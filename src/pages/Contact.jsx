import { motion } from "framer-motion";
import HeroContainer from "../components/header/HeroContainer";
import "./Contact.css";

const contactHeroConfig = {
    layout: "full-left",
    minHeight: "35vh",
    text: {
        descriptor: "Contact",
        headline: "Let's talk.",
        headlineAs: "h1",
        subline: null,
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

const ROWS = [
    {
        label: "Email",
        content: (
            <a href="mailto:leanale003@gmail.com" className="contact-link">
                leanale003@gmail.com
            </a>
        ),
    },
    {
        label: "LinkedIn",
        content: (
            <a
                href="https://linkedin.com/in/leanale"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
            >
                linkedin.com/in/leanale →
            </a>
        ),
    },
    {
        label: "GitHub",
        content: (
            <a
                href="https://github.com/chuot-the-rat"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
            >
                github.com/chuot-the-rat →
            </a>
        ),
    },
    {
        label: "Location",
        content: <span className="contact-value">Vancouver, BC</span>,
    },
    {
        label: "Status",
        content: <span className="contact-value">Open to full-time, freelance, and isekai recommendations.</span>,
    },
];

export default function Contact() {
    return (
        <div className="contact">
            <main className="contact-main">
                <div className="container">
                    <HeroContainer config={contactHeroConfig} />

                    <div className="contact-body">
                        {ROWS.map((row, i) => (
                            <motion.div
                                key={row.label}
                                className="contact-row"
                                {...fadeUp}
                                transition={{ duration: 0.45, delay: i * 0.05 }}
                            >
                                <span className="contact-row-label">{row.label}</span>
                                <div className="contact-row-content">{row.content}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
