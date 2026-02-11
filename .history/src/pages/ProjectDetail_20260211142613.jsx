import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getProjectById } from "../utils/projectDataMapper";
import PivotSection from "../components/PivotSection";
import PivotDiagram from "../components/PivotDiagram";
import WeightLiftedPivot from "../components/WeightLiftedPivot";
import ClaritySubtractionScene from "../components/ClaritySubtractionScene";
import { SectionIndex, SectionTag, ScrollProgress, FigLabel } from "../components/MicroIndex";
import EvolutionSection from "../components/EvolutionSection";
import "./ProjectDetail.css";

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const contentRef = useRef(null);

    useEffect(() => {
        // Load project data from centralized case studies
        try {
            const projectData = getProjectById(id);
            if (!projectData) {
                navigate("/");
                return;
            }
            setProject(projectData);
            setLoading(false);
        } catch (error) {
            console.error("Error loading project:", error);
            navigate("/");
        }
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="project-detail-loading">
                <motion.div
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="project-detail">
            {/* Back Button */}
            <motion.div
                className="project-detail-back"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Link
                    to="/"
                    className="back-button"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <path
                            d="M12 4l-8 6 8 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span>Back</span>
                </Link>
            </motion.div>

            {/* Hero */}
            <motion.section
                className="project-hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <div className="container">
                    <div className="project-hero-meta">
                        <span className="project-tag">{project.category}</span>
                        <span className="project-year">{project.year}</span>
                    </div>

                    <h1 className="project-hero-title">{project.title}</h1>

                    <p className="project-hero-tagline">{project.tagline}</p>

                    {/* Header CTA - Live Site Link */}
                    {project.links?.live && (
                        <motion.a
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-cta-link"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            whileHover={{
                                y: -2,
                                transition: { duration: 0.2 },
                            }}
                        >
                            <span>Visit Live Site</span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    d="M6 3h7v7M13 3L3 13"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </motion.a>
                    )}

                    <div className="project-meta-grid">
                        <div className="project-meta-item">
                            <span className="meta-label">Role</span>
                            <span className="meta-value">{project.role}</span>
                        </div>
                        <div className="project-meta-item">
                            <span className="meta-label">Timeline</span>
                            <span className="meta-value">
                                {project.timeline || project.duration}
                            </span>
                        </div>
                        <div className="project-meta-item">
                            <span className="meta-label">Team</span>
                            <span className="meta-value">
                                {project.team || `${project.teamSize} members`}
                            </span>
                        </div>
                        {project.context && (
                            <div className="project-meta-item">
                                <span className="meta-label">Context</span>
                                <span className="meta-value">
                                    {project.context}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Responsibilities */}
                    {project.responsibilities &&
                        project.responsibilities.length > 0 && (
                            <div className="project-responsibilities">
                                <span className="meta-label">
                                    Key Responsibilities
                                </span>
                                <ul className="responsibilities-list">
                                    {project.responsibilities.map(
                                        (resp, index) => (
                                            <li
                                                key={index}
                                                className="responsibility-item"
                                            >
                                                {resp}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        )}

                    {/* Tools - Categorized */}
                    {project.toolsCategories &&
                        Object.keys(project.toolsCategories).length > 0 && (
                            <div className="project-tools-categorized">
                                {Object.entries(project.toolsCategories).map(
                                    ([category, tools]) =>
                                        tools && tools.length > 0 ? (
                                            <div
                                                key={category}
                                                className="tools-category"
                                            >
                                                <span className="tools-category-label">
                                                    {category}
                                                </span>
                                                <div className="tools-category-items">
                                                    {tools.map(
                                                        (tool, index) => (
                                                            <span
                                                                key={index}
                                                                className="tool-tag"
                                                            >
                                                                {tool}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ) : null,
                                )}
                            </div>
                        )}

                    {/* Legacy tools display */}
                    {(!project.toolsCategories ||
                        Object.keys(project.toolsCategories).length === 0) &&
                        project.tools &&
                        project.tools.length > 0 && (
                            <div className="project-tools">
                                {project.tools.map((tool, index) => (
                                    <span
                                        key={index}
                                        className="tool-tag"
                                    >
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        )}
                </div>
            </motion.section>

            {/* Content Sections */}
            <div
                className="project-content"
                ref={contentRef}
            >
                <div className="container">
                    <div className="project-content-layout">
                        <ProjectContentMain project={project} />
                        {/* Micro-index scroll progress sidebar */}
                        <ScrollProgress contentRef={contentRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ═════════════════════════════════════════════════════════════════════
   ProjectContentMain — renders all case study sections
   with auto-incrementing micro-index system.
   Image counter (FIG.XX) resets per case study.
   ═════════════════════════════════════════════════════════════════════ */
const ProjectContentMain = ({ project }) => {
    /* Mutable counters — increment as sections render */
    let sectionNum = 0;
    let imageNum = 0;
    const ci = project.caseIndex || 1;
    const nextSection = () => ++sectionNum;
    const nextImage = () => ++imageNum;

    return (
        <div className="project-content-main">
            {/* Overview */}
            {project.overview && (() => {
                const s = nextSection();
                return (
                    <IndexedSection
                        caseIndex={ci}
                        sectionIndex={s}
                        name="Overview"
                        title={project.overview.title}
                        description={project.overview.description}
                        images={project.overview.images}
                        imageStartIndex={imageNum}
                        onImageCount={(n) => { imageNum += n; }}
                    />
                );
            })()}

            {/* Research */}
            {project.research && (() => {
                const s = nextSection();
                return (
                    <motion.section
                        className="project-section research-section"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <SectionIndex caseIndex={ci} sectionIndex={s} title="Research" />
                        <h2 className="section-title">{project.research.title}</h2>
                        <SectionTag sectionIndex={s} version="2.0" />
                        <p className="section-description">{project.research.description}</p>

                        {project.research.methods?.length > 0 && (
                            <div className="research-methods">
                                <h3 className="subsection-title">Methods</h3>
                                <ul className="methods-list">
                                    {project.research.methods.map((method, i) => (
                                        <li key={i} className="method-item">{method}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {project.research.keyFindings?.length > 0 && (
                            <div className="research-findings">
                                <h3 className="subsection-title">Key Findings</h3>
                                <ul className="findings-list">
                                    {project.research.keyFindings.map((finding, i) => (
                                        <motion.li
                                            key={i}
                                            className="finding-item"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: i * 0.1 }}
                                        >
                                            <span className="finding-icon">→</span>
                                            <span>{finding}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {project.research.participantCount && (
                            <p className="participant-count">
                                <strong>{project.research.participantCount}</strong> participants
                            </p>
                        )}

                        {project.research.reflection && (
                            <blockquote className="research-reflection">
                                {project.research.reflection}
                            </blockquote>
                        )}

                        {project.research.images?.length > 0 && (
                            <ImageGallery images={project.research.images} startIndex={imageNum} onCount={(n) => { imageNum += n; }} />
                        )}
                    </motion.section>
                );
            })()}

            {/* Problem (legacy) */}
            {!project.research && project.problem && (() => {
                const s = nextSection();
                return (
                    <IndexedSection
                        caseIndex={ci}
                        sectionIndex={s}
                        name="Problem"
                        title={project.problem.title}
                        description={project.problem.description}
                        images={project.problem.images}
                        imageStartIndex={imageNum}
                        onImageCount={(n) => { imageNum += n; }}
                    />
                );
            })()}

            {/* Challenges & Pivots */}
            {project.challenges && (() => {
                const s = nextSection();
                return (
                    <motion.section
                        className="project-section challenges-section"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <SectionIndex caseIndex={ci} sectionIndex={s} title="Challenges" />
                        <h2 className="section-title">{project.challenges.title}</h2>
                        <SectionTag sectionIndex={s} version="2.0" />
                        <p className="section-description">{project.challenges.description}</p>

                        {project.challenges.pivots?.length > 0 && (
                            <PivotDiagram pivots={project.challenges.pivots} />
                        )}
                    </motion.section>
                );
            })()}

            {/* Pivot section */}
            <PivotSection pivot={project.pivot} />

            {/* Clarity Subtraction Scene */}
            {project.pivot?.clarityScene && (
                <ClaritySubtractionScene data={project.pivot.clarityScene} />
            )}

            {/* Weight Lifted (fallback) */}
            {project.pivot?.weightLifted && !project.pivot?.clarityScene && (
                <WeightLiftedPivot {...project.pivot.weightLifted} />
            )}

            {/* Lo-Fi Exploration */}
            {project.lofi && (() => {
                const s = nextSection();
                return (
                    <IndexedSection
                        caseIndex={ci}
                        sectionIndex={s}
                        name="Lo-Fi Exploration"
                        title={project.lofi.title}
                        description={project.lofi.description}
                        images={project.lofi.images}
                        imageStartIndex={imageNum}
                        onImageCount={(n) => { imageNum += n; }}
                    />
                );
            })()}

            {/* Development Approach */}
            {project.development && (() => {
                const s = nextSection();
                return (
                    <motion.section
                        className="project-section development-section"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <SectionIndex caseIndex={ci} sectionIndex={s} title="Development" />
                        <h2 className="section-title">{project.development.title}</h2>
                        <SectionTag sectionIndex={s} version="2.0" />
                        <p className="section-description">{project.development.description}</p>

                        {project.development.technicalDecisions?.length > 0 && (
                            <div className="technical-decisions">
                                <h3 className="subsection-title">Technical Decisions</h3>
                                <ul className="decisions-list">
                                    {project.development.technicalDecisions.map((decision, i) => (
                                        <motion.li
                                            key={i}
                                            className="decision-item"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: i * 0.1 }}
                                        >
                                            <span className="decision-icon">✓</span>
                                            <span>{decision}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {project.development.constraints?.length > 0 && (
                            <div className="development-constraints">
                                <h3 className="subsection-title">Constraints</h3>
                                <ul className="constraints-list">
                                    {project.development.constraints.map((c, i) => (
                                        <li key={i} className="constraint-item">{c}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.section>
                );
            })()}

            {/* Iterations & Refinements */}
            {project.iterations && (() => {
                const s = nextSection();
                return (
                    <motion.section
                        className="project-section"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <SectionIndex caseIndex={ci} sectionIndex={s} title="Iterations" />
                        <h2 className="section-title">{project.iterations.title}</h2>
                        <SectionTag sectionIndex={s} version="2.1" />
                        <p className="section-description">{project.iterations.description}</p>
                        {project.iterations.improvements && (
                            <ul className="objectives-list">
                                {project.iterations.improvements.map((imp, i) => (
                                    <motion.li
                                        key={i}
                                        className="objective-item"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.1 }}
                                    >
                                        <span className="objective-icon">✓</span>
                                        <span className="objective-text">{imp}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                        {project.iterations.images?.length > 0 && (
                            <ImageGallery images={project.iterations.images} startIndex={imageNum} onCount={(n) => { imageNum += n; }} />
                        )}
                        {project.iterations.prototype && (
                            <PrototypeEmbed prototype={project.iterations.prototype} />
                        )}
                    </motion.section>
                );
            })()}

            {/* Objectives (legacy) */}
            {!project.iterations && project.objectives?.length > 0 && (() => {
                const s = nextSection();
                return (
                    <motion.section
                        className="project-section"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <SectionIndex caseIndex={ci} sectionIndex={s} title="Objectives" />
                        <h2 className="section-title">Goals</h2>
                        <SectionTag sectionIndex={s} />
                        <ul className="objectives-list">
                            {project.objectives.map((obj, i) => (
                                <motion.li
                                    key={i}
                                    className="objective-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                >
                                    <span className="objective-icon">✓</span>
                                    <span className="objective-text">{obj}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.section>
                );
            })()}

            {/* Solution */}
            {project.solution && (() => {
                const s = nextSection();
                return (
                    <motion.section
                        className="project-section solution-section"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <SectionIndex caseIndex={ci} sectionIndex={s} title="Final Solution" />
                        <h2 className="section-title">{project.solution.title}</h2>
                        <SectionTag sectionIndex={s} version="2.1" />
                        <p className="section-description">{project.solution.description}</p>

                        {project.solution.features?.length > 0 && (
                            <div className="features-list">
                                {project.solution.features.map((feature, i) => (
                                    <motion.div
                                        key={feature.id || i}
                                        className="feature-item"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                    >
                                        <h3 className="feature-title">{feature.title}</h3>
                                        <p className="feature-description">{feature.description}</p>
                                        {feature.why && (
                                            <p className="feature-why"><strong>Why:</strong> {feature.why}</p>
                                        )}
                                        {feature.image && (
                                            <div className="feature-image">
                                                <FigLabel index={nextImage()} />
                                                <img src={feature.image} alt={feature.title} />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {project.solution.images?.length > 0 && (
                            <ImageGallery images={project.solution.images} startIndex={imageNum} onCount={(n) => { imageNum += n; }} />
                        )}

                        {project.solution.prototype && (
                            <PrototypeEmbed prototype={project.solution.prototype} />
                        )}
                    </motion.section>
                );
            })()}

            {/* Validation & Testing */}
            {project.validation && (() => {
                const s = nextSection();
                return (
                    <motion.section
                        className="project-section validation-section"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <SectionIndex caseIndex={ci} sectionIndex={s} title="Validation" />
                        <h2 className="section-title">{project.validation.title}</h2>
                        <SectionTag sectionIndex={s} version="2.0" />
                        <p className="section-description">{project.validation.description}</p>

                        {project.validation.method && (
                            <p className="validation-method">
                                <strong>Method:</strong> {project.validation.method}
                                {project.validation.participantCount && ` • ${project.validation.participantCount} participants`}
                            </p>
                        )}

                        {project.validation.quotes?.length > 0 && (
                            <div className="quotes-list">
                                {project.validation.quotes.map((quote, i) => (
                                    <motion.blockquote
                                        key={i}
                                        className="validation-quote"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                    >
                                        <p className="quote-text">"{quote.text || quote.quote}"</p>
                                        {(quote.author || quote.attribution) && (
                                            <cite className="quote-author">— {quote.author || quote.attribution}</cite>
                                        )}
                                    </motion.blockquote>
                                ))}
                            </div>
                        )}

                        {project.validation.outcomes?.length > 0 && (
                            <div className="validation-outcomes">
                                <h3 className="subsection-title">Outcomes</h3>
                                <ul className="outcomes-list">
                                    {project.validation.outcomes.map((o, i) => (
                                        <li key={i} className="outcome-item">{o}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.section>
                );
            })()}

            {/* What I Learned */}
            {project.learnings && (() => {
                const s = nextSection();
                return (
                    <motion.section
                        className="project-section learnings-section"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <SectionIndex caseIndex={ci} sectionIndex={s} title="Learnings" />
                        <h2 className="section-title">{project.learnings.title}</h2>
                        <SectionTag sectionIndex={s} />

                        {project.learnings.insights?.length > 0 && (
                            <div className="insights-list">
                                {project.learnings.insights.map((insight, i) => (
                                    <motion.div
                                        key={i}
                                        className="insight-item"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                    >
                                        <h3 className="insight-title">{insight.title}</h3>
                                        <p className="insight-description">{insight.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.section>
                );
            })()}

            {/* Where It Evolves */}
            {project.evolution && <EvolutionSection evolution={project.evolution} />}

            {/* Final Experience/Prototype */}
            {project.finalExperience && (() => {
                const s = nextSection();
                return (
                    <motion.section
                        className="project-section final-experience-section"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <SectionIndex caseIndex={ci} sectionIndex={s} title="Final Experience" />
                        <h2 className="section-title">Complete Prototype</h2>
                        <SectionTag sectionIndex={s} />
                        {project.finalExperience.intro && (
                            <p className="section-description">{project.finalExperience.intro}</p>
                        )}
                        {project.finalExperience.prototype && (
                            <PrototypeEmbed prototype={project.finalExperience.prototype} />
                        )}
                    </motion.section>
                );
            })()}

            {/* Impact */}
            {project.outcomes && (() => {
                const s = nextSection();
                return (
                    <motion.section
                        className="project-section outcomes-section"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <SectionIndex caseIndex={ci} sectionIndex={s} title="Impact" />
                        <h2 className="section-title">{project.outcomes.title}</h2>
                        <SectionTag sectionIndex={s} />
                        <p className="section-description">{project.outcomes.description}</p>

                        {project.outcomes.metrics?.length > 0 && (
                            <div className="outcomes-metrics">
                                {project.outcomes.metrics.map((metric, i) => (
                                    <motion.div
                                        key={i}
                                        className="outcome-metric"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                    >
                                        <div className="metric-value">{metric.value}</div>
                                        <div className="metric-label">{metric.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.section>
                );
            })()}
        </div>
    );
};

// Reusable Image Gallery Component with FIG.XX labels
const ImageGallery = ({ images, startIndex = 0, onCount }) => {
    if (!images || images.length === 0) return null;

    // Report image count to parent for counter tracking
    if (onCount) onCount(images.length);

    return (
        <div className="section-images">
            {images.map((img, index) => (
                <motion.div
                    key={index}
                    className="section-image"
                    initial={{
                        opacity: 0,
                        y: 40,
                        rotate: index % 2 === 0 ? -1 : 1,
                    }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                        duration: 0.7,
                        delay: index * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{
                        scale: 1.01,
                        rotate: index % 2 === 0 ? 0.5 : -0.5,
                        transition: {
                            duration: 0.4,
                            ease: [0.16, 1, 0.3, 1],
                        },
                    }}
                >
                    <FigLabel index={startIndex + index + 1} />
                    <motion.div
                        className="section-image-overlay"
                        initial={{ opacity: 0 }}
                        whileHover={{
                            opacity: 1,
                            transition: { duration: 0.3 },
                        }}
                    />
                    <img
                        src={img.src}
                        alt={img.alt}
                    />
                    {img.caption && (
                        <p className="image-caption">{img.caption}</p>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

// Reusable Prototype Embed Component
const PrototypeEmbed = ({ prototype }) => {
    if (!prototype) return null;

    return (
        <motion.div
            className="prototype-embed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            {prototype.description && (
                <p className="prototype-description">{prototype.description}</p>
            )}

            {/* Figma Embed (if embed_url exists) */}
            {prototype.embed_url && (
                <div className="prototype-iframe-container">
                    <iframe
                        src={prototype.embed_url}
                        className="prototype-iframe"
                        allowFullScreen
                        title="Interactive Prototype"
                    />
                </div>
            )}

            {/* Fallback to URL link if no embed */}
            {!prototype.embed_url && prototype.url && (
                <a
                    href={prototype.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="prototype-link"
                >
                    <span>View Prototype</span>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                    >
                        <path
                            d="M6 3h7v7M13 3L3 13"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </a>
            )}
        </motion.div>
    );
};

// Reusable IndexedSection with micro-index labels and FIG.XX images
const IndexedSection = ({ caseIndex, sectionIndex, name, title, description, images, imageStartIndex = 0, onImageCount }) => (
    <motion.section
        className="project-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
    >
        <SectionIndex caseIndex={caseIndex} sectionIndex={sectionIndex} title={name} />
        <h2 className="section-title">{title}</h2>
        <SectionTag sectionIndex={sectionIndex} version="2.0" />
        <p className="section-description">{description}</p>

        {images && images.length > 0 && (
            <ImageGallery images={images} startIndex={imageStartIndex} onCount={onImageCount} />
        )}
    </motion.section>
);

export default ProjectDetail;
