// Utility to map case_studies_standardized.json structure to the format expected by UI components
import caseStudiesData from '../assets/case_studies_standardized.json';

/**
 * Helper to extract images from section data
 */
const extractImages = (section) => {
    if (!section) return [];
    return section.images || section.visuals || [];
};

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

    // Determine preview layout from project type if not specified
    const getPreviewLayout = () => {
        if (caseStudy.preview_layout) return caseStudy.preview_layout;
        const type = caseStudy.project_type?.toLowerCase() || '';
        if (type.includes('mobile')) return 'mobile';
        if (type.includes('web')) return 'tablet';
        return 'tablet';
    };

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
            images: extractImages(sections.hook)
        } : null,
        
        problem: sections?.problem_framing ? {
            title: "The Problem",
            description: sections.problem_framing.content,
            images: extractImages(sections.problem_framing)
        } : null,
        
        research: sections?.research_process ? {
            title: "Research & Ideation",
            description: (() => {
                const process = sections.research_process;
                let desc = process.content || '';
                
                if (process.key_findings && process.key_findings.length > 0) {
                    desc += '\n\nKey findings: ' + process.key_findings.join(' ');
                }
                
                if (process.reflection) {
                    desc += '\n\n' + process.reflection;
                }
                
                return desc;
            })(),
            images: extractImages(sections.research_process)
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
            images: extractImages(sections.lofi_phase)
        } : null,
        
        iterations: sections?.hifi_phase ? {
            title: "High-Fidelity Designs",
            description: sections.hifi_phase.content,
            improvements: sections.hifi_phase.key_decisions || [],
            images: extractImages(sections.hifi_phase)
        } : null,
        
        solution: sections?.feature_breakdown ? {
            title: "Final Solution",
            description: sections.feature_breakdown.intro || sections.development?.content || '',
            features: sections.feature_breakdown.features?.map(f => ({
                title: f.title || f.name,
                description: f.description || f.explanation || f.why
            })) || [],
            images: extractImages(sections.feature_breakdown) || extractImages(sections.development)
        } : sections?.development ? {
            title: "Final Solution",
            description: sections.development.content,
            features: [],
            images: extractImages(sections.development)
        } : null,
        
        validation: sections?.validation ? {
            title: "Validation & Testing",
            description: sections.validation.content,
            quotes: sections.validation.quotes || sections.validation.participant_quotes || []
        } : null,
        
        learnings: sections?.what_i_learned ? {
            title: "What I Learned",
            insights: sections.what_i_learned.insights?.map(insight => ({
                title: insight.point || insight.title,
                description: insight.explanation || insight.description
            })) || []
        } : null,
        
        nextSteps: sections?.next_steps ? {
            title: "Next Steps",
            items: sections.next_steps.planned || sections.next_steps.items || []
        } : null,
        
        // Additional metadata
        previewLayout: getPreviewLayout(),
        status: caseStudy.status,
        featured: caseStudy.featured
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
