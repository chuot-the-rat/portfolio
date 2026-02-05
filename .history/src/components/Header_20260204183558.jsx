import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <motion.header
            className="header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
            <div className="container">
                <div className="header-content">
                    <Link
                        to="/"
                        className="header-logo"
                    >
                        <span className="header-logo-initial">L</span>
                        <span className="header-logo-name">Leana Le</span>
                    </Link>

                    <nav className="header-nav">
                        {/* CTA Buttons */}
                        <a
                            href="mailto:leanale003@gmail.com"
                            className="header-cta-link"
                        >
                            Contact
                        </a>
                        <a
                            href="/resume.pdf"
                            download
                            className="header-cta-link header-cta-link-secondary"
                        >
                            Download Resume
                        </a>

                        <button
                            onClick={toggleTheme}
                            className="theme-toggle"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                >
                                    <path
                                        d="M10 3V1M10 19v-2M17 10h2M1 10h2M15.657 4.343l1.414-1.414M3.93 16.07l1.414-1.414M15.657 15.657l1.414 1.414M3.93 3.93l1.414 1.414"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="4"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                >
                                    <path
                                        d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </button>
                    </nav>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;
