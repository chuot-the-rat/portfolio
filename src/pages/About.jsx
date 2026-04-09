// eslint-disable-next-line no-unused-vars
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
                            Product designer who bridges research, interaction, and front-end build.
                        </p>
                    </motion.section>

                    <div className="about-body">

                        {/* ── Intro ── */}
                        <motion.div className="about-row" {...fadeUp}>
                            <span className="about-row-label">Intro</span>
                            <div className="about-row-content">
                                <p className="about-para">
                                    I spent <em className="about-em">six years in hospitality</em>, where I learned
                                    to make complex moments feel easy, warm, and clear. That
                                    instinct carried straight into design — I still optimize
                                    for the{" "}
                                    <em className="about-em">person on the other side of the screen</em> first.
                                </p>
                                <p className="about-para">
                                    I'm a <em className="about-em">product designer with front-end chops</em>:
                                    from early research to shipped code. I'm currently finishing
                                    my Diploma in Digital Design &amp; Development at BCIT.
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
                                    desc: "I don't touch Figma until I understand the space. Competitor audits, domain reading, user interviews — I go deep enough that a direction starts to feel obvious, not arbitrary.",
                                },
                                {
                                    title: "Problem framing",
                                    desc: "Before any visuals, I put the problem in words — usually a deck or a doc. If I can't explain what I'm solving and why in a sentence, the design will wander.",
                                },
                                {
                                    title: "User journey",
                                    desc: "I map every state a user might be in — frustrated, confused, delighted, lost. The interesting design decisions live at the edges, not the happy path.",
                                },
                                {
                                    title: "Exploration",
                                    desc: "I go wide on purpose. Multiple directions, quick tests, feedback loops. I'll overexplore — that's fine. It's the only way I find solutions I never predicted from the research alone.",
                                },
                                {
                                    title: "Refinement",
                                    desc: "This is my danger zone. I can polish indefinitely — spacing, copy, micro-interactions, edge cases. I've learned to set explicit stopping conditions: what has to be true for this to ship?",
                                },
                                {
                                    title: "Handoff",
                                    desc: "I build. Not just redlines — I can open the codebase and implement components when it helps. The design doesn't stop at the Figma file.",
                                },
                                {
                                    title: "After launch",
                                    desc: "I watch what happens. Metrics, user feedback, support patterns — whatever data exists. I treat launch as the beginning of the design, not the end.",
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
