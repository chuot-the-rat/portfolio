import { motion } from "framer-motion";
import { usePageTitle } from "../hooks/usePageTitle";
import NameCycle from "../components/about/NameCycle";
import SkillsSection from "../components/SkillsSection";
import EducationSection from "../components/EducationSection";
import "./About.css";

const CONTACT_ROWS = [
    {
        label: "LinkedIn",
        value: "linkedin.com/in/leanale",
        href: "https://linkedin.com/in/leanale",
        external: true,
    },
    {
        label: "GitHub",
        value: "github.com/chuot-the-rat",
        href: "https://github.com/chuot-the-rat",
        external: true,
    },
    {
        label: "Location",
        value: "Vancouver, BC — PST",
        href: null,
    },
    {
        label: "Status",
        value: null,
        href: null,
    },
];

const RESUME_LINK =
    "https://indd.adobe.com/view/8da9a590-bb12-4c21-a861-4ef0ff8106b1";

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.45 },
};

export default function About() {
    usePageTitle("About", { site: true }); // "Leana Le · About"

    return (
        <div className="about">
            <main className="about-main">
                <div className="container">

                    {/* ── Hero ── */}
                    <motion.section
                        className="about-hero"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="about-hero-descriptor">About</p>
                        <h1 className="about-hero-headline">
                            <NameCycle />
                        </h1>
                        <p className="about-hero-sub">
                            Designer, developer, and recovering hospitality worker.
                        </p>
                    </motion.section>

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
                                    in Digital Design &amp; Development at BCIT.
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

                    {/* ── How I Work ── */}
                    <motion.section
                        className="about-process"
                        {...fadeUp}
                        transition={{ duration: 0.45, delay: 0.08 }}
                    >
                        <div className="about-process-header">
                            <p className="about-connect-label">Process</p>
                            <h2 className="about-process-heading">How I work</h2>
                        </div>
                        <ol className="about-process-steps">
                            {[
                                {
                                    title: "Research",
                                    desc: "Understanding the problem and product space, researching the market, learning the user, and considering potential solutions.",
                                },
                                {
                                    title: "Design Strategy",
                                    desc: "Crafting design principles to guide the project and set direction for the team.",
                                },
                                {
                                    title: "User Journey",
                                    desc: "Diving into user stories, personas, and decision-making. Mapping the golden path.",
                                },
                                {
                                    title: "Design Exploration",
                                    desc: "Brainstorming a wide range of solutions — testing, iterating, and refining through feedback.",
                                },
                                {
                                    title: "Design Refinement",
                                    desc: "Polishing the chosen direction and preparing designs for handoff.",
                                },
                                {
                                    title: "Handoff",
                                    desc: "Working closely with devs and product to ensure the solution gets built right.",
                                },
                                {
                                    title: "Monitoring",
                                    desc: "After launch, tracking performance wherever possible and iterating on findings.",
                                },
                            ].map((step, i) => (
                                <li key={step.title} className="about-process-step">
                                    <span className="about-process-step-num" aria-hidden="true">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div className="about-process-step-body">
                                        <strong className="about-process-step-title">{step.title}</strong>
                                        <p className="about-process-step-desc">{step.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </motion.section>

                    {/* ── My Philosophy ── */}
                    <motion.section
                        className="about-philosophy"
                        {...fadeUp}
                        transition={{ duration: 0.45, delay: 0.08 }}
                    >
                        <div className="about-philosophy-header">
                            <p className="about-connect-label">Philosophy</p>
                            <h2 className="about-process-heading">My philosophy</h2>
                        </div>
                        <div className="about-philosophy-grid">
                            {[
                                {
                                    title: "Curiosity",
                                    body: "I start every challenge by asking \"what if?\" — curiosity drives me deep into the problem and consistently leads me somewhere better than the obvious answer.",
                                },
                                {
                                    title: "Challenge assumptions",
                                    body: "Confidence in your own ideas is a trap. I test my assumptions with real users whenever I can and let research data steer the solution, not gut feeling alone.",
                                },
                                {
                                    title: "Attention to detail",
                                    body: "Great design lives in the details. I check everything twice — spacing, copy, edge cases — because the small stuff is what separates polished from almost-there.",
                                },
                            ].map((block) => (
                                <div key={block.title} className="about-philosophy-block">
                                    <strong className="about-philosophy-block-title">{block.title}</strong>
                                    <p className="about-philosophy-block-body">{block.body}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

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
                        <div className="about-connect-heading-row">
                            <p className="about-connect-label">
                                <span className="about-connect-label-star" aria-hidden="true">✦</span>
                                {" "}Contact
                            </p>
                            <h2 className="about-connect-heading">Let's talk.</h2>
                        </div>

                        {/* Primary: email CTA */}
                        <div className="about-email-cta">
                            <a
                                href="mailto:leanale003@gmail.com"
                                className="about-email-link"
                            >
                                leanale003@gmail.com
                                <span className="about-email-arrow" aria-hidden="true">↗</span>
                            </a>
                            <p className="about-email-note">
                                Hit me up — I don't bite.
                            </p>
                        </div>

                        {/* Secondary rows */}
                        <div className="about-contact-rows">
                            {CONTACT_ROWS.map((row, i) => (
                                <motion.div
                                    key={row.label}
                                    className="about-contact-row"
                                    {...fadeUp}
                                    transition={{ duration: 0.45, delay: 0.05 + i * 0.05 }}
                                >
                                    <span className="about-contact-row-label">{row.label}</span>
                                    <div className="about-contact-row-content">
                                        {row.label === "Status" ? (
                                            <span className="about-contact-value about-contact-value--status">
                                                <span className="about-status-dot" aria-hidden="true" />
                                                Open to full-time, freelance &amp; isekai recs.
                                            </span>
                                        ) : row.href ? (
                                            <a
                                                href={row.href}
                                                className="about-contact-link"
                                                {...(row.external
                                                    ? { target: "_blank", rel: "noopener noreferrer" }
                                                    : {})}
                                            >
                                                {row.value}
                                                <span className="about-contact-link-arrow" aria-hidden="true">↗</span>
                                            </a>
                                        ) : (
                                            <span className="about-contact-value">{row.value}</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* ── Resume ── */}
                    <motion.section
                        id="resume"
                        className="about-resume"
                        {...fadeUp}
                        transition={{ duration: 0.45, delay: 0.08 }}
                    >
                        <div className="about-resume-header">
                            <div>
                                <p className="about-connect-label">Resume</p>
                                <h2 className="about-resume-heading">Experience &amp; Skills</h2>
                            </div>
                            <div className="about-resume-actions">
                                <a
                                    href={RESUME_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="about-resume-btn about-resume-btn--primary"
                                >
                                    Open in new tab →
                                </a>
                                <a
                                    href="/Le_Leana_Resume_NoNumber.pdf"
                                    download="Leana_Le_Resume.pdf"
                                    className="about-resume-btn about-resume-btn--ghost"
                                >
                                    Download PDF
                                </a>
                            </div>
                        </div>
                        <div className="about-resume-embed">
                            <iframe
                                src={RESUME_LINK}
                                title="Resume — Leana Le"
                                className="about-resume-iframe"
                                allowFullScreen
                            />
                        </div>
                    </motion.section>

                </div>
            </main>
        </div>
    );
}
