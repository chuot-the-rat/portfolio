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

const HOW_I_WORK_BLOCKS = [
    {
        code: "01/06",
        id: "approach-discovery",
        group: "Approach",
        title: "Start with context",
        body: "I align on user behavior, product constraints, and business goals before exploring solutions.",
        framed: false,
    },
    {
        code: "02/06",
        id: "approach-structure",
        group: "Approach",
        title: "Clarify the flow",
        body: "I shape clear states, interactions, and priorities so product and engineering can move quickly together.",
        framed: true,
    },
    {
        code: "03/06",
        id: "approach-iterate",
        group: "Approach",
        title: "Ship and refine",
        body: "I define success criteria early, ship intentionally, and iterate from live feedback.",
        framed: false,
    },
    {
        code: "04/06",
        id: "principle-research",
        group: "Principles",
        title: "Research over assumptions",
        body: "I test quickly instead of guessing. Evidence keeps the team aligned and decisions grounded.",
        framed: false,
    },
    {
        code: "05/06",
        id: "principle-clarity",
        group: "Principles",
        title: "Clarity is the craft",
        body: "Good design should feel obvious to users and straightforward to build across teams.",
        framed: true,
    },
    {
        code: "06/06",
        id: "principle-focus",
        group: "Principles",
        title: "Progress over perfection",
        body: "I focus on meaningful progress and outcomes instead of polishing details that do not move the product forward.",
        framed: false,
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
                            Product designer focused on research, interaction clarity, and outcomes teams can ship with confidence.
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
                                    I spent <em className="about-em">six years in hospitality</em>, where I learned to
                                    make busy, high-pressure moments feel clear for real people. That mindset now drives
                                    how I design digital products.
                                </p>
                                <p className="about-para">
                                    I am a <em className="about-em">product designer</em> finishing the Digital Design and
                                    Development diploma at BCIT, focused on research-backed decisions, interaction systems,
                                    and production-ready delivery with engineering.
                                </p>
                            </div>
                        </motion.div>

                    </div>

                    {/* ── How I Work ── */}
                    <motion.section
                        className="about-work"
                        {...fadeUp}
                        transition={{ duration: 0.45, delay: 0.08 }}
                    >
                        <div className="about-work-header">
                            <p className="about-connect-label">Approach</p>
                            <h2 className="about-work-heading">How I work</h2>
                            <p className="about-work-intro">
                                I keep the process practical: align on the problem, structure the flow, and ship in small confident steps.
                            </p>
                        </div>
                        <div className="about-work-timeline" role="list" aria-label="How I work">
                            {HOW_I_WORK_BLOCKS.map((block) => (
                                <article
                                    key={block.id}
                                    className={`about-work-row ${block.framed ? "about-work-row--framed" : ""}`}
                                    role="listitem"
                                >
                                    <div className="about-work-step" aria-hidden="true">
                                        {block.code}
                                    </div>
                                    <div className="about-work-meta">
                                        <span className="about-work-kicker">{block.group}</span>
                                    </div>
                                    <div className="about-work-content">
                                        <h3 className="about-work-row-title">{block.title}</h3>
                                        <p className="about-work-row-body">{block.body}</p>
                                    </div>
                                </article>
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
                                Open to product design roles, with immediate start availability.
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
                                                Open to product design roles — full-time or contract.
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
