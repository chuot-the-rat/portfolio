/**
 * HomeWorkList.jsx
 * Text-led project list — Jackie Hu / Sharleen inspired.
 *
 * Layout philosophy:
 * - Resting state: text rows only. Index | Title + subtitle | Year.
 * - Hover: floating preview image fades in on the right (desktop only).
 * - Hovered row: brightens, shifts 4px right.
 * - Siblings: dim subtly to preserve context while focusing selection.
 * - Mobile: no preview, touch goes straight to project.
 *
 * No permanent thumbnails in the grid. Image is a reward, not a fixture.
 */

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { getProjectPath, isStandaloneProject } from "../../utils/projectDataMapper";
import { MOTION_DURATION, MOTION_EASE } from "../../utils/motion/tokens";
import "./HomeWorkList.css";

const TABS = ["UX/UI", "Motion Design", "Graphic Design"];

const CATEGORY_MAP = {
  "UI/UX":            "UX/UI",
  "Web Design":       "UX/UI",
  "Mobile App":       "UX/UI",
  "Motion Graphics":  "Motion Design",
  "Packaging Design": "Graphic Design",
};

export default function HomeWorkList({ projects }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab]   = useState("UX/UI");
  const [hoveredId, setHoveredId]   = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  const filtered = projects.filter(
    (p) => (CATEGORY_MAP[p.category] ?? "UX/UI") === activeTab,
  );

  // Find the hovered project and resolve its best preview image
  const hoveredProject = filtered.find((p) => p.id === hoveredId) ?? null;
  const previewCandidates = useMemo(() => {
    if (!hoveredProject) return [];
    const candidates = [
      ...(Array.isArray(hoveredProject.previewCandidates)
        ? hoveredProject.previewCandidates
        : []),
      hoveredProject.coverImage,
      ...(hoveredProject.allImages || []).map((img) => img?.src),
    ].filter(Boolean);

    const unique = [];
    const seen = new Set();
    for (const src of candidates) {
      if (!src || seen.has(src)) continue;
      seen.add(src);
      unique.push(src);
    }
    return unique;
  }, [hoveredProject]);

  useEffect(() => {
    setPreviewIndex(0);
  }, [hoveredId]);

  const previewSrc = previewCandidates[previewIndex] ?? null;
  const previewVideoSrc = hoveredProject?.previewVideoSrc ?? null;
  const showPreviewVideo = Boolean(previewVideoSrc && hoveredId && !shouldReduceMotion);
  const projectTags = (hoveredProject?.taxonomyTags ?? []).slice(0, 2);

  return (
    <section className="hw" aria-label="Selected work">
      {/* ── Tab row ── */}
      <div className="hw-tabs" role="tablist" aria-label="Work categories">
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`hw-tab${activeTab === tab ? " hw-tab--active" : ""}`}
            onClick={() => { setActiveTab(tab); setHoveredId(null); }}
          >
            {tab}
          </button>
        ))}
        <span className="hw-tab-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </span>
      </div>

      {/* ── Body: text list + sticky preview slot ── */}
      <div className="hw-body">

        {/* Project rows */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="hw-list"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: MOTION_DURATION.revealBase, ease: MOTION_EASE.editorial }}
          >
            {filtered.length === 0 ? (
              <p className="hw-empty">No projects in this category yet.</p>
            ) : (
              filtered.map((project, index) => {
                const isHovered = hoveredId === project.id;
                const isDimmed  = hoveredId !== null && !isHovered;
                const isFeatured = !isStandaloneProject(project.id);

                return (
                  <motion.article
                    key={project.id}
                    className={[
                      "hw-item",
                      isFeatured ? "hw-item--featured" : "hw-item--standard",
                      isHovered ? "hw-item--active" : "",
                      isDimmed  ? "hw-item--dimmed" : "",
                    ].filter(Boolean).join(" ")}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: MOTION_DURATION.revealBase,
                      delay: index * MOTION_DURATION.staggerFast,
                      ease: MOTION_EASE.editorial,
                    }}
                    onMouseEnter={() => setHoveredId(project.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={()     => setHoveredId(project.id)}
                    onBlur={()      => setHoveredId(null)}
                  >
                    <Link
                      to={getProjectPath(project.id)}
                      className="hw-item-link"
                    >
                      {/* Index */}
                      <span className="hw-item-index" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Title + one-line descriptor */}
                      <div className="hw-item-text">
                        <span className="hw-item-title">{project.title}</span>
                        {(project.subtitle || project.tagline) && (
                          <span className="hw-item-sub">
                            {project.recruiterSummary ?? project.subtitle ?? project.tagline}
                          </span>
                        )}
                        <div className="hw-item-tags" aria-label="Project tags">
                          {(project.taxonomyTags?.length
                            ? project.taxonomyTags
                            : [
                                project.category ?? "Project",
                              ]
                          )
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((tag) => (
                              <span key={`${project.id}-${tag}`} className="hw-item-tag">
                                {String(tag).toLowerCase()}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* Year — pushed right */}
                      {project.year && (
                        <span className="hw-item-year" aria-hidden="true">
                          {project.year}
                        </span>
                      )}
                    </Link>
                  </motion.article>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>

        {/* Floating preview — desktop only, hidden on mobile via CSS */}
        <div className="hw-preview-slot" aria-hidden="true">
          <AnimatePresence mode="sync">
            {hoveredId && (
              <motion.div
                key={hoveredId}
                className="hw-preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: MOTION_DURATION.hoverBase,
                    delay: MOTION_DURATION.previewDelay, // delayed reward
                    ease: MOTION_EASE.editorial,
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                  transition: { duration: MOTION_DURATION.hoverFast, ease: MOTION_EASE.smooth },
                }}
              >
                <div
                  className={`hw-preview-media${previewVideoSrc ? " hw-preview-media--has-video" : ""}`}
                  aria-label={projectTags.length > 0 ? `Preview: ${projectTags.join(", ")}` : "Project preview"}
                >
                  {previewSrc ? (
                    <img
                      src={previewSrc}
                      alt=""
                      className="hw-preview-img"
                      loading="lazy"
                      onError={() => {
                        if (previewIndex < previewCandidates.length - 1) {
                          setPreviewIndex((current) => current + 1);
                        } else {
                          setPreviewIndex(previewCandidates.length);
                        }
                      }}
                    />
                  ) : (
                    <div className="hw-preview-fallback">
                      <p className="hw-preview-fallback-title">
                        Preview coming soon
                      </p>
                      <p className="hw-preview-fallback-sub">
                        {hoveredProject?.title ?? "Project"}
                      </p>
                    </div>
                  )}
                  {showPreviewVideo && (
                    <video
                      key={`${hoveredId}-preview-video`}
                      className="hw-preview-video"
                      src={previewVideoSrc}
                      muted
                      loop
                      playsInline
                      autoPlay
                      preload="none"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
