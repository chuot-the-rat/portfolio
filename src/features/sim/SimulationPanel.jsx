/**
 * SimulationPanel.jsx
 * Configuration UI for the InkLink Simulation Mode.
 * Renders user type selector, device toggle, and constraint checkboxes.
 */

import { useSimulation } from './SimulationProvider.jsx';
import { USER_TYPES, DEVICES, CONSTRAINTS, MAX_CONSTRAINTS } from './sim.types.js';

export default function SimulationPanel() {
    const { config, dispatch } = useSimulation();

    const constraintsFull = config.constraints.length >= MAX_CONSTRAINTS;

    return (
        <div className="sim-panel">
            <div className="sim-panel__header">
                <span className="sim-panel__badge">SIM MODE</span>
                <p className="sim-panel__hint">
                    Configure a scenario to see how InkLink's product direction shifts.
                </p>
            </div>

            {/* User Type */}
            <fieldset className="sim-panel__fieldset">
                <legend className="sim-panel__legend">User type</legend>
                <div className="sim-panel__select-wrap">
                    <select
                        className="sim-panel__select"
                        value={config.userType}
                        onChange={(e) =>
                            dispatch({ type: 'SET_USER_TYPE', payload: e.target.value })
                        }
                        aria-label="Select user type"
                    >
                        {USER_TYPES.map((u) => (
                            <option key={u.value} value={u.value}>
                                {u.label}
                            </option>
                        ))}
                    </select>
                    <span className="sim-panel__select-chevron" aria-hidden="true">
                        ▾
                    </span>
                </div>
            </fieldset>

            {/* Device */}
            <fieldset className="sim-panel__fieldset">
                <legend className="sim-panel__legend">Device</legend>
                <div className="sim-panel__radio-group" role="radiogroup">
                    {DEVICES.map((d) => (
                        <label key={d.value} className="sim-panel__radio-label">
                            <input
                                type="radio"
                                name="device"
                                value={d.value}
                                checked={config.device === d.value}
                                onChange={() =>
                                    dispatch({ type: 'SET_DEVICE', payload: d.value })
                                }
                                className="sim-panel__radio-input"
                            />
                            <span className="sim-panel__radio-dot" aria-hidden="true" />
                            {d.label}
                        </label>
                    ))}
                </div>
            </fieldset>

            {/* Constraints */}
            <fieldset className="sim-panel__fieldset">
                <legend className="sim-panel__legend">
                    Context constraints
                    <span className="sim-panel__legend-note">
                        {config.constraints.length}/{MAX_CONSTRAINTS} selected
                    </span>
                </legend>
                <div className="sim-panel__checkbox-group">
                    {CONSTRAINTS.map((con) => {
                        const checked = config.constraints.includes(con.value);
                        const disabled = !checked && constraintsFull;
                        return (
                            <label
                                key={con.value}
                                className={`sim-panel__checkbox-label${disabled ? ' sim-panel__checkbox-label--disabled' : ''}${checked ? ' sim-panel__checkbox-label--checked' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    disabled={disabled}
                                    onChange={() =>
                                        dispatch({
                                            type: 'TOGGLE_CONSTRAINT',
                                            payload: con.value,
                                        })
                                    }
                                    className="sim-panel__checkbox-input"
                                    aria-label={con.label}
                                />
                                <span className="sim-panel__checkbox-box" aria-hidden="true">
                                    {checked && (
                                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
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

            {/* Reset */}
            <button
                className="sim-panel__reset"
                onClick={() => dispatch({ type: 'RESET' })}
                type="button"
            >
                Reset
            </button>
        </div>
    );
}
