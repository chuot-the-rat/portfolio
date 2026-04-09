/**
 * PassbookPrintCard.jsx
 * First-visit passbook introduction, shown in the home page hero area.
 *
 * Behaviour:
 * - On first visit (isNewlyIssued = true): animates in with a brief entrance,
 *   then settles. Card marks itself as "seen" after mount.
 * - On return visits: renders in its resting state immediately (no entrance).
 * - Clicking opens the passbook drawer.
 *
 * Rendered between HeroContainer and MarqueeTicker in Home.jsx.
 * Stays visible on the home page as the hero-level passbook touchpoint.
 */

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePassbook } from "./PassbookProvider";
import { PASSBOOK_ROUTE_ORDER, PASSBOOK_ROUTES } from "../../data/passbook/passbookConfig";
import "./Passbook.css";

export default function PassbookPrintCard() {
    const {
        stampCount,
        totalRoutes,
        openDrawer,
        isStamped,
        isNewlyIssued,
        clearNewlyIssued,
        isParked,
        parkPassbook,
    } = usePassbook();

    const shouldReduceMotion = useReducedMotion();
    const shouldAnimate = !shouldReduceMotion;

    useEffect(() => {
        if (isNewlyIssued) {
            const t = setTimeout(clearNewlyIssued, 2400);
            return () => clearTimeout(t);
        }
    }, [isNewlyIssued, clearNewlyIssued]);

    const isPrimaryIssue = isNewlyIssued;
    const profile = isPrimaryIssue
        ? {
              delay: 0.45,
              feedDuration: 0.72,
              settleDuration: 0.2,
              contentDuration: 0.28,
              contentDelay: 0.48,
              settleDelay: 0.74,
          }
        : {
              delay: 0.06,
              feedDuration: 0.36,
              settleDuration: 0.16,
              contentDuration: 0.2,
              contentDelay: 0.22,
              settleDelay: 0.32,
          };

    const finalProfile = shouldReduceMotion
        ? {
              delay: 0,
              feedDuration: 0,
              settleDuration: 0,
              contentDuration: 0,
              contentDelay: 0,
              settleDelay: 0,
          }
        : profile;

    const cardVariants = {
        initial: shouldAnimate
            ? { clipPath: "inset(0 0 100% 0)", opacity: 0.98, y: -8 }
            : { clipPath: "inset(0 0 0% 0)", opacity: 1 },
        animate: {
            clipPath: "inset(0 0 0% 0)",
            opacity: shouldAnimate ? [1, 1, 0.995, 1] : 1,
            y: shouldAnimate ? [0, 1, 0] : 0,
            transition: {
                clipPath: {
                    duration: finalProfile.feedDuration,
                    ease: [0.16, 1, 0.3, 1],
                    delay: finalProfile.delay,
                },
                y: {
                    duration: finalProfile.settleDuration,
                    ease: [0.25, 0, 0, 1],
                    delay: shouldAnimate ? finalProfile.delay + finalProfile.settleDelay : 0,
                },
                opacity: {
                    duration: 0.16,
                    ease: [0.25, 0, 0, 1],
                    delay: shouldAnimate ? finalProfile.delay + finalProfile.settleDelay : 0,
                },
            },
        },
    };

    const contentVariants = {
        initial: { opacity: shouldAnimate ? 0 : 1 },
        animate: {
            opacity: 1,
            transition: {
                duration: finalProfile.contentDuration,
                delay: shouldAnimate ? finalProfile.delay + finalProfile.contentDelay : 0,
            },
        },
    };

    const allDone = stampCount === totalRoutes;
    const handlePress = () => {
        if (!isParked) {
            parkPassbook();
            return;
        }
        openDrawer();
    };

    return (
        <div className="pb-print-wrapper">
            <div className="pb-print-slot" aria-hidden="true">
                <span className="pb-print-slot__feed" />
            </div>
            <motion.button
                className="pb-print-card"
                onClick={handlePress}
                aria-label={
                    isParked
                        ? `Project Passbook — ${stampCount} of ${totalRoutes} route seals logged. Open passbook.`
                        : "Printed pass ready. Press to add to rail."
                }
                initial={cardVariants.initial}
                animate={cardVariants.animate}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985, y: 1 }}
            >
                <motion.span
                    className="pb-print-card__inner"
                    initial={contentVariants.initial}
                    animate={contentVariants.animate}
                >
                    {/* Left: compact mark */}
                    <span className="pb-print-card__mark" aria-hidden="true">
                        PP
                    </span>

                    {/* Text block */}
                    <span className="pb-print-card__body">
                        <span className="pb-print-card__eyebrow">
                            {isNewlyIssued ? "Issuance active" : "Printed artifact"}
                        </span>
                        <span className="pb-print-card__label">
                            {!isParked
                                ? "Press to add passbook"
                                : allDone
                                  ? "All route seals logged"
                                  : "Press to open route seals"}
                        </span>
                        <span className="pb-print-card__sub">
                            {stampCount} / {totalRoutes} sealed
                        </span>
                        <span className="pb-print-card__slots" aria-hidden="true">
                            {PASSBOOK_ROUTE_ORDER.map((id) => {
                                const stamped = isStamped(id);
                                const route = PASSBOOK_ROUTES[id];
                                return (
                                    <span
                                        key={id}
                                        className={`pb-print-slot-dot${stamped ? " is-filled" : ""}`}
                                        style={{ "--pb-accent-hue": route?.accentHue ?? 240 }}
                                    />
                                );
                            })}
                        </span>
                    </span>

                    {/* Arrow */}
                    <span className="pb-print-card__arrow" aria-hidden="true">
                        →
                    </span>
                </motion.span>
            </motion.button>
        </div>
    );
}
