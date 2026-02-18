import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ProjectLayout.css";

/**
 * ProjectLayout — A gallery-forward layout for standalone design projects.
 * Renders from local data.json files (e.g., /projects/fizzu-soda/data.json).
 * Does NOT use case-study sections like research, pivots, or validation.
 * Scalable: any project with a data.json in public/projects/{slug}/ will work.
 */
const ProjectLayout = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState(null);

    const basePath = `/projects/${slug}`;

    useEffect(() => {
        const loadProject = async () => {
            try {
                const res = await fetch(`${basePath}/data.json`);
                if (!res.ok) throw new Error("Not found");
                const data = await res.json();
                setProject(data);
                setLoading(false);
                window.scrollTo(0, 0);
            } catch (err) {
                console.error("Error loading project:", err);
                navigate("/");
            }
        };

        loadProject();
    }, [slug, navigate, basePath]);

    /** Resolve image src — handles both relative ("images/x.png") and absolute ("/...") paths */
    const resolveImage = (src) => {
        if (!src) return "";
        if (src.startsWith("/") || src.startsWith("http")) return src;
        return `${basePath}/${src}`;
    };

    if (loading) {
        return (
            <div className="project-layout-loading">
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

    // Collect ALL images from every section for the gallery
    const collectImages = () => {
        const imgs = [];
        const addImages = (section) => {
            if (!section) return;
            if (section.images) {
                section.images.forEach((img) => imgs.push(img));
            }
        };

        addImages(project.overview);
        addImages(project.problem);
        addImages(project.solution);
        addImages(project.styleGuide);

        // Also include any loose gallery field
        if (project.gallery) {
            project.gallery.forEach((img) => imgs.push(img));
        }

        return imgs;
    };

    const allImages = collectImages();

    return (
        <div className="project-layout">
            {/* Back Button */}
            <motion.div
                className="project-layout-back"
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

            {/* ── Hero ── */}
            <motion.section
                className="pl-hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <div className="container">
                    <div className="pl-hero-meta">
                        <span className="project-tag">{project.category}</span>
                        <span className="project-year">{project.year}</span>
                    </div>

                    <h1 className="pl-hero-title">{project.title}</h1>
                    <p className="pl-hero-tagline">{project.tagline}</p>

                    {/* Links */}
                    {project.links &&
                        Object.entries(project.links).map(([key, url]) => (
                            <motion.a
                                key={key}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-cta-link"
                                whileHover={{
                                    y: -2,
                                    transition: { duration: 0.2 },
                                }}
                            >
                                <span>
                                    {key === "behance"
                                        ? "View on Behance"
                                        : key === "live"
                                          ? "Visit Live Site"
                                          : key.charAt(0).toUpperCase() +
                                            key.slice(1)}
                                </span>
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
                        ))}

                    {/* Meta Grid */}
                    <div className="pl-meta-grid">
                        {project.role && (
                            <div className="pl-meta-item">
                                <span className="meta-label">Role</span>
                                <span className="meta-value">
                                    {project.role}
                                </span>
                            </div>
                        )}
                        {project.timeline && (
                            <div className="pl-meta-item">
                                <span className="meta-label">Timeline</span>
                                <span className="meta-value">
                                    {project.timeline}
                                </span>
                            </div>
                        )}
                        {project.team && (
                            <div className="pl-meta-item">
                                <span className="meta-label">Team</span>
                                <span className="meta-value">
                                    {project.team}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Tools */}
                    {project.tools && project.tools.length > 0 && (
                        <div className="project-tools">
                            {project.tools.map((tool, i) => (
                                <span
                                    key={i}
                                    className="tool-tag"
                                >
                                    {tool}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </motion.section>

            {/* ── Hero Image (full-bleed) ── */}
            {project.overview?.images?.[0] && (
                <motion.div
                    className="pl-hero-image"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                >
                    <img
                        src={resolveImage(project.overview.images[0].src)}
                        alt={project.overview.images[0].alt || project.title}
                    />
                </motion.div>
            )}

            {/* ── Content Sections ── */}
            <div className="pl-content">
                <div className="container">
                    {/* Overview */}
                    {project.overview && (
                        <PLSection
                            label={`01 — ${project.overview.title || "Overview"}`}
                            title={project.overview.title}
                            description={project.overview.description}
                        />
                    )}

                    {/* Objectives */}
                    {project.objectives && project.objectives.length > 0 && (
                        <motion.section
                            className="pl-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="section-label">Objectives</span>
                            <ul className="pl-objectives">
                                {project.objectives.map((obj, i) => (
                                    <motion.li
                                        key={i}
                                        className="pl-objective-item"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.4,
                                            delay: i * 0.08,
                                        }}
                                    >
                                        <span className="objective-icon">
                                            {i + 1}
                                        </span>
                                        <span className="objective-text">
                                            {obj}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.section>
                    )}

                    {/* Challenge / Problem */}
                    {project.problem && (
                        <PLSection
                            label={`02 — ${project.problem.title || "The Challenge"}`}
                            title={project.problem.title}
                            description={project.problem.description}
                            images={project.problem.images}
                            resolveImage={resolveImage}
                            onImageClick={setLightboxImage}
                        />
                    )}

                    {/* Design Process Timeline */}
                    {project.designProcess &&
                        project.designProcess.length > 0 && (
                            <motion.section
                                className="pl-section"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="section-label">
                                    03 — Can to Concept
                                </span>
                                <div className="pl-process-timeline">
                                    {project.designProcess.map((phase, i) => (
                                        <motion.div
                                            key={i}
                                            className="pl-process-step"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.5,
                                                delay: i * 0.1,
                                            }}
                                        >
                                            <div className="pl-process-number">
                                                {String(i + 1).padStart(2, "0")}
                                            </div>
                                            <div className="pl-process-info">
                                                <h3 className="pl-process-title">
                                                    {phase.title}
                                                </h3>
                                                {phase.duration && (
                                                    <span className="pl-process-duration">
                                                        {phase.duration}
                                                    </span>
                                                )}
                                                {phase.activities && (
                                                    <div className="pl-process-activities">
                                                        {phase.activities.map(
                                                            (act, j) => (
                                                                <span
                                                                    key={j}
                                                                    className="pl-activity-tag"
                                                                >
                                                                    {act}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                    {/* Style Guide / Design System */}
                    {project.styleGuide && (
                        <PLSection
                            label={`04 — ${project.styleGuide.title || "Design System"}`}
                            title={project.styleGuide.title}
                            description={project.styleGuide.description}
                            images={project.styleGuide.images}
                            resolveImage={resolveImage}
                            onImageClick={setLightboxImage}
                        />
                    )}

                    {/* Solution */}
                    {project.solution && (
                        <PLSection
                            label={`05 — ${project.solution.title || "Solution"}`}
                            title={project.solution.title}
                            description={project.solution.description}
                            images={project.solution.images}
                            resolveImage={resolveImage}
                            onImageClick={setLightboxImage}
                        />
                    )}

                    {/* Outcomes / Results */}
                    {project.outcomes && (
                        <motion.section
                            className="pl-section"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="section-label">{`06 — ${project.outcomes.title || "Results"}`}</span>
                            <h2 className="section-title">
                                {project.outcomes.title}
                            </h2>
                            <p className="section-description">
                                {project.outcomes.description}
                            </p>
                            {project.outcomes.metrics &&
                                project.outcomes.metrics.length > 0 && (
                                    <div className="pl-metrics-grid">
                                        {project.outcomes.metrics.map(
                                            (m, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="pl-metric-card"
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.95,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: i * 0.1,
                                                    }}
                                                >
                                                    <span className="pl-metric-value">
                                                        {m.value}
                                                    </span>
                                                    <span className="pl-metric-label">
                                                        {m.label}
                                                    </span>
                                                </motion.div>
                                            ),
                                        )}
                                    </div>
                                )}
                        </motion.section>
                    )}
                </div>
            </div>

            {/* ── Full Gallery ── */}
            {allImages.length > 1 && (
                <motion.section
                    className="pl-gallery"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="container">
                        <span className="section-label">Gallery</span>
                    </div>
                    <div className="pl-gallery-grid">
                        {allImages.map((img, i) => (
                            <motion.div
                                key={i}
                                className="pl-gallery-item"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                onClick={() =>
                                    setLightboxImage(resolveImage(img.src))
                                }
                            >
                                <img
                                    src={resolveImage(img.src)}
                                    alt={
                                        img.alt ||
                                        `${project.title} — image ${i + 1}`
                                    }
                                    loading="lazy"
                                />
                                {img.caption && (
                                    <span className="pl-gallery-caption">
                                        {img.caption}
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* ── Lightbox ── */}
            {lightboxImage && (
                <motion.div
                    className="pl-lightbox"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        className="pl-lightbox-close"
                        onClick={() => setLightboxImage(null)}
                        aria-label="Close lightbox"
                    >
                        &times;
                    </button>
                    <img
                        src={lightboxImage}
                        alt="Enlarged view"
                    />
                </motion.div>
            )}

            {/* ── Footer nav ── */}
            <div className="pl-footer-nav">
                <div className="container">
                    <Link
                        to="/"
                        className="pl-footer-link"
                    >
                        &larr; Back to all projects
                    </Link>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   Reusable section block for text + images
   ───────────────────────────────────────────── */
const PLSection = ({
    label,
    title,
    description,
    images,
    resolveImage,
    onImageClick,
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const prev = () =>
        setCurrentSlide((s) => (s === 0 ? images.length - 1 : s - 1));
    const next = () =>
        setCurrentSlide((s) => (s === images.length - 1 ? 0 : s + 1));

    return (
        <motion.section
            className="pl-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            {label && <span className="section-label">{label}</span>}
            {title && <h2 className="section-title">{title}</h2>}
            {description && (
                <p className="section-description">{description}</p>
            )}
            {images && images.length > 0 && images.length <= 2 && (
                <div className="pl-section-images">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            className="pl-section-image"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.3 }}
                            onClick={() =>
                                onImageClick?.(
                                    resolveImage?.(img.src) || img.src,
                                )
                            }
                        >
                            <img
                                src={
                                    resolveImage
                                        ? resolveImage(img.src)
                                        : img.src
                                }
                                alt={img.alt || title || "Project image"}
                                loading="lazy"
                            />
                        </motion.div>
                    ))}
                </div>
            )}
            {images &&
                images.length > 2 &&
                (() => {
                    const img = images[currentSlide];
                    const src = resolveImage ? resolveImage(img.src) : img.src;
                    return (
                        <div className="image-carousel">
                            <div
                                className="carousel-viewport"
                                onClick={() => onImageClick?.(src)}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentSlide}
                                        src={src}
                                        alt={
                                            img.alt || title || "Project image"
                                        }
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
                            {img.caption && (
                                <p className="image-caption">{img.caption}</p>
                            )}
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
                        </div>
                    );
                })()}
        </motion.section>
    );
};

export default ProjectLayout;
