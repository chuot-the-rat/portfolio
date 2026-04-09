export const caseStudyMotion = {
    sectionReveal: {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
    mockupReveal: {
        initial: { opacity: 0, y: 18, scale: 0.97 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
    verdictContainer: {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.12,
            },
        },
    },
    verdictItem: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    },
    checklistItem: {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
    },
};
