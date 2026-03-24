/**
 * SimulationSection.jsx
 * The top-level section component rendered inside the InkLink case study.
 * Drop this inside ProjectContentMain in ProjectDetail.jsx.
 *
 * Usage:
 *   import SimulationSection from '../features/sim/SimulationSection';
 *   // Inside ProjectContentMain, after the final rendered section:
 *   {project.id === 'inklink' && <SimulationSection caseIndex={ci} sectionIndex={nextSection()} />}
 */

import { motion } from 'framer-motion';
import { SimulationProvider } from './SimulationProvider.jsx';
import SimulationPanel from './SimulationPanel.jsx';
import OutcomeSummary from './OutcomeSummary.jsx';
import './SimulationSandbox.css';

export default function SimulationSection({ caseIndex, sectionIndex }) {
    const sectionId = `${caseIndex}.${String(sectionIndex).padStart(2, '0')}`;

    return (
        <motion.section
            className="project-section sim-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            aria-label="InkLink Design Simulator"
        >
            {/* Micro-index label, matching the existing SectionIndex pattern */}
            <div className="sim-section__index">
                <span className="section-index-id">{sectionId}</span>
                <span className="section-index-name">Simulation Mode</span>
            </div>

            <h2 className="section-title">Design Simulator</h2>

            <p className="section-description">
                Configure a user scenario below to see how InkLink's product scope,
                tradeoffs, and test priorities would shift. This is the case study as a
                decision engine — not a static story.
            </p>

            <SimulationProvider>
                <div className="sim-layout">
                    <SimulationPanel />
                    <OutcomeSummary />
                </div>
            </SimulationProvider>
        </motion.section>
    );
}
