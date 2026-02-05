import { createContext, useContext, useState, useEffect } from "react";

const ModeContext = createContext();

export const MODES = {
    WORK: "work",
    CHAOS: "chaos",
    CLEAN: "clean",
};

export const ModeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        // Load from localStorage if available
        const saved = localStorage.getItem("portfolioMode");
        return saved || MODES.WORK;
    });

    useEffect(() => {
        // Save to localStorage whenever mode changes
        localStorage.setItem("portfolioMode", mode);

        // Apply mode class to body for global CSS targeting
        document.body.className = `mode-${mode}`;
    }, [mode]);

    const cycleMode = () => {
    const modes = [MODES.CLEAN, MODES.CHAOS, MODES.WORK];
        const nextIndex = (currentIndex + 1) % modes.length;
        setMode(modes[nextIndex]);
    };

    return (
        <ModeContext.Provider value={{ mode, setMode, cycleMode }}>
            {children}
        </ModeContext.Provider>
    );
};

export const useMode = () => {
    const context = useContext(ModeContext);
    if (!context) {
        throw new Error("useMode must be used within ModeProvider");
    }
    return context;
};
