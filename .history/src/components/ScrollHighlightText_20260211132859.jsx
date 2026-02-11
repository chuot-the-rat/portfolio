import { useRef, useMemo, Children, isValidElement, cloneElement } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import "./ScrollHighlightText.css";

/* ─────────────────────────────────────────────
   Parse [[term]] tokens in a string into
   an array of text nodes and <mark> elements.
   ───────────────────────────────────────────── */
function parseTokenSyntax(text) {
    const parts = [];
    const regex = /\[\[(.+?)\]\]/g;
    let last = 0;
    let match;
    let tokenIndex = 0;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > last) {
            parts.push(text.slice(last, match.index));
        }
        parts.push(
            <mark key={`tok-${tokenIndex}`} data-key={`tok-${tokenIndex}`}>
                {match[1]}
            </mark>
        );
        tokenIndex++;
        last = regex.lastIndex;
    }

    if (last < text.length) {
        parts.push(text.slice(last));
    }

    return parts;
}

/* ─────────────────────────────────────────────
   Walk React children, collect <mark> elements
   and replace them with animated spans.
   ───────────────────────────────────────────── */
function collectAndReplace(children, tokens) {
    return Children.map(children, (child) => {
        // Plain string → parse [[tokens]]
        if (typeof child === "string") {
            const parsed = parseTokenSyntax(child);
            return parsed.map((part) => {
                if (typeof part === "string") return part;
                // part is a <mark> from parseTokenSyntax
                const idx = tokens.length;
                tokens.push(part.props.children);
                return <span key={idx} className="sht-token" data-token-index={idx}>{part.props.children}</span>;
            });
        }

        // <mark data-key="..."> → convert to token span
        if (isValidElement(child) && child.type === "mark") {
            const idx = tokens.length;
            tokens.push(child.props.children);
            return <span key={idx} className="sht-token" data-token-index={idx}>{child.props.children}</span>;
        }

        // Recurse into other elements
        if (isValidElement(child) && child.props?.children) {
            return cloneElement(child, {}, collectAndReplace(child.props.children, tokens));
        }

        return child;
    });
}

/* ─────────────────────────────────────────────
   Single Token — animated via scroll progress
   ───────────────────────────────────────────── */
const HighlightToken = ({ children, progress, start, end, mode, accent }) => {
    const [isActive, setIsActive] = useState(false);

    /* Stepped mode: binary on/off at midpoint */
    const midpoint = (start + end) / 2;

    useMotionValueEvent(progress, "change", (v) => {
        setIsActive(v >= midpoint);
    });

    if (mode === "smooth") {
        /* Smooth: interpolate opacity over the token's range */
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(progress, [start, end], [0, 1]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const fontWeight = useTransform(progress, [start, end], [400, 500]);

        return (
            <motion.span
                className={`sht-token sht-token--smooth sht-accent--${accent}`}
                style={{
                    "--sht-reveal": opacity,
                    fontWeight,
                }}
            >
                <span className="sht-token-text">{children}</span>
                <motion.span className="sht-token-underline" style={{ scaleX: opacity }} />
            </motion.span>
        );
    }

    /* Stepped mode */
    return (
        <span
            className={`sht-token sht-token--stepped sht-accent--${accent} ${isActive ? "sht-token--active" : ""}`}
        >
            <span className="sht-token-text">{children}</span>
            <span className="sht-token-underline" />
        </span>
    );
};

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */

/**
 * ScrollHighlightText
 *
 * Props:
 *   mode     – "stepped" | "smooth"  (default: "stepped")
 *   accent   – "auto" | "text" | "accent"  (default: "auto")
 *   range    – fraction of scroll each token occupies (default: 0.15)
 *   children – text with <mark> tags or [[token]] syntax
 *   as       – wrapper element type (default: "p")
 *   className – additional class names
 *   offset   – framer-motion useScroll offset (default: ["start 0.85", "end 0.35"])
 */
const ScrollHighlightText = ({
    mode = "stepped",
    accent = "auto",
    range = 0.15,
    children,
    as: Tag = "p",
    className = "",
    offset,
}) => {
    const containerRef = useRef(null);

    /* ── Collect tokens from children ── */
    const { processedChildren, tokenCount } = useMemo(() => {
        const tokens = [];
        const processed = collectAndReplace(children, tokens);
        return { processedChildren: processed, tokenCount: tokens.length };
    }, [children]);

    /* ── Scroll progress of this section ── */
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: offset || ["start 0.85", "end 0.35"],
    });

    /* ── Compute token thresholds ── */
    const tokenRanges = useMemo(() => {
        if (tokenCount === 0) return [];
        // Distribute tokens evenly across 0→1 progress
        const usable = 1 - range; // leave room for the last token
        return Array.from({ length: tokenCount }, (_, i) => {
            const start = (usable * i) / Math.max(tokenCount - 1, 1);
            return { start, end: start + range };
        });
    }, [tokenCount, range]);

    /* ── Rebuild children tree, replacing sht-token spans with HighlightToken ── */
    const renderedChildren = useMemo(() => {
        let tokenIdx = 0;

        function replaceTokens(nodes) {
            return Children.map(nodes, (child) => {
                if (
                    isValidElement(child) &&
                    child.props?.className?.includes("sht-token")
                ) {
                    const idx = tokenIdx++;
                    const tr = tokenRanges[idx];
                    if (!tr) return child;
                    return (
                        <HighlightToken
                            key={idx}
                            progress={scrollYProgress}
                            start={tr.start}
                            end={tr.end}
                            mode={mode}
                            accent={accent}
                        >
                            {child.props.children}
                        </HighlightToken>
                    );
                }

                if (isValidElement(child) && child.props?.children) {
                    return cloneElement(child, {}, replaceTokens(child.props.children));
                }

                return child;
            });
        }

        return replaceTokens(processedChildren);
        // scrollYProgress is a stable ref — safe to include
    }, [processedChildren, tokenRanges, scrollYProgress, mode, accent]);

    return (
        <Tag
            ref={containerRef}
            className={`sht-container ${className}`}
        >
            {renderedChildren}
        </Tag>
    );
};

export default ScrollHighlightText;
