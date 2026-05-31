const cleanValue = (value) => String(value || "").replace(/\s+/g, " ").trim();

const DESIGN_ROLE_PRIORITY = [
    "Product Designer",
    "UX Designer",
    "UI/UX Designer",
    "UI Designer",
    "Product Design",
    "UX Researcher",
    "UX Research",
    "Interaction Designer",
    "Researcher",
];

const scoreRoleForDesignPriority = (role = "") => {
    const normalizedRole = cleanValue(role).toLowerCase();
    if (!normalizedRole) return Number.POSITIVE_INFINITY;

    for (let i = 0; i < DESIGN_ROLE_PRIORITY.length; i += 1) {
        const keyword = DESIGN_ROLE_PRIORITY[i].toLowerCase();
        if (normalizedRole.includes(keyword)) {
            return i;
        }
    }

    return Number.POSITIVE_INFINITY;
};

const toDesignFirstRole = (project = {}) => {
    const roleArray = Array.isArray(project.roleArray) ? project.roleArray : [];
    if (roleArray.length > 0) {
        const normalizedRoles = roleArray
            .map((role) => cleanValue(role))
            .filter(Boolean);

        if (normalizedRoles.length > 0) {
            const rankedRoles = normalizedRoles
                .map((role) => ({
                    role,
                    priority: scoreRoleForDesignPriority(role),
                }))
                .sort((a, b) => a.priority - b.priority);

            if (Number.isFinite(rankedRoles[0]?.priority)) {
                return rankedRoles[0].role;
            }

            return normalizedRoles[0];
        }
    }

    const role = cleanValue(project.role);
    if (!role) return "";
    return cleanValue(role.split(",")[0]);
};

export const getDisplayProjectMeta = (project = {}) => {
    const rawSummary = [
        project?.evidenceNarrative?.whatChangedWhy,
        project.subtitle,
        project.tagline,
        project.summary,
        project?.overview?.description,
    ].find((value) => cleanValue(value));

    const summary = cleanValue(rawSummary);
    const displaySummary =
        summary.length > 108 ? `${summary.slice(0, 105).trimEnd()}…` : summary;

    const displayRole = toDesignFirstRole(project) || "Product Design";
    const displayScope = cleanValue(project.scope || project.category || project.project_type);
    const displayYear = cleanValue(project.year);

    return {
        displayScope,
        displayRole,
        displayYear,
        displaySummary,
    };
};
