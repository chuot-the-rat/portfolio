/**
 * OutcomeSummary.jsx
 * Displays the rule-generated outcome for the current simulation config.
 * Animates between states using Framer Motion.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useSimulation } from './SimulationProvider.jsx';
import { USER_TYPES, DEVICES } from './sim.types.js';

const OUTCOME_SECTIONS = [
    { key: 'scope', label: 'MVP Scope', accent: false },
    { key: 'removed', label: 'Removed / Deprioritized', accent: false },
    { key: 'tradeoffs', label: 'Tradeoffs', accent: false },
    { key: 'risks', label: 'Risks', accent: false },
    { key: 'tests', label: 'Suggested Usability Tests', accent: true },
];

const containerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.06 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

function OutcomeBlock({ label, items, accent }) {
    if (!items || items.length === 0) return null;

    return (
        <motion.div
            className={`sim-outcome__block${accent ? ' sim-outcome__block--accent' : ''}`}
            variants={itemVariants}
        >
            <h4 className="sim-outcome__block-label">{label}</h4>
            <ul className="sim-outcome__list">
                {items.map((item, i) => (
                    <li key={i} className="sim-outcome__list-item">
                        <span className="sim-outcome__bullet" aria-hidden="true" />
                        {item}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}

export default function OutcomeSummary() {
    const { config, outcome } = useSimulation();

    const userLabel = USER_TYPES.find((u) => u.value === config.userType)?.label ?? config.userType;
    const deviceLabel = DEVICES.find((d) => d.value === config.device)?.label ?? config.device;

    // Key changes whenever config changes, causing AnimatePresence to remount
    const outcomeKey = `${config.userType}__${config.device}__${config.constraints.sort().join('-')}`;

    return (
        <div className="sim-outcome">
            <div className="sim-outcome__context">
                <span className="sim-outcome__context-tag">{userLabel}</span>
                <span className="sim-outcome__context-divider" aria-hidden="true">·</span>
                <span className="sim-outcome__context-tag">{deviceLabel}</span>
                {config.constraints.map((c) => {
                    const label = c
                        .split('-')
                        .map((w) => w[0].toUpperCase() + w.slice(1))
                        .join(' ');
                    return (
                        <span key={c} className="sim-outcome__context-divider" aria-hidden="true">
                            ·
                            <span className="sim-outcome__context-tag"> {label}</span>
                        </span>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={outcomeKey}
                    className="sim-outcome__body"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                >
                    {OUTCOME_SECTIONS.map(({ key, label, accent }) => (
                        <OutcomeBlock
                            key={key}
                            label={label}
                            items={outcome[key]}
                            accent={accent}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
