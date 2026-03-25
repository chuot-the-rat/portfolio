/**
 * sim.rules.js
 * Lightweight rule engine for the InkLink Simulation Mode.
 *
 * How this works:
 * 1. Rules define conditions (if user type is X AND device is Y)
 * 2. Rules define outcomes (these features, these tradeoffs, these risks, these tests)
 * 3. When user changes the config, ALL matching rules fire
 * 4. All matching rule outputs merge together
 * 5. Duplicates are removed so each point only appears once
 *
 * Rule structure:
 *   - id: unique name for debugging (e.g., 'user-student', 'device-tablet')
 *   - when(config): returns true if this rule should apply
 *   - output: what gets added to the outcome (scope, removed, tradeoffs, risks, tests)
 *
 * Example: If user picks "Student writer" + "Tight deadline":
 * - Both the 'user-student' rule AND 'constraint-deadline' rule fire
 * - Their outputs merge together
 * - User sees combined scope, removed features, tradeoffs, etc.
 */

/** @type {import('./sim.types').SimRule[]} */
export const SIM_RULES = [
    // ─── User Type: Student Writer ────────────────────────────────────────────
    {
        id: 'user-student',
        when: (c) => c.userType === 'student-writer',
        output: {
            scope: [
                'Distraction-free writing mode',
                'Simple story prompts',
                'Basic formatting toolbar',
                'Auto-save drafts',
            ],
            removed: [
                'Advanced version history',
                'Multi-user comment threads',
                'Citation management',
            ],
            tradeoffs: [
                'Reduced feature depth in exchange for lower cognitive load',
            ],
            risks: [
                'Power users may feel constrained by simplified toolset',
            ],
            tests: [
                'Can a first-time user start writing within 60 seconds?',
            ],
        },
    },

    // ─── User Type: Academic Researcher ───────────────────────────────────────
    {
        id: 'user-researcher',
        when: (c) => c.userType === 'academic-researcher',
        output: {
            scope: [
                'Citation and reference management',
                'Link graph visualization',
                'Export to PDF and DOCX',
                'Section-based outline view',
            ],
            removed: [
                'Distraction-free solo writing mode',
                'Simplified tagging system',
            ],
            tradeoffs: [
                'Higher interface complexity in exchange for structured research output',
            ],
            risks: [
                'Non-technical users may face a steep learning curve',
            ],
            tests: [
                'Can a researcher organize 5 sources and annotate them in under 5 minutes?',
            ],
        },
    },

    // ─── User Type: Editor ────────────────────────────────────────────────────
    {
        id: 'user-editor',
        when: (c) => c.userType === 'editor',
        output: {
            scope: [
                'Inline comment threads',
                'Track changes with attribution',
                'Version comparison view',
                'Contributor activity overview',
            ],
            removed: [
                'Solo writing prompts',
                'Personal brainstorm canvas',
            ],
            tradeoffs: [
                'Tool optimized for reviewing, not originating content',
            ],
            risks: [
                'Writers may feel surveilled rather than supported',
            ],
            tests: [
                'Can an editor leave contextual feedback without disrupting a writer\'s flow?',
            ],
        },
    },

    // ─── Device: Tablet ───────────────────────────────────────────────────────
    {
        id: 'device-tablet',
        when: (c) => c.device === 'tablet',
        output: {
            scope: [
                'Touch-optimized toolbar',
                'Swipe navigation between sections',
            ],
            removed: [
                'Keyboard shortcut system',
                'Multi-pane split layout',
            ],
            tradeoffs: [
                'Reduced screen real estate limits simultaneous views',
            ],
            risks: [
                'Complex graph visualizations may be unreadable at tablet scale',
            ],
            tests: [
                'Are all interactive targets at least 44×44px on a standard tablet viewport?',
            ],
        },
    },

    // ─── Device: Desktop ──────────────────────────────────────────────────────
    {
        id: 'device-desktop',
        when: (c) => c.device === 'desktop',
        output: {
            scope: [
                'Multi-pane writing layout',
                'Expanded sidebar with outline',
                'Full keyboard shortcut system',
            ],
            removed: [
                'Simplified single-column layout',
            ],
            tradeoffs: [
                'Desktop-first layout may degrade on smaller screens without responsive work',
            ],
            risks: [
                'Mobile users receive a degraded experience if responsive design is deprioritized',
            ],
            tests: [
                'Does the multi-pane layout remain usable at a 1280px viewport width?',
            ],
        },
    },

    // ─── Constraint: Tight Deadline ───────────────────────────────────────────
    {
        id: 'constraint-deadline',
        when: (c) => c.constraints.includes('tight-deadline'),
        output: {
            scope: [
                'Quick-start writing templates',
                'Session focus timer',
                'Progress completion tracker',
            ],
            removed: [
                'Onboarding tour and setup wizard',
                'Advanced customization settings',
            ],
            tradeoffs: [
                'Reduced discoverability of advanced features to prioritize speed',
            ],
            risks: [
                'Users may overlook key functionality when under time pressure',
            ],
            tests: [
                'Can a user reach an active writing state in under 2 minutes from first load?',
            ],
        },
    },

    // ─── Constraint: Accessibility Priority ───────────────────────────────────
    {
        id: 'constraint-accessibility',
        when: (c) => c.constraints.includes('accessibility-priority'),
        output: {
            scope: [
                'Screen reader optimization (ARIA labels, live regions)',
                'High-contrast mode toggle',
                'Full keyboard navigation',
                'Reduced motion preference support',
            ],
            removed: [
                'Animation-heavy transitions',
                'Color-only status indicators',
            ],
            tradeoffs: [
                'Visual design constrained by accessibility requirements',
            ],
            risks: [
                'Some interactive metaphors (e.g. drag-to-link) may not translate to assistive technology',
            ],
            tests: [
                'Is the complete writing and linking flow navigable by keyboard alone?',
                'Does the interface pass WCAG 2.1 AA color contrast requirements?',
            ],
        },
    },

    // ─── Constraint: Offline Writing Need ─────────────────────────────────────
    {
        id: 'constraint-offline',
        when: (c) => c.constraints.includes('offline-writing'),
        output: {
            scope: [
                'Offline-first local draft storage',
                'Background sync queue',
                'Merge conflict resolution UI',
            ],
            removed: [
                'Real-time collaboration features',
                'Live presence indicators',
            ],
            tradeoffs: [
                'Collaboration features unavailable without an active connection',
            ],
            risks: [
                'Sync conflicts arise after long offline sessions with concurrent edits',
            ],
            tests: [
                'Does offline mode correctly queue changes and sync cleanly on reconnect?',
            ],
        },
    },

    // ─── Constraint: Collaboration Priority ───────────────────────────────────
    {
        id: 'constraint-collaboration',
        when: (c) => c.constraints.includes('collaboration-priority'),
        output: {
            scope: [
                'Multi-user real-time presence',
                'Comment threads on passages',
                'Version history and change attribution',
                'Contributor role management',
            ],
            removed: [
                'Distraction-free solo writing mode',
                'Simplified tagging system',
            ],
            tradeoffs: [
                'Increased interface complexity for solo or casual users',
            ],
            risks: [
                'Steeper onboarding curve for first-time collaborators',
            ],
            tests: [
                'Can a new collaborator understand link relationships and leave a comment within 3 minutes?',
            ],
        },
    },

    // ─── Compound: Researcher + Collaboration ─────────────────────────────────
    {
        id: 'compound-researcher-collab',
        when: (c) =>
            c.userType === 'academic-researcher' &&
            c.constraints.includes('collaboration-priority'),
        output: {
            scope: [
                'Shared annotation layer across citations',
                'Export combined bibliography from multiple contributors',
            ],
            removed: [],
            tradeoffs: [
                'Research structure must accommodate multiple contrasting annotation styles',
            ],
            risks: [
                'Diverging citation formats between collaborators can create data inconsistency',
            ],
            tests: [
                'Can two researchers merge annotated sources without overwriting each other\'s notes?',
            ],
        },
    },

    // ─── Compound: Editor + Desktop ───────────────────────────────────────────
    {
        id: 'compound-editor-desktop',
        when: (c) => c.userType === 'editor' && c.device === 'desktop',
        output: {
            scope: [
                'Side-by-side diff view for version comparison',
                'Bulk comment resolution panel',
            ],
            removed: [],
            tradeoffs: [
                'Feature richness assumes a large screen — unavailable to mobile reviewers',
            ],
            risks: [
                'Desktop-only review workflow creates bottleneck for remote editors on mobile',
            ],
            tests: [
                'Can an editor review and resolve 10 comments in one focused session?',
            ],
        },
    },

    // ─── Compound: Student + Tight Deadline ───────────────────────────────────
    {
        id: 'compound-student-deadline',
        when: (c) =>
            c.userType === 'student-writer' &&
            c.constraints.includes('tight-deadline'),
        output: {
            scope: [
                'One-tap writing prompt generator',
                'Minimal-chrome focus mode',
            ],
            removed: [],
            tradeoffs: [
                'Speed optimizations remove helpful context for new users',
            ],
            risks: [
                'Students may submit drafts without reviewing InkLink\'s collaborative features',
            ],
            tests: [
                'Does the focus mode reduce time-to-first-word compared to default onboarding?',
            ],
        },
    },
];

