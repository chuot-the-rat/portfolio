/**
 * OutcomeSummary.jsx
 * Displays the rule-generated outcome for the current simulation config.
 *
 * What it does:
 * - Reads the current config from simulation state (user type, device, constraints)
 * - Reads the merged outcome from all rules that match the config
 * - Displays outcome in 5 sections: Scope, Removed, Tradeoffs, Risks, Tests
 * - Animates each section in when config changes (smooth staggered entrance)
 *
 * Animation strategy:
 * - When user changes config, outcomeKey changes
 * - When outcomeKey changes, AnimatePresence detects the old outcome is gone
 * - Old outcome exits with fade-out, new outcome enters with fade-in + stagger
 * - Creates smooth visual transition between different scenarios
 */

import { AnimatePresence, motion } from "framer-motion";
import { useSimulation } from "./SimulationProvider.jsx";
import { USER_TYPES, DEVICES } from "./sim.types.js";

// Define which sections appear in the outcome and in what order
const OUTCOME_SECTIONS = [
    { key: "scope", label: "MVP Scope", accent: false },
    { key: "removed", label: "Removed / Deprioritized", accent: false },
    { key: "tradeoffs", label: "Tradeoffs", accent: false },
    { key: "risks", label: "Risks", accent: false },
    // Tests section gets accent styling (different look)
    { key: "tests", label: "Suggested Usability Tests", accent: true },
];

// Animation for the whole outcome container
// staggerChildren delays each child motion.div by 0.06s for a cascading effect
const containerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.06 },
    },
};

// Animation for each individual outcome block (scope, removed, tradeoffs, etc.)
const itemVariants = {
    hidden: { opacity: 0, y: 10 }, // Start invisible, slightly down
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    }, // Fade in, slide up
    exit: { opacity: 0, y: -6, transition: { duration: 0.15 } }, // Exit quickly: fade out, slide up
};

/**
 * OutcomeBlock component
 * Renders a single section of the outcome (e.g., list of features in MVP scope).
 *
 * @param {string} label - Section title (e.g., "MVP Scope")
 * @param {string[]} items - List of items to display
 * @param {boolean} accent - If true, apply accent styling
 * @returns null if no items to display, otherwise a styled list
 */
function OutcomeBlock({ label, items, accent }) {
    // Don't render if no items
    if (!items || items.length === 0) return null;

    return (
        <motion.div
            className={`sim-outcome__block${accent ? " sim-outcome__block--accent" : ""}`}
            variants={itemVariants}
        >
            <h4 className="sim-outcome__block-label">{label}</h4>
            <ul className="sim-outcome__list">
                {items.map((item, i) => (
                    <li
                        key={i}
                        className="sim-outcome__list-item"
                    >
                        <span
                            className="sim-outcome__bullet"
                            aria-hidden="true"
                        />
                        {item}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}

export default function OutcomeSummary() {
    // Get current config and calculated outcome from simulation context
    const { config, outcome } = useSimulation();

    // Look up human-readable labels for the currently selected options
    // (e.g., "student-writer" → "Student Writer")
    const userLabel =
        USER_TYPES.find((u) => u.value === config.userType)?.label ??
        config.userType;
    const deviceLabel =
        DEVICES.find((d) => d.value === config.device)?.label ?? config.device;

    /**
     * Create a unique key for the outcome container.
     * When this key changes, AnimatePresence remounts the entire container,
     * triggering exit animation on old content and enter animation on new content.
     *
     * Key includes: user type + device + sorted constraints
     * (sorted so "a,b" and "b,a" produce the same key)
     */
    const outcomeKey = `${config.userType}__${config.device}__${config.constraints.sort().join("-")}`;

    return (
        <div className="sim-outcome">
            {/* ─── CONTEXT TAGS ─── show user what scenario they're looking at */}
            <div className="sim-outcome__context">
                <span className="sim-outcome__context-tag">{userLabel}</span>
                <span
                    className="sim-outcome__context-divider"
                    aria-hidden="true"
                >
                    ·
                </span>
                <span className="sim-outcome__context-tag">{deviceLabel}</span>

                {/* Display each selected constraint as a tag */}
                {config.constraints.map((c) => {
                    // Convert constraint ID to label (e.g., "tight-deadline" → "Tight Deadline")
                    const label = c
                        .split("-")
                        .map((w) => w[0].toUpperCase() + w.slice(1))
                        .join(" ");
                    return (
                        <span
                            key={c}
                            className="sim-outcome__context-divider"
                            aria-hidden="true"
                        >
                            ·
                            <span className="sim-outcome__context-tag">
                                {" "}
                                {label}
                            </span>
                        </span>
                    );
                })}
            </div>

            {/* ─── ANIMATED OUTCOME BODY ─── renders when key changes */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={outcomeKey} // When this changes, old content exits, new content enters
                    className="sim-outcome__body"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                >
                    {/* Render each section from OUTCOME_SECTIONS */}
                    {OUTCOME_SECTIONS.map(({ key, label, accent }) => (
                        <OutcomeBlock
                            key={key}
                            label={label}
                            items={outcome[key]} // Get items from rules engine
                            accent={accent}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
