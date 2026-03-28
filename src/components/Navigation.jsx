/**
 * Navigation.jsx
 * Main navigation bar component.
 *
 * What it does:
 * - Shows site name/logo on the left (links to home)
 * - Shows navigation menu on the right with links to main pages
 * - Highlights current page link with "active" class so user knows where they are
 * - Navigation items come from data file (navItems)
 *
 * How it works:
 * - useLocation() hook tells us what page user is currently on
 * - For each link, compares current pathname to the link's path
 * - If they match, adds "active" class (CSS styles it differently)
 * - Helps with navigation and orientation
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import navItems from "../data/navItems";
import "./Navigation.css";

export default function Navigation() {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

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
                                className={`nav-link${location.pathname === item.path ? " active" : ""}`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

