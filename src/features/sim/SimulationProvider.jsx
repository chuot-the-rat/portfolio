/**
 * SimulationProvider.jsx
 * React Context provider for the InkLink Simulation Mode.
 *
 * This file:
 * - Creates a context that stores simulation state (useReducer)
 * - Evaluates rules whenever state changes (useMemo)
 * - Provides a hook (useSimulation) for child components to access both
 *
 * Data flow:
 * 1. SimulationSection wraps everything with <SimulationProvider>
 * 2. SimulationPanel gets state via useSimulation(), dispatches actions
 * 3. Rules engine evaluates state, produces outcome
 * 4. OutcomeSummary gets state + outcome via useSimulation(), displays results
 */

import { createContext, useContext, useReducer, useMemo } from "react";
import { simReducer, initialState } from "./sim.reducer.js";
import { evaluateRules } from "./sim.rules.js";

// Create context object
const SimulationContext = createContext(null);

/**
 * SimulationProvider component
 * Wraps children with simulation state + outcome
 */
export function SimulationProvider({ children }) {
    // Set up reducer: current config + dispatch function
    const [config, dispatch] = useReducer(simReducer, initialState);

    // Evaluate rules whenever config changes (memoized for performance)
    // If config doesn't change, outcome doesn't recalculate
    const outcome = useMemo(() => evaluateRules(config), [config]);

    // Bundle everything into value object
    const value = {
        config, // Current user selections (user type, device, constraints)
        outcome, // Result from rule engine (scope, removed, tradeoffs, risks, tests)
        dispatch, // Function to update config
    };

    return (
        <SimulationContext.Provider value={value}>
            {children}
        </SimulationContext.Provider>
    );
}

/**
 * useSimulation hook
 * Get simulation state and outcome from anywhere inside SimulationProvider
 *
 * Usage:
 *   const { config, outcome, dispatch } = useSimulation()
 *
 * Throws error if used outside of <SimulationProvider>, which helps catch bugs.
 */
export function useSimulation() {
    const ctx = useContext(SimulationContext);
    if (!ctx) {
        throw new Error(
            "useSimulation must be used within a SimulationProvider",
        );
    }
    return ctx;
}
