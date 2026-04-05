/**
 * SimulationPanel.jsx
 * Configuration UI for the InkLink Simulation Mode.
 *
 * What it does:
 * - Renders form controls (dropdown, radio buttons, checkboxes)
 * - User picks: a user type, a device, and up to MAX_CONSTRAINTS constraints
 * - When user changes anything, dispatches actions to update simulation state
 * - Displays feedback (e.g., how many constraints are selected)
 *
 * How it connects:
 * - Gets state from useSimulation() hook (SimulationProvider)
 * - Dispatches actions that update the reducer
 * - OutcomeSummary watches state and updates results in real-time
 */

import { useSimulation } from "./SimulationProvider.jsx";
import {
    USER_TYPES,
    DEVICES,
    CONSTRAINTS,
    MAX_CONSTRAINTS,
} from "./sim.types.js";

export default function SimulationPanel() {
    // Get current config and dispatch function from context
    const { config, dispatch } = useSimulation();

    // Check if user has hit the constraint limit (disables remaining checkboxes)
    const constraintsFull = config.constraints.length >= MAX_CONSTRAINTS;

    return (
        <div className="sim-panel">
            <div className="sim-panel__header">
                <span className="sim-panel__badge">Configure scenario</span>
                <p className="sim-panel__hint">
                    Adjust the variables below. Results update in real time.
                </p>
            </div>

            {/* ─── USER TYPE SELECTOR ─── dropdown to pick who's using InkLink */}
            <fieldset className="sim-panel__fieldset">
                <legend className="sim-panel__legend">User type</legend>
                <div className="sim-panel__select-wrap">
                    <select
                        className="sim-panel__select"
                        value={config.userType}
                        onChange={(e) =>
                            // When user picks a different option, dispatch SET_USER_TYPE action
                            dispatch({
                                type: "SET_USER_TYPE",
                                payload: e.target.value,
                            })
                        }
                        aria-label="Select user type"
                    >
                        {/* Generate dropdown options from USER_TYPES list */}
                        {USER_TYPES.map((u) => (
                            <option
                                key={u.value}
                                value={u.value}
                            >
                                {u.label}
                            </option>
                        ))}
                    </select>
                    {/* Custom chevron (hidden from screen readers, visual only) */}
                    <span
                        className="sim-panel__select-chevron"
                        aria-hidden="true"
                    >
                        ▾
                    </span>
                </div>
            </fieldset>

            {/* ─── DEVICE SELECTOR ─── radio buttons for desktop/tablet/mobile */}
            <fieldset className="sim-panel__fieldset">
                <legend className="sim-panel__legend">Device</legend>
                <div
                    className="sim-panel__radio-group"
                    role="radiogroup"
                >
                    {DEVICES.map((d) => (
                        <label
                            key={d.value}
                            className="sim-panel__radio-label"
                        >
                            <input
                                type="radio"
                                name="device"
                                value={d.value}
                                checked={config.device === d.value}
                                onChange={() =>
                                    // When user selects a device, dispatch SET_DEVICE action
                                    dispatch({
                                        type: "SET_DEVICE",
                                        payload: d.value,
                                    })
                                }
                                className="sim-panel__radio-input"
                            />
                            {/* Custom radio dot (visual indicator) */}
                            <span
                                className="sim-panel__radio-dot"
                                aria-hidden="true"
                            />
                            {d.label}
                        </label>
                    ))}
                </div>
            </fieldset>

            {/* ─── CONSTRAINTS CHECKBOXES ─── pick up to MAX_CONSTRAINTS additional constraints */}
            <fieldset className="sim-panel__fieldset">
                <legend className="sim-panel__legend">
                    Context constraints
                    {/* Show user how many constraints they've selected */}
                    <span className="sim-panel__legend-note">
                        {config.constraints.length}/{MAX_CONSTRAINTS} selected
                    </span>
                </legend>
                <div className="sim-panel__checkbox-group">
                    {CONSTRAINTS.map((con) => {
                        // Check if this constraint is currently selected
                        const checked = config.constraints.includes(con.value);
                        // Disable checkbox if we're at max AND this one isn't already selected
                        const disabled = !checked && constraintsFull;

                        return (
                            <label
                                key={con.value}
                                // Add CSS class if disabled or checked (for styling)
                                className={`sim-panel__checkbox-label${disabled ? " sim-panel__checkbox-label--disabled" : ""}${checked ? " sim-panel__checkbox-label--checked" : ""}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    disabled={disabled}
                                    onChange={() =>
                                        // When user toggles a constraint checkbox, toggle it in state
                                        dispatch({
                                            type: "TOGGLE_CONSTRAINT",
                                            payload: con.value,
                                        })
                                    }
                                    className="sim-panel__checkbox-input"
                                    aria-label={con.label}
                                />
                                {/* Custom checkbox box (shows checkmark when selected) */}
                                <span
                                    className="sim-panel__checkbox-box"
                                    aria-hidden="true"
                                >
                                    {checked && (
                                        <svg
                                            width="10"
                                            height="8"
                                            viewBox="0 0 10 8"
                                            fill="none"
                                        >
                                            <path
                                                d="M1 4l3 3 5-6"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </span>
                                {con.label}
                            </label>
                        );
                    })}
                </div>
            </fieldset>

            {/* ─── RESET BUTTON ─── go back to default state */}
            <button
                className="sim-panel__reset"
                onClick={() => dispatch({ type: "RESET" })}
                type="button"
            >
                Reset
            </button>
        </div>
    );
}
