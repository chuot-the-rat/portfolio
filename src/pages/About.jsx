import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

const PROCESS_BLOCKS = [
    {
        phase: "01",
        title: "Discover",
        body: "I start by getting close to the problem so every decision is grounded in evidence, not preference.",
        tags: ["Domain research", "User interviews", "Competitive patterns"],
    },
    {
        phase: "02",
        title: "Shape",
        body: "I define the problem in plain language, map critical states, and test multiple directions quickly.",
        tags: ["Problem statement", "Journey mapping", "Rapid exploration"],
    },
    {
        phase: "03",
        title: "Ship + Learn",
        body: "I refine with clear ship criteria, implement where it helps, then iterate with real post-launch feedback.",
        tags: ["Frontend handoff", "Quality polish", "Post-launch feedback"],
    },
];

const ABOUT_TRAITS = ["Research-led", "System-minded", "Build-aware"];

function LiveClock() {
    const formatTime = () =>
        new Date().toLocaleTimeString("en-US", {
            timeZone: "America/Vancouver",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    const [time, setTime] = useState(formatTime);

    useEffect(() => {
        const id = setInterval(() => setTime(formatTime()), 30_000);
        return () => clearInterval(id);
    }, []);

    return <span className="about-hero-status-time">{time}</span>;
}

export default function About() {
    usePageTitle("About", {
        site: true,
        path: "/about",
        description:
            "About Leana Le: product designer with frontend implementation experience, based in Vancouver and open to product design roles.",
    });

    return (
        <div className="about">
            <main className="about-main page-main">
                <div className="container">

                    {/* ── Hero ── */}
                    <motion.section
                        className="about-hero"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="about-hero-descriptor">About</p>
                        <div className="about-hero-status" aria-label="Availability status">
                            <span className="about-hero-status-dot" aria-hidden="true" />
                            <span>Available</span>
                            <span className="about-hero-status-sep" aria-hidden="true">·</span>
                            <span>Vancouver, BC</span>
                            <span className="about-hero-status-sep" aria-hidden="true">·</span>
                            <LiveClock />
                        </div>
                        <h1 className="about-hero-headline">
                            <NameCycle />
                        </h1>
                        <p className="about-hero-sub">
                            Product designer bridging research, interaction design, and front-end implementation.
                        </p>
                        <ul className="about-hero-traits" aria-label="Core strengths">
                            {ABOUT_TRAITS.map((trait) => (
                                <li key={trait} className="about-hero-trait">{trait}</li>
                            ))}
                        </ul>
                    </motion.section>

                    <div className="about-body">

                        {/* ── About ── */}
                        <motion.div className="about-row" {...fadeUp}>
                            <span className="about-row-label">About</span>
                            <div className="about-row-content">
                                <p className="about-para">
                                    I spent <em className="about-em">six years in hospitality</em>, where I learned
                                    to make complex moments feel easy, warm, and clear. That instinct carried directly
                                    into design, where I still optimize for the <em className="about-em">person on the other side of the screen</em> first.
                                </p>
                                <p className="about-para">
                                    I am a <em className="about-em">product designer with frontend chops</em>, moving from discovery to shipped interfaces.
                                    I am currently finishing my Diploma in Digital Design and Development at BCIT.
                                    Outside work, I am usually in a manga arc or refining a presentation deck.
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
                        <div className="about-process-flow" role="list" aria-label="Design process phases">
                            {PROCESS_BLOCKS.map((step, index) => (
                                <article
                                    key={step.title}
                                    className="about-process-card"
                                    role="listitem"
                                >
                                    <div className="about-process-card-top">
                                        <span className="about-process-phase" aria-hidden="true">
                                            {step.phase}
                                        </span>
                                        <h3 className="about-process-card-title">{step.title}</h3>
                                    </div>
                                    <p className="about-process-card-body">{step.body}</p>
                                    <div className="about-process-tags">
                                        {step.tags.map((tag) => (
                                            <span key={tag} className="about-process-tag">{tag}</span>
                                        ))}
                                    </div>
                                    {index < PROCESS_BLOCKS.length - 1 ? (
                                        <span className="about-process-arrow" aria-hidden="true">→</span>
                                    ) : null}
                                </article>
                            ))}
                        </div>
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
                                    title: "Research first, always",
                                    body: "I've learned to resist the urge to jump to solutions. The interesting problems are usually not the stated ones — and the only way to find the real one is to stay in research longer than feels comfortable.",
                                },
                                {
                                    title: "Design is a communication problem",
                                    body: "The best design in the world fails if nobody understands the decision. I spend real time on how I present and explain my work — alignment isn't a soft skill, it's part of the job.",
                                },
                                {
                                    title: "Ship it, then improve it",
                                    body: "I have to actively fight my instinct to polish forever. Good design that ships beats perfect design that doesn't. I've gotten better at calling done.",
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
                                                Open to product design roles — full-time or contract. Isekai recs also welcome.
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
