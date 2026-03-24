/**
 * SimulationProvider.jsx
 * React Context provider for the InkLink Simulation Mode.
 * Wraps the simulation panel and outcome summary with shared state.
 */

import { createContext, useContext, useReducer, useMemo } from 'react';
import { simReducer, initialState } from './sim.reducer.js';
import { evaluateRules } from './sim.rules.js';

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
    const [config, dispatch] = useReducer(simReducer, initialState);

    // Re-evaluate rules whenever config changes
    const outcome = useMemo(() => evaluateRules(config), [config]);

    const value = {
        config,
        outcome,
        dispatch,
    };

    return (
        <SimulationContext.Provider value={value}>
            {children}
        </SimulationContext.Provider>
    );
}

/**
 * Hook to access simulation state and dispatch from any child component.
 * Must be used within a SimulationProvider.
 */
export function useSimulation() {
    const ctx = useContext(SimulationContext);
    if (!ctx) {
        throw new Error('useSimulation must be used within a SimulationProvider');
    }
    return ctx;
}
