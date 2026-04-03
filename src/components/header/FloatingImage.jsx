/**
 * FloatingImage.jsx
 * Draggable image card that animates between positions when hero mode changes.
 *
 * - position: { x, y, rotate } — driven by current mode from headerConfig
 * - When mode switches, Framer Motion springs to the new position
 * - If src is null, renders a placeholder so layout is visible during authoring
 * - Hidden on mobile (< 768px)
 */

import { motion, useReducedMotion } from "framer-motion";

export default function FloatingImage({
  src,
  alt = "Image",
  width = 180,
  position = { x: 0, y: 0, rotate: 0 },
  dragConstraintsRef,
  index = 0,
}) {
  const shouldReduceMotion = useReducedMotion();

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;
  if (isMobile) return null;

  const { x, y, rotate = 0 } = position;

  // Shared spring for position changes (mode switch)
  const springTransition = {
    type: "spring",
    stiffness: 130,
    damping: 22,
  };

  return (
    <motion.div
      className={`hs-float-img${!src ? " hs-float-img--placeholder" : ""}`}
      style={{ width }}
      initial={
        shouldReduceMotion
          ? { opacity: 1, x, y, rotate }
          : { opacity: 0, scale: 0.88, x, y, rotate }
      }
      animate={{ opacity: 1, scale: 1, x, y, rotate }}
      transition={
        shouldReduceMotion
          ? {}
          : {
              opacity: { duration: 0.45, delay: 0.65 + index * 0.12 },
              scale: { duration: 0.45, delay: 0.65 + index * 0.12 },
              x: springTransition,
              y: springTransition,
              rotate: springTransition,
            }
      }
      drag={!shouldReduceMotion}
      dragConstraints={dragConstraintsRef}
      dragElastic={0.08}
      dragMomentum={false}
      aria-hidden="true"
    >
      {src ? (
        <img src={src} alt={alt} className="hs-float-img__img" />
      ) : (
        <div className="hs-float-img__placeholder">
          <span className="hs-float-img__placeholder-label">{alt}</span>
        </div>
      )}
    </motion.div>
  );
}
