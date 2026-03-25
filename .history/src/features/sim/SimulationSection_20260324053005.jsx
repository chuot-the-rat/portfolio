/**
 * SimulationSection.jsx
 * Top-level section component for the InkLink Interactive Case Study Sandbox.
 *
 * This file:
 * - Renders a <section> with title and description
 * - Wraps SimulationPanel and OutcomeSummary with SimulationProvider
 * - Handles Framer Motion fade-in animation when section scrolls into view
 *
 * How it fits in the InkLink case study:
 * - Drop this component inside ProjectDetail.jsx
 * - It appears as one section of the case study (with index like "1.07 Simulation Mode")
 * - User configures options → real-time outcome updates
 * - Shows how product decisions change by scenario
 *
 * Usage in ProjectDetail.jsx:
 *   {project.id === 'inklink' && <SimulationSection caseIndex={1} sectionIndex={7} />}
 */

import { motion } from 'framer-motion';
import { SimulationProvider } from './SimulationProvider.jsx';
import SimulationPanel from './SimulationPanel.jsx';
import OutcomeSummary from './OutcomeSummary.jsx';
import './SimulationSandbox.css';

export default function SimulationSection({ caseIndex, sectionIndex }) {
    // Format section index like "1.07" for the micro-index system
    const sectionId = `${caseIndex}.${String(sectionIndex).padStart(2, '0')}`;

    return (
        <motion.section
            className="project-section sim-section"
            // Fade in + slide up when section scrolls into view
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            // once: true = animate only the first time, don't re-animate on scroll back
            // margin = start animation before element is fully visible
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            aria-label="InkLink Design Simulator"
        >
            {/* ─── SECTION INDEX ─── matches the micro-index labels on other sections */}
            <div className="sim-section__index">
                <span className="section-index-id">{sectionId}</span>
                <span className="section-index-name">Simulation Mode</span>
            </div>

            {/* ─── SECTION TITLE & DESCRIPTION ─── introduce what this section does */}
            <h2 className="section-title">Design Simulator</h2>

            <p className="section-description">
                Configure a user scenario below to see how InkLink's product scope,
                tradeoffs, and test priorities would shift. This is the case study as a
                decision engine — not a static story.
            </p>

            {/* ─── SIMULATION STATE PROVIDER ─── wrap both panel and outcome */}
            <SimulationProvider>
                <div className="sim-layout">
                    {/* Left: Configuration panel (user picks options) */}
                    <SimulationPanel />
                    {/* Right: Outcome display (shows rules results) */}
                    <OutcomeSummary />
                </div>
            </SimulationProvider>
        </motion.section>
    );
}
