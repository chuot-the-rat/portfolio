/**
 * FloatingTag.jsx
 * Draggable pill positioned absolutely within HeroContainer.
 * Springs to mode-specific positions on mode change.
 *
 * - position { x, y } is the target for the current mode
 * - useMotionValue + animate() shares motion values between drag and spring
 *   so mode transitions don't snap the element back after dragging
 * - On mobile: returns null; HeroContainer renders static chips instead
 */

import { useState, useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, animate } from "framer-motion";
import { tagVariants, tagIdleVariants } from "../../utils/header/heroMotion";

export default function FloatingTag({
  label,
  icon = null,
  initialX = 0,
  initialY = 0,
  index = 0,
  position,          // { x, y } for current mode — drives spring animation
  dragConstraintsRef,
  idleMotion = true,
}) {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState("entrance");
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Shared motion values — both drag and mode-spring operate on these
  // so they never conflict with each other
  const mx = useMotionValue(position?.x ?? initialX);
  const my = useMotionValue(position?.y ?? initialY);

  // Spring to new mode position whenever position changes
  useEffect(() => {
    if (!position) return;
    const cx = animate(mx, position.x, { type: "spring", stiffness: 160, damping: 24 });
    const cy = animate(my, position.y, { type: "spring", stiffness: 160, damping: 24 });
    return () => { cx.stop(); cy.stop(); };
  }, [position?.x, position?.y]); // eslint-disable-line react-hooks/exhaustive-deps

  const motionProps = shouldReduceMotion
    ? { style: { opacity: 1, x: mx, y: my } }
    : {
        variants: { ...tagVariants, ...tagIdleVariants },
        custom: index,
        initial: "hidden",
        animate: phase === "idle" ? "idle" : "visible",
        onAnimationComplete: (def) => {
          if (def === "visible" && idleMotion) setPhase("idle");
        },
        style: { x: mx, y: my },
      };

  if (isMobile) return null;

  return (
    <motion.span
      className="hs-tag"
      style={{
        left: initialX,
        top: initialY,
        ...motionProps.style,
      }}
      drag={!shouldReduceMotion}
      dragConstraints={dragConstraintsRef}
      dragElastic={0.08}
      dragMomentum={false}
      aria-hidden="true"
      variants={motionProps.variants}
      custom={motionProps.custom}
      initial={motionProps.initial}
      animate={motionProps.animate}
      onAnimationComplete={motionProps.onAnimationComplete}
    >
      {icon && <i className="hs-tag__icon" aria-hidden="true">{icon}</i>}
      {label}
    </motion.span>
  );
}
