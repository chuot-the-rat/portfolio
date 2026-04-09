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

import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
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
  const [activeTab, setActiveTab]   = useState("UX/UI");
  const [hoveredId, setHoveredId]   = useState(null);

  const filtered = projects.filter(
    (p) => (CATEGORY_MAP[p.category] ?? "UX/UI") === activeTab,
  );

  // Find the hovered project and resolve its best preview image
  const hoveredProject = filtered.find((p) => p.id === hoveredId) ?? null;
  const previewSrc =
    hoveredProject?.coverImage ??
    hoveredProject?.allImages?.[0]?.src ??
    null;
  const previewVideoSrc = hoveredProject?.previewVideoSrc ?? null;
  const projectTags = (hoveredProject?.taxonomyTags ?? []).slice(0, 3);

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

                return (
                  <motion.article
                    key={project.id}
                    className={[
                      "hw-item",
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
                            {project.subtitle ?? project.tagline}
                          </span>
                        )}
                        <div className="hw-item-tags" aria-label="Project tags">
                          {(project.taxonomyTags?.length
                            ? project.taxonomyTags
                            : [
                                isStandaloneProject(project.id) ? "Design Project" : "Case Study",
                                project.category ?? "Project",
                                project.year,
                              ]
                          )
                            .filter(Boolean)
                            .slice(0, 3)
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
            {previewSrc && hoveredId && (
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
                  <img
                    src={previewSrc}
                    alt=""
                    className="hw-preview-img"
                    loading="lazy"
                  />
                  {previewVideoSrc && (
                    <video
                      key={`${hoveredId}-preview-video`}
                      className="hw-preview-video"
                      src={previewVideoSrc}
                      muted
                      loop
                      playsInline
                      autoPlay
                      preload="metadata"
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
