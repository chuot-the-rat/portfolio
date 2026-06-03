import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SectionIndex, SectionTag, FigLabel } from "../MicroIndex";
import EvolutionSection from "../EvolutionSection";
import FigmaEmbed from "../FigmaEmbed";
import SimulationSection from "../../features/sim/SimulationSection";
import BrowserMockup from "./BrowserMockup";
import PrincipleVerdict from "./PrincipleVerdict";
import { caseStudyMotion } from "../../utils/motion/caseStudyMotion";
import {
    CASE_SECTION_FALLBACKS,
    dedupeAdjacentCopy,
    filterRedundantOutcomes,
    getNestedCopy,
    getSectionIntroCopy,
    getSectionWhyLine,
    getWhatChangedClose,
    toEditorialCopy,
    toSentenceCaseLine,
} from "../../utils/caseStudyCopy";
import {
    BeforeAfterComparisons,
    CaseStudyImage,
    PrototypeTabs,
} from "./ProjectDetailWidgets";

const ProjectContentMain = ({ project }) => {
    /* Mutable counters — increment as sections render */
    let sectionNum = 0;
    let imageNum = 0;
    const ci = project.caseIndex || 1;
    const nextSection = () => ++sectionNum;
    const nextImage = () => ++imageNum;
    const hasIterationComparisons =
        Array.isArray(project.iterations?.comparisons) &&
        project.iterations.comparisons.length > 0;
    const comparisonsForLofi = hasIterationComparisons
        ? []
        : project.lofi?.comparisons || [];
    const comparisonsForIterations = hasIterationComparisons
        ? project.iterations.comparisons
        : [];
    const sectionIntro = (sectionKey, value, options) =>
        getSectionIntroCopy(project, sectionKey, value, options);
    const nestedCopy = (nestedKey, value, options) =>
        getNestedCopy(project, nestedKey, value, options);
    const compactProblemDescription = sectionIntro(
        "problem",
        project.problem?.description,
        { maxSentences: 1, maxChars: 170 },
    );
    const compactValidationDescription = sectionIntro(
        "validation",
        project.validation?.description,
        { maxSentences: 1, maxChars: 172 },
    );
    const validationOutcomes = filterRedundantOutcomes(
        compactValidationDescription,
        project.validation?.outcomes || [],
    );
    const normalizedValidationOutcomes = validationOutcomes
        .map((outcome, i, arr) => {
            const current = nestedCopy("validationOutcomeLine", outcome, {
                maxSentences: 1,
                maxChars: 156,
            });
            if (i === 0) return current;
            const previous = nestedCopy("validationOutcomeLine", arr[i - 1], {
                maxSentences: 1,
                maxChars: 156,
            });
            return dedupeAdjacentCopy(current, previous);
        })
        .filter(Boolean);
    const researchWhy = getSectionWhyLine(project, "research");
    const userFlowsWhy = getSectionWhyLine(project, "userFlows");
    const lofiWhy = getSectionWhyLine(project, "lofi");
    const iterationsWhy = getSectionWhyLine(project, "iterations");
    const hifiWhy = getSectionWhyLine(project, "hifi");
    const developmentWhy = getSectionWhyLine(project, "development");
    const solutionWhy = getSectionWhyLine(project, "solution");
    const validationWhy = getSectionWhyLine(project, "validation");
    const whatChangedClose = getWhatChangedClose(project);
    const evidenceNarrative = project.evidenceNarrative || null;
    const hasEvidenceNarrative = Boolean(
        evidenceNarrative &&
            (
                evidenceNarrative.originalAssumption ||
                evidenceNarrative.researchChangedDirection ||
                evidenceNarrative.whatChangedWhy ||
                (Array.isArray(evidenceNarrative.whatWasCut) &&
                    evidenceNarrative.whatWasCut.length > 0) ||
                evidenceNarrative.nextIteration
            ),
    );

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
                            description={sectionIntro("overview", project.overview.description)}
                            images={project.overview.images}
                            mediaDemo={project.overview.mediaDemo}
                            verdict={project.overview.verdict}
                            captionContext="Overview"
                            imageStartIndex={imageNum}
                            onImageCount={(n) => {
                                imageNum += n;
                            }}
                        />
                    );
                })()}

            {/* Problem framing */}
            {project.problem &&
                (() => {
                    const s = nextSection();
                    return (
                        <IndexedSection
                            caseIndex={ci}
                            sectionIndex={s}
                            name="Problem"
                            title={project.problem.title}
                            description={compactProblemDescription}
                            images={project.problem.images}
                            mediaDemo={project.problem.mediaDemo}
                            verdict={project.problem.verdict}
                            captionContext="Problem framing"
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
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Approach"
                            />
                            <h2 className="section-title">
                                {project.research.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {sectionIntro("research", project.research.description)}
                            </p>
                            {researchWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {researchWhy}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.research.mediaDemo} />
                            <PrincipleVerdict verdict={project.research.verdict} />

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
                                                <li
                                                    key={i}
                                                    className="finding-item"
                                                >
                                                    {finding}
                                                </li>
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

                            {project.research.images?.length > 0 && (
                                <ImageGallery
                                    images={project.research.images}
                                    captionContext="Research evidence"
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Decision evidence */}
            {hasEvidenceNarrative &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section decision-evidence-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Decision Evidence"
                            />
                            <h2 className="section-title">What changed and why</h2>
                            <SectionTag sectionIndex={s} version="2.0" />
                            <p className="section-description">
                                {sectionIntro(
                                    "decisionEvidence",
                                    evidenceNarrative.whatChangedWhy,
                                )}
                            </p>

                            <div className="decision-evidence-grid">
                                {evidenceNarrative.originalAssumption && (
                                    <article className="decision-evidence-card">
                                        <h3 className="subsection-title">Original assumption</h3>
                                        <p className="decision-evidence-text">
                                            {evidenceNarrative.originalAssumption}
                                        </p>
                                    </article>
                                )}

                                {evidenceNarrative.researchChangedDirection && (
                                    <article className="decision-evidence-card">
                                        <h3 className="subsection-title">Research changed the direction</h3>
                                        <p className="decision-evidence-text">
                                            {evidenceNarrative.researchChangedDirection}
                                        </p>
                                    </article>
                                )}

                                {evidenceNarrative.whatChangedWhy && (
                                    <article className="decision-evidence-card">
                                        <h3 className="subsection-title">Design response</h3>
                                        <p className="decision-evidence-text">
                                            {evidenceNarrative.whatChangedWhy}
                                        </p>
                                    </article>
                                )}

                                {Array.isArray(evidenceNarrative.whatWasCut) &&
                                    evidenceNarrative.whatWasCut.length > 0 && (
                                        <article className="decision-evidence-card">
                                            <h3 className="subsection-title">What was cut</h3>
                                            <ul className="decision-evidence-list">
                                                {evidenceNarrative.whatWasCut.map((item) => (
                                                    <li key={item} className="decision-evidence-item">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </article>
                                    )}

                                {evidenceNarrative.nextIteration && (
                                    <article className="decision-evidence-card">
                                        <h3 className="subsection-title">Next iteration</h3>
                                        <p className="decision-evidence-text">
                                            {evidenceNarrative.nextIteration}
                                        </p>
                                    </article>
                                )}
                            </div>
                        </motion.section>
                    );
                })()}

            {/* ── Personas ── */}
            {project.personas &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section personas-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
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
                                {sectionIntro("personas", project.personas.description)}
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
                                        <CaseStudyImage
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
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
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
                                {sectionIntro("userFlows", project.userFlows.description)}
                            </p>
                            {userFlowsWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {userFlowsWhy}
                                </p>
                            )}

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
                                            {(() => {
                                                const flowDescription = nestedCopy(
                                                    "flowDescription",
                                                    flow.description,
                                                    { maxSentences: 1, maxChars: 158 },
                                                );
                                                const prevFlowDescription =
                                                    i > 0
                                                        ? nestedCopy(
                                                            "flowDescription",
                                                            project.userFlows?.flows?.[i - 1]
                                                                ?.description,
                                                            { maxSentences: 1, maxChars: 158 },
                                                        )
                                                        : "";
                                                const resolvedFlowDescription =
                                                    i > 0
                                                        ? dedupeAdjacentCopy(
                                                            flowDescription,
                                                            prevFlowDescription,
                                                        )
                                                        : flowDescription;
                                                return resolvedFlowDescription ? (
                                                    <p className="flow-description">
                                                        {resolvedFlowDescription}
                                                    </p>
                                                ) : null;
                                            })()}
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
                                    captionContext="User flow evidence"
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
                            description={sectionIntro("ia", project.informationArchitecture.description)}
                            images={project.informationArchitecture.images}
                            mediaDemo={project.informationArchitecture.mediaDemo}
                            verdict={project.informationArchitecture.verdict}
                            captionContext="Information architecture"
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
                            description={sectionIntro("lofi", project.lofi.description)}
                            images={project.lofi.images}
                            mediaDemo={project.lofi.mediaDemo}
                            verdict={project.lofi.verdict}
                            comparisons={comparisonsForLofi}
                            captionContext="Lo-fi exploration"
                            imageStartIndex={imageNum}
                            onImageCount={(n) => {
                                imageNum += n;
                            }}
                        />
                    );
                })()}
            {project.lofi && lofiWhy && (
                <p className="section-why-line section-why-line--after-indexed">
                    <strong>Why this choice:</strong> {lofiWhy}
                </p>
            )}

            {/* ── Style Guide ── */}
            {project.styleGuide &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section styleguide-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
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
                                {sectionIntro("styleGuide", project.styleGuide.description)}
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
                                    captionContext="Style system"
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Iterations & Refinements (supports both improvements and rounds) */}
            {project.iterations &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
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
                                {sectionIntro("iterations", project.iterations.description)}
                            </p>
                            {iterationsWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {iterationsWhy}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.iterations.mediaDemo} />
                            <PrincipleVerdict verdict={project.iterations.verdict} />
                            <BeforeAfterComparisons
                                comparisons={comparisonsForIterations}
                            />

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
                                    captionContext="Iteration decisions"
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                            {!project.prototypeTabs?.length &&
                                project.iterations.prototype && (
                                <PrototypeEmbed
                                    project={project}
                                    prototype={project.iterations.prototype}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {project.prototypeTabs?.length > 0 && (
                <PrototypeTabs tabs={project.prototypeTabs} />
            )}

            {/* ── High-Fidelity Mockups ── */}
            {project.hifi &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section hifi-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
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
                                {sectionIntro("hifi", project.hifi.description)}
                            </p>
                            {hifiWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {hifiWhy}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.hifi.mediaDemo} />
                            <PrincipleVerdict verdict={project.hifi.verdict} />

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
                                            project={project}
                                            previousScreenDescription={
                                                i > 0
                                                    ? project.hifi?.screens?.[i - 1]
                                                        ?.description
                                                    : ""
                                            }
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
                                    captionContext="Hi-fi execution"
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
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
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
                                {sectionIntro("development", project.development.description)}
                            </p>
                            {developmentWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {developmentWhy}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.development.mediaDemo} />
                            <PrincipleVerdict verdict={project.development.verdict} />

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

            {/* ── Usability Testing ── */}
            {project.userTesting &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section usability-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
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
                                {sectionIntro("userTesting", project.userTesting.description)}
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
                                    captionContext="Testing evidence"
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
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
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
                                    {sectionIntro("finalPresentation", project.finalPresentation.description)}
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
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
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
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
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
                                {sectionIntro("solution", project.solution.description)}
                            </p>
                            {solutionWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {solutionWhy}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.solution.mediaDemo} />
                            <PrincipleVerdict verdict={project.solution.verdict} />

                            {project.solution.features?.length > 0 && (
                                <div className="features-list">
                                    {project.solution.features.map(
                                        (feature, i) => (
                                            <motion.div
                                                key={feature.id || i}
                                                className={`feature-item${feature.image ? " feature-item--has-media" : ""}`}
                                                initial={{ opacity: 0, y: 16 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.45,
                                                    delay: i * 0.08,
                                                }}
                                            >
                                                {feature.image && (
                                                    <div className="feature-media-wrap">
                                                        <div className="feature-media">
                                                            <FigLabel
                                                                index={nextImage()}
                                                            />
                                                            <CaseStudyImage
                                                                src={feature.image}
                                                                alt={feature.title}
                                                            />
                                                        </div>
                                                        <p className="image-caption">
                                                            {feature.caption || feature.title}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="feature-body">
                                                    <h3 className="feature-title">
                                                        {feature.title}
                                                    </h3>
                                                    {(() => {
                                                        const featureDescription = nestedCopy(
                                                            "featureDescription",
                                                            feature.description,
                                                            { maxSentences: 1, maxChars: 168 },
                                                        );
                                                        const prevFeatureDescription =
                                                            i > 0
                                                                ? nestedCopy(
                                                                    "featureDescription",
                                                                    project.solution?.features?.[
                                                                        i - 1
                                                                    ]?.description,
                                                                    {
                                                                        maxSentences: 1,
                                                                        maxChars: 168,
                                                                    },
                                                                )
                                                                : "";
                                                        const resolvedFeatureDescription =
                                                            i > 0
                                                                ? dedupeAdjacentCopy(
                                                                    featureDescription,
                                                                    prevFeatureDescription,
                                                                )
                                                                : featureDescription;
                                                        return resolvedFeatureDescription ? (
                                                            <p className="feature-description">
                                                                {resolvedFeatureDescription}
                                                            </p>
                                                        ) : null;
                                                    })()}
                                                    {feature.why && (
                                                        <p className="feature-why">
                                                            <strong>Why:</strong>{" "}
                                                            {feature.why}
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            )}

                            {project.solution.images?.length > 0 && (
                                <ImageGallery
                                    images={project.solution.images}
                                    captionContext="Solution details"
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}

                            {project.solution.prototype && (
                                <PrototypeEmbed
                                    project={project}
                                    prototype={project.solution.prototype}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Final Experience/Prototype */}
            {project.finalExperience &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section final-experience-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Solution"
                            />
                            <h2 className="section-title">
                                Complete Prototype
                            </h2>
                            <SectionTag sectionIndex={s} />
                            {project.finalExperience.intro && (
                                <p className="section-description">
                                    {sectionIntro("finalExperience", project.finalExperience.intro)}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.finalExperience.mediaDemo} />
                            <PrincipleVerdict verdict={project.finalExperience.verdict} />
                            {project.finalExperience.prototype && (
                                <PrototypeEmbed
                                    project={project}
                                    prototype={
                                        project.finalExperience.prototype
                                    }
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
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Outcome"
                            />
                            <h2 className="section-title">
                                {project.validation.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {compactValidationDescription}
                            </p>
                            {validationWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {validationWhy}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.validation.mediaDemo} />
                            <PrincipleVerdict verdict={project.validation.verdict} />

                            {project.validation.method && (
                                <p className="validation-method">
                                    <strong>Method:</strong>{" "}
                                    {project.validation.method}
                                    {project.validation.participantCount &&
                                        ` • ${project.validation.participantCount} participants`}
                                </p>
                            )}

                            {normalizedValidationOutcomes.length > 0 && (
                                <div className="validation-outcomes">
                                    <h3 className="subsection-title">
                                        Outcomes
                                    </h3>
                                    <ul className="outcomes-list">
                                        {normalizedValidationOutcomes.map(
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
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
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
                                                {(() => {
                                                    const insightDescription = nestedCopy(
                                                        "insightDescription",
                                                        insight.description,
                                                        { maxSentences: 1, maxChars: 170 },
                                                    );
                                                    const prevInsightDescription =
                                                        i > 0
                                                            ? nestedCopy(
                                                                "insightDescription",
                                                                project.learnings?.insights?.[
                                                                    i - 1
                                                                ]?.description,
                                                                {
                                                                    maxSentences: 1,
                                                                    maxChars: 170,
                                                                },
                                                            )
                                                            : "";
                                                    const resolvedInsightDescription =
                                                        i > 0
                                                            ? dedupeAdjacentCopy(
                                                                insightDescription,
                                                                prevInsightDescription,
                                                            )
                                                            : insightDescription;
                                                    return resolvedInsightDescription ? (
                                                        <p className="insight-description">
                                                            {resolvedInsightDescription}
                                                        </p>
                                                    ) : null;
                                                })()}
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

            {/* Impact */}
            {project.outcomes &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section outcomes-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Outcome"
                            />
                            <h2 className="section-title">
                                {project.outcomes.title}
                            </h2>
                            <SectionTag sectionIndex={s} />
                            <p className="section-description">
                                {sectionIntro("outcomes", project.outcomes.description)}
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

            {whatChangedClose && (
                <motion.section
                    className="project-section case-close-section"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.45 }}
                >
                    <h2 className="section-title">What changed</h2>
                    <p className="section-description">{whatChangedClose}</p>
                </motion.section>
            )}

            {/* ── Simulation Mode (InkLink only) ── */}
            {project.id === "inklink" && (
                <SimulationSection
                    caseIndex={ci}
                    sectionIndex={nextSection()}
                />
            )}
        </div>
    );
};

// Reusable Image Gallery Component with FIG.XX labels
// Shows all images stacked for ≤2 images; slideshow carousel for 3+
const getImageCaption = (image, captionContext = "case study") => {
    if (image?.caption && String(image.caption).trim().length > 3) {
        return toSentenceCaseLine(image.caption, 132);
    }
    if (image?.alt && String(image.alt).trim().length > 8) {
        const alt = String(image.alt).replace(/\.$/, "");
        return toSentenceCaseLine(`${alt} (${captionContext}).`, 132);
    }
    return toSentenceCaseLine(
        `Supporting visual from ${captionContext.toLowerCase()}.`,
        132,
    );
};

const ImageGallery = ({
    images,
    captionContext,
    startIndex = 0,
    onCount,
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = Array.isArray(images) ? images.length : 0;

    useEffect(() => {
        setCurrentSlide(0);
    }, [images]);

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
                        <CaseStudyImage
                            src={img.src}
                            alt={img.alt}
                        />
                        <p className="image-caption">
                            {getImageCaption(img, captionContext)}
                        </p>
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
    const onCarouselKeyDown = (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            prev();
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            next();
        }
    };
    const img = images[currentSlide];

    return (
        <motion.div
            className="image-carousel"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            onKeyDown={onCarouselKeyDown}
        >
            <div className="carousel-viewport">
                <FigLabel index={startIndex + currentSlide + 1} />
                <AnimatePresence mode="wait">
                    <CaseStudyImage
                        key={currentSlide}
                        src={img.src}
                        alt={img.alt}
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
                    {currentSlide + 1} / {totalSlides}
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

            <p className="image-caption">
                {getImageCaption(img, captionContext)}
            </p>

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
const HifiAccordion = ({
    screen,
    index,
    figIndex,
    project,
    previousScreenDescription = "",
}) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(false);
    }, [screen?.name, screen?.image]);
    const currentScreenDescription = getNestedCopy(
        project,
        "screenDescription",
        screen.description,
        { maxSentences: 1, maxChars: 168 },
    );
    const priorScreenDescription = getNestedCopy(
        project,
        "screenDescription",
        previousScreenDescription,
        { maxSentences: 1, maxChars: 168 },
    );
    const screenDescription =
        index > 0
            ? dedupeAdjacentCopy(currentScreenDescription, priorScreenDescription)
            : currentScreenDescription;

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
                            {screenDescription && (
                                <p className="accordion-desc">
                                    {screenDescription}
                                </p>
                            )}
                            {screen.image && (
                                <div className="hifi-screen-image">
                                    <FigLabel index={figIndex} />
                                    <CaseStudyImage
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
const PrototypeEmbed = ({ prototype, project }) => {
    if (!prototype) return null;
    const prototypeDescription = getNestedCopy(
        project,
        "prototypeDescription",
        prototype.description,
        { maxSentences: 1, maxChars: 168 },
    );

    return (
        <motion.div
            className="prototype-embed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            {prototypeDescription && (
                <p className="prototype-description">{prototypeDescription}</p>
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
    mediaDemo,
    verdict,
    comparisons,
    captionContext,
    imageStartIndex = 0,
    onImageCount,
}) => {
    const resolvedDescription = toEditorialCopy(description, {
        fallback: CASE_SECTION_FALLBACKS.default,
        maxSentences: 2,
        maxChars: 228,
    });

    return (
        <motion.section
            className="project-section"
            initial={caseStudyMotion.sectionReveal.initial}
            whileInView={caseStudyMotion.sectionReveal.whileInView}
            viewport={caseStudyMotion.sectionReveal.viewport}
            transition={caseStudyMotion.sectionReveal.transition}
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
            <p className="section-description">{resolvedDescription}</p>
            <BrowserMockup mediaDemo={mediaDemo} />
            <PrincipleVerdict verdict={verdict} />
            <BeforeAfterComparisons comparisons={comparisons} />

            {images && images.length > 0 && (
                <ImageGallery
                    images={images}
                    captionContext={captionContext || title || name}
                    startIndex={imageStartIndex}
                    onCount={onImageCount}
                />
            )}
        </motion.section>
    );
};

export default ProjectContentMain;
