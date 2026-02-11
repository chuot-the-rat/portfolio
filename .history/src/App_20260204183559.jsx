import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import "./styles/App.css";

function App() {
    return (
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
    );
}

export default App;