/**
 * Evaluate all rules against a config and merge outputs.
 * This is the engine that turns user choices into the outcome display.
 *
 * How it works:
 * 1. Start with empty arrays for each outcome category
 * 2. Loop through all rules
 * 3. If a rule's 'when' condition returns true, add its output to the accumulators
 * 4. Remove duplicates from each category (Set removes duplicates automatically)
 * 5. Return the merged, deduplicated outcome
 *
 * @param {import('./sim.types').SimConfig} config - User's current choices
 * @returns {import('./sim.types').SimOutcome} Merged result from all matching rules
 */
export function evaluateRules(config) {
    // Start with empty buckets for each outcome type
    const empty = { scope: [], removed: [], tradeoffs: [], risks: [], tests: [] };

    // Accumulate all matching rule outputs
    const merged = SIM_RULES.reduce((acc, rule) => {
        // Skip this rule if its condition doesn't match
        if (!rule.when(config)) return acc;

        // Add this rule's output to our accumulator
        return {
            scope: [...acc.scope, ...rule.output.scope],
            removed: [...acc.removed, ...rule.output.removed],
            tradeoffs: [...acc.tradeoffs, ...rule.output.tradeoffs],
            risks: [...acc.risks, ...rule.output.risks],
            tests: [...acc.tests, ...rule.output.tests],
        };
    }, empty);

    // Convert arrays to Sets to remove duplicates, then back to arrays
    // (Set only keeps unique values)
    return {
        scope: [...new Set(merged.scope)],
        removed: [...new Set(merged.removed)],
        tradeoffs: [...new Set(merged.tradeoffs)],
        risks: [...new Set(merged.risks)],
        tests: [...new Set(merged.tests)],
    };
}
