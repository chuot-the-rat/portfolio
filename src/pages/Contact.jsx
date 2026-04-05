import { motion } from "framer-motion";
import HeroContainer from "../components/header/HeroContainer";
import "./Contact.css";

const contactHeroConfig = {
    layout: "full-left",
    minHeight: "55vh",
    text: {
        showStatus: true,
        descriptor: "Contact",
        headline: "Let's talk.",
        headlineAs: "h1",
        subline: "I read every message. Most get a reply within 24 hours.",
    },
    media: null,
    tags: [],
    ctas: [],
    ctaLayout: "row",
    idleMotion: false,
};

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.45 },
};

const SECONDARY_ROWS = [
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
        value: null, // rendered specially
        href: null,
    },
];

export default function Contact() {
    return (
        <div className="contact">
            <main className="contact-main">
                <div className="container">
                    <HeroContainer config={contactHeroConfig} />

                    <div className="contact-body">

                        {/* ── Primary CTA: email ── */}
                        <motion.div
                            className="contact-email-cta"
                            {...fadeUp}
                        >
                            <a
                                href="mailto:leanale003@gmail.com"
                                className="contact-email-link"
                            >
                                leanale003@gmail.com
                                <span className="contact-email-arrow" aria-hidden="true">↗</span>
                            </a>
                            <p className="contact-email-note">
                                Hit me up — I don't bite.
                            </p>
                        </motion.div>

                        {/* ── Secondary rows ── */}
                        <div className="contact-rows">
                            {SECONDARY_ROWS.map((row, i) => (
                                <motion.div
                                    key={row.label}
                                    className="contact-row"
                                    {...fadeUp}
                                    transition={{ duration: 0.45, delay: 0.05 + i * 0.05 }}
                                >
                                    <span className="contact-row-label">{row.label}</span>
                                    <div className="contact-row-content">
                                        {row.label === "Status" ? (
                                            <span className="contact-value contact-value--status">
                                                <span className="contact-status-dot" aria-hidden="true" />
                                                Open to full-time, freelance &amp; isekai recs.
                                            </span>
                                        ) : row.href ? (
                                            <a
                                                href={row.href}
                                                className="contact-link"
                                                {...(row.external
                                                    ? { target: "_blank", rel: "noopener noreferrer" }
                                                    : {})}
                                            >
                                                {row.value}
                                                <span className="contact-link-arrow" aria-hidden="true">↗</span>
                                            </a>
                                        ) : (
                                            <span className="contact-value">{row.value}</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
