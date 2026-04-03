/**
 * MediaBlock.jsx
 * Renders a single image or video in an editorially-tilted panel.
 *
 * - rotation prop creates the intentional tilt via CSS rotate (not transform).
 *   Default 1.5° gives a floating card feel. 0 = flat. Negative = left-lean.
 * - Hover lift is driven by mediaHoverVariants (max 4px — restrained).
 * - Entrance slides from the right + slight scale via mediaVariants.
 * - The panel is decorative — it does not receive focus or keyboard interaction.
 */

import { motion, useReducedMotion } from "framer-motion";
import { mediaVariants } from "../../utils/header/heroMotion";

export default function MediaBlock({
  src,
  alt = "",
  type = "image",
  caption,
  rotation = 1.5,
  aspectRatio = "4/5",
}) {
  const shouldReduceMotion = useReducedMotion();

  // Entrance and hover are kept separate to avoid variant key ambiguity.
  // whileHover uses an inline object so Framer Motion always knows the
  // explicit rest value (y: 0) to return to on hover-exit.
  const panelProps = shouldReduceMotion
    ? {
        style: { rotate: 0, aspectRatio },
      }
    : {
        variants: mediaVariants,
        initial: "hidden",
        animate: "visible",
        whileHover: { y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
        style: { rotate: rotation, aspectRatio },
      };

  return (
    <div>
      <motion.div
        className="hs-media-panel"
        aria-hidden="true"
        {...panelProps}
      >
        {type === "video" ? (
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            aria-label={alt}
          />
        ) : (
          <img src={src} alt={alt} loading="lazy" />
        )}
      </motion.div>

      {caption && <p className="hs-media-caption">{caption}</p>}
    </div>
  );
}
