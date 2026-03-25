/**
 * sim.types.js
 * JSDoc type definitions for the InkLink Simulation Mode.
 */

/**
 * @typedef {'student-writer' | 'academic-researcher' | 'editor'} UserType
 */

/**
 * @typedef {'tablet' | 'desktop'} DeviceType
 */

/**
 * @typedef {'tight-deadline' | 'accessibility-priority' | 'offline-writing' | 'collaboration-priority'} ConstraintType
 */

/**
 * @typedef {Object} SimConfig
 * @property {UserType} userType
 * @property {DeviceType} device
 * @property {ConstraintType[]} constraints - max 2
 */

/**
 * @typedef {Object} SimOutcome
 * @property {string[]} scope
 * @property {string[]} removed
 * @property {string[]} tradeoffs
 * @property {string[]} risks
 * @property {string[]} tests
 */

/**
 * @typedef {Object} SimRule
 * @property {string} id
 * @property {function(SimConfig): boolean} when
 * @property {SimOutcome} output
 */

export const USER_TYPES = [
    { value: 'student-writer', label: 'Student Writer' },
    { value: 'academic-researcher', label: 'Academic Researcher' },
    { value: 'editor', label: 'Editor' },
];

export const DEVICES = [
    { value: 'tablet', label: 'Tablet' },
    { value: 'desktop', label: 'Desktop' },
];

export const CONSTRAINTS = [
    { value: 'tight-deadline', label: 'Tight deadline' },
    { value: 'accessibility-priority', label: 'Accessibility priority' },
    { value: 'offline-writing', label: 'Offline writing need' },
    { value: 'collaboration-priority', label: 'Collaboration priority' },
];

export const MAX_CONSTRAINTS = 2;
