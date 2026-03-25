import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";

// Project detail pages (existing)
import ProjectDetail from "./pages/ProjectDetail";
import ProjectLayout from "./pages/ProjectLayout";

import "./styles/App.css";

/** IDs of standalone (non-case-study) projects that use their own data.json */
export const STANDALONE_PROJECT_IDS = ["fizzu-soda", "sap"];

function App() {
    return (
        <div className="app">
            <Navigation />
            <Routes>
                {/* Multi-page routing structure */}
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/about" element={<About />} />

                {/* Existing case-study project routes */}
                <Route
                    path="/projects/:id"
                    element={<ProjectDetail />}
                />
                {/* Standalone design projects (own data.json) */}
                <Route
                    path="/design/:slug"
                    element={<ProjectLayout />}
                />

                {/* 404 catch-all (must be last) */}
                <Route
                    path="*"
                    element={<NotFound />}
                />
            </Routes>
        </div>
    );
}

export default App;
