/**
 * ModeContext.jsx
 * React Context for managing portfolio view modes (e.g., "chaos" vs "work").
 *
 * This file:
 * - Provides a context for switching between different visual modes
 * - Persists user's mode choice to localStorage (survives page refresh)
 * - Applies a CSS class to document body (mode-chaos, mode-work)
 * - Offers a hook (useMode) for any component to access mode state
 *
 * Two modes available:
 * - chaos: Playful, experimental portfolio view (default)
 * - work: Professional, focused work-only view
 *
 * CSS uses the body class to style differently based on mode (e.g., .mode-chaos .component { ... })
 */

import { createContext, useContext, useState, useEffect } from "react";

// Create context object
const ModeContext = createContext();

/**
 * Available mode options and their IDs.
 * These strings are used as:
 * - localStorage keys
 * - body className values (mode-chaos, mode-work)
 * - Comparisons in logic
 */
export const MODES = {
    CHAOS: "chaos",
    WORK: "work",
};

/**
 * ModeProvider component
 * Wraps the app with mode state and functions
 *
 * Usage in main.jsx:
 *   <ModeProvider>
 *     <App />
 *   </ModeProvider>
 */
export const ModeProvider = ({ children }) => {
    // Initialize state from localStorage, fallback to CHAOS
    const [mode, setMode] = useState(() => {
        // Load from localStorage if available, otherwise default to chaos
        const saved = localStorage.getItem("portfolioMode");
        return saved || MODES.CHAOS; // Chaos is the default
    });

    // Whenever mode changes, save to localStorage and update body class
    useEffect(() => {
        // Persist mode choice so it survives page reload
        localStorage.setItem("portfolioMode", mode);

        // Apply mode class to body tag for global CSS targeting
        // CSS rules can then use: body.mode-chaos { ... } or body.mode-work { ... }
        document.body.className = `mode-${mode}`;
    }, [mode]); // Re-run this effect whenever mode changes

    /**
     * Cycle to the next mode.
     * Rotates through all available modes: chaos → work → chaos → ...
     */
    const cycleMode = () => {
        const modes = [MODES.CHAOS, MODES.WORK];
        const currentIndex = modes.indexOf(mode);
        const nextIndex = (currentIndex + 1) % modes.length; // Wrap around to 0 after last mode
        setMode(modes[nextIndex]);
    };

    // Provide mode, setMode, and cycleMode to all child components
    return (
        <ModeContext.Provider value={{ mode, setMode, cycleMode }}>
            {children}
        </ModeContext.Provider>
    );
};

/**
 * useMode hook
 * Access mode state and functions from anywhere in the app.
 *
 * Usage:
 *   const { mode, setMode, cycleMode } = useMode()
 *   // mode = current mode string (e.g., "chaos")
 *   // setMode = function to set specific mode
 *   // cycleMode = function to switch to next mode
 *
 * Throws error if used outside of <ModeProvider>, which helps catch bugs.
 */
export const useMode = () => {
    const context = useContext(ModeContext);
    if (!context) {
        throw new Error("useMode must be used within ModeProvider");
    }
    return context;
};
