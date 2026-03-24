/**
 * sim.reducer.js
 * useReducer state management for the InkLink Simulation Mode.
 */

import { MAX_CONSTRAINTS } from './sim.types.js';

/** @type {import('./sim.types').SimConfig} */
export const initialState = {
    userType: 'student-writer',
    device: 'desktop',
    constraints: [],
};

/**
 * @typedef {'SET_USER_TYPE' | 'SET_DEVICE' | 'TOGGLE_CONSTRAINT' | 'RESET'} SimActionType
 *
 * @typedef {Object} SimAction
 * @property {SimActionType} type
 * @property {*} [payload]
 */

/**
 * @param {import('./sim.types').SimConfig} state
 * @param {SimAction} action
 * @returns {import('./sim.types').SimConfig}
 */
export function simReducer(state, action) {
    switch (action.type) {
        case 'SET_USER_TYPE':
            return { ...state, userType: action.payload };

        case 'SET_DEVICE':
            return { ...state, device: action.payload };

        case 'TOGGLE_CONSTRAINT': {
            const constraint = action.payload;
            const isSelected = state.constraints.includes(constraint);

            if (isSelected) {
                // Remove it
                return {
                    ...state,
                    constraints: state.constraints.filter((c) => c !== constraint),
                };
            }

            // Add it only if under the max
            if (state.constraints.length >= MAX_CONSTRAINTS) {
                return state; // Silently ignore — UI prevents this via disabled state
            }

            return {
                ...state,
                constraints: [...state.constraints, constraint],
            };
        }

        case 'RESET':
            return { ...initialState };

        default:
            return state;
    }
}
