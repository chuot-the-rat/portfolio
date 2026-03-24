/**
 * sim.reducer.js
 * State management for the InkLink Simulation Mode using React's useReducer.
 * Tracks user type, device, and constraints to determine what features appear in the outcome.
 *
 * How it fits in:
 * - SimulationProvider wraps this reducer
 * - SimulationPanel dispatches actions when user changes settings
 * - OutcomeSummary reads the state to display results
 * - sim.rules.js evaluates this state to determine which features show in output
 */

import { MAX_CONSTRAINTS } from "./sim.types.js";

/**
 * Initial state for a new simulation session.
 * Default: student-writer on desktop with no constraints selected
 * @type {import('./sim.types').SimConfig}
 */
export const initialState = {
    userType: "student-writer", // Who is using InkLink (student, researcher, editor)
    device: "desktop", // What they're using (desktop, tablet, mobile)
    constraints: [], // Additional project constraints (up to MAX_CONSTRAINTS)
};

/**
 * @typedef {'SET_USER_TYPE' | 'SET_DEVICE' | 'TOGGLE_CONSTRAINT' | 'RESET'} SimActionType
 *
 * @typedef {Object} SimAction
 * @property {SimActionType} type - The action to perform
 * @property {*} [payload] - Data needed for this action (e.g., new user type or constraint)
 */

/**
 * Reducer function: takes current state + action, returns new state.
 * Pure function — doesn't mutate state, just creates a new object with changes.
 *
 * @param {import('./sim.types').SimConfig} state - Current simulation config
 * @param {SimAction} action - Action describing what changed
 * @returns {import('./sim.types').SimConfig} New state object
 */
export function simReducer(state, action) {
    switch (action.type) {
        // User selected a different user type from dropdown
        case "SET_USER_TYPE":
            return { ...state, userType: action.payload };

        // User selected a different device
        case "SET_DEVICE":
            return { ...state, device: action.payload };

        // User clicked a constraint checkbox (toggle on/off)
        case "TOGGLE_CONSTRAINT": {
            const constraint = action.payload;
            const isSelected = state.constraints.includes(constraint);

            // If already selected, remove it from the list
            if (isSelected) {
                return {
                    ...state,
                    constraints: state.constraints.filter(
                        (c) => c !== constraint,
                    ),
                };
            }

            // If trying to add but already at max, ignore (UI prevents this via disabled state)
            if (state.constraints.length >= MAX_CONSTRAINTS) {
                return state; // Don't change anything
            }

            // Add the constraint to the list
            return {
                ...state,
                constraints: [...state.constraints, constraint],
            };
        }

        // User clicked "Reset" button — go back to defaults
        case "RESET":
            return { ...initialState };

        // Unknown action — don't change state
        default:
            return state;
    }
}
