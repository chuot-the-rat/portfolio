/**
 * Example App.jsx - Portfolio Integration
 * 
 * This file shows how to integrate the Skills, Education, and Contact sections
 * into your existing portfolio layout. Adapt this to your current App.jsx structure.
 */

import { useState, useEffect } from 'react';
import { SkillsSection, EducationSection, ContactSection } from './components';
import './components/SectionLayout.css';

// Your existing imports
// import { CaseStudyModal } from './components/CaseStudyModal';
// import projects from '../projects.json';

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  
  return (
    <div className="container">
      {/* ========================================
          SIDEBAR - Compact Section Variants
          ======================================== */}
      <aside className="sidebar">
        <div className="profile-section">
          <div className="profile-image">👋</div>
          <h1>Leana Le</h1>
          <p className="tagline">UI/UX Designer & Developer</p>
          <p className="bio">
            Digital Design and Development student at BCIT with a passion for
            creating thoughtful user experiences through research-driven design
            and clean code.
          </p>
          
          <div className="cta-buttons">
            <a href="/Le_Leana_Resume.pdf" className="cta-btn primary">
              <span className="cta-icon">📄</span>
              Download Resume
            </a>
            <a href="mailto:leanale003@gmail.com" className="cta-btn secondary">
              <span className="cta-icon">✉️</span>
              Get in Touch
            </a>
          </div>
        </div>

        {/* Compact Education in Sidebar */}
        <div className="sidebar-section">
          <h3 className="section-title">Education</h3>
          <div className="sidebar-education">
            <div className="edu-item">
              <span className="edu-year">2026</span>
              <span className="edu-school">BCIT Grad</span>
              <span className="edu-program">DDD</span>
              <span className="edu-degree">Diploma</span>
            </div>
          </div>
        </div>

        {/* Compact Skills in Sidebar - Uses the compact variant */}
        <SkillsSection variant="compact" />

        {/* Compact Contact in Sidebar */}
        <ContactSection variant="compact" />
      </aside>

      {/* ========================================
          MAIN CONTENT AREA
          ======================================== */}
      <main className="canvas-area">
        <header className="canvas-header">
          <h2 className="canvas-title">Selected Work</h2>
          <p className="canvas-subtitle">
            Drag to rearrange • Click to view case study
          </p>
        </header>

        <div className="canvas-instructions">
          💡 Click any project to explore the full case study
        </div>

        {/* Your existing project canvas */}
        <div className="project-canvas">
          {/* Project icons go here */}
        </div>

        {/* ========================================
            NEW SECTIONS - Full Editorial Layout
            Place these after the project canvas
            ======================================== */}
        <div className="sections-container">
          
          {/* Skills Section - Full Grid Layout */}
          <div className="section-wrapper">
            <SkillsSection variant="grid" />
          </div>

          {/* Education Section - Timeline Layout */}
          <div className="section-wrapper">
            <EducationSection variant="timeline" />
          </div>

          {/* Contact Section - With Optional Form */}
          <div className="section-wrapper">
            <ContactSection variant="full" showForm={true} />
          </div>

        </div>
      </main>

      {/* Your existing modal */}
      {/* <CaseStudyModal project={selectedProject} onClose={() => setSelectedProject(null)} /> */}
    </div>
  );
}

export default App;
