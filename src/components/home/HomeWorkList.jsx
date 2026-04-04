/**
 * HomeWorkList.jsx
 * Editorial project list for the home page.
 *
 * Layout: Sharleen Wang-style rows — image left, info right.
 * Category tabs (UX/UI · Motion Design · Graphic Design) filter the list.
 * Hovering a row cycles through project screenshots in the image panel.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { getProjectPath } from "../../utils/projectDataMapper";
import "./HomeWorkList.css";

const TABS = ["UX/UI", "Motion Design", "Graphic Design"];

// Map projects.json category values to the three tabs
const CATEGORY_MAP = {
  "UI/UX":            "UX/UI",
  "Web Design":       "UX/UI",
  "Mobile App":       "UX/UI",
  "Motion Graphics":  "Motion Design",
  "Packaging Design": "Graphic Design",
};

const IMAGE_CYCLE_MS = 1800;

export default function HomeWorkList({ projects }) {
  const [activeTab, setActiveTab]   = useState("UX/UI");
  const [hoveredId, setHoveredId]   = useState(null);
  const [cycleIdx, setCycleIdx]     = useState(0);
  const intervalRef                 = useRef(null);

  // Cycle through images while a row is hovered
  useEffect(() => {
    if (hoveredId) {
      intervalRef.current = setInterval(() => {
        setCycleIdx((i) => i + 1);
      }, IMAGE_CYCLE_MS);
    } else {
      clearInterval(intervalRef.current);
      setCycleIdx(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [hoveredId]);

  const filtered = projects.filter(
    (p) => (CATEGORY_MAP[p.category] ?? "UX/UI") === activeTab,
  );

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

      {/* ── Project rows ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="hw-list"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          {filtered.length === 0 ? (
            <p className="hw-empty">No projects in this category yet.</p>
          ) : (
            filtered.map((project, index) => {
              const isHovered = hoveredId === project.id;
              const isDimmed  = hoveredId !== null && !isHovered;
              const images    = project.allImages ?? [];
              const coverSrc  = project.coverImage
                ?? images[0]?.src
                ?? (project.thumbnail ? `/${project.thumbnail}` : null);
              const cycledSrc = isHovered && images.length > 1
                ? images[cycleIdx % images.length]?.src
                : coverSrc;

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
                  transition={{ duration: 0.42, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={()     => setHoveredId(project.id)}
                  onBlur={()      => setHoveredId(null)}
                >
                  <Link
                    to={getProjectPath(project.id)}
                    className="hw-item-link"
                  >
                    {/* Image panel */}
                    <div className="hw-item-image" aria-hidden="true">
                      <AnimatePresence mode="wait">
                        {cycledSrc ? (
                          <motion.img
                            key={cycledSrc}
                            src={cycledSrc}
                            alt=""
                            className="hw-item-img"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.45 }}
                          />
                        ) : (
                          <motion.div
                            key="placeholder"
                            className="hw-item-placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Info panel */}
                    <div className="hw-item-info">
                      <span className="hw-item-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3 className="hw-item-title">{project.title}</h3>

                      {(project.subtitle || project.tagline) && (
                        <p className="hw-item-desc">
                          {project.subtitle ?? project.tagline}
                        </p>
                      )}

                      <div className="hw-item-meta">
                        {project.role && (
                          <span className="hw-item-tag">
                            {Array.isArray(project.role)
                              ? project.role[0]
                              : project.role}
                          </span>
                        )}
                        {project.year && (
                          <span className="hw-item-tag">{project.year}</span>
                        )}
                        {project.category && (
                          <span className="hw-item-tag">{project.category}</span>
                        )}
                      </div>

                      <span className="hw-item-cta" aria-hidden="true">
                        View case study
                        <span className="hw-item-cta-arrow">→</span>
                      </span>
                    </div>
                  </Link>
                </motion.article>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
