/**
 * PassbookDock.jsx
 * Compact persistent access object for the passbook.
 *
 * Desktop: fixed bottom-right pill.
 * Mobile: fixed bottom-center pill.
 *
 * Shows stamp progress and opens the drawer on click.
 * Mounted globally at App level — visible on all pages.
 */

import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePassbook } from "./PassbookProvider";
import "./Passbook.css";

const TOOLTIP_KEY = "pb_tooltip_dismissed";

export default function PassbookDock() {
    const { stampCount, totalRoutes, toggleDrawer } = usePassbook();
    const controls = useAnimation();
    const prevCount = useRef(stampCount);

    // Show tooltip once — dismissed to localStorage
    const [showTooltip, setShowTooltip] = useState(
        () => !localStorage.getItem(TOOLTIP_KEY)
    );

    const dismissTooltip = () => {
        localStorage.setItem(TOOLTIP_KEY, "1");
        setShowTooltip(false);
    };

    // Auto-dismiss after 6 seconds
    useEffect(() => {
        if (!showTooltip) return;
        const t = setTimeout(dismissTooltip, 6000);
        return () => clearTimeout(t);
    }, [showTooltip]);

    // Pulse animation when a new stamp is collected
    useEffect(() => {
        if (stampCount > prevCount.current) {
            controls.start({
                scale: [1, 1.18, 0.96, 1.06, 1],
                transition: { duration: 0.55, ease: "easeOut" },
            });
        }
        prevCount.current = stampCount;
    }, [stampCount, controls]);

    const allDone = stampCount === totalRoutes;

    return (
        <motion.div
            className="pb-dock"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* First-time tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.button
                        className="pb-dock__tooltip"
                        onClick={dismissTooltip}
                        aria-label="Dismiss hint"
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 280, damping: 22, delay: 1.2 }}
                    >
                        Collect a stamp at the end of each project ✦
                    </motion.button>
                )}
            </AnimatePresence>

            <motion.button
                className="pb-dock__btn"
                animate={controls}
                onClick={() => { toggleDrawer(); dismissTooltip(); }}
                aria-label={`Open project passbook — ${stampCount} of ${totalRoutes} stamps collected`}
            >
                <span className="pb-dock__icon" aria-hidden="true">
                    {allDone ? "◆" : "◇"}
                </span>
                <span className="pb-dock__progress">
                    {stampCount}/{totalRoutes}
                </span>
                <span aria-hidden="true">Passbook</span>
            </motion.button>
        </motion.div>
    );
}
