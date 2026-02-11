import { Routes, Route } from "react-router-dom";
import { ModeProvider } from "./context/ModeContext";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectLayout from "./pages/ProjectLayout";
import "./styles/App.css";

/** IDs of standalone (non-case-study) projects that use their own data.json */
export const STANDALONE_PROJECT_IDS = ["fizzu-soda"];

function App() {
    return (
        <ModeProvider>
            <div className="app">
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    {/* Case-study projects */}
                    <Route
                        path="/projects/:id"
                        element={<ProjectDetail />}
                    />
                    {/* Standalone design projects (own data.json) */}
                    <Route
                        path="/design/:slug"
                        element={<ProjectLayout />}
                    />
                </Routes>
            </div>
        </ModeProvider>
    );
}

export default App;
