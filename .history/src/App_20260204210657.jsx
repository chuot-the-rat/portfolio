import { Routes, Route } from "react-router-dom";
import { ModeProvider } from "./context/ModeContext";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import "./styles/App.css";

function App() {
    return (
        <ModeProvider>
            <div className="app">
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/projects/:id"
                        element={<ProjectDetail />}
                    />
                </Routes>
            </div>
        </ModeProvider>
    );
}

export default App;
