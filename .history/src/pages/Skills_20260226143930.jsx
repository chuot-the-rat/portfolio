import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import './Skills.css';

// Chaos mode skill data only
const skillsData = {
  design: {
    label: 'Design',
    skills: [
      { name: 'User Research', level: 'v2.0' },
      { name: 'Wireframing', level: 'v3.0' },
      { name: 'Prototyping', level: 'v3.0' },
      { name: 'User Testing', level: 'v1.0' },
      { name: 'User Flows', level: 'v2.0' },
      { name: 'Journey Mapping', level: 'v1.0' },
    ],
  },
  ui: {
    label: 'UI Design',
    skills: [
      { name: 'Figma', level: 'v3.0' },
      { name: 'Typography', level: 'v3.0' },
      { name: 'Color Theory', level: 'v3.0' },
      { name: 'Accessibility', level: 'v1.0' },
      { name: 'Responsive Design', level: 'v2.0' },
      { name: 'Design Systems', level: 'v1.0' },
    ],
  },
  development: {
    label: 'Development',
    skills: [
      { name: 'HTML/CSS', level: 'v3.0' },
      { name: 'JavaScript', level: 'v1.0' },
      { name: 'React', level: 'v1.0' },
      { name: 'Next.js', level: 'beta' },
      { name: 'Python', level: 'v1.0' },
      { name: 'Git/GitHub', level: 'v1.0' },
    ],
  },
  tools: {
    label: 'Tools',
    skills: [
      { name: 'Adobe Illustrator', level: 'v2.0' },
      { name: 'Photoshop', level: 'v1.0' },
      { name: 'After Effects', level: 'beta' },
      { name: 'Framer', level: 'v1.0' },
      { name: 'VS Code', level: 'v3.0' },
      { name: 'Notion', level: 'v3.0' },
    ],
  },
};

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="skills-page">
      <main className="skills-main">
        <motion.section
          className="skills-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="skills-title">Skills & Expertise</h1>
          <p className="skills-subtitle">
            A toolkit of design and development capabilities
          </p>
        </motion.section>

        <section
          ref={sectionRef}
          className={`skills-content ${isVisible ? 'visible' : ''}`}
        >
          {Object.entries(skillsData).map(([key, category], categoryIndex) => (
            <motion.div
              key={key}
              className="skills-category"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: categoryIndex * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <h2 className="skills-category-title">{category.label}</h2>

              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    className="skill-item"
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: categoryIndex * 0.1 + skillIndex * 0.05,
                    }}
                  >
                    <div className="skill-header">
                      <span className="skill-name">
                        {skill.name}
                        {hoveredSkill === skill.name && (
                          <motion.span
                            className="skill-indicator"
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -4 }}
                            transition={{ duration: 0.2 }}
                          >
                            →
                          </motion.span>
                        )}
                      </span>
                      <span className="skill-level">{skill.level}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}
