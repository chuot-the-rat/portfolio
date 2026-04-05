/**
 * PassbookStorage.js
 * localStorage helpers for passbook state.
 *
 * State shape:
 * {
 *   issued:    boolean          — whether passbook has been issued
 *   issuedAt:  ISO string|null  — timestamp of first issuance
 *   stamps: {
 *     [projectId]: {
 *       stamped:   boolean
 *       stampedAt: ISO string|null
 *     }
 *   }
 * }
 *
 * Key is versioned ("v1") so a future schema change can cleanly migrate.
 */

const STORAGE_KEY = "leana_passbook_v1";

const DEFAULT_STATE = {
    issued:   false,
    issuedAt: null,
    stamps:   {},
};

export function loadPassbook() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...DEFAULT_STATE };
        const parsed = JSON.parse(raw);
        // Merge with defaults so future fields are safe
        return { ...DEFAULT_STATE, ...parsed, stamps: { ...parsed.stamps } };
    } catch {
        return { ...DEFAULT_STATE };
    }
}

export function savePassbook(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // localStorage unavailable (private browsing, storage full, etc.)
    }
}

/** Returns new state with issued = true and issuedAt set (once only). */
export function issuePassbook(state) {
    if (state.issued) return state;
    return {
        ...state,
        issued:   true,
        issuedAt: new Date().toISOString(),
    };
}

/** Returns new state with the project stamp added. Idempotent. */
export function addStamp(state, projectId) {
    if (state.stamps[projectId]?.stamped) return state;
    return {
        ...state,
        stamps: {
            ...state.stamps,
            [projectId]: {
                stamped:   true,
                stampedAt: new Date().toISOString(),
            },
        },
    };
}

/** Count of stamped projects. */
export function getStampCount(state) {
    return Object.values(state.stamps).filter((s) => s.stamped).length;
}

/** Debug helper — wipes passbook from localStorage. */
export function resetPassbook() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
}
