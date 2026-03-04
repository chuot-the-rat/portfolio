/**
 * AsciiOrchidCanvas.tsx
 *
 * Elegant, flowing ASCII orchid flowers with smooth fade animations.
 * Matches botanical illustration aesthetic - sophisticated, organic, premium.
 * NOT retro/campy - graceful curves, gentle breathing motion.
 *
 * ── CSS Variables for Customization ──────────────────────────────
 *   --orchid-color: hsl(220, 90%, 60%)  (soft blue for flowers)
 *   --orchid-accent: hsl(220, 95%, 70%) (lighter blue for centers)
 *   --orchid-opacity: 0.6               (visibility)
 *   --orchid-animation-speed: 4000      (ms per breath cycle)
 * ──────────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect, useRef } from "react";

interface OrchidFlower {
    id: number;
    x: number;
    y: number;
    scale: number;
    phase: number; // Staggered animation timing
    baseOpacity: number;
}

export default function AsciiOrchidCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const flowersRef = useRef<OrchidFlower[]>([]);
    const timeRef = useRef(0);

    useEffect(() => {
        // Respect prefers-reduced-motion
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (motionQuery.matches) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        // ── CSS Variable Helpers ──────────────────────────────────
        function getCSSVar(name: string, fallback: string): string {
            if (typeof window === "undefined") return fallback;
            return (
                getComputedStyle(document.documentElement)
                    .getPropertyValue(name)
                    .trim() || fallback
            );
        }

        function getCSSVarFloat(name: string, fallback: number): number {
            const v = parseFloat(getCSSVar(name, String(fallback)));
            return isNaN(v) ? fallback : v;
        }

        let W = 0,
            H = 0;
        let flowers: OrchidFlower[] = [];

        // ── Responsive Setup ──────────────────────────────────────
        function resize() {
            if (!parent) return;
            if (!canvas) return;

            const rect = parent.getBoundingClientRect();
            W = rect.width;
            H = rect.height;

            const dpr = window.devicePixelRatio || 1;
            canvas!.width = W * dpr;
            canvas!.height = H * dpr;
            canvas!.style.width = W + "px";
            canvas!.style.height = H + "px";

            ctx!.setTransform(1, 0, 0, 1, 0, 0);
            ctx!.scale(dpr, dpr);

            // Initialize 3 orchids at natural positions (staggered)
            flowers = [
                {
                    id: 1,
                    x: W * 0.15,
                    y: H * 0.25,
                    scale: 1.2,
                    phase: 0,
                    baseOpacity: 0.5,
                },
                {
                    id: 2,
                    x: W * 0.65,
                    y: H * 0.4,
                    scale: 1.4,
                    phase: 0.33,
                    baseOpacity: 0.6,
                },
                {
                    id: 3,
                    x: W * 0.35,
                    y: H * 0.65,
                    scale: 0.9,
                    phase: 0.66,
                    baseOpacity: 0.45,
                },
            ];
            flowersRef.current = flowers;
        }

        const ro = new ResizeObserver(resize);
        ro.observe(parent);
        resize();

        // ── ASCII Orchid Flower Design ────────────────────────────
        // Using flowing curves: ( ) / \ ~ ` ' and spaces
        // NOT geometric or blocky - elegant botanical forms

        const orchidFrame1 = [
            "      .~.      ",
            "    ( ' ' )    ",
            "   ~  ◆  ~      ", // Center (◆ = heart of flower)
            "    ( . )      ",
            "      `~`      ",
            "      | |      ",
            "       |       ",
        ];

        const orchidFrame2 = [
            "     .`~`.     ",
            "    (  ~  )    ",
            "   ~   ◆   ~   ",
            "    (  .  )    ",
            "     `~~~`     ",
            "      | |      ",
            "       |       ",
        ];

        const orchidFrame3 = [
            "      ~~       ",
            "    ( ` ` )    ",
            "   `   ◆   `   ",
            "    ( ~ )     ",
            "      `~`      ",
            "      | |      ",
            "       |       ",
        ];

        // Smooth breathing animation between frames
        // Creates elegant fade effect
        function renderOrchid(
            ox: number,
            oy: number,
            scale: number,
            opacity: number,
            frame: string[],
        ) {
            ctx!.save();
            ctx!.globalAlpha = opacity;
            ctx!.font = `14px "Monaco", "Menlo", "Courier New", monospace`;
            ctx!.fillStyle = getCSSVar("--orchid-color", "hsl(220, 90%, 60%)");
            ctx!.textAlign = "center";
            ctx!.textBaseline = "middle";

            // Scale & position
            ctx!.translate(ox, oy);
            ctx!.scale(scale, scale);

            // Draw each line of the orchid
            for (let i = 0; i < frame.length; i++) {
                const line = frame[i];
                const y = (i - frame.length / 2) * 18;

                // Character-by-character for flowing effect
                for (let j = 0; j < line.length; j++) {
                    const char = line[j];
                    if (char !== " ") {
                        const x = (j - line.length / 2) * 8;

                        // Special coloring for centers (◆)
                        if (char === "◆") {
                            ctx!.fillStyle = getCSSVar(
                                "--orchid-accent",
                                "hsl(220, 95%, 70%)",
                            );
                        } else {
                            ctx!.fillStyle = getCSSVar(
                                "--orchid-color",
                                "hsl(220, 90%, 60%)",
                            );
                        }

                        ctx!.fillText(char, x, y);
                    }
                }
            }

            ctx!.restore();
        }

        // ── Animation: Smooth Breathing Fade ──────────────────────
        // Flowers fade in/out smoothly like gentle blooming
        function getAnimationOpacity(time: number, phase: number, duration: number): number {
            // Phase-shifted sine wave for continuous breathing
            const t = ((time + phase * duration) % duration) / duration;
            // Smooth ease in/out: sine wave creates gentle breathing
            return Math.sin(t * Math.PI) * 0.4 + 0.55; // Range: 0.15 - 0.95
        }

        function getFrameIndex(time: number, duration: number): number {
            const t = (time % duration) / duration;
            if (t < 0.33) return 0;
            if (t < 0.66) return 1;
            return 2;
        }

        // ── Main Drawing Loop ─────────────────────────────────────
        function draw(time: number) {
            const animSpeed = getCSSVarFloat("--orchid-animation-speed", 4000);
            const baseOpacity = getCSSVarFloat("--orchid-opacity", 0.6);

            // Clear canvas (very subtle fade trail for elegance)
            ctx!.fillStyle = "rgba(255, 255, 255, 0.01)";
            ctx!.fillRect(0, 0, W, H);

            flowers = flowersRef.current;

            for (const flower of flowers) {
                // Animation: smooth breathing fade
                const animOpacity = getAnimationOpacity(time, flower.phase, animSpeed);
                const finalOpacity = animOpacity * baseOpacity * flower.baseOpacity;

                // Interpolate between frames for smooth transition
                const frameIdx = getFrameIndex(time, animSpeed);
                const frames = [orchidFrame1, orchidFrame2, orchidFrame3];
                const frame = frames[frameIdx];

                // Slight scale breathing effect (very subtle)
                const scaleBreath = 1 + Math.sin(time * 0.001 + flower.phase * Math.PI * 2) * 0.02;

                renderOrchid(
                    flower.x,
                    flower.y,
                    flower.scale * scaleBreath,
                    finalOpacity,
                    frame,
                );
            }
        }

        // ── Animation Loop ────────────────────────────────────────
        let rafId: number;

        function loop(now: number) {
            draw(now);
            rafId = requestAnimationFrame(loop);
        }

        rafId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(rafId);
            ro.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}
