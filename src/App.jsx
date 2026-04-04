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
import { useEffect } from "react";
import Navigation from "./components/Navigation";

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

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

function App() {
    return (
        <div className="app">
            <ScrollToTop />
            <Navigation />

            {/* Route definitions — determines which page renders based on URL */}
            <Routes>
                {/* ─── PRIMARY ROUTES ─── */}
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/projects"
                    element={<Navigate to="/" replace />}
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

                {/* ─── 404 CATCH-ALL ─── */}
                {/* Must be last — matches any route not caught above */}
                <Route
                    path="*"
                    element={<NotFound />}
                />
            </Routes>
        </div>
    );
}

export default App;
