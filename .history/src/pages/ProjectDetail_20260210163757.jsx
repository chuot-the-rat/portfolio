import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProjectById } from "../utils/projectDataMapper";
import "./ProjectDetail.css";

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

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
                            <span className="meta-value">{project.team || `${project.teamSize} members`}</span>
                        </div>
                        {project.context && (
                            <div className="project-meta-item">
                                <span className="meta-label">Context</span>
                                <span className="meta-value">{project.context}</span>
                            </div>
                        )}
                    </div>

                    {/* Responsibilities */}
                    {project.responsibilities && project.responsibilities.length > 0 && (
                        <div className="project-responsibilities">
                            <span className="meta-label">Key Responsibilities</span>
                            <ul className="responsibilities-list">
                                {project.responsibilities.map((resp, index) => (
                                    <li key={index} className="responsibility-item">{resp}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Tools - Categorized */}
                    {project.toolsCategories && Object.keys(project.toolsCategories).length > 0 && (
                        <div className="project-tools-categorized">
                            {Object.entries(project.toolsCategories).map(([category, tools]) => 
                                tools && tools.length > 0 ? (
                                    <div key={category} className="tools-category">
                                        <span className="tools-category-label">{category}</span>
                                        <div className="tools-category-items">
                                            {tools.map((tool, index) => (
                                                <span key={index} className="tool-tag">{tool}</span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </div>
                    )}

                    {/* Legacy tools display */}
                    {(!project.toolsCategories || Object.keys(project.toolsCategories).length === 0) && 
                     project.tools && project.tools.length > 0 && (
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
            <div className="project-content">
                <div className="container">
                    {/* Overview */}
                    {project.overview && (
                        <Section
                            label="01 — Overview"
                            title={project.overview.title}
                            description={project.overview.description}
                            images={project.overview.images}
                        />
                    )}

                    {/* Research (replaces Problem) */}
                    {project.research && (
                        <Section
                            label="02 — Research"
                            title={project.research.title}
                            description={project.research.description}
                            images={project.research.images}
                        />
                    )}

                    {/* Problem (legacy support) */}
                    {!project.research && project.problem && (
                        <Section
                            label="02 — Problem"
                            title={project.problem.title}
                            description={project.problem.description}
                            images={project.problem.images}
                        />
                    )}

                    {/* Challenges & Pivots */}
                    {project.challenges && (
                        <motion.section
                            className="project-section challenges-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="section-label">03 — Challenges</span>
                            <h2 className="section-title">{project.challenges.title}</h2>
                            <p className="section-description">{project.challenges.description}</p>
                            
                            {project.challenges.pivots && project.challenges.pivots.length > 0 && (
                                <div className="pivots-list">
                                    {project.challenges.pivots.map((pivot, index) => (
                                        <motion.div
                                            key={index}
                                            className="pivot-item"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <div className="pivot-from">
                                                <span className="pivot-label">From:</span>
                                                <span className="pivot-text">{pivot.from}</span>
                                            </div>
                                            <div className="pivot-arrow">→</div>
                                            <div className="pivot-to">
                                                <span className="pivot-label">To:</span>
                                                <span className="pivot-text">{pivot.to}</span>
                                            </div>
                                            <div className="pivot-reason">
                                                <span className="pivot-label">Why:</span>
                                                <span className="pivot-text">{pivot.reason}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.section>
                    )}

                    {/* Lo-Fi Exploration */}
                    {project.lofi && (
                        <Section
                            label="04 — Lo-Fi Exploration"
                            title={project.lofi.title}
                            description={project.lofi.description}
                            images={project.lofi.images}
                        />
                    )}

                    {/* Iterations & Refinements */}
                    {project.iterations && (
                        <motion.section
                            className="project-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="section-label">
                                05 — Iterations
                            </span>
                            <h2 className="section-title">
                                {project.iterations.title}
                            </h2>
                            <p className="section-description">
                                {project.iterations.description}
                            </p>
                            {project.iterations.improvements && (
                                <ul className="objectives-list">
                                    {project.iterations.improvements.map(
                                        (improvement, index) => (
                                            <motion.li
                                                key={index}
                                                className="objective-item"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: index * 0.1,
                                                }}
                                            >
                                                <span className="objective-icon">
                                                    ✓
                                                </span>
                                                <span className="objective-text">
                                                    {improvement}
                                                </span>
                                            </motion.li>
                                        ),
                                    )}
                                </ul>
                            )}
                            {project.iterations.images && project.iterations.images.length > 0 && (
                                <div className="section-images">
                                    {project.iterations.images.map((img, index) => (
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
                                            <img
                                                src={img.src}
                                                alt={img.alt}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.section>
                    )}

                    {/* Objectives (legacy support) */}
                    {!project.iterations &&
                        project.objectives &&
                        project.objectives.length > 0 && (
                            <motion.section
                                className="project-section"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="section-label">
                                    03 — Objectives
                                </span>
                                <h2 className="section-title">Goals</h2>
                                <ul className="objectives-list">
                                    {project.objectives.map(
                                        (objective, index) => (
                                            <motion.li
                                                key={index}
                                                className="objective-item"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: index * 0.1,
                                                }}
                                            >
                                                <span className="objective-icon">
                                                    ✓
                                                </span>
                                                <span className="objective-text">
                                                    {objective}
                                                </span>
                                            </motion.li>
                                        ),
                                    )}
                                </ul>
                            </motion.section>
                        )}

                    {/* Solution */}
                    {project.solution && (
                        <motion.section
                            className="project-section solution-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="section-label">06 — Final Solution</span>
                            <h2 className="section-title">{project.solution.title}</h2>
                            <p className="section-description">{project.solution.description}</p>
                            
                            {project.solution.features && project.solution.features.length > 0 && (
                                <div className="features-list">
                                    {project.solution.features.map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            className="feature-item"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <h3 className="feature-title">{feature.title}</h3>
                                            <p className="feature-description">{feature.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                            
                            {project.solution.images && project.solution.images.length > 0 && (
                                <div className="section-images">
                                    {project.solution.images.map((img, index) => (
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
                                            <img
                                                src={img.src}
                                                alt={img.alt}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.section>
                    )}

                    {/* Validation & Testing */}
                    {project.validation && (
                        <motion.section
                            className="project-section validation-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="section-label">07 — Validation</span>
                            <h2 className="section-title">{project.validation.title}</h2>
                            <p className="section-description">{project.validation.description}</p>
                            
                            {project.validation.quotes && project.validation.quotes.length > 0 && (
                                <div className="quotes-list">
                                    {project.validation.quotes.map((quote, index) => (
                                        <motion.blockquote
                                            key={index}
                                            className="validation-quote"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <p className="quote-text">"{quote.text || quote.quote}"</p>
                                            {(quote.author || quote.attribution) && (
                                                <cite className="quote-author">— {quote.author || quote.attribution}</cite>
                                            )}
                                        </motion.blockquote>
                                    ))}
                                </div>
                            )}
                        </motion.section>
                    )}

                    {/* What I Learned */}
                    {project.learnings && (
                        <motion.section
                            className="project-section learnings-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="section-label">08 — Learnings</span>
                            <h2 className="section-title">{project.learnings.title}</h2>
                            
                            {project.learnings.insights && project.learnings.insights.length > 0 && (
                                <div className="insights-list">
                                    {project.learnings.insights.map((insight, index) => (
                                        <motion.div
                                            key={index}
                                            className="insight-item"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <h3 className="insight-title">{insight.title}</h3>
                                            <p className="insight-description">{insight.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.section>
                    )}

                    {/* Next Steps */}
                    {project.nextSteps && (
                        <motion.section
                            className="project-section next-steps-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="section-label">09 — Next Steps</span>
                            <h2 className="section-title">{project.nextSteps.title}</h2>
                            
                            {project.nextSteps.items && project.nextSteps.items.length > 0 && (
                                <ul className="next-steps-list">
                                    {project.nextSteps.items.map((item, index) => (
                                        <motion.li
                                            key={index}
                                            className="next-step-item"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                        >
                                            <span className="step-icon">→</span>
                                            <span className="step-text">{item.item || item}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </motion.section>
                    )}

                    {/* Impact & Lessons Learned */}
                    {project.outcomes && (
                        <motion.section
                            className="project-section outcomes-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="section-label">06 — Impact</span>
                            <h2 className="section-title">
                                {project.outcomes.title}
                            </h2>
                            <p className="section-description">
                                {project.outcomes.description}
                            </p>

                            {project.outcomes.metrics &&
                                project.outcomes.metrics.length > 0 && (
                                    <div className="outcomes-metrics">
                                        {project.outcomes.metrics.map(
                                            (metric, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="outcome-metric"
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: index * 0.1,
                                                    }}
                                                >
                                                    <div className="metric-value">
                                                        {metric.value}
                                                    </div>
                                                    <div className="metric-label">
                                                        {metric.label}
                                                    </div>
                                                </motion.div>
                                            ),
                                        )}
                                    </div>
                                )}
                        </motion.section>
                    )}
                </div>
            </div>
        </div>
    );
};

// Reusable Section Component with Enhanced Micro-Interactions
const Section = ({ label, title, description, images }) => (
    <motion.section
        className="project-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
    >
        <span className="section-label">{label}</span>
        <h2 className="section-title">{title}</h2>
        <p className="section-description">{description}</p>

        {images && images.length > 0 && (
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
                    </motion.div>
                ))}
            </div>
        )}
    </motion.section>
);

// Compact Project Component - Minimal Editorial Layout
const CompactProject = ({ project }) => {
    return (
        <div className="project-detail compact-project">
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

            {/* Compact Hero */}
            <motion.section
                className="compact-hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <div className="container">
                    <div className="project-hero-meta">
                        <span className="project-tag">{project.category}</span>
                        <span className="project-year">{project.year}</span>
                    </div>

                    <h1 className="compact-title">{project.title}</h1>

                    {project.subtitle && (
                        <p className="compact-subtitle">{project.subtitle}</p>
                    )}

                    {/* CTA Links */}
                    {(project.links?.behance ||
                        project.links?.dribbble ||
                        project.links?.live) && (
                        <div className="compact-ctas">
                            {project.links.live && (
                                <motion.a
                                    href={project.links.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="compact-cta-link"
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span>View Project</span>
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
                            {project.links.behance && (
                                <motion.a
                                    href={project.links.behance}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="compact-cta-link secondary"
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span>Behance</span>
                                </motion.a>
                            )}
                            {project.links.dribbble && (
                                <motion.a
                                    href={project.links.dribbble}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="compact-cta-link secondary"
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span>Dribbble</span>
                                </motion.a>
                            )}
                        </div>
                    )}
                </div>
            </motion.section>

            {/* Hero Image with Free-Floating Layout */}
            {project.heroImage && (
                <motion.section
                    className="compact-hero-image"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <div className="container">
                        <motion.div
                            className="hero-image-wrapper"
                            whileHover={{
                                scale: 1.01,
                                rotate: 0.5,
                                transition: {
                                    duration: 0.4,
                                    ease: [0.16, 1, 0.3, 1],
                                },
                            }}
                        >
                            <img
                                src={project.heroImage.src}
                                alt={project.heroImage.alt}
                                className="hero-image"
                            />
                        </motion.div>
                    </div>
                </motion.section>
            )}

            {/* Description */}
            {project.description && (
                <motion.section
                    className="compact-description"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="container">
                        <p className="description-text">
                            {project.description}
                        </p>
                    </div>
                </motion.section>
            )}

            {/* Hover Preview Images - Free Floating */}
            {project.hoverImages && project.hoverImages.length > 0 && (
                <motion.section
                    className="compact-gallery"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="container">
                        <div className="gallery-grid">
                            {project.hoverImages.map((imgSrc, index) => (
                                <motion.div
                                    key={index}
                                    className="gallery-item"
                                    initial={{
                                        opacity: 0,
                                        y: 40,
                                        rotate: index % 2 === 0 ? -1 : 1,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                        rotate: 0,
                                    }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{
                                        duration: 0.7,
                                        delay: index * 0.1,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    whileHover={{
                                        scale: 1.02,
                                        rotate: index % 2 === 0 ? 0.5 : -0.5,
                                        transition: { duration: 0.3 },
                                    }}
                                >
                                    <motion.div
                                        className="gallery-overlay"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <img
                                        src={imgSrc}
                                        alt={`${project.title} preview ${index + 1}`}
                                        className="gallery-image"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>
            )}
        </div>
    );
};

export default ProjectDetail;
