import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "@phosphor-icons/react";
import navItems from "../data/navItems";
import "./Navigation.css";

export default function Navigation() {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    // Dark mode — reads from localStorage, falls back to system preference
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === "undefined") return false;
        const stored = localStorage.getItem("theme");
        if (stored) return stored === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    // Apply data-theme to <html> and persist whenever it changes
    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            isDark ? "dark" : "light",
        );
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark]);

    // Scroll detection — add class when user scrolls past nav height
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 48);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    Leana Le
                </Link>

                <ul className="nav-menu">
                    {navItems.map((item) => (
                        <li key={item.path} className="nav-item">
                            <Link
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                                aria-current={location.pathname === item.path ? "page" : undefined}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Divider */}
                <span className="nav-sep" aria-hidden="true" />

                {/* Theme toggle */}
                <button
                    className="nav-theme-btn"
                    onClick={() => setIsDark((d) => !d)}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    title={isDark ? "Light mode" : "Dark mode"}
                >
                    {isDark
                        ? <Sun size={15} weight="regular" />
                        : <Moon size={15} weight="regular" />
                    }
                </button>
            </div>
        </nav>
    );
}
