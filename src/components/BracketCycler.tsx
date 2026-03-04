/**
 * BracketCycler.tsx
 *
 * Renders: <baseText>[<animatedToken>]
 * Example: leanale[.com]  →  leanale[003@gmail.com]  →  leanale[ux]  →  ...
 *
 * ── State machine ──────────────────────────────────────────────────────────
 *  Loop forever (until freeze):
 *   1. Show primary token  (2–3 s dwell; email uses typewriter + extra hold)
 *   2. Do 1–3 burst tokens (0.35–0.6 s each), each with a brief scramble swap
 *   3. Repeat from step 1 with the next primary token
 *
 * ── CSS variable knobs ────────────────────────────────────────────────────
 *   --bc-text          base name color          (default: var(--foreground))
 *   --bc-bracket       [ ] color                (default: var(--muted-foreground, #888))
 *   --bc-token         token text color         (default: var(--foreground))
 *   --bc-scramble      scramble frame color     (default: var(--muted-foreground))
 *   --bc-font          token font               (default: ui-monospace)
 *   --bc-enter-ms      enter animation speed    (default: 200ms)
 *   --bc-enter-y       enter Y-nudge            (default: 5px)
 *   --bracket-opacity  [ ] opacity              (default: 0.4)
 *   --cycler-freeze-ms animation lifetime ms    (default: 15000)
 *
 * ── Accessibility ─────────────────────────────────────────────────────────
 *   prefers-reduced-motion → shows static "[.com]", no animation
 *   aria-label on the outer span always reads the current resolved token
 *   A sr-only aria-live region announces real (non-scramble) token changes
 */

"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";

// ─── Public props ─────────────────────────────────────────────────────────────

export interface BracketCyclerProps {
    baseText?: string;
    primaryTokens?: string[];
    burstTokens?: string[];
    className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SCRAMBLE_CHARS =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789@._-";
const SCRAMBLE_MS = 155; // total scramble window
const SCRAMBLE_FRAMES = 9; // frames within that window

const PRIMARY_DWELL_MIN = 2000;
const PRIMARY_DWELL_MAX = 3000;
const BURST_DWELL_MIN = 350;
const BURST_DWELL_MAX = 600;
const BURST_COUNT_MIN = 1;
const BURST_COUNT_MAX = 3;
const TYPEWRITER_CHAR_MS = 52; // ms between each typed character
const TYPEWRITER_EXTRA_MS = 1100; // extra dwell after full email appears

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const randInt = (lo: number, hi: number) => Math.floor(rand(lo, hi + 1));

function scrambleOf(len: number): string {
    return Array.from(
        { length: len },
        () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
    ).join("");
}

function getCSSVar(name: string, fallback: string): string {
    if (typeof window === "undefined") return fallback;
    return (
        getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim() || fallback
    );
}

// ─── prefers-reduced-motion hook ──────────────────────────────────────────────

const pmSubscribe = (cb: () => void) => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
};
const pmSnapshot = () =>
    typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
const useReducedMotion = () =>
    useSyncExternalStore(pmSubscribe, pmSnapshot, () => false);

// ─── Slot state ───────────────────────────────────────────────────────────────

interface Slot {
    text: string; // what renders inside [ ]
    key: number; // bumped on real transitions to re-trigger CSS animation
    scramble: boolean; // true during scramble frames (suppresses enter animation)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BracketCycler({
    baseText = "leanale",
    primaryTokens = [".com", "003@gmail.com"],
    burstTokens = [
        "ux",
        "ui",
        "react",
        "motion",
        "fig.02",
        "v2.1",
        "s03",
        "available",
        "burnaby",
        "portfolio",
    ],
    className = "",
}: BracketCyclerProps) {
    const reduced = useReducedMotion();

    // Debug logging
    useEffect(() => {
        console.log("BracketCycler mounted - reduced motion:", reduced);
    }, [reduced]);

    if (reduced) {
        console.log(
            "BracketCycler: showing static version (prefers-reduced-motion enabled)",
        );
        return (
            <StaticVersion
                baseText={baseText}
                staticToken={primaryTokens[0] ?? ".com"}
                className={className}
            />
        );
    }

    console.log("BracketCycler: showing animated version");
    return (
        <AnimatedVersion
            baseText={baseText}
            primaryTokens={primaryTokens}
            burstTokens={burstTokens}
            className={className}
        />
    );
}

// ─── Static (reduced-motion) ─────────────────────────────────────────────────

function StaticVersion({
    baseText,
    staticToken,
    className,
}: {
    baseText: string;
    staticToken: string;
    className: string;
}) {
    return (
        <span
            className={className}
            aria-label={`${baseText}${staticToken}`}
            style={{ display: "inline-flex", alignItems: "baseline" }}
        >
            <span
                style={{
                    color: "var(--bc-text, var(--foreground, currentColor))",
                }}
            >
                {baseText}
            </span>
            <BracketSlot
                text={staticToken}
                animKey={0}
                scramble={false}
            />
        </span>
    );
}

