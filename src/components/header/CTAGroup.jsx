/**
 * CTAGroup.jsx
 * Renders 1–3 CTA items as pill buttons or links.
 *
 * - When href is present, renders as <motion.a>. Otherwise <motion.button>.
 * - variant "primary" = filled pill (uses --hs-cta-primary-* tokens).
 * - variant "ghost" = border-only pill (uses --hs-cta-ghost-* tokens).
 * - layout "row" = flex-wrap row. "stack" = column.
 * - Entrance participates in the HeroContainer stagger via childVariants.
 * - Hover animation is self-contained via ctaHoverVariants.
 */

import { motion, useReducedMotion } from "framer-motion";
import {
  childVariants,
  ctaHoverVariants,
} from "../../utils/header/heroMotion";

export default function CTAGroup({ ctas = [], layout = "row" }) {
  const shouldReduceMotion = useReducedMotion();

  const entranceProps = shouldReduceMotion ? {} : { variants: childVariants };

  const hoverProps = shouldReduceMotion
    ? {}
    : {
        variants: ctaHoverVariants,
        initial: "rest",
        whileHover: "hover",
        whileTap: "tap",
      };

  return (
    <motion.nav
      className="hs-cta-group"
      data-layout={layout}
      aria-label="Primary actions"
      {...entranceProps}
    >
      {ctas.map((cta) => {
        // Render as <a> when href is present, otherwise <button>
        if (cta.href) {
          return (
            <motion.a
              key={cta.label}
              className={`hs-cta hs-cta--${cta.variant}`}
              href={cta.href}
              download={cta.download || undefined}
              target={cta.external ? "_blank" : undefined}
              rel={cta.external ? "noopener noreferrer" : undefined}
              {...hoverProps}
            >
              {cta.label}
            </motion.a>
          );
        }

        return (
          <motion.button
            key={cta.label}
            className={`hs-cta hs-cta--${cta.variant}`}
            type="button"
            onClick={cta.onClick}
            {...hoverProps}
          >
            {cta.label}
          </motion.button>
        );
      })}
    </motion.nav>
  );
}
