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
 * - /case-studies/:id: Individual case study detail page
 * - /design/:slug: Standalone design projects (each has own data.json)
 * - /about: About page
 * - /resume: Resume page with embedded Adobe InDesign
 * - *: 404 catch-all for unknown routes
 *
 * Project types tracked here:
 * - Case studies: Use centralized data, route to /case-studies/:id
 * - Standalone: Self-contained projects, route to /design/:id
 */

import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect, Component, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navigation from "./components/Navigation";
import { PassbookProvider } from "./components/passbook/PassbookProvider";
import PassbookDock from "./components/passbook/PassbookDock";
import PassbookDrawer from "./components/passbook/PassbookDrawer";

// Pages (lazy-loaded for better first-load performance)
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const About = lazy(() => import("./pages/About"));
const Resume = lazy(() => import("./pages/Resume"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const ProjectLayout = lazy(() => import("./pages/ProjectLayout"));

import "./styles/App.css";

/**
 * IDs of standalone (non-case-study) projects.
 * These projects:
 * - Live under /design/:slug route instead of /case-studies/:id
 * - Each has its own data.json file instead of using centralized data
 *
 * This list is used by:
 * - projectDataMapper.js (to identify standalone projects)
 * - Projects.jsx (to fetch supplemental data)
 */
export const STANDALONE_PROJECT_IDS = ["fizzu-soda", "sap"];
export const CASE_STUDY_BASE_PATH = "/case-studies";

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

function LegacyProjectRouteRedirect() {
    const { id } = useParams();
    const target = STANDALONE_PROJECT_IDS.includes(id)
        ? `/design/${id}`
        : `${CASE_STUDY_BASE_PATH}/${id}`;
    return <Navigate to={target} replace />;
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
                    <Suspense fallback={null}>
                        <Routes location={location} key={location.pathname}>
                            {/* ─── PRIMARY ROUTES ─── */}
                            <Route path="/"          element={<P><Home /></P>} />
                            <Route path="/projects"  element={<P><Projects /></P>} />
                            <Route path="/about"     element={<P><About /></P>} />
                            <Route path="/resume"    element={<Navigate to="/about" replace />} />
                            <Route path="/contact"   element={<Navigate to="/about" replace />} />

                            {/* ─── CASE STUDY PROJECTS ─── */}
                            <Route path={`${CASE_STUDY_BASE_PATH}/:id`} element={<ProjectErrorBoundary routeKey={location.pathname}><P><ProjectDetail /></P></ProjectErrorBoundary>} />
                            <Route path="/projects/:id" element={<LegacyProjectRouteRedirect />} />

                            {/* ─── STANDALONE PROJECTS ─── */}
                            <Route path="/design/:slug"  element={<P><ProjectLayout /></P>} />

                            {/* ─── 404 CATCH-ALL ─── */}
                            <Route path="*" element={<P><NotFound /></P>} />
                        </Routes>
                    </Suspense>
                </AnimatePresence>
            </div>
        </PassbookProvider>
    );
}

export default App;