// ─── Animated version ────────────────────────────────────────────────────────

function AnimatedVersion({
    baseText,
    primaryTokens,
    burstTokens,
    className,
}: Required<BracketCyclerProps>) {
    // ── State ────────────────────────────────────────────────────────────────
    const [slot, setSlot] = useState<Slot>({
        text: primaryTokens[0] ?? ".com",
        key: 0,
        scramble: false,
    });

    // Drives partial reveal during typewriter phase
    const [typePos, setTypePos] = useState<number | null>(null);

    // Screen reader announcements
    const [srText, setSrText] = useState("");

    // ── Refs ─────────────────────────────────────────────────────────────────
    const frozenRef = useRef(false);
    const hiddenRef = useRef(false);
    const cancelRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const primaryIdxRef = useRef(0);
    // Tracks the email string being typed so typePos can slice it
    const typeTargetRef = useRef<string>("");
    const freezeMsRef = useRef(15000); // Default 15 seconds minimum
    // Holds a "resume after unhide" callback
    const onResumeRef = useRef<(() => void) | null>(null);

    // ── Read freeze ms from CSS var once ────────────────────────────────────
    useEffect(() => {
        // Try to read from CSS variable on mount and after a small delay
        // to ensure styles have loaded
        const readFreezeMs = () => {
            const v = parseFloat(getCSSVar("--cycler-freeze-ms", "15000"));
            if (!isNaN(v) && v > 0) {
                freezeMsRef.current = v;
            }
        };

        // Read immediately
        readFreezeMs();

        // Also read after a short delay to catch late-loaded styles
        const timer = setTimeout(readFreezeMs, 100);
        return () => clearTimeout(timer);
    }, []);

    // ── Tab visibility → pause / resume ─────────────────────────────────────
    useEffect(() => {
        function onVis() {
            hiddenRef.current = document.hidden;
            if (!document.hidden && onResumeRef.current) {
                const fn = onResumeRef.current;
                onResumeRef.current = null;
                fn();
            }
        }
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, []);

    // ── sleep — pauses if tab is hidden ─────────────────────────────────────
    const sleep = useCallback((ms: number): Promise<void> => {
        return new Promise((resolve) => {
            if (hiddenRef.current) {
                // Store resolve; it'll fire when the tab becomes visible again
                onResumeRef.current = () => {
                    cancelRef.current = setTimeout(resolve, ms);
                };
            } else {
                cancelRef.current = setTimeout(resolve, ms);
            }
        });
    }, []);

    // ── Scramble transition ──────────────────────────────────────────────────
    const scramble = useCallback(
        async (target: string): Promise<void> => {
            const len = Math.max(target.length, 3);
            const frameMs = SCRAMBLE_MS / SCRAMBLE_FRAMES;

            for (let i = 0; i < SCRAMBLE_FRAMES; i++) {
                if (frozenRef.current) return;
                const progress = i / SCRAMBLE_FRAMES;
                const revealed = Math.floor(progress * len * 0.55);
                const text =
                    target.slice(0, revealed) + scrambleOf(len - revealed);

                setSlot((prev) => ({
                    text: text.slice(0, len),
                    key: prev.key,
                    scramble: true,
                }));
                await sleep(frameMs);
            }
        },
        [sleep],
    );

    // ── Typewriter reveal ────────────────────────────────────────────────────
    const typewriter = useCallback(
        async (token: string): Promise<void> => {
            typeTargetRef.current = token;
            setTypePos(0);
            for (let i = 1; i <= token.length; i++) {
                await sleep(TYPEWRITER_CHAR_MS);
                if (frozenRef.current) {
                    setTypePos(null);
                    return;
                }
                setTypePos(i);
            }
            setTypePos(null);
        },
        [sleep],
    );

    // ── Swap to a new token ──────────────────────────────────────────────────
    const swapTo = useCallback(
        async (
            token: string,
            opts: { email?: boolean } = {},
        ): Promise<void> => {
            if (frozenRef.current) return;

            await scramble(token);
            if (frozenRef.current) return;

            if (opts.email) {
                // Clear slot first so typewriter builds from nothing
                setSlot((prev) => ({
                    text: "",
                    key: prev.key + 1,
                    scramble: false,
                }));
                setSrText(token);
                await typewriter(token);
                if (frozenRef.current) return;
                // Commit the full string once typewriter finishes
                setSlot((prev) => ({
                    text: token,
                    key: prev.key,
                    scramble: false,
                }));
            } else {
                setSlot((prev) => ({
                    text: token,
                    key: prev.key + 1,
                    scramble: false,
                }));
                setSrText(token);
            }
        },
        [scramble, typewriter],
    );

    // ── Main loop ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (primaryTokens.length === 0) return;
        let alive = true;
        const t0 = Date.now();

        console.log("BracketCycler animation loop starting");
        console.log("Primary tokens:", primaryTokens);
        console.log("Burst tokens:", burstTokens);
        console.log("Freeze time:", freezeMsRef.current);

        async function run() {
            await sleep(500); // brief intro pause
            if (!alive) return;

            while (alive && !frozenRef.current) {
                // Phase A — primary
                const pIdx = primaryIdxRef.current % primaryTokens.length;
                const primary = primaryTokens[pIdx];
                primaryIdxRef.current++;

                console.log("Swapping to primary:", primary);

                const isEmail = primary.includes("@");
                await swapTo(primary, { email: isEmail });
                if (!alive || frozenRef.current) break;

                const dwell = isEmail
                    ? primary.length * TYPEWRITER_CHAR_MS + TYPEWRITER_EXTRA_MS
                    : rand(PRIMARY_DWELL_MIN, PRIMARY_DWELL_MAX);
                await sleep(dwell);
                if (!alive || frozenRef.current) break;

                // Freeze check
                if (Date.now() - t0 >= freezeMsRef.current) {
                    frozenRef.current = true;
                    break;
                }

                // Phase B — bursts
                if (burstTokens.length > 0) {
                    const count = randInt(BURST_COUNT_MIN, BURST_COUNT_MAX);
                    const picks = [...burstTokens]
                        .sort(() => Math.random() - 0.5)
                        .slice(0, count);

                    console.log(
                        "Burst phase - showing",
                        count,
                        "tokens:",
                        picks,
                    );

                    for (const burst of picks) {
                        if (!alive || frozenRef.current) break;
                        await swapTo(burst);
                        if (!alive || frozenRef.current) break;
                        await sleep(rand(BURST_DWELL_MIN, BURST_DWELL_MAX));
                    }
                }

                if (!alive || frozenRef.current) break;

                // Freeze check — land cleanly back on first primary
                if (Date.now() - t0 >= freezeMsRef.current) {
                    frozenRef.current = true;
                    await swapTo(primaryTokens[0]);
                    break;
                }
            }
        }

        run();

        return () => {
            alive = false;
            frozenRef.current = true;
            if (cancelRef.current) clearTimeout(cancelRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Resolve display text ─────────────────────────────────────────────────
    // During typewriter phase: slice the email token to typePos characters.
    const display =
        typePos !== null ? typeTargetRef.current.slice(0, typePos) : slot.text;

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            {/* Screen-reader live region */}
            <span
                aria-live="polite"
                aria-atomic="true"
                style={srOnly}
            >
                {srText}
            </span>

            <span
                className={className}
                aria-label={`${baseText}${slot.text}`}
                style={{ display: "inline-flex", alignItems: "baseline" }}
            >
                {/* Static name */}
                <span
                    style={{
                        color: "var(--bc-text, var(--foreground, currentColor))",
                    }}
                >
                    {baseText}
                </span>

                {/* Animated bracket group */}
                <BracketSlot
                    text={display}
                    animKey={slot.key}
                    scramble={slot.scramble}
                />
            </span>
        </>
    );
}

// ─── BracketSlot ─────────────────────────────────────────────────────────────

/**
 * Renders `[token]`. The token span re-animates whenever `animKey` changes
 * via the `bc-enter` keyframe. During scramble frames the enter animation
 * is suppressed and a muted scramble color is used instead.
 */
function BracketSlot({
    text,
    animKey,
    scramble,
}: {
    text: string;
    animKey: number;
    scramble: boolean;
}) {
    // Inject keyframes once into the document <head>
    useEffect(() => {
        if (document.getElementById("bc-kf")) return;
        const s = document.createElement("style");
        s.id = "bc-kf";
        s.textContent = `
      @keyframes bc-enter {
        from { opacity: 0; transform: translateY(var(--bc-enter-y, 5px)); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
        document.head.appendChild(s);
    }, []);

    return (
        <span
            aria-hidden="true"
            style={{ display: "inline-flex", alignItems: "baseline" }}
        >
            {/* [ */}
            <Bracket char="[" />

            {/* Animated token */}
            <span
                key={animKey}
                style={{
                    display: "inline-block",
                    minWidth: "3ch",
                    textAlign: "left",
                    color: scramble
                        ? "var(--bc-scramble, var(--muted-foreground, #888))"
                        : "var(--bc-token, var(--foreground, currentColor))",
                    fontFamily:
                        "var(--bc-font, ui-monospace, 'SF Mono', Consolas, monospace)",
                    fontSize: "0.9em",
                    letterSpacing: "-0.01em",
                    animation: scramble
                        ? "none"
                        : `bc-enter var(--bc-enter-ms, 200ms) cubic-bezier(0.22, 1, 0.36, 1) both`,
                }}
            >
                {text}
            </span>

            {/* ] */}
            <Bracket char="]" />
        </span>
    );
}

function Bracket({ char }: { char: "[" | "]" }) {
    return (
        <span
            style={{
                color: "var(--bc-bracket, var(--muted-foreground, #888))",
                opacity: "var(--bracket-opacity, 0.4)" as unknown as number,
                userSelect: "none",
                fontFamily: "inherit",
            }}
        >
            {char}
        </span>
    );
}

// ─── sr-only style ────────────────────────────────────────────────────────────

const srOnly: React.CSSProperties = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    border: "0",
};
