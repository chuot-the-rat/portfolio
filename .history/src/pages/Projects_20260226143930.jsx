import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  getAllProjects,
  getProjectPath,
  isStandaloneProject,
} from '../utils/projectDataMapper';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProject, setHoveredProject] = useState(null);

  useEffect(() => {
    try {
      const caseStudyProjects = getAllProjects();

      fetch('/projects.json')
        .then((res) => res.json())
        .then(async (projectsList) => {
          const caseStudyCards = await Promise.all(
            caseStudyProjects.map(async (project, index) => {
              const projectMeta =
                projectsList.find((p) => p.id === project.id) || {};

              return {
                ...projectMeta,
                ...project,
              };
            }),
          );

          const standaloneEntries = projectsList.filter((p) =>
            isStandaloneProject(p.id),
          );

          const standaloneCards = await Promise.all(
            standaloneEntries.map(async (entry) => {
              try {
                const res = await fetch(
                  `/projects/${entry.id}/data.json`,
                );
                if (!res.ok) return null;
                const data = await res.json();
                return {
                  ...entry,
                  ...data,
                };
              } catch {
                return null;
              }
            }),
          );

          setProjects([
            ...caseStudyCards,
            ...standaloneCards.filter(Boolean),
          ]);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading projects.json:", error);
          const projectsWithData = caseStudyProjects.map(
            (project, index) => ({
              ...project,
            }),
          );
          setProjects(projectsWithData);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error loading projects:", error);
      setLoading(false);
    }
  }, []);

  return (
    <div className="projects-page">
      <main className="projects-main">
        <motion.section
          className="projects-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="projects-title">Selected Work</h1>
          <p className="projects-subtitle">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </motion.section>

        {loading ? (
          <div className="projects-loading">
            <motion.div
              className="loading-spinner"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        ) : (
          <section className="projects-grid">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.08 * index,
                  ease: [0.4, 0, 0.2, 1],
                }}
                onMouseEnter={() => setHoveredProject(project)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <Link
                  to={getProjectPath(project.id)}
                  className="project-card-link"
                >
                  <div className="project-card-header">
                    <h3 className="project-card-title">{project.title}</h3>
                    {(project.subtitle || project.tagline) && (
                      <p className="project-card-subtitle">
                        {project.subtitle || project.tagline}
                      </p>
                    )}
                  </div>

                  <div className="project-card-meta">
                    {project.category && (
                      <>
                        <span className="project-meta-item">
                          {project.category}
                        </span>
                        <span className="project-meta-dot">·</span>
                      </>
                    )}
                    {project.year && (
                      <span className="project-meta-item">
                        {project.year}
                      </span>
                    )}
                  </div>

                  {hoveredProject?.id === project.id && (
                    <motion.div
                      className="project-card-highlight"
                      layoutId="project-highlight"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
