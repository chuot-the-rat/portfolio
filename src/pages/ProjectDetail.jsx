import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getProjectById } from "../utils/projectDataMapper";
import PivotSection from "../components/PivotSection";
import PivotDiagram from "../components/PivotDiagram";
import WeightLiftedPivot from "../components/WeightLiftedPivot";
import ClaritySubtractionScene from "../components/ClaritySubtractionScene";
import {
    SectionIndex,
    SectionTag,
    ScrollProgress,
    FigLabel,
} from "../components/MicroIndex";
import EvolutionSection from "../components/EvolutionSection";
import FigmaEmbed from "../components/FigmaEmbed";
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

            // Try to fetch supplemental data (rich sections from local data.json)
            fetch(`/projects/${id}/data.json`)
                .then((res) => (res.ok ? res.json() : null))
                .then((localData) => {
                    if (localData) {
                        const merged = { ...projectData };
                        // Merge supplemental sections that don't exist in the mapper
                        const extras = [
                            "personas",
                            "userFlows",
                            "informationArchitecture",
                            "styleGuide",
                            "hifi",
                            "prototype",
                            "userTesting",
                            "finalPresentation",
                            "embeds",
                        ];
                        for (const key of extras) {
                            if (localData[key]) merged[key] = localData[key];
                        }
                        // Merge iterations rounds if present in local data
                        if (localData.iterations?.rounds) {
                            merged.iterations = {
                                ...merged.iterations,
                                ...localData.iterations,
                            };
                        }
                        setProject(merged);
                    } else {
                        setProject(projectData);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setProject(projectData);
                    setLoading(false);
                });
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

                    {/* Header CTAs */}
                    {(project.links?.live || project.links?.prototype) && (
                        <div className="project-hero-ctas">
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
                            {project.links?.prototype && (
                                <motion.a
                                    href={project.links.prototype}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-cta-link secondary"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                    whileHover={{
                                        y: -2,
                                        transition: { duration: 0.2 },
                                    }}
                                >
                                    <span>Try Prototype</span>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M4 2l10 6-10 6V2z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </motion.a>
                            )}
                        </div>
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
            {project.overview &&
                (() => {
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
                            onImageCount={(n) => {
                                imageNum += n;
                            }}
                        />
                    );
                })()}

            {/* Research */}
            {project.research &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section research-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Research"
                            />
                            <h2 className="section-title">
                                {project.research.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {project.research.description}
                            </p>

                            {project.research.methods?.length > 0 && (
                                <div className="research-methods">
                                    <h3 className="subsection-title">
                                        Methods
                                    </h3>
                                    <ul className="methods-list">
                                        {project.research.methods.map(
                                            (method, i) => (
                                                <li
                                                    key={i}
                                                    className="method-item"
                                                >
                                                    {method}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {project.research.keyFindings?.length > 0 && (
                                <div className="research-findings">
                                    <h3 className="subsection-title">
                                        Key Findings
                                    </h3>
                                    <ul className="findings-list">
                                        {project.research.keyFindings.map(
                                            (finding, i) => (
                                                <motion.li
                                                    key={i}
                                                    className="finding-item"
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: i * 0.1,
                                                    }}
                                                >
                                                    <span className="finding-icon">
                                                        →
                                                    </span>
                                                    <span>{finding}</span>
                                                </motion.li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {project.research.participantCount && (
                                <p className="participant-count">
                                    <strong>
                                        {project.research.participantCount}
                                    </strong>{" "}
                                    participants
                                </p>
                            )}

                            {project.research.reflection && (
                                <blockquote className="research-reflection">
                                    {project.research.reflection}
                                </blockquote>
                            )}

                            {project.research.images?.length > 0 && (
                                <ImageGallery
                                    images={project.research.images}
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Problem (legacy) */}
            {!project.research &&
                project.problem &&
                (() => {
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
                            onImageCount={(n) => {
                                imageNum += n;
                            }}
                        />
                    );
                })()}

            {/* ── Personas ── */}
            {project.personas &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section personas-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Personas"
                            />
                            <h2 className="section-title">
                                {project.personas.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {project.personas.description}
                            </p>

                            {project.personas.prototypeLink && (
                                <FigmaEmbed
                                    linkOnly
                                    caption="View full personas in Figma"
                                    prototypeLink={
                                        project.personas.prototypeLink
                                    }
                                />
                            )}

                            {project.personas.images?.length > 0 &&
                                project.personas.images.map((img, i) => (
                                    <div
                                        key={i}
                                        className="persona-image"
                                        style={{ position: "relative" }}
                                    >
                                        <FigLabel index={nextImage()} />
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                        </motion.section>
                    );
                })()}

            {/* ── User Flows ── */}
            {project.userFlows &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section userflows-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="User Flows"
                            />
                            <h2 className="section-title">
                                {project.userFlows.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {project.userFlows.description}
                            </p>

                            {project.userFlows.flows?.length > 0 && (
                                <div className="flows-list">
                                    {project.userFlows.flows.map((flow, i) => (
                                        <motion.div
                                            key={i}
                                            className="flow-card"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.5,
                                                delay: i * 0.1,
                                            }}
                                        >
                                            <h3 className="flow-name">
                                                {flow.name}
                                            </h3>
                                            {flow.description && (
                                                <p className="flow-description">
                                                    {flow.description}
                                                </p>
                                            )}
                                            {flow.steps?.length > 0 && (
                                                <div className="flow-steps">
                                                    {flow.steps.map(
                                                        (step, j) => (
                                                            <span
                                                                key={j}
                                                                className="flow-step"
                                                            >
                                                                {step}
                                                                {j <
                                                                    flow.steps
                                                                        .length -
                                                                        1 && (
                                                                    <span className="flow-arrow">
                                                                        →
                                                                    </span>
                                                                )}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {project.userFlows.images?.length > 0 && (
                                <ImageGallery
                                    images={project.userFlows.images}
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* ── Information Architecture ── */}
            {project.informationArchitecture &&
                (() => {
                    const s = nextSection();
                    return (
                        <IndexedSection
                            caseIndex={ci}
                            sectionIndex={s}
                            name="IA"
                            title={project.informationArchitecture.title}
                            description={
                                project.informationArchitecture.description
                            }
                            images={project.informationArchitecture.images}
                            imageStartIndex={imageNum}
                            onImageCount={(n) => {
                                imageNum += n;
                            }}
                        />
                    );
                })()}

            {/* Lo-Fi Exploration */}
            {project.lofi &&
                (() => {
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
                            onImageCount={(n) => {
                                imageNum += n;
                            }}
                        />
                    );
                })()}

            {/* ── Style Guide ── */}
            {project.styleGuide &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section styleguide-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Style Guide"
                            />
                            <h2 className="section-title">
                                {project.styleGuide.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {project.styleGuide.description}
                            </p>

                            {project.styleGuide.embed && (
                                <FigmaEmbed
                                    src={project.styleGuide.embed.src}
                                    title={project.styleGuide.embed.title}
                                    type="figma-design"
                                    caption="Typography, color palette, and component library"
                                />
                            )}

                            {project.styleGuide.principles?.length > 0 && (
                                <div className="styleguide-principles">
                                    <h3 className="subsection-title">
                                        Design Principles
                                    </h3>
                                    <div className="principles-grid">
                                        {project.styleGuide.principles.map(
                                            (p, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="principle-card"
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
                                                        delay: i * 0.1,
                                                    }}
                                                >
                                                    <h4 className="principle-name">
                                                        {p.name}
                                                    </h4>
                                                    <p className="principle-description">
                                                        {p.description}
                                                    </p>
                                                </motion.div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {project.styleGuide.typography && (
                                <div className="styleguide-typography">
                                    <h3 className="subsection-title">
                                        Typography
                                    </h3>
                                    {project.styleGuide.typography.scale
                                        ?.length > 0 && (
                                        <div className="type-scale">
                                            {project.styleGuide.typography.scale.map(
                                                (t, i) => (
                                                    <div
                                                        key={i}
                                                        className="type-scale-row"
                                                    >
                                                        <span className="type-scale-name">
                                                            {t.name}
                                                        </span>
                                                        <span className="type-scale-size">
                                                            {t.size} /{" "}
                                                            {t.weight}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {project.styleGuide.colors && (
                                <div className="styleguide-colors">
                                    <h3 className="subsection-title">
                                        Color Palette
                                    </h3>
                                    <div className="color-swatches">
                                        {Object.values(
                                            project.styleGuide.colors,
                                        ).map((color, i) => (
                                            <div
                                                key={i}
                                                className="color-swatch"
                                            >
                                                <div
                                                    className="color-swatch-preview"
                                                    style={{
                                                        backgroundColor:
                                                            color.hex,
                                                    }}
                                                />
                                                <span className="color-swatch-name">
                                                    {color.name}
                                                </span>
                                                <span className="color-swatch-hex">
                                                    {color.hex}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {project.styleGuide.components?.length > 0 && (
                                <div className="styleguide-components">
                                    <h3 className="subsection-title">
                                        Components
                                    </h3>
                                    <div className="components-list">
                                        {project.styleGuide.components.map(
                                            (comp, i) => (
                                                <div
                                                    key={i}
                                                    className="component-item"
                                                >
                                                    <h4 className="component-name">
                                                        {comp.name}
                                                    </h4>
                                                    <p className="component-desc">
                                                        {comp.description}
                                                    </p>
                                                    {comp.variants?.length >
                                                        0 && (
                                                        <div className="component-variants">
                                                            {comp.variants.map(
                                                                (v, j) => (
                                                                    <span
                                                                        key={j}
                                                                        className="variant-tag"
                                                                    >
                                                                        {v}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {project.styleGuide.images?.length > 0 && (
                                <ImageGallery
                                    images={project.styleGuide.images}
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Challenges & Pivots */}
            {project.challenges &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section challenges-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Challenges"
                            />
                            <h2 className="section-title">
                                {project.challenges.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {project.challenges.description}
                            </p>

                            {project.challenges.pivots?.length > 0 && (
                                <PivotDiagram
                                    pivots={project.challenges.pivots}
                                />
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

            {/* Iterations & Refinements (supports both improvements and rounds) */}
            {project.iterations &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Iterations"
                            />
                            <h2 className="section-title">
                                {project.iterations.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.1"
                            />
                            <p className="section-description">
                                {project.iterations.description}
                            </p>

                            {/* Rounds-based iterations (from local data) */}
                            {project.iterations.rounds?.length > 0 && (
                                <div className="iteration-rounds">
                                    {project.iterations.rounds.map(
                                        (round, i) => (
                                            <motion.div
                                                key={i}
                                                className="iteration-round"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.1,
                                                }}
                                            >
                                                <h3 className="round-title">
                                                    Round {round.round}
                                                    {round.focus && (
                                                        <span className="round-focus">
                                                            {" "}
                                                            — {round.focus}
                                                        </span>
                                                    )}
                                                </h3>
                                                {round.findings?.length > 0 && (
                                                    <div className="round-findings">
                                                        <h4 className="round-sub-label">
                                                            Findings
                                                        </h4>
                                                        <ul className="findings-list">
                                                            {round.findings.map(
                                                                (f, j) => (
                                                                    <li
                                                                        key={j}
                                                                        className="finding-item"
                                                                    >
                                                                        <span className="finding-icon">
                                                                            →
                                                                        </span>
                                                                        <span>
                                                                            {f}
                                                                        </span>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                                {round.changes?.length > 0 && (
                                                    <div className="round-changes">
                                                        <h4 className="round-sub-label">
                                                            Changes Made
                                                        </h4>
                                                        <ul className="objectives-list">
                                                            {round.changes.map(
                                                                (c, j) => (
                                                                    <li
                                                                        key={j}
                                                                        className="objective-item"
                                                                    >
                                                                        <span className="objective-icon">
                                                                            ✓
                                                                        </span>
                                                                        <span className="objective-text">
                                                                            {c}
                                                                        </span>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            )}

                            {/* Legacy improvements list */}
                            {!project.iterations.rounds &&
                                project.iterations.improvements && (
                                    <ul className="objectives-list">
                                        {project.iterations.improvements.map(
                                            (imp, i) => (
                                                <motion.li
                                                    key={i}
                                                    className="objective-item"
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: i * 0.1,
                                                    }}
                                                >
                                                    <span className="objective-icon">
                                                        ✓
                                                    </span>
                                                    <span className="objective-text">
                                                        {imp}
                                                    </span>
                                                </motion.li>
                                            ),
                                        )}
                                    </ul>
                                )}

                            {project.iterations.images?.length > 0 && (
                                <ImageGallery
                                    images={project.iterations.images}
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                            {project.iterations.prototype && (
                                <PrototypeEmbed
                                    prototype={project.iterations.prototype}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* ── High-Fidelity Mockups ── */}
            {project.hifi &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section hifi-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Hi-Fi"
                            />
                            <h2 className="section-title">
                                {project.hifi.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {project.hifi.description}
                            </p>

                            {project.hifi.embed && (
                                <FigmaEmbed
                                    src={project.hifi.embed.src}
                                    title={project.hifi.embed.title}
                                    type="figma-design"
                                />
                            )}

                            {project.hifi.screens?.length > 0 && (
                                <div className="hifi-screens accordion-group">
                                    {project.hifi.screens.map((screen, i) => (
                                        <HifiAccordion
                                            key={i}
                                            screen={screen}
                                            index={i}
                                            figIndex={nextImage()}
                                        />
                                    ))}
                                </div>
                            )}

                            {project.hifi.improvements?.length > 0 && (
                                <div className="hifi-improvements">
                                    <h3 className="subsection-title">
                                        Key Improvements
                                    </h3>
                                    <ul className="objectives-list">
                                        {project.hifi.improvements.map(
                                            (imp, i) => (
                                                <motion.li
                                                    key={i}
                                                    className="objective-item"
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: i * 0.1,
                                                    }}
                                                >
                                                    <span className="objective-icon">
                                                        ✓
                                                    </span>
                                                    <span className="objective-text">
                                                        {imp}
                                                    </span>
                                                </motion.li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {project.hifi.images?.length > 0 && (
                                <ImageGallery
                                    images={project.hifi.images}
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Development Approach */}
            {project.development &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section development-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Development"
                            />
                            <h2 className="section-title">
                                {project.development.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {project.development.description}
                            </p>

                            {project.development.technicalDecisions?.length >
                                0 && (
                                <div className="technical-decisions">
                                    <h3 className="subsection-title">
                                        Technical Decisions
                                    </h3>
                                    <ul className="decisions-list">
                                        {project.development.technicalDecisions.map(
                                            (decision, i) => (
                                                <motion.li
                                                    key={i}
                                                    className="decision-item"
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: i * 0.1,
                                                    }}
                                                >
                                                    <span className="decision-icon">
                                                        ✓
                                                    </span>
                                                    <span>{decision}</span>
                                                </motion.li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {project.development.constraints?.length > 0 && (
                                <div className="development-constraints">
                                    <h3 className="subsection-title">
                                        Constraints
                                    </h3>
                                    <ul className="constraints-list">
                                        {project.development.constraints.map(
                                            (c, i) => (
                                                <li
                                                    key={i}
                                                    className="constraint-item"
                                                >
                                                    {c}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}
                        </motion.section>
                    );
                })()}

            {/* ── Interactive Prototype ── */}
            {project.prototype &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section prototype-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Prototype"
                            />
                            <h2 className="section-title">
                                {project.prototype.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {project.prototype.description}
                            </p>

                            {project.prototype.link && (
                                <FigmaEmbed
                                    linkOnly
                                    caption="Try the interactive prototype"
                                    prototypeLink={project.prototype.link}
                                />
                            )}

                            {project.prototype.flows?.length > 0 && (
                                <div className="prototype-flows">
                                    <h3 className="subsection-title">
                                        Core Flows
                                    </h3>
                                    <ul className="objectives-list">
                                        {project.prototype.flows.map(
                                            (flow, i) => (
                                                <motion.li
                                                    key={i}
                                                    className="objective-item"
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: i * 0.1,
                                                    }}
                                                >
                                                    <span className="objective-icon">
                                                        →
                                                    </span>
                                                    <span className="objective-text">
                                                        {flow}
                                                    </span>
                                                </motion.li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {project.prototype.images?.length > 0 && (
                                <ImageGallery
                                    images={project.prototype.images}
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* ── Usability Testing ── */}
            {project.userTesting &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section usability-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Testing"
                            />
                            <h2 className="section-title">
                                {project.userTesting.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {project.userTesting.description}
                            </p>

                            {/* Test report links */}
                            {project.userTesting.reportLinks && (
                                <div className="test-report-links">
                                    {project.userTesting.reportLinks.lofi && (
                                        <FigmaEmbed
                                            linkOnly
                                            caption="Lo-fi usability test report"
                                            prototypeLink={
                                                project.userTesting.reportLinks
                                                    .lofi
                                            }
                                        />
                                    )}
                                    {project.userTesting.reportLinks.hifi && (
                                        <FigmaEmbed
                                            linkOnly
                                            caption="Hi-fi usability test report"
                                            prototypeLink={
                                                project.userTesting.reportLinks
                                                    .hifi
                                            }
                                        />
                                    )}
                                </div>
                            )}

                            {/* Testing rounds */}
                            {project.userTesting.rounds?.length > 0 && (
                                <div className="testing-rounds">
                                    {project.userTesting.rounds.map(
                                        (round, i) => (
                                            <motion.div
                                                key={i}
                                                className="testing-round"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.15,
                                                }}
                                            >
                                                <h3 className="round-title">
                                                    Round {round.round}
                                                    {round.stage && (
                                                        <span className="round-focus">
                                                            {" "}
                                                            — {round.stage}
                                                        </span>
                                                    )}
                                                </h3>
                                                <div className="round-meta">
                                                    {round.participants && (
                                                        <span>
                                                            {round.participants}{" "}
                                                            participants
                                                        </span>
                                                    )}
                                                    {round.tool && (
                                                        <span>
                                                            {round.tool}
                                                        </span>
                                                    )}
                                                    {round.taskCompletionRate && (
                                                        <span>
                                                            Completion:{" "}
                                                            {
                                                                round.taskCompletionRate
                                                            }
                                                        </span>
                                                    )}
                                                </div>

                                                {round.tasks?.length > 0 && (
                                                    <div className="round-tasks">
                                                        <h4 className="round-sub-label">
                                                            Tasks
                                                        </h4>
                                                        <ul className="objectives-list">
                                                            {round.tasks.map(
                                                                (t, j) => (
                                                                    <li
                                                                        key={j}
                                                                        className="objective-item"
                                                                    >
                                                                        <span className="objective-icon">
                                                                            →
                                                                        </span>
                                                                        <span className="objective-text">
                                                                            {t}
                                                                        </span>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}

                                                {round.findings?.length > 0 && (
                                                    <div className="round-findings">
                                                        <h4 className="round-sub-label">
                                                            Findings
                                                        </h4>
                                                        <div className="findings-table">
                                                            {round.findings.map(
                                                                (f, j) => (
                                                                    <div
                                                                        key={j}
                                                                        className="finding-row"
                                                                    >
                                                                        <span
                                                                            className={`finding-severity finding-severity--${f.severity}`}
                                                                        >
                                                                            {
                                                                                f.severity
                                                                            }
                                                                        </span>
                                                                        <div className="finding-detail">
                                                                            <p className="finding-text">
                                                                                {
                                                                                    f.finding
                                                                                }
                                                                            </p>
                                                                            {f.change && (
                                                                                <p className="finding-change">
                                                                                    →{" "}
                                                                                    {
                                                                                        f.change
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            )}

                            {/* Metrics summary */}
                            {project.userTesting.metrics && (
                                <div className="testing-metrics">
                                    <h3 className="subsection-title">
                                        Results
                                    </h3>
                                    <div className="metrics-row">
                                        {Object.entries(
                                            project.userTesting.metrics,
                                        ).map(([key, value], i) => (
                                            <motion.div
                                                key={key}
                                                className="metric-card"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.1,
                                                }}
                                            >
                                                <div className="metric-value">
                                                    {value}
                                                </div>
                                                <div className="metric-label">
                                                    {key.replace(
                                                        /([A-Z])/g,
                                                        " $1",
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {project.userTesting.images?.length > 0 && (
                                <ImageGallery
                                    images={project.userTesting.images}
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* ── Final Presentation ── */}
            {project.finalPresentation &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section presentation-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Presentation"
                            />
                            <h2 className="section-title">
                                {project.finalPresentation.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            {project.finalPresentation.description && (
                                <p className="section-description">
                                    {project.finalPresentation.description}
                                </p>
                            )}

                            {project.finalPresentation.embed && (
                                <FigmaEmbed
                                    src={project.finalPresentation.embed.src}
                                    title={
                                        project.finalPresentation.embed.title
                                    }
                                    type="figma-slides"
                                    caption="Complete design journey from research to final solution"
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Objectives (legacy) */}
            {!project.iterations &&
                project.objectives?.length > 0 &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Objectives"
                            />
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
                                        transition={{
                                            duration: 0.4,
                                            delay: i * 0.1,
                                        }}
                                    >
                                        <span className="objective-icon">
                                            ✓
                                        </span>
                                        <span className="objective-text">
                                            {obj}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.section>
                    );
                })()}

            {/* Solution */}
            {project.solution &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section solution-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Final Solution"
                            />
                            <h2 className="section-title">
                                {project.solution.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.1"
                            />
                            <p className="section-description">
                                {project.solution.description}
                            </p>

                            {project.solution.features?.length > 0 && (
                                <div className="features-list">
                                    {project.solution.features.map(
                                        (feature, i) => (
                                            <motion.div
                                                key={feature.id || i}
                                                className="feature-item"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.1,
                                                }}
                                            >
                                                <h3 className="feature-title">
                                                    {feature.title}
                                                </h3>
                                                <p className="feature-description">
                                                    {feature.description}
                                                </p>
                                                {feature.why && (
                                                    <p className="feature-why">
                                                        <strong>Why:</strong>{" "}
                                                        {feature.why}
                                                    </p>
                                                )}
                                                {feature.image && (
                                                    <div className="feature-image">
                                                        <FigLabel
                                                            index={nextImage()}
                                                        />
                                                        <img
                                                            src={feature.image}
                                                            alt={feature.title}
                                                        />
                                                    </div>
                                                )}
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            )}

                            {project.solution.images?.length > 0 && (
                                <ImageGallery
                                    images={project.solution.images}
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}

                            {project.solution.prototype && (
                                <PrototypeEmbed
                                    prototype={project.solution.prototype}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Validation & Testing */}
            {project.validation &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section validation-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Validation"
                            />
                            <h2 className="section-title">
                                {project.validation.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {project.validation.description}
                            </p>

                            {project.validation.method && (
                                <p className="validation-method">
                                    <strong>Method:</strong>{" "}
                                    {project.validation.method}
                                    {project.validation.participantCount &&
                                        ` • ${project.validation.participantCount} participants`}
                                </p>
                            )}

                            {project.validation.quotes?.length > 0 && (
                                <div className="quotes-list">
                                    {project.validation.quotes.map(
                                        (quote, i) => (
                                            <motion.blockquote
                                                key={i}
                                                className="validation-quote"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.1,
                                                }}
                                            >
                                                <p className="quote-text">
                                                    "{quote.text || quote.quote}
                                                    "
                                                </p>
                                                {(quote.author ||
                                                    quote.attribution) && (
                                                    <cite className="quote-author">
                                                        —{" "}
                                                        {quote.author ||
                                                            quote.attribution}
                                                    </cite>
                                                )}
                                            </motion.blockquote>
                                        ),
                                    )}
                                </div>
                            )}

                            {project.validation.outcomes?.length > 0 && (
                                <div className="validation-outcomes">
                                    <h3 className="subsection-title">
                                        Outcomes
                                    </h3>
                                    <ul className="outcomes-list">
                                        {project.validation.outcomes.map(
                                            (o, i) => (
                                                <li
                                                    key={i}
                                                    className="outcome-item"
                                                >
                                                    {o}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}
                        </motion.section>
                    );
                })()}

            {/* What I Learned */}
            {project.learnings &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section learnings-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Learnings"
                            />
                            <h2 className="section-title">
                                {project.learnings.title}
                            </h2>
                            <SectionTag sectionIndex={s} />

                            {project.learnings.insights?.length > 0 && (
                                <div className="insights-list">
                                    {project.learnings.insights.map(
                                        (insight, i) => (
                                            <motion.div
                                                key={i}
                                                className="insight-item"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.1,
                                                }}
                                            >
                                                <h3 className="insight-title">
                                                    {insight.title}
                                                </h3>
                                                <p className="insight-description">
                                                    {insight.description}
                                                </p>
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            )}
                        </motion.section>
                    );
                })()}

            {/* Where It Evolves */}
            {project.evolution && (
                <EvolutionSection evolution={project.evolution} />
            )}

            {/* Final Experience/Prototype */}
            {project.finalExperience &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section final-experience-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Final Experience"
                            />
                            <h2 className="section-title">
                                Complete Prototype
                            </h2>
                            <SectionTag sectionIndex={s} />
                            {project.finalExperience.intro && (
                                <p className="section-description">
                                    {project.finalExperience.intro}
                                </p>
                            )}
                            {project.finalExperience.prototype && (
                                <PrototypeEmbed
                                    prototype={
                                        project.finalExperience.prototype
                                    }
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Impact */}
            {project.outcomes &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section outcomes-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Impact"
                            />
                            <h2 className="section-title">
                                {project.outcomes.title}
                            </h2>
                            <SectionTag sectionIndex={s} />
                            <p className="section-description">
                                {project.outcomes.description}
                            </p>

                            {project.outcomes.metrics?.length > 0 && (
                                <div className="outcomes-metrics">
                                    {project.outcomes.metrics.map(
                                        (metric, i) => (
                                            <motion.div
                                                key={i}
                                                className="outcome-metric"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.1,
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
                    );
                })()}
        </div>
    );
};

// Reusable Image Gallery Component with FIG.XX labels
// Shows all images stacked for ≤2 images; slideshow carousel for 3+
const ImageGallery = ({ images, startIndex = 0, onCount }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    if (!images || images.length === 0) return null;

    // Report image count to parent for counter tracking
    if (onCount) onCount(images.length);

    // ≤2 images: render stacked (original behavior)
    if (images.length <= 2) {
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
    }

    // 3+ images: clickthrough slideshow
    const prev = () =>
        setCurrentSlide((s) => (s === 0 ? images.length - 1 : s - 1));
    const next = () =>
        setCurrentSlide((s) => (s === images.length - 1 ? 0 : s + 1));
    const img = images[currentSlide];

    return (
        <motion.div
            className="image-carousel"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
        >
            <div className="carousel-viewport">
                <FigLabel index={startIndex + currentSlide + 1} />
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentSlide}
                        src={img.src}
                        alt={img.alt}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </AnimatePresence>
            </div>

            <div className="carousel-controls">
                <button
                    className="carousel-btn"
                    onClick={prev}
                    aria-label="Previous image"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <path
                            d="M12 4L6 10l6 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <span className="carousel-counter">
                    {currentSlide + 1} / {images.length}
                </span>

                <button
                    className="carousel-btn"
                    onClick={next}
                    aria-label="Next image"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <path
                            d="M8 4l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            {img.caption && <p className="image-caption">{img.caption}</p>}

            {/* Dot indicators */}
            <div className="carousel-dots">
                {images.map((_, i) => (
                    <button
                        key={i}
                        className={`carousel-dot ${i === currentSlide ? "active" : ""}`}
                        onClick={() => setCurrentSlide(i)}
                        aria-label={`Go to image ${i + 1}`}
                    />
                ))}
            </div>
        </motion.div>
    );
};

// Accordion item for Hi-Fi screens — click name to reveal image
const HifiAccordion = ({ screen, index, figIndex }) => {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            className={`accordion-item ${open ? "accordion-open" : ""}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
        >
            <button
                className="accordion-trigger"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                <span className="accordion-label">{screen.name}</span>
                <motion.span
                    className="accordion-chevron"
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                    >
                        <path
                            d="M4 6l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        className="accordion-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="accordion-content">
                            {screen.description && (
                                <p className="accordion-desc">
                                    {screen.description}
                                </p>
                            )}
                            {screen.image && (
                                <div className="hifi-screen-image">
                                    <FigLabel index={figIndex} />
                                    <img
                                        src={screen.image}
                                        alt={screen.name}
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
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
const IndexedSection = ({
    caseIndex,
    sectionIndex,
    name,
    title,
    description,
    images,
    imageStartIndex = 0,
    onImageCount,
}) => (
    <motion.section
        className="project-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
    >
        <SectionIndex
            caseIndex={caseIndex}
            sectionIndex={sectionIndex}
            title={name}
        />
        <h2 className="section-title">{title}</h2>
        <SectionTag
            sectionIndex={sectionIndex}
            version="2.0"
        />
        <p className="section-description">{description}</p>

        {images && images.length > 0 && (
            <ImageGallery
                images={images}
                startIndex={imageStartIndex}
                onCount={onImageCount}
            />
        )}
    </motion.section>
);

export default ProjectDetail;
