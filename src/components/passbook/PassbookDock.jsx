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

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { usePassbook } from "./PassbookProvider";
import "./Passbook.css";

export default function PassbookDock() {
    const { stampCount, totalRoutes, toggleDrawer } = usePassbook();
    const controls = useAnimation();
    const prevCount = useRef(stampCount);

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
            <motion.button
                className="pb-dock__btn"
                animate={controls}
                onClick={toggleDrawer}
                aria-label={`Open project passbook — ${stampCount} of ${totalRoutes} stamps collected`}
            >
                <span className="pb-dock__icon" aria-hidden="true">
                    {allDone ? "◆" : "◇"}
                </span>
                <span className="pb-dock__progress">
                    {stampCount}/{totalRoutes}
                </span>
                <span aria-hidden="true">Archive Pass</span>
            </motion.button>
        </motion.div>
    );
}
