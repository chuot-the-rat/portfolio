import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import HeroContainer from "../components/header/HeroContainer";
import SkillsSection from "../components/SkillsSection";
import EducationSection from "../components/EducationSection";
import { aboutHeroConfig } from "../data/header/headerConfig";
import "./About.css";

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.45 },
};

export default function About() {
    usePageTitle("About");
    return (
        <div className="about">
            <main className="about-main">
                <div className="container">
                    <HeroContainer config={aboutHeroConfig} />

                    <div className="about-body">

                        {/* ── Intro ── */}
                        <motion.div className="about-row" {...fadeUp}>
                            <span className="about-row-label">Intro</span>
                            <div className="about-row-content">
                                <p className="about-para">
                                    I spent <em className="about-em">six years in hospitality</em>, and what I
                                    loved most was the craft of making someone's experience
                                    feel easy, warm, and just right. That instinct carried
                                    straight into design — I care about the{" "}
                                    <em className="about-em">person on the other side of the screen</em>{" "}
                                    the same way I cared about every guest across the counter.
                                </p>
                                <p className="about-para">
                                    Now I'm a <em className="about-em">UI/UX designer and front-end developer</em>,
                                    combining that people-first approach with the technical
                                    side of building things. Currently finishing my Diploma
                                    in Digital Design & Development at BCIT.
                                </p>
                            </div>
                        </motion.div>

                        {/* ── About Me ── */}
                        <motion.div
                            className="about-row"
                            {...fadeUp}
                            transition={{ duration: 0.45, delay: 0.06 }}
                        >
                            <span className="about-row-label">About Me</span>
                            <div className="about-row-content">
                                <p className="about-para">
                                    When I'm not designing, I'm probably deep in a manga
                                    arc — isekai and regression, mostly — or rebuilding my
                                    Super Auto Pets team after an embarrassing loss. I love
                                    making presentations{" "}
                                    <em className="about-em">far more than any normal person should</em>.
                                    I used to cosplay. I still consider myself a massive geek.
                                </p>
                                <p className="about-para">
                                    My friends call me <em className="about-em">Chuot</em> — Vietnamese for mouse.
                                    You can too.
                                </p>
                            </div>
                        </motion.div>

                    </div>

                    {/* ── Skills ── */}
                    <SkillsSection variant="grid" />

                    {/* ── Education ── */}
                    <EducationSection variant="timeline" />

                    {/* ── Let's Talk ── */}
                    <motion.section
                        className="about-connect"
                        {...fadeUp}
                        transition={{ duration: 0.45, delay: 0.08 }}
                    >
                        <div className="about-connect-inner">
                            <div className="about-connect-text">
                                <p className="about-connect-label">Contact</p>
                                <h2 className="about-connect-heading">
                                    Let's talk.
                                </h2>
                                <p className="about-connect-sub">
                                    Open to full-time roles, freelance projects, and
                                    the occasional isekai recommendation. Reach out —
                                    I don't bite.
                                </p>
                            </div>
                            <div className="about-connect-links">
                                <Link
                                    to="/contact"
                                    className="about-connect-link about-connect-link--primary"
                                >
                                    Get in touch →
                                </Link>
                                <a
                                    href="https://linkedin.com/in/leanale"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="about-connect-link"
                                >
                                    LinkedIn →
                                </a>
                                <a
                                    href="https://github.com/chuot-the-rat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="about-connect-link"
                                >
                                    GitHub →
                                </a>
                            </div>
                        </div>
                    </motion.section>

                </div>
            </main>
        </div>
    );
}
