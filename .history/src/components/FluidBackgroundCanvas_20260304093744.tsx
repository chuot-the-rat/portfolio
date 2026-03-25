/**
 * FluidBackgroundCanvas.tsx
 *
 * Modern, premium fluid background animation.
 * Animated gradients + floating particles with organic motion.
 * Inspired by modern design portfolio aesthetics (Framer, Vercel, design agencies).
 *
 * ── CSS Variables for Customization ──────────────────────────────
 *   --fluid-opacity: 0.6 (background visibility, 0-1)
 *   --fluid-speed: 1 (animation speed multiplier, 0.5-3)
 *   --fluid-intensity: 1 (particle movement intensity, 0.5-2)
 *   --fluid-particle-count: 50 (number of particles, 20-100)
 *   --fluid-color-1: hsl(220, 80%, 50%) (primary gradient color)
 *   --fluid-color-2: hsl(280, 70%, 55%) (secondary - transitions)
 *   --fluid-color-3: hsl(180, 60%, 50%) (tertiary - accent)
 *   --fluid-glow: 0.3 (particle glow intensity, 0-1)
 * ──────────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
    targetOpacity: number;
}

export default function FluidBackgroundCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const timeRef = useRef(0);

    useEffect(() => {
        // Respect prefers-reduced-motion
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (motionQuery.matches) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // ── Setup ─────────────────────────────────────────────────────
        const parent = canvas.parentElement;
        if (!parent) return;

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

        function getCSSVarColor(name: string, fallback: string): string {
            return getCSSVar(name, fallback);
        }

        let W = 0,
            H = 0;
        let particles: Particle[] = [];

        function resize() {
            const rect = parent.getBoundingClientRect();
            W = rect.width;
            H = rect.height;

            const dpr = window.devicePixelRatio || 1;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = W + "px";
            canvas.style.height = H + "px";

            ctx!.setTransform(1, 0, 0, 1, 0, 0);
            ctx!.scale(dpr, dpr);

            // Initialize particles
            const particleCount = Math.floor(
                getCSSVarFloat("--fluid-particle-count", 50),
            );
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.5 + 0.2,
                    targetOpacity: Math.random() * 0.5 + 0.2,
                });
            }
            particlesRef.current = particles;
        }

        const ro = new ResizeObserver(resize);
        ro.observe(parent);
        resize();

        // ── Perlin-like noise for smooth randomness ────────────────────
        const noise = (x: number, y: number, z: number): number => {
            // Simple pseudo-noise using sine waves
            return (
                Math.sin(x * 0.01) * Math.cos(y * 0.01) *
                Math.sin(z * 0.001)
            );
        };

        // ── Draw frame ─────────────────────────────────────────────────
        function draw(time: number) {
            const speed = getCSSVarFloat("--fluid-speed", 1);
            const intensity = getCSSVarFloat("--fluid-intensity", 1);
            const opacity = getCSSVarFloat("--fluid-opacity", 0.6);
            const glowIntensity = getCSSVarFloat("--fluid-glow", 0.3);

            const color1 = getCSSVarColor("--fluid-color-1", "hsl(220, 80%, 50%)");
            const color2 = getCSSVarColor("--fluid-color-2", "hsl(280, 70%, 55%)");
            const color3 = getCSSVarColor("--fluid-color-3", "hsl(180, 60%, 50%)");

            const t = (time * speed) / 5000; // Normalized time

            // Clear with slight fade for trail effect
            ctx!.fillStyle = "rgba(255, 255, 255, 0.02)";
            ctx!.fillRect(0, 0, W, H);

            // ── 1. Animated gradient background ────────────────────────
            const gx = W / 2 + Math.sin(t * 0.3) * W * 0.3;
            const gy = H / 2 + Math.cos(t * 0.2) * H * 0.3;

            const grad = ctx!.createRadialGradient(gx, gy, 0, gx, gy, Math.max(W, H) * 0.8);

            // Smooth color transitions through the gradient
            const c1Progress = (Math.sin(t * 0.5) + 1) / 2;
            const c2Progress = (Math.sin(t * 0.4 + 2) + 1) / 2;

            grad.addColorStop(0, color1);
            grad.addColorStop(0.5, color2);
            grad.addColorStop(1, color3);

            ctx!.globalAlpha = opacity * 0.3;
            ctx!.fillStyle = grad;
            ctx!.fillRect(0, 0, W, H);

            // ── 2. Secondary gradient layer (moving differently) ────────
            const gx2 = W / 2 + Math.cos(t * 0.25) * W * 0.25;
            const gy2 = H / 2 + Math.sin(t * 0.3) * H * 0.25;

            const grad2 = ctx!.createRadialGradient(
                gx2,
                gy2,
                0,
                gx2,
                gy2,
                Math.max(W, H) * 0.6,
            );

            grad2.addColorStop(0, color2);
            grad2.addColorStop(0.7, color3);

            ctx!.globalAlpha = opacity * 0.2;
            ctx!.fillStyle = grad2;
            ctx!.fillRect(0, 0, W, H);

            // ── 3. Floating particles ──────────────────────────────────
            ctx!.globalAlpha = 1;

            particles = particlesRef.current;

            for (const p of particles) {
                // Update position with noise-based velocity
                const noiseX = noise(p.x, p.y, t) * 2;
                const noiseY = noise(p.y, p.x, t + 100) * 2;

                p.vx += (noiseX - p.vx * 0.1) * 0.001 * intensity;
                p.vy += (noiseY - p.vy * 0.1) * 0.001 * intensity;

                // Add floating effect
                p.vy += Math.sin(t * 0.5 + p.x * 0.01) * 0.0001 * intensity;

                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = W;
                if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H;
                if (p.y > H) p.y = 0;

                // Target opacity changes smoothly
                p.targetOpacity = Math.random() * 0.5 + 0.2 + Math.sin(t * 2 + p.x) * 0.2;
                p.opacity += (p.targetOpacity - p.opacity) * 0.05;

                // Draw particle with glow
                const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity * glowIntensity})`);
                gradient.addColorStop(0.5, `rgba(200, 200, 255, ${p.opacity * 0.3})`);
                gradient.addColorStop(1, `rgba(200, 200, 255, 0)`);

                ctx!.fillStyle = gradient;
                ctx!.fillRect(
                    p.x - p.radius * 3,
                    p.y - p.radius * 3,
                    p.radius * 6,
                    p.radius * 6,
                );

                // Particle core
                ctx!.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx!.beginPath();
                ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx!.fill();
            }

            // ── 4. Optional subtle connections between nearby particles ─
            ctx!.globalAlpha = opacity * 0.1;
            ctx!.strokeStyle = color1;
            ctx!.lineWidth = 0.5;

            const connectionDistance = 100;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx!.beginPath();
                        ctx!.moveTo(particles[i].x, particles[i].y);
                        ctx!.lineTo(particles[j].x, particles[j].y);
                        ctx!.globalAlpha = (opacity * 0.1 * (1 - dist / connectionDistance));
                        ctx!.stroke();
                    }
                }
            }
        }

        // ── Animation loop ─────────────────────────────────────────────
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
