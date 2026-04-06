/**
 * App.jsx
 * Main application component — sets up routing structure.
 *
 * This file:
 * - Renders the Navigation component (header/nav bar)
 * - Defines all routes and which page components they render
 * - Handles both case study projects and standalone design projects
 *
 * Routing strategy:
 * - /: Home page
 * - /projects: Projects list (shows all case studies + standalone)
 * - /projects/:id: Individual case study detail page
 * - /design/:slug: Standalone design projects (each has own data.json)
 * - /about: About page
 * - /resume: Resume page with embedded Adobe InDesign
 * - *: 404 catch-all for unknown routes
 *
 * Project types tracked here:
 * - Case studies: Use centralized data, route to /projects/:id
 * - Standalone: Self-contained projects, route to /design/:id
 */

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, Component } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navigation from "./components/Navigation";
import { PassbookProvider } from "./components/passbook/PassbookProvider";
import PassbookDock from "./components/passbook/PassbookDock";
import PassbookDrawer from "./components/passbook/PassbookDrawer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";

// Project detail pages (existing)
import ProjectDetail from "./pages/ProjectDetail";
import ProjectLayout from "./pages/ProjectLayout";

import "./styles/App.css";

/**
 * IDs of standalone (non-case-study) projects.
 * These projects:
 * - Live under /design/:slug route instead of /projects/:id
 * - Each has its own data.json file instead of using centralized data
 *
 * This list is used by:
 * - projectDataMapper.js (to identify standalone projects)
 * - Projects.jsx (to fetch supplemental data)
 */
export const STANDALONE_PROJECT_IDS = ["fizzu-soda", "sap"];

/**
 * Error boundary for project detail pages.
 * Catches runtime render errors and shows a recoverable error UI
 * instead of a blank screen or silent redirect.
 */
class ProjectErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidUpdate(prevProps) {
        // Reset on navigation to a new project
        if (prevProps.routeKey !== this.props.routeKey && this.state.hasError) {
            this.setState({ hasError: false });
        }
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-secondary)" }}>
                        Something went wrong loading this project.{" "}
                        <a href="/" style={{ color: "var(--color-text)" }}>← Back to work</a>
                    </p>
                </div>
            );
        }
        return this.props.children;
    }
}

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

/** Wraps each page in a fade transition. Framer Motion handles enter/exit. */
function P({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
}

function App() {
    const location = useLocation();

    return (
        <PassbookProvider>
            <div className="app">
                <ScrollToTop />
                <Navigation />

                {/* Passbook: global dock + drawer, mounted outside Routes
                    so they persist across page transitions */}
                <PassbookDock />
                <PassbookDrawer />

                <AnimatePresence mode="wait" initial={false}>
                    <Routes location={location} key={location.pathname}>
                        {/* ─── PRIMARY ROUTES ─── */}
                        <Route path="/"          element={<P><Home /></P>} />
                        <Route path="/projects"  element={<Navigate to="/" replace />} />
                        <Route path="/about"     element={<P><About /></P>} />
                        <Route path="/resume"    element={<Navigate to="/about" replace />} />
                        <Route path="/contact"   element={<Navigate to="/about" replace />} />

                        {/* ─── CASE STUDY PROJECTS ─── */}
                        <Route path="/projects/:id"  element={<ProjectErrorBoundary routeKey={location.pathname}><P><ProjectDetail /></P></ProjectErrorBoundary>} />

                        {/* ─── STANDALONE PROJECTS ─── */}
                        <Route path="/design/:slug"  element={<P><ProjectLayout /></P>} />

                        {/* ─── 404 CATCH-ALL ─── */}
                        <Route path="*" element={<P><NotFound /></P>} />
                    </Routes>
                </AnimatePresence>
            </div>
        </PassbookProvider>
    );
}

export default App;
