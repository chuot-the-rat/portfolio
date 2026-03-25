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
import "./Resume.css";

export default function Resume() {
    // Adobe InDesign link (embedded view)
    const resumeLink =
        "https://indd.adobe.com/view/8da9a590-bb12-4c21-a861-4ef0ff8106b1";

    return (
        <div className="resume">
            <main className="resume-main">
                {/* ─── HERO SECTION ─── */}
                <motion.section
                    className="resume-hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="resume-title">Resume</h1>
                    <p className="resume-subtitle">
                        My experience, skills, and education
                    </p>
                </motion.section>

                {/* ─── EMBEDDED RESUME VIEWER ─── */}
                <motion.section
                    className="resume-embed-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
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
                </motion.section>

                {/* ─── ACTION BUTTONS ─── */}
                <motion.section
                    className="resume-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="resume-buttons">
                        {/* Open in new tab */}
                        <a
                            href={resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resume-btn resume-btn--primary"
                        >
                            Open in New Tab
                        </a>

                        {/* Download PDF link */}
                        <a
                            href={resumeLink}
                            download
                            className="resume-btn resume-btn--secondary"
                            onClick={(e) => {
                                // Open Adobe link in new tab for download option
                                e.preventDefault();
                                window.open(
                                    resumeLink,
                                    "_blank",
                                    "noopener,noreferrer",
                                );
                            }}
                        >
                            Download PDF
                        </a>
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
