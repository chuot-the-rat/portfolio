import { useState, useEffect, useRef } from 'react';
import './EducationSection.css';

const educationData = [
  {
    id: 'bcit-ddd',
    institution: 'British Columbia Institute of Technology',
    program: 'Digital Design & Development',
    degree: 'Diploma',
    period: '2024 – 2026',
    status: 'In Progress',
    description:
      'Comprehensive program covering UI/UX design, front-end development, and digital product creation. Focus on user-centered design methodology and modern web technologies.',
    highlights: [
      'User Experience Design',
      'Front-End Development',
      'Design Systems',
      'Responsive Web Design',
    ],
  },
  {
    id: 'google-ux',
    institution: 'Google',
    program: 'UX Design Professional Certificate',
    degree: 'Certificate',
    period: '2023',
    status: 'Completed',
    description:
      'Industry-recognized certification covering the entire UX design process from research to prototyping and testing.',
    highlights: [
      'User Research',
      'Wireframing & Prototyping',
      'Usability Testing',
      'Design Thinking',
    ],
  },
];

export default function EducationSection({ variant = 'timeline' }) {
  const [expandedId, setExpandedId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section
      ref={sectionRef}
      className={`education-section ${variant} ${isVisible ? 'visible' : ''}`}
      aria-label="Education"
    >
      <header className="education-header">
        <span className="education-eyebrow">Background</span>
        <h2 className="education-title">Education</h2>
        <p className="education-description">
          Building a foundation in design thinking and technical implementation.
        </p>
      </header>

      <div className="education-timeline">
        {educationData.map((item, index) => (
          <article
            key={item.id}
            className={`education-entry ${expandedId === item.id ? 'expanded' : ''}`}
            style={{
              '--entry-delay': prefersReducedMotion.current
                ? '0ms'
                : `${index * 150}ms`,
            }}
          >
            <div className="education-timeline-marker">
              <span className="timeline-dot" aria-hidden="true" />
              {index < educationData.length - 1 && (
                <span className="timeline-line" aria-hidden="true" />
              )}
            </div>

            <div className="education-content">
              <header className="education-entry-header">
                <div className="education-meta">
                  <span className="education-period">{item.period}</span>
                  <span className={`education-status ${item.status.toLowerCase().replace(' ', '-')}`}>
                    {item.status}
                  </span>
                </div>
                
                <h3 className="education-program">{item.program}</h3>
                
                <div className="education-institution-row">
                  <span className="education-institution">{item.institution}</span>
                  <span className="education-degree">{item.degree}</span>
                </div>
              </header>

              <p className="education-description-text">{item.description}</p>

              {item.highlights && item.highlights.length > 0 && (
                <div className="education-highlights">
                  <span className="highlights-label">Focus Areas</span>
                  <ul className="highlights-list">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="highlight-item">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
