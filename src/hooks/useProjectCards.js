import { useEffect, useState } from "react";
import { getAllProjects } from "../utils/projectDataMapper";
import {
    buildEnrichedProjectUpdates,
    buildInitialProjectCards,
    mergeProjectUpdatesById,
    PROJECTS_ENRICHMENT_IMAGE_SECTIONS,
    safeFetchJson,
    scheduleIdleTask,
} from "../utils/projectListViewModel";

export function useProjectCards() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        let alive = true;
        let cancelIdleTask = null;

        const loadProjects = async () => {
            try {
                const caseStudyProjects = getAllProjects();
                const projectsList =
                    (await safeFetchJson("/projects.json", {
                        signal: controller.signal,
                    })) || [];
                const { cards, standaloneEntries } = buildInitialProjectCards({
                    caseStudyProjects,
                    projectsList,
                    includeHoverPattern: true,
                    includeTaxonomyTags: true,
                    seedImageSections: ["solution", "overview"],
                });

                if (!alive) return;
                setProjects(cards);
                setLoading(false);

                cancelIdleTask = scheduleIdleTask(async () => {
                    const updates = await buildEnrichedProjectUpdates({
                        caseStudyProjects,
                        standaloneEntries,
                        projectsList,
                        signal: controller.signal,
                        caseStudyImageSections: PROJECTS_ENRICHMENT_IMAGE_SECTIONS,
                        standaloneImageSections: ["overview", "solution", "styleGuide"],
                    });

                    if (!alive || updates.length === 0) return;
                    setProjects((currentProjects) =>
                        mergeProjectUpdatesById(currentProjects, updates),
                    );
                });
            } catch {
                if (!alive) return;
                const fallbackCaseStudies = getAllProjects();
                const { cards: fallbackCards } = buildInitialProjectCards({
                    caseStudyProjects: fallbackCaseStudies,
                    projectsList: [],
                    includeHoverPattern: false,
                    includeTaxonomyTags: false,
                    seedImageSections: [],
                });
                setProjects(
                    fallbackCards.map((project) => ({
                        ...project,
                        allImages: [],
                    })),
                );
                setLoading(false);
            }
        };

        loadProjects();

        return () => {
            alive = false;
            controller.abort();
            if (cancelIdleTask) cancelIdleTask();
        };
    }, []);

    return { loading, projects };
}
