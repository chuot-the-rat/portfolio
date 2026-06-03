import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import ProjectCheckpoint from "../components/passbook/ProjectCheckpoint";
import { getProjectById } from "../utils/projectDataMapper";
import { ScrollProgress } from "../components/MicroIndex";
import BackToTop from "../components/BackToTop";
import ReadingProgress from "../components/ReadingProgress";
import ProjectNextPrev from "../components/ProjectNextPrev";
import DecorativeDivider from "../components/caseStudy/DecorativeDivider";
import ProjectContentMain from "../components/caseStudy/ProjectContentMain";
import { CaseStudyImage, ProjectCredibility } from "../components/caseStudy/ProjectDetailWidgets";
import { getDisplayProjectMeta } from "../utils/displayProjectMeta";
import {
    CASE_COPY_FALLBACKS,
    getCredibilityRows,
    getHeroFramingCopy,
    getHeroTaglineCopy,
    getImpactSnapshot,
    getLaunchMediaCaption,
    getYouTubeEmbedUrl,
    normalizeTextKey,
    toEditorialCopy,
} from "../utils/caseStudyCopy";
import "./ProjectDetail.css";

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const pageSummary = toEditorialCopy(project?.summary || project?.tagline, {
        fallback: CASE_COPY_FALLBACKS.pageSummary,
        maxSentences: 1,
        maxChars: 156,
    });
    usePageTitle(project?.title ?? null, {
        description: pageSummary,
        path: id ? `/case-studies/${id}` : "/",
        image: project?.media?.og_image || "https://leanale.com/starfruit.png",
        structuredData: project
            ? {
                  "@context": "https://schema.org",
                  "@type": "CreativeWork",
                  name: project.title,
                  description: pageSummary || "Portfolio case study by Leana Le.",
                  url: `https://leanale.com/case-studies/${project.id}`,
                  author: {
                      "@type": "Person",
                      name: "Leana Le",
                  },
              }
            : null,
    });
    const [loading, setLoading] = useState(true);
    const contentRef = useRef(null);

    useEffect(() => {
        let alive = true;
        const controller = new AbortController();
        setLoading(true);

        // Load project data from centralized case studies
        try {
            const projectData = getProjectById(id);
            if (!projectData) {
                navigate("/");
                return;
            }

            // Try to fetch supplemental data (rich sections from local data.json)
            fetch(`/projects/${id}/data.json`, { signal: controller.signal })
                .then((res) => (res.ok ? res.json() : null))
                .then((localData) => {
                    if (!alive) return;
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
                            if (!localData[key]) continue;
                            merged[key] = localData[key];
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
                    if (!alive) return;
                    setProject(projectData);
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error loading project:", error);
            navigate("/");
        }
        return () => {
            alive = false;
            controller.abort();
        };
    }, [id, navigate]);

    // Favicon swap: active ↔ idle on tab visibility change
    useEffect(() => {
        const link = document.querySelector("link[rel~='icon']");
        if (!link) return;
        const activeFavicon = link.href;
        const idleFavicon =
            "data:image/svg+xml," +
            encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
                `<text y="26" font-size="26">💤</text></svg>`,
            );

        const onVisibility = () => {
            link.href = document.hidden ? idleFavicon : activeFavicon;
        };
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            document.removeEventListener("visibilitychange", onVisibility);
            link.href = activeFavicon;
        };
    }, []);

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

    // Hero image: prefer hifi/solution screens over generic overview
    const heroImage =
        project.media?.hero_image ??
        project.iterations?.images?.[0]?.src ??
        project.overview?.images?.[0]?.src ??
        null;

    // Build meta bar items — only show fields that exist
    const {
        displayScope,
        displayRole,
        displayYear,
        displaySummary,
    } = getDisplayProjectMeta(project);

    const toolsValue = Array.isArray(project.tools)
        ? project.tools.slice(0, 3).join(", ")
        : Array.isArray(project.techStack)
          ? project.techStack.slice(0, 3).join(", ")
          : project.tools || project.techStack || "";

    const metaItems = [
        displayScope && {
            label: "Scope",
            value: displayScope,
        },
        displayRole && {
            label: "Role",
            value: displayRole,
        },
        displayYear && { label: "Year", value: displayYear },
        (project.timeline || project.duration) && { label: "Timeline", value: project.timeline || project.duration },
        (project.team || project.teamSize) && {
            label: "Team",
            value: project.team || `${project.teamSize} members`,
        },
        toolsValue && { label: "Tools", value: toolsValue },
    ].filter(Boolean);

    const actionLinks = [
        project.links?.live && { href: project.links.live, label: "Live site" },
        project.links?.prototype && {
            href: project.links.prototype,
            label: "Prototype",
        },
        project.links?.github && { href: project.links.github, label: "GitHub" },
        project.links?.figma && { href: project.links.figma, label: "Figma" },
    ].filter(Boolean);

    const impactSnapshot = getImpactSnapshot(project);
    const credibilityRows = getCredibilityRows(project);
    const heroTagline = getHeroTaglineCopy(project);
    let framingStatement = getHeroFramingCopy(project, displaySummary);
    if (normalizeTextKey(framingStatement) === normalizeTextKey(heroTagline)) {
        framingStatement = CASE_COPY_FALLBACKS.heroFraming;
    }

    const previewLayout = String(project.previewLayout || "").toLowerCase();
    const layoutClass =
        previewLayout === "mobile" || previewLayout === "tablet"
            ? `project-detail--layout-${previewLayout}`
            : "project-detail--layout-tablet";

    return (
        <div
            className={`project-detail project-detail--${project.id || "unknown"} ${layoutClass}`}
        >
            <ReadingProgress />

            {/* Hero — full Sharleen-style header */}
            <motion.section
                className="project-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="container">

                    {/* Breadcrumb */}
                    <motion.nav
                        className="project-breadcrumb"
                        aria-label="Breadcrumb"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <Link to="/" className="breadcrumb-link">Work</Link>
                        <span className="breadcrumb-sep" aria-hidden>/</span>
                        <span className="breadcrumb-current">{project.title}</span>
                    </motion.nav>

                    {/* Title block */}
                    <motion.div
                        className="project-hero-text"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Eyebrow: category · year */}
                        <span className="project-eyebrow">
                            {project.category}
                            {project.year && <><span aria-hidden> · </span>{project.year}</>}
                        </span>

                        <h1 className="project-hero-title">{project.title}</h1>

                        {heroTagline && (
                            <p className="project-hero-tagline">{heroTagline}</p>
                        )}
                        {framingStatement && (
                            <p className="project-framing-statement">
                                {framingStatement}
                            </p>
                        )}

                        <ul className="project-impact-snapshot" aria-label="Impact snapshot">
                            {impactSnapshot.map((item) => (
                                <li key={item} className="project-impact-item">{item}</li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Meta area — separated informational metadata and actions */}
                    {(metaItems.length > 0 || actionLinks.length > 0) && (
                        <motion.div
                            className="project-meta-bar"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.45, delay: 0.18 }}
                        >
                            {metaItems.length > 0 && (
                                <div className="project-meta-info" aria-label="Case info">
                                    <p className="project-meta-group-title">Case Info</p>
                                    {metaItems.map((item) => (
                                        <div key={item.label} className="project-meta-info-item">
                                            <span className="meta-label">{item.label}</span>
                                            <span className="meta-value">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {actionLinks.length > 0 && (
                                <div className="project-meta-actions" aria-label="Case links">
                                    <p className="project-meta-group-title">Actions</p>
                                    {actionLinks.map((link, index) => (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`project-meta-action-link ${index === 0 ? "is-primary" : ""}`.trim()}
                                        >
                                            {link.label} ↗
                                        </a>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    <DecorativeDivider />

                    {/* Hero image — full width below the header text */}
                    {heroImage && (
                        <motion.div
                            className="project-hero-media"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <CaseStudyImage
                                src={heroImage}
                                alt={`${project.title} preview`}
                                className="project-hero-media-img"
                            />
                        </motion.div>
                    )}
                </div>
            </motion.section>

            {(project.launchAd?.video_url ||
                project.launchAd?.youtube_url ||
                project.launchAd?.embed_url) && (
                <section className="project-launch-media">
                    <div className="container">
                        <div className="launch-media-card">
                            <p className="launch-media-label">Launch Media</p>
                            <h2 className="launch-media-title">
                                {project.launchAd?.title || `${project.title} launch media overview`}
                            </h2>
                            {getLaunchMediaCaption(project.launchAd) && (
                                <p className="launch-media-caption">
                                    {getLaunchMediaCaption(project.launchAd)}
                                </p>
                            )}
                            <div className="launch-media-stack">
                                {project.launchAd?.video_url && (
                                    <div className="launch-media-embed">
                                        <video
                                            controls
                                            preload="metadata"
                                            playsInline
                                            aria-label={project.launchAd.title || `${project.title} promo video`}
                                        >
                                            <source src={project.launchAd.video_url} type="video/mp4" />
                                        </video>
                                    </div>
                                )}

                                {project.launchAd?.youtube_url && (
                                    <div className="launch-media-embed">
                                        <iframe
                                            src={getYouTubeEmbedUrl(project.launchAd.youtube_url)}
                                            title={project.launchAd.title || `${project.title} launch media`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    </div>
                                )}

                                {project.launchAd?.embed_url && (
                                    <div className="launch-media-embed">
                                        <iframe
                                            src={project.launchAd.embed_url}
                                            title={`${project.title} presentation`}
                                            allowFullScreen
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Content Sections */}
            <div
                className="project-content"
                ref={contentRef}
            >
                <div className="container">
                    <ProjectCredibility rows={credibilityRows} />
                    <div className="project-content-layout">
                        <ProjectContentMain project={project} />
                        {/* Micro-index scroll progress sidebar */}
                        <ScrollProgress contentRef={contentRef} />
                    </div>
                </div>
            </div>
            {/* Passbook checkpoint — collect stamp before navigating away */}
            <div className="container">
                <ProjectCheckpoint projectId={project.id} />
            </div>

            {/* Next / Prev project navigation */}
            <div className="container">
                <ProjectNextPrev currentId={project.id} />
            </div>

            <BackToTop />
        </div>
    );
};

export default ProjectDetail;
