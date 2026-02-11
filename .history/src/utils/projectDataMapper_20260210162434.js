// Utility to map case_studies_standardized.json structure to the format expected by UI components
import caseStudiesData from '../assets/case_studies_standardized.json';

/**
 * Maps a case study from the centralized JSON to the format expected by ProjectDetail and Home components
 */
export const mapCaseStudyToProject = (caseStudy) => {
    if (!caseStudy) return null;

    const { sections } = caseStudy;
    
    // Flatten tools_used object into array
    const tools = caseStudy.tools_used 
        ? Object.values(caseStudy.tools_used).flat()
        : [];

    return {
        id: caseStudy.id,
        title: caseStudy.title,
        tagline: caseStudy.subtitle || caseStudy.summary,
        subtitle: caseStudy.subtitle,
        summary: caseStudy.summary,
        category: caseStudy.project_type,
        year: caseStudy.year,
        role: Array.isArray(caseStudy.role) ? caseStudy.role.join(', ') : caseStudy.role,
        timeline: caseStudy.duration,
        team: `${caseStudy.team_size} team members`,
        tools: tools,
        links: caseStudy.links || {},
        
        // Map sections to expected format
        overview: sections?.hook ? {
            title: "Overview",
            description: sections.hook.content,
            images: sections.hook.visuals || []
        } : null,
        
        problem: sections?.problem_framing ? {
            title: "The Problem",
            description: sections.problem_framing.content,
            images: sections.problem_framing.visuals || []
        } : null,
        
        research: sections?.research_process ? {
            title: "Research & Ideation",
            description: sections.research_process.insights?.join('\n\n') || sections.research_process.content || '',
            images: []
        } : null,
        
        challenges: sections?.early_challenges && sections?.pivots ? {
            title: "Early Challenges & Pivots",
            description: sections.early_challenges.content,
            pivots: sections.pivots.map(pivot => ({
                from: pivot.from,
                to: pivot.to,
                reason: pivot.reason
            }))
        } : null,
        
        lofi: sections?.lofi_phase ? {
            title: "Lo‑Fi Exploration",
            description: sections.lofi_phase.content,
            images: sections.lofi_phase.visuals || []
        } : null,
        
        iterations: sections?.hifi_phase ? {
            title: "High-Fidelity Designs",
            description: sections.hifi_phase.content,
            improvements: sections.hifi_phase.key_decisions || [],
            images: sections.hifi_phase.visuals || []
        } : null,
        
        solution: sections?.development || sections?.feature_breakdown ? {
            title: "Final Solution",
            description: sections.development?.content || '',
            features: sections.feature_breakdown?.features?.map(f => ({
                title: f.name,
                description: f.explanation
            })) || [],
            images: sections.development?.visuals || sections.feature_breakdown?.visuals || []
        } : null,
        
        validation: sections?.validation ? {
            title: "Validation & Testing",
            description: sections.validation.content,
            quotes: sections.validation.quotes || []
        } : null,
        
        learnings: sections?.what_i_learned ? {
            title: "What I Learned",
            insights: sections.what_i_learned.insights?.map(insight => ({
                title: insight.point,
                description: insight.explanation
            })) || []
        } : null,
        
        nextSteps: sections?.next_steps ? {
            title: "Next Steps",
            items: sections.next_steps.planned || []
        } : null,
        
        // Additional metadata
        previewLayout: caseStudy.preview_layout || 'tablet',
        status: caseStudy.status
    };
};

/**
 * Gets all case studies and maps them to project format
 */
export const getAllProjects = () => {
    if (!caseStudiesData?.case_studies) {
        console.error('Case studies data not found');
        return [];
    }
    
    return caseStudiesData.case_studies.map(mapCaseStudyToProject);
};

/**
 * Gets a single project by ID
 */
export const getProjectById = (id) => {
    if (!caseStudiesData?.case_studies) {
        console.error('Case studies data not found');
        return null;
    }
    
    const caseStudy = caseStudiesData.case_studies.find(cs => cs.id === id || cs.slug === id);
    return caseStudy ? mapCaseStudyToProject(caseStudy) : null;
};
