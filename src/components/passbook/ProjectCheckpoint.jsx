/**
 * ProjectCheckpoint.jsx
 * End-of-project stamp collection block.
 *
 * States:
 * 1. Not yet stamped — shows checkpoint label + stamp button
 * 2. Just stamped    — brief pulse animation + stamped confirmation
 * 3. Already stamped — quiet confirmation on revisit (no animation)
 *
 * Props:
 *   projectId  string  — must match a key in passbookConfig
 *
 * If projectId is not in passbookConfig, renders nothing.
 * This keeps it safe to add to all project pages without custom logic.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePassbook } from "./PassbookProvider";
import { getPassbookRoute } from "../../data/passbook/passbookConfig";
import "./Passbook.css";

export default function ProjectCheckpoint({ projectId }) {
    const { isStamped, stamp, openDrawer } = usePassbook();
    const [justCollected, setJustCollected] = useState(false);

    const route = getPassbookRoute(projectId);
    if (!route) return null; // project not in passbook — render nothing

    const already = isStamped(projectId);
    const hue     = route.accentHue ?? 240;

    function handleStamp() {
        if (already) return;
        stamp(projectId);
        setJustCollected(true);
        // Clear animation class after it plays
        setTimeout(() => setJustCollected(false), 500);
    }

    return (
        <div
            className="pb-checkpoint"
            style={{ "--pb-accent-hue": hue }}
        >
            {/* Left: label block */}
            <div className="pb-checkpoint__meta">
                <span className="pb-checkpoint__eyebrow">
                    {route.checkpointLabel}
                </span>
                <p className="pb-checkpoint__label">
                    {route.stampLabel}
                </p>
                <span className="pb-checkpoint__route">
                    {route.routeCode} — {route.lineLabel}
                </span>
                {route.microCues?.length > 0 && (
                    <span className="pb-checkpoint__micro" aria-hidden="true">
                        + {route.microCues[0]}
                    </span>
                )}
            </div>

            {/* Right: action */}
            <AnimatePresence mode="wait">
                {already ? (
                    <motion.div
                        key="stamped"
                        className={`pb-checkpoint__stamped${
                            justCollected ? " pb-checkpoint__stamped--just-collected" : ""
                        }`}
                        onClick={openDrawer}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter") openDrawer(); }}
                        aria-label="Stamped — open passbook"
                        style={{ cursor: "pointer" }}
                        initial={{ opacity: 0, scale: 0.82 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 340, damping: 22 }}
                    >
                        <span className="pb-checkpoint__stamped-dot" aria-hidden="true" />
                        <span className="pb-checkpoint__stamped-label">
                            Stamped
                        </span>
                    </motion.div>
                ) : (
                    <motion.button
                        key="action"
                        className="pb-checkpoint__action"
                        onClick={handleStamp}
                        aria-label={`Collect stamp: ${route.stampLabel}`}
                        whileTap={{ scale: 0.88 }}
                        transition={{ duration: 0.08 }}
                    >
                        Press to stamp
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
