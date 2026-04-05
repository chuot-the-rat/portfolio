/**
 * ProjectNextPrev.jsx
 * Full-width two-panel footer nav shown at the bottom of every case study.
 *
 * Layout:
 *   [ ← Prev project ]  |  [ Next project → ]
 *
 * Each panel shows: direction label, project title, thumbnail on hover.
 * Below both panels: a centered "← All work" return link.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProjects, getProjectPath } from "../utils/projectDataMapper";
import "./ProjectNextPrev.css";

export default function ProjectNextPrev({ currentId }) {
    const [prev, setPrev] = useState(null);
    const [next, setNext] = useState(null);
    const [thumbs, setThumbs] = useState({}); // id → cover image src
    const [hovered, setHovered] = useState(null); // "prev" | "next" | null

    useEffect(() => {
        const projects = getAllProjects();
        const idx = projects.findIndex((p) => p.id === currentId);
        if (idx === -1) return;

        const prevProject = idx > 0 ? projects[idx - 1] : null;
        const nextProject = idx < projects.length - 1 ? projects[idx + 1] : null;

        setPrev(prevProject);
        setNext(nextProject);

        // Fetch cover thumbnails from each project's data.json
        const fetchThumb = async (project) => {
            if (!project) return;
            try {
                const res = await fetch(`/projects/${project.id}/data.json`);
                if (!res.ok) return;
                const data = await res.json();
                const src =
                    data?.hifi?.images?.[0]?.src ??
                    data?.solution?.images?.[0]?.src ??
                    data?.overview?.images?.[0]?.src ??
                    null;
                if (src) setThumbs((t) => ({ ...t, [project.id]: src }));
            } catch {
                // no thumbnail — panel shows without image
            }
        };

        fetchThumb(prevProject);
        fetchThumb(nextProject);
    }, [currentId]);

    if (!prev && !next) return null;

    return (
        <div className="pnp">
            {/* Two-panel nav */}
            <div className="pnp-panels">
                {/* Prev */}
                <div className={`pnp-panel pnp-panel--prev${!prev ? " pnp-panel--empty" : ""}`}>
                    {prev ? (
                        <Link
                            to={getProjectPath(prev.id)}
                            className="pnp-link"
                            onMouseEnter={() => setHovered("prev")}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <PanelContent
                                direction="prev"
                                project={prev}
                                thumb={thumbs[prev.id]}
                                isHovered={hovered === "prev"}
                            />
                        </Link>
                    ) : (
                        <div className="pnp-link pnp-link--inactive" />
                    )}
                </div>

                {/* Divider */}
                <div className="pnp-divider" aria-hidden />

                {/* Next */}
                <div className={`pnp-panel pnp-panel--next${!next ? " pnp-panel--empty" : ""}`}>
                    {next ? (
                        <Link
                            to={getProjectPath(next.id)}
                            className="pnp-link"
                            onMouseEnter={() => setHovered("next")}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <PanelContent
                                direction="next"
                                project={next}
                                thumb={thumbs[next.id]}
                                isHovered={hovered === "next"}
                            />
                        </Link>
                    ) : (
                        <div className="pnp-link pnp-link--inactive" />
                    )}
                </div>
            </div>

            {/* Return to all work */}
            <div className="pnp-return">
                <Link to="/" className="pnp-return-link">
                    ← All work
                </Link>
            </div>
        </div>
    );
}

function PanelContent({ direction, project, thumb, isHovered }) {
    const isPrev = direction === "prev";

    return (
        <div className={`pnp-content pnp-content--${direction}`}>
            {/* Thumbnail */}
            <div className="pnp-thumb-wrap" aria-hidden>
                <AnimatePresence>
                    {thumb && isHovered && (
                        <motion.img
                            key={thumb}
                            src={thumb}
                            alt=""
                            className="pnp-thumb"
                            initial={{ opacity: 0, scale: 0.96, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Text */}
            <div className="pnp-text">
                <span className="pnp-direction">
                    {isPrev ? "← Previous" : "Next →"}
                </span>
                <span className="pnp-title">{project.title}</span>
                {project.tagline && (
                    <span className="pnp-tagline">{project.tagline}</span>
                )}
            </div>
        </div>
    );
}
