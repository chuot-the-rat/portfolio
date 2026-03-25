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

import { Link, useLocation } from "react-router-dom";
import navItems from "../data/navItems";
import "./Navigation.css";

export default function Navigation() {
    // Get current URL path — tells us which page user is viewing
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* ─── LOGO/HOME LINK ─── */}
                {/* Clicking this takes you back to home from anywhere */}
                <Link
                    to="/"
                    className="nav-logo"
                >
                    Leana Le
                </Link>

                {/* ─── NAV MENU ─── */}
                {/* Render each navigation item from data/navItems.js */}
                <ul className="nav-menu">
                    {navItems.map((item) => (
                        <li
                            key={item.path}
                            className="nav-item"
                        >
                            <Link
                                to={item.path}
                                // Add "active" class if this link matches current page
                                // CSS uses this to highlight the active link
                                className={`nav-link ${
                                    location.pathname === item.path
                                        ? "active"
                                        : ""
                                }`}
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
