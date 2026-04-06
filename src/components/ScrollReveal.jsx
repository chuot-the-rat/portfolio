/**
 * ScrollReveal.jsx
 * Reusable wrapper that triggers a reveal animation when the element enters
 * the viewport. Uses Framer Motion's useInView hook.
 *
 * Props:
 *   delay     — optional manual stagger offset (seconds). Default: 0.
 *   duration  — optional duration override (seconds). Default: DURATION.reveal.
 *   children  — anything.
 *   className — forwarded to the motion wrapper div.
 *
 * Do NOT apply to: body text, metadata rows, nav, footer, or any element
 * that is always in the initial viewport.
 *
 * prefers-reduced-motion: when active, the element appears immediately with
 * no translateY — only a short opacity fade is retained.
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { DURATION, EASING } from "../animation.config";

export default function ScrollReveal({
  children,
  delay = 0,
  duration = DURATION.reveal,
  className = "",
}) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transition: "opacity 0.15s" }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration,
        delay,
        ease: EASING.spring,
      }}
    >
      {children}
    </motion.div>
  );
}
