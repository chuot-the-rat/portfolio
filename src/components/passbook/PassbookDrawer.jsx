/**
 * PassbookDrawer.jsx
 * Passbook side drawer (desktop) / bottom sheet (mobile).
 *
 * Desktop:  slides in from right, soft overlay behind.
 * Mobile:   slides up from bottom as a sheet.
 *
 * Contents:
 *   - Header with title + close
 *   - Progress summary bar
 *   - Ordered route list (stamped / unstamped)
 *   - Footer note
 */

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { usePassbook } from "./PassbookProvider";
import {
    PASSBOOK_ROUTE_ORDER,
    PASSBOOK_ROUTES,
} from "../../data/passbook/passbookConfig";
import { getProjectPath } from "../../utils/projectDataMapper";
import "./Passbook.css";

/** Project display names — supplement data without touching project mapper */
const PROJECT_TITLES = {
    inklink:     "InkLink",
    prolog:      "ProLog",
    sidequest:   "SideQuest",
    "fizzu-soda": "Fizzu Soda",
    sap:         "SAP",
};

export default function PassbookDrawer() {
    const { drawerOpen, closeDrawer, isStamped, stampCount, totalRoutes } =
        usePassbook();

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [drawerOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!drawerOpen) return;
        const onKey = (e) => { if (e.key === "Escape") closeDrawer(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [drawerOpen, closeDrawer]);

    const fillPct = totalRoutes > 0 ? (stampCount / totalRoutes) * 100 : 0;

    /* ── Animation variants ─────────────────────────────────────────── */
    const isMobile =
        typeof window !== "undefined" && window.innerWidth <= 600;

    const drawerVariants = {
        hidden:  isMobile ? { y: "100%" }    : { x: "100%" },
        visible: isMobile ? { y: 0 }          : { x: 0 },
        exit:    isMobile ? { y: "100%" }    : { x: "100%" },
    };

    return (
        <AnimatePresence>
            {drawerOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="pb-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        onClick={closeDrawer}
                        aria-hidden="true"
                    />

                    {/* Drawer panel */}
                    <motion.aside
                        className="pb-drawer"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Project Passbook"
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{
                            duration: 0.36,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    >
                        {/* Header */}
                        <div className="pb-drawer__header">
                            <div className="pb-drawer__title-block">
                                <span className="pb-drawer__eyebrow">
                                    Leana Le
                                </span>
                                <h2 className="pb-drawer__title">
                                    Project Passbook
                                </h2>
                            </div>
                            <button
                                className="pb-drawer__close"
                                onClick={closeDrawer}
                                aria-label="Close passbook"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Progress summary */}
                        <div className="pb-drawer__summary">
                            <div className="pb-drawer__progress-label">
                                <span className="pb-drawer__progress-text">
                                    Routes stamped
                                </span>
                                <span className="pb-drawer__progress-count">
                                    {stampCount} / {totalRoutes}
                                </span>
                            </div>
                            <div className="pb-drawer__progress-track">
                                <div
                                    className="pb-drawer__progress-fill"
                                    style={{ width: `${fillPct}%` }}
                                />
                            </div>
                        </div>

                        {/* Route list */}
                        <nav
                            className="pb-drawer__routes"
                            aria-label="Project routes"
                        >
                            {PASSBOOK_ROUTE_ORDER.map((id) => {
                                const route   = PASSBOOK_ROUTES[id];
                                const stamped = isStamped(id);
                                const title   = PROJECT_TITLES[id] ?? id;
                                const path    = getProjectPath(id);
                                const hue     = route?.accentHue ?? 240;

                                return (
                                    <Link
                                        key={id}
                                        to={path}
                                        className={`pb-route-row${stamped ? " pb-route-row--stamped" : ""}`}
                                        style={{ "--pb-accent-hue": hue }}
                                        onClick={closeDrawer}
                                        aria-label={`${title}${stamped ? ` — stamped: ${route.stampLabel}` : " — not yet stamped"}`}
                                    >
                                        <span className="pb-route-dot" aria-hidden="true" />
                                        <span className="pb-route-code" aria-hidden="true">
                                            {route?.routeCode}
                                        </span>
                                        <span className="pb-route-title">{title}</span>
                                        {stamped && (
                                            <span className="pb-route-stamp" aria-hidden="true">
                                                {route?.stampLabel}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer */}
                        <div className="pb-drawer__footer">
                            <p className="pb-drawer__footer-note">
                                {stampCount === totalRoutes
                                    ? "All routes completed."
                                    : "Stamps collected at the end of each project."}
                            </p>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
