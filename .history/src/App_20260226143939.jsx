import { Routes, Route } from "react-router-dom";
import { ModeProvider } from "./context/ModeContext";
import Navigation from "./components/Navigation";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Education from "./pages/Education";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Project detail pages (existing)
import ProjectDetail from "./pages/ProjectDetail";
import ProjectLayout from "./pages/ProjectLayout";

import "./styles/App.css";

/** IDs of standalone (non-case-study) projects that use their own data.json */
export const STANDALONE_PROJECT_IDS = ["fizzu-soda"];

function App() {
    return (
        <ModeProvider>
            <div className="app">
                <Navigation />
                <Routes>
                    {/* New multi-page routing structure */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/skills" element={<Skills />} />
                    <Route path="/education" element={<Education />} />
                    <Route path="/contact" element={<Contact />} />
                    
                    {/* Existing case-study project routes */}
                    <Route
                        path="/project/:id"
                        element={<ProjectDetail />}
                    />
                    {/* Standalone design projects (own data.json) */}
                    <Route
                        path="/design/:slug"
                        element={<ProjectLayout />}
                    />
                    
                    {/* 404 catch-all (must be last) */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </ModeProvider>
    );
}

export default App;
