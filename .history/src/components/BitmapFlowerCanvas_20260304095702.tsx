/**
 * BitmapFlowerCanvas.tsx
 *
 * Animated bitmap-style flowers with recognizable shapes.
 * Smooth flowing animation (petals rotating, stems swaying, centers pulsing).
 * Grey color palette only - professional, premium botanical animation.
 *
 * ── CSS Variables for Customization ──────────────────────────────
 *   --flower-primary: #e5e7eb       (light grey for petals)
 *   --flower-secondary: #9ca3af     (medium grey for stems/leaves)
 *   --flower-accent: #374151        (dark grey for centers/shadows)
 *   --flower-opacity: 0.7           (visibility)
 *   --flower-animation-speed: 5000  (ms per cycle)
 * ──────────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect, useRef } from "react";

interface Flower {
    id: number;
    x: number;
    y: number;
    scale: number;
    type: "tulip" | "peony" | "rose"; // Different flower shapes
    phase: number; // Staggered animation timing
    rotationOffset: number;
}

export default function BitmapFlowerCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const flowersRef = useRef<Flower[]>([]);

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
        let flowers: Flower[] = [];

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

            // Initialize 3 flowers with natural composition
            flowers = [
                {
                    id: 1,
                    x: W * 0.2,
                    y: H * 0.3,
                    scale: 1.3,
                    type: "tulip",
                    phase: 0,
                    rotationOffset: 0,
                },
                {
                    id: 2,
                    x: W * 0.7,
                    y: H * 0.5,
                    scale: 1.5,
                    type: "peony",
                    phase: 0.33,
                    rotationOffset: Math.PI / 4,
                },
                {
                    id: 3,
                    x: W * 0.35,
                    y: H * 0.7,
                    scale: 1.1,
                    type: "rose",
                    phase: 0.66,
                    rotationOffset: -Math.PI / 6,
                },
            ];
            flowersRef.current = flowers;
        }

        const ro = new ResizeObserver(resize);
        ro.observe(parent);
        resize();

        // ── Flower Drawing Functions ──────────────────────────────
        // Each flower is made of recognizable parts: petals, center, stem, leaves

        function drawTulip(x: number, y: number, scale: number, opacity: number, rotation: number) {
            ctx!.save();
            ctx!.translate(x, y);
            ctx!.rotate(rotation);
            ctx!.scale(scale, scale);
            ctx!.globalAlpha = opacity;

            const primary = getCSSVar("--flower-primary", "#e5e7eb");
            const secondary = getCSSVar("--flower-secondary", "#9ca3af");
            const accent = getCSSVar("--flower-accent", "#374151");

            // Stem
            ctx!.strokeStyle = secondary;
            ctx!.lineWidth = 3;
            ctx!.beginPath();
            ctx!.moveTo(0, 0);
            ctx!.quadraticCurveTo(5, 20, 0, 50);
            ctx!.stroke();

            // Leaves
            ctx!.strokeStyle = secondary;
            ctx!.lineWidth = 2;
            ctx!.beginPath();
            ctx!.moveTo(0, 20);
            ctx!.quadraticCurveTo(-8, 25, -10, 35);
            ctx!.stroke();

            ctx!.beginPath();
            ctx!.moveTo(0, 25);
            ctx!.quadraticCurveTo(8, 28, 10, 38);
            ctx!.stroke();

            // Petals (3 tulip petals forming cup)
            ctx!.fillStyle = primary;
            // Left petal
            ctx!.beginPath();
            ctx!.ellipse(-8, -5, 7, 12, -Math.PI / 4, 0, Math.PI * 2);
            ctx!.fill();

            // Center petal
            ctx!.beginPath();
            ctx!.ellipse(0, -10, 6, 14, 0, 0, Math.PI * 2);
            ctx!.fill();

            // Right petal
            ctx!.beginPath();
            ctx!.ellipse(8, -5, 7, 12, Math.PI / 4, 0, Math.PI * 2);
            ctx!.fill();

            // Center
            ctx!.fillStyle = accent;
            ctx!.beginPath();
            ctx!.ellipse(0, -2, 4, 5, 0, 0, Math.PI * 2);
            ctx!.fill();

            ctx!.restore();
        }

        function drawPeony(x: number, y: number, scale: number, opacity: number, rotation: number) {
            ctx!.save();
            ctx!.translate(x, y);
            ctx!.rotate(rotation);
            ctx!.scale(scale, scale);
            ctx!.globalAlpha = opacity;

            const primary = getCSSVar("--flower-primary", "#e5e7eb");
            const secondary = getCSSVar("--flower-secondary", "#9ca3af");
            const accent = getCSSVar("--flower-accent", "#374151");

            // Stem
            ctx!.strokeStyle = secondary;
            ctx!.lineWidth = 3;
            ctx!.beginPath();
            ctx!.moveTo(0, 0);
            ctx!.quadraticCurveTo(-3, 20, 0, 50);
            ctx!.stroke();

            // Leaves
            ctx!.strokeStyle = secondary;
            ctx!.lineWidth = 2;
            ctx!.beginPath();
            ctx!.moveTo(-2, 18);
            ctx!.quadraticCurveTo(-12, 22, -12, 35);
            ctx!.stroke();

            ctx!.beginPath();
            ctx!.moveTo(2, 20);
            ctx!.quadraticCurveTo(12, 25, 12, 38);
            ctx!.stroke();

            // Peony: many layered petals (circles of varying sizes)
            ctx!.fillStyle = primary;

            // Outer petals (larger)
            for (let i = 0; i < 5; i++) {
                const angle = (i * Math.PI * 2) / 5;
                const px = Math.cos(angle) * 12;
                const py = Math.sin(angle) * 12 - 5;
                ctx!.beginPath();
                ctx!.ellipse(px, py, 8, 10, angle, 0, Math.PI * 2);
                ctx!.fill();
            }

            // Middle petals
            for (let i = 0; i < 5; i++) {
                const angle = (i * Math.PI * 2) / 5 + Math.PI / 5;
                const px = Math.cos(angle) * 7;
                const py = Math.sin(angle) * 7 - 3;
                ctx!.beginPath();
                ctx!.ellipse(px, py, 6, 8, angle, 0, Math.PI * 2);
                ctx!.fill();
            }

            // Center
            ctx!.fillStyle = accent;
            ctx!.beginPath();
            ctx!.ellipse(0, -2, 5, 6, 0, 0, Math.PI * 2);
            ctx!.fill();

            ctx!.restore();
        }

        function drawRose(x: number, y: number, scale: number, opacity: number, rotation: number) {
            ctx!.save();
            ctx!.translate(x, y);
            ctx!.rotate(rotation);
            ctx!.scale(scale, scale);
            ctx!.globalAlpha = opacity;

            const primary = getCSSVar("--flower-primary", "#e5e7eb");
            const secondary = getCSSVar("--flower-secondary", "#9ca3af");
            const accent = getCSSVar("--flower-accent", "#374151");

            // Stem with slight curve
            ctx!.strokeStyle = secondary;
            ctx!.lineWidth = 2.5;
            ctx!.beginPath();
            ctx!.moveTo(0, 0);
            ctx!.quadraticCurveTo(2, 25, 0, 50);
            ctx!.stroke();

            // Thorns
            ctx!.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                const yPos = 10 + i * 10;
                ctx!.beginPath();
                ctx!.moveTo(0, yPos);
                ctx!.lineTo(3, yPos + 2);
                ctx!.stroke();

                ctx!.beginPath();
                ctx!.moveTo(0, yPos);
                ctx!.lineTo(-3, yPos + 2);
                ctx!.stroke();
            }

            // Leaves
            ctx!.strokeStyle = secondary;
            ctx!.lineWidth = 2;
            ctx!.beginPath();
            ctx!.moveTo(-1, 15);
            ctx!.bezierCurveTo(-8, 18, -10, 25, -8, 35);
            ctx!.stroke();

            ctx!.beginPath();
            ctx!.moveTo(1, 22);
            ctx!.bezierCurveTo(8, 25, 10, 32, 8, 42);
            ctx!.stroke();

            // Rose petals - spiral inward (concentric circles/ellipses)
            ctx!.fillStyle = primary;

            // Outer petals
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2) / 8;
                const px = Math.cos(angle) * 11;
                const py = Math.sin(angle) * 11 - 5;
                ctx!.beginPath();
                ctx!.ellipse(px, py, 7, 9, angle, 0, Math.PI * 2);
                ctx!.fill();
            }

            // Middle petals
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2) / 8 + Math.PI / 8;
                const px = Math.cos(angle) * 6;
                const py = Math.sin(angle) * 6 - 3;
                ctx!.beginPath();
                ctx!.ellipse(px, py, 5, 7, angle, 0, Math.PI * 2);
                ctx!.fill();
            }

            // Inner petals
            ctx!.beginPath();
            ctx!.ellipse(0, -2, 4, 5, 0, 0, Math.PI * 2);
            ctx!.fill();

            // Center
            ctx!.fillStyle = accent;
            ctx!.beginPath();
            ctx!.ellipse(0, -1, 2, 3, 0, 0, Math.PI * 2);
            ctx!.fill();

            ctx!.restore();
        }

        // ── Animation: Smooth flower motion ───────────────────────
        function getAnimationValues(
            time: number,
            phase: number,
            duration: number,
        ): { opacity: number; rotation: number; scale: number } {
            // Phase-shifted sine waves for smooth continuous animation
            const t = ((time + phase * duration) % duration) / duration;

            // Opacity: fade in/out smoothly (breathing)
            const opacity = Math.sin(t * Math.PI * 2) * 0.25 + 0.6; // Range: 0.35-0.85

            // Rotation: gentle swaying (petals rotating)
            const rotation = Math.sin(t * Math.PI * 2) * 0.15; // ±0.15 radians (~9 degrees)

            // Scale: subtle pulsing (centers expanding/contracting)
            const scale = 1 + Math.cos(t * Math.PI * 2 + Math.PI) * 0.05; // Range: 0.95-1.05

            return { opacity, rotation, scale };
        }

        // ── Main Drawing Loop ─────────────────────────────────────
        function draw(time: number) {
            const animSpeed = getCSSVarFloat("--flower-animation-speed", 5000);
            const baseOpacity = getCSSVarFloat("--flower-opacity", 0.7);

            // Clear canvas with very subtle fade for elegance
            ctx!.fillStyle = "rgba(0, 0, 0, 0.01)";
            ctx!.fillRect(0, 0, W, H);

            flowers = flowersRef.current;

            for (const flower of flowers) {
                const anim = getAnimationValues(time, flower.phase, animSpeed);
                const finalOpacity = anim.opacity * baseOpacity;
                const finalScale = anim.scale * flower.scale;
                const finalRotation = anim.rotation + flower.rotationOffset;

                // Draw based on flower type
                if (flower.type === "tulip") {
                    drawTulip(flower.x, flower.y, finalScale, finalOpacity, finalRotation);
                } else if (flower.type === "peony") {
                    drawPeony(flower.x, flower.y, finalScale, finalOpacity, finalRotation);
                } else if (flower.type === "rose") {
                    drawRose(flower.x, flower.y, finalScale, finalOpacity, finalRotation);
                }
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
