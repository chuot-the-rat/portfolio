import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { usePassbook } from "./PassbookProvider";
import "./Passbook.css";

export default function PassbookDock({ embedded = false }) {
    const { pathname } = useLocation();
    const { stampCount, totalRoutes, toggleDrawer, isParked } = usePassbook();
    const allDone = stampCount >= totalRoutes;
    const onHome = pathname === "/";
    const shouldReduceMotion = useReducedMotion();

    const shouldRender = useMemo(() => {
        if (!isParked) return false;
        if (embedded) return onHome;
        return !onHome;
    }, [embedded, isParked, onHome]);

    if (!shouldRender) return null;

    return (
        <motion.div
            className={`pb-peek-tab${embedded ? " pb-peek-tab--embedded" : ""}`}
            initial={shouldReduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                duration: shouldReduceMotion ? 0 : 0.24,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            <motion.button
                className="pb-peek-tab__btn"
                onClick={toggleDrawer}
                aria-label={`Open archive passbook — ${stampCount} of ${totalRoutes} route seals logged`}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            >
                <span className="pb-peek-tab__icon" aria-hidden="true">
                    {allDone ? "◆" : "◇"}
                </span>
                <span className="pb-peek-tab__progress">
                    {stampCount}/{totalRoutes}
                </span>
            </motion.button>
        </motion.div>
    );
}
