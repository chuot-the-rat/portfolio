import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import "./NotFound.css";

export default function NotFound() {
    usePageTitle("404 — Not Found");
    return (
        <div className="not-found">
            <motion.main
                className="not-found-main"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="not-found-eyebrow">404</span>

                <h1 className="not-found-heading">Wrong turn.</h1>

                <p className="not-found-sub">
                    This page doesn't exist — probably an isekai portal.
                    <br />
                    Let's get you back.
                </p>

                <div className="not-found-actions">
                    <Link to="/" className="not-found-cta">
                        ← Back to work
                    </Link>
                    <Link to="/about" className="not-found-cta not-found-cta--ghost">
                        About me
                    </Link>
                </div>
            </motion.main>
        </div>
    );
}
