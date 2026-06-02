/**
 * PassbookProvider.jsx
 * Context provider for the Project Passbook system.
 *
 * Provides:
 *   passbook         — raw state object from storage
 *   stamp(id)        — collect a stamp for a project
 *   isStamped(id)    — check if a project is stamped
 *   stampCount       — number of collected stamps
 *   totalRoutes      — total number of routes in the passbook
 *   drawerOpen       — whether the drawer is currently open
 *   openDrawer()
 *   closeDrawer()
 *   toggleDrawer()
 *   isNewlyIssued    — true on first-ever visit (clears after print card settles)
 *   clearNewlyIssued()
 *
 * Usage:
 *   Wrap at App level.
 *   Consume via usePassbook() anywhere below.
 */

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import {
    loadPassbook,
    savePassbook,
    issuePassbook,
    addStamp,
    getStampCount,
} from "./PassbookStorage";
import { PASSBOOK_TOTAL } from "../../data/passbook/passbookConfig";

const PassbookContext = createContext(null);

export function PassbookProvider({ children }) {
    const [passbook, setPassbook]             = useState(() => loadPassbook());
    const [drawerOpen, setDrawerOpen]         = useState(false);
    // First-visit issuance state for this browser session.
    const [isNewlyIssued, setIsNewlyIssued]   = useState(
        () => !sessionStorage.getItem("pb_anim_done"),
    );

    const commitPassbook = useCallback((updater) => {
        setPassbook((prev) => {
            const next = updater(prev);
            savePassbook(next);
            return next;
        });
    }, []);

    // Issue passbook on first load
    useEffect(() => {
        if (!passbook.issued) {
            commitPassbook((prev) => issuePassbook(prev));
        }
    }, [commitPassbook, passbook.issued]);

    const stamp = useCallback((projectId) => {
        commitPassbook((prev) => addStamp(prev, projectId));
    }, [commitPassbook]);

    const parkPassbook = useCallback(() => {
        commitPassbook((prev) => {
            if (prev.parked) return prev;
            return { ...prev, parked: true };
        });
    }, [commitPassbook]);

    const isStamped = useCallback(
        (projectId) => Boolean(passbook.stamps[projectId]?.stamped),
        [passbook.stamps],
    );

    const stampCount = getStampCount(passbook);

    const value = {
        passbook,
        stamp,
        isStamped,
        stampCount,
        totalRoutes:      PASSBOOK_TOTAL,
        isParked:         Boolean(passbook.parked),
        parkPassbook,
        drawerOpen,
        openDrawer:       () => setDrawerOpen(true),
        closeDrawer:      () => setDrawerOpen(false),
        toggleDrawer:     () => setDrawerOpen((v) => !v),
        isNewlyIssued,
        clearNewlyIssued: () => {
            sessionStorage.setItem("pb_anim_done", "1");
            setIsNewlyIssued(false);
        },
    };

    return (
        <PassbookContext.Provider value={value}>
            {children}
        </PassbookContext.Provider>
    );
}

/** Consume passbook context. Must be used inside <PassbookProvider>. */
export function usePassbook() {
    const ctx = useContext(PassbookContext);
    if (!ctx) {
        throw new Error("usePassbook must be used inside <PassbookProvider>");
    }
    return ctx;
}
