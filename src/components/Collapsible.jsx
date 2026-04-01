import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Collapsible.css";

/**
 * Collapsible — Expandable section component for case study details.
 *
 * Usage:
 * <Collapsible
 *   title="Feature Title"
 *   subtitle="Optional subtitle"
 *   isOpen={false}
 * >
 *   <p>Content goes here...</p>
 * </Collapsible>
 */
export default function Collapsible({
    title,
    subtitle,
    children,
    isOpen = false,
    className = "",
}) {
    const [open, setOpen] = useState(isOpen);

    return (
        <div className={`collapsible ${className} ${open ? "is-open" : ""}`}>
            {/* Header — clickable trigger */}
            <motion.button
                className="collapsible-trigger"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                type="button"
            >
                <div className="collapsible-header">
                    <div className="collapsible-text">
                        <h3 className="collapsible-title">{title}</h3>
                        {subtitle && (
                            <p className="collapsible-subtitle">{subtitle}</p>
                        )}
                    </div>

                    {/* Chevron indicator */}
                    <motion.div
                        className="collapsible-chevron"
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5 8L10 13L15 8"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </motion.div>
                </div>
            </motion.button>

            {/* Content — animated reveal */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                            duration: 0.35,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                    >
                        <div className="collapsible-content">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
