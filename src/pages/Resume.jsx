/**
 * Resume.jsx
 * Resume page with embedded Adobe InDesign link.
 *
 * What it does:
 * - Embeds resume in a responsive iframe
 * - Provides button to open in new tab
 * - Includes download PDF link
 * - Matches site design system (minimal, centered, spacious)
 */

import { motion } from "framer-motion";
import { usePageTitle } from "../hooks/usePageTitle";
import HeroContainer from "../components/header/HeroContainer";
import { resumeHeroConfig } from "../data/header/headerConfig";
import "./Resume.css";

export default function Resume() {
    usePageTitle("Resume");
    // Adobe InDesign link (embedded view)
    const resumeLink =
        "https://indd.adobe.com/view/8da9a590-bb12-4c21-a861-4ef0ff8106b1";

    return (
        <div className="resume">
            <main className="resume-main">
                {/* ─── HERO SECTION ─── */}
                <HeroContainer config={resumeHeroConfig} />

                {/* ─── EMBEDDED RESUME VIEWER ─── */}
                <motion.div
                    className="resume-embed-container"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.2 }}
                >
                    {/* Responsive iframe wrapper */}
                    <div className="resume-iframe-wrapper">
                        <iframe
                            src={resumeLink}
                            title="Resume - Leana Le"
                            className="resume-iframe"
                            allowFullScreen
                        />
                    </div>
                </motion.div>

                {/* ─── ACTION BUTTONS ─── */}
                <motion.div
                    className="resume-actions"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.3 }}
                >
                    <div className="resume-buttons">
                        <a
                            href={resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resume-btn--primary"
                        >
                            Open in new tab →
                        </a>
                        <a
                            href="/Le_Leana_Resume_NoNumber.pdf"
                            download="Leana_Le_Resume.pdf"
                            className="resume-btn--secondary"
                        >
                            Download PDF
                        </a>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
