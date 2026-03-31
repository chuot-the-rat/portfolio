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

import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navigation from "./components/Navigation";
import CursorFollower from "./components/CursorFollower";

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

function App() {
    const location = useLocation();

    return (
        <div className="app">
            <CursorFollower />
            <Navigation />

            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
            <Routes location={location}>
                {/* ─── PRIMARY ROUTES ─── */}
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/projects"
                    element={<Projects />}
                />
                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/resume"
                    element={<Resume />}
                />

                {/* ─── CASE STUDY PROJECTS ─── */}
                {/* Route for individual case studies (e.g., /projects/inklink) */}
                <Route
                    path="/projects/:id"
                    element={<ProjectDetail />}
                />

                {/* ─── STANDALONE PROJECTS ─── */}
                {/* Route for standalone design projects (e.g., /design/fizzu-soda) */}
                <Route
                    path="/design/:slug"
                    element={<ProjectLayout />}
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default App;
