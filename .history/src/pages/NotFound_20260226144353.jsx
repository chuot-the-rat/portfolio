import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
    return (
        <div className="not-found">
            <main className="not-found-main">
                <motion.div
                    className="not-found-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="not-found-code">404</h1>
                    <h2 className="not-found-title">Page Not Found</h2>
                    <p className="not-found-text">
                        Oops! It looks like you've navigated to a page that
                        doesn't exist. Let's get you back on track.
                    </p>

                    <div className="not-found-actions">
                        <Link
                            to="/"
                            className="not-found-link primary"
                        >
                            Back to Home
                        </Link>
                        <Link
                            to="/projects"
                            className="not-found-link secondary"
                        >
                            View Projects
                        </Link>
                    </div>

                    <nav className="not-found-nav">
                        <p className="not-found-nav-title">Quick Navigation</p>
                        <ul className="not-found-nav-list">
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/about">About</Link>
                            </li>
                            <li>
                                <Link to="/projects">Projects</Link>
                            </li>
                            <li>
                                <Link to="/skills">Skills</Link>
                            </li>
                            <li>
                                <Link to="/education">Education</Link>
                            </li>
                            <li>
                                <Link to="/contact">Contact</Link>
                            </li>
                        </ul>
                    </nav>
                </motion.div>
            </main>
        </div>
    );
}
