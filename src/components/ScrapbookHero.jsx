import { motion } from "framer-motion";
import "./ScrapbookHero.css";

const LINKS = [
    { label: "Email",    href: "mailto:leanale003@gmail.com" },
    { label: "LinkedIn", href: "https://linkedin.com/in/leanale",       external: true },
    { label: "GitHub",   href: "https://github.com/chuot-the-rat",       external: true },
    { label: "Resume",   href: "/Le_Leana_Resume_NoNumber.pdf",          download: "Leana_Le_Resume.pdf" },
];

function Sticker({ children, className = "", rotate = 0, delay = 0 }) {
    return (
        <motion.div
            className={`scrap-sticker ${className}`}
            drag
            dragSnapToOrigin
            dragElastic={0.1}
            dragMomentum={false}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            whileDrag={{ scale: 1.05, zIndex: 60, cursor: "grabbing" }}
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate }}
            transition={{
                type: "spring",
                stiffness: 240,
                damping: 22,
                delay,
            }}
        >
            {children}
        </motion.div>
    );
}

export default function ScrapbookHero() {
    return (
        <section className="scrap-hero">
            {/* ── Name + links ── */}
            <div className="scrap-text">
                <motion.h1
                    className="scrap-name"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    Leana Le
                </motion.h1>

                <motion.p
                    className="scrap-role"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.28, duration: 0.5 }}
                >
                    UI/UX Designer &amp; Developer
                </motion.p>

                <motion.nav
                    className="scrap-links"
                    aria-label="Connect"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.42, duration: 0.5 }}
                >
                    {LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="scrap-link"
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noopener noreferrer" : undefined}
                            download={link.download || undefined}
                        >
                            {link.label}
                        </a>
                    ))}
                </motion.nav>
            </div>

            {/* ── Sticker: availability stamp ── */}
            <Sticker className="sticker-stamp" rotate={-10} delay={0.55}>
                <div className="stamp-ring">
                    <span className="stamp-dot" />
                    <p className="stamp-main">Open<br />to Work</p>
                    <p className="stamp-sub">2025</p>
                </div>
            </Sticker>

            {/* ── Sticker: location card ── */}
            <Sticker className="sticker-location" rotate={3} delay={0.68}>
                <div className="card-tape card-tape--tan" />
                <div className="card-body">
                    <p className="loc-city">Vancouver</p>
                    <p className="loc-region">BC · Canada</p>
                </div>
            </Sticker>

            {/* ── Sticker: polaroid ── */}
            <Sticker className="sticker-polaroid" rotate={-2} delay={0.82}>
                <div className="polaroid-image">
                    <span className="polaroid-project-name">InkLink</span>
                </div>
                <p className="polaroid-caption">Collaborative writing · 2025</p>
            </Sticker>

            {/* ── Sticker: school ticket ── */}
            <Sticker className="sticker-ticket" rotate={5} delay={0.96}>
                <p className="ticket-school">BCIT</p>
                <p className="ticket-program">Digital Design<br />&amp; Development</p>
                <div className="ticket-divider" />
                <p className="ticket-year">Class of '25</p>
            </Sticker>
        </section>
    );
}
