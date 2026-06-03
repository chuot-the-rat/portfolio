export const STANDALONE_PROJECT_IDS = ["fizzu-soda", "sap", "menu", "yard-sale"];
export const CASE_STUDY_BASE_PATH = "/case-studies";

export const isStandaloneProject = (id) =>
    STANDALONE_PROJECT_IDS.includes(id);

export const getProjectPath = (id) =>
    isStandaloneProject(id) ? `/design/${id}` : `${CASE_STUDY_BASE_PATH}/${id}`;
