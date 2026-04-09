/**
 * passbookConfig.js
 * Passbook / route metadata for every project in the system.
 *
 * Shape per entry:
 *   routeCode       short identifier in transit style (e.g. "IL-07")
 *   lineLabel       category / line name shown in drawer
 *   stampLabel      completion phrase collected on stamp (e.g. "Clarity Restored")
 *   checkpointLabel section label shown at the project completion checkpoint
 *   accentHue       HSL hue value (0–360) — used for per-route accent tint
 *                   intentionally a raw number so callers can compose it freely
 *
 * Flexible by design:
 * - Stamp labels are first-pass and can be revised without any code changes
 * - Accent hues are loose approximations — final palette TBD
 * - routeCodes are arbitrary for now; can be made meaningful later
 *
 * Keyed by project ID (matches IDs in case_studies_standardized.json
 * and STANDALONE_PROJECT_IDS in App.jsx).
 */

export const PASSBOOK_ROUTES = {
    inklink: {
        routeCode:        "IL-07",
        lineLabel:        "UX SYSTEM",
        stampLabel:       "Seal Registered",
        checkpointLabel:  "Validation point",
        accentHue:        240,    // indigo-adjacent
        microCues:        ["Quote captured", "Flow branch logged"],
    },
    prolog: {
        routeCode:        "PL-03",
        lineLabel:        "GUIDANCE SYSTEM",
        stampLabel:       "Route Confirmed",
        checkpointLabel:  "Validation point",
        accentHue:        210,    // blue
        microCues:        ["Progress delta noted", "Stress point resolved"],
    },
    sidequest: {
        routeCode:        "SQ-11",
        lineLabel:        "BEHAVIOR SYSTEM",
        stampLabel:       "Path Verified",
        checkpointLabel:  "Validation point",
        accentHue:        142,    // green
        microCues:        ["Prompt cadence tuned", "Friction reduced"],
    },
    "fizzu-soda": {
        routeCode:        "FS-04",
        lineLabel:        "BRAND SYSTEM",
        stampLabel:       "Identity Sealed",
        checkpointLabel:  "Validation point",
        accentHue:        22,     // warm orange
        microCues:        ["Palette pass", "Packaging lock"],
    },
    sap: {
        routeCode:        "SA-02",
        lineLabel:        "ENTERPRISE SYSTEM",
        stampLabel:       "System Logged",
        checkpointLabel:  "Validation point",
        accentHue:        188,    // teal
        microCues:        ["Handoff note", "Constraint marked"],
    },
};

/**
 * Canonical display order for drawer / progress readout.
 * Can be reordered any time without affecting stamp data.
 */
export const PASSBOOK_ROUTE_ORDER = [
    "inklink",
    "prolog",
    "sidequest",
    "fizzu-soda",
    "sap",
];

/** Total number of collectable stamps. */
export const PASSBOOK_TOTAL = PASSBOOK_ROUTE_ORDER.length;

/** Returns config for a project, or null if not in the passbook. */
export function getPassbookRoute(projectId) {
    return PASSBOOK_ROUTES[projectId] ?? null;
}

/** True if this project has a passbook stamp to collect. */
export function isPassbookProject(projectId) {
    return Object.prototype.hasOwnProperty.call(PASSBOOK_ROUTES, projectId);
}
