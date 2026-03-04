# Portfolio Refactor - Code Templates & Examples

## FILE TEMPLATES

---

## 1. UPDATED App.jsx TEMPLATE

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Education from './pages/Education';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navigation />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/education" element={<Education />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
```

**Key Changes:**
- ❌ Removed: `<ModeProvider>`
- ❌ Removed: `useMode()` hook
- ✅ Added: Route structure for 6+ pages
- ✅ Added: Navigation component in layout
- ✅ Added: Footer component in layout

---

## 2. NAVIGATION COMPONENT TEMPLATE

```jsx
// src/components/Navigation.jsx
import { Link, useLocation } from 'react-router-dom';
import navItems from '../data/navItems';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          YourName
        </Link>

        <ul className="nav-menu">
          {navItems.map(item => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
```

---

## 3. NAVIGATION DATA FILE

```javascript
// src/data/navItems.js
export default [
  {
    path: '/',
    label: 'Home',
  },
  {
    path: '/about',
    label: 'About',
  },
  {
    path: '/projects',
    label: 'Projects',
  },
  {
    path: '/skills',
    label: 'Skills',
  },
  {
    path: '/education',
    label: 'Education',
  },
  {
    path: '/contact',
    label: 'Contact',
  },
];
```

---

## 4. NAVIGATION STYLESHEET TEMPLATE

```css
/* src/components/Navigation.css */

.navbar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-logo:hover {
  color: #0066cc;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #0066cc;
  border-bottom-color: #0066cc;
}

.nav-link.active {
  color: #0066cc;
  border-bottom-color: #0066cc;
}

/* Mobile responsive (optional) */
@media (max-width: 768px) {
  .nav-menu {
    gap: 1rem;
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background-color: #fff;
    padding: 1rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    display: none;
  }

  .nav-menu.active {
    display: flex;
  }
}
```

---

## 5. PAGE COMPONENT TEMPLATE

```jsx
// src/pages/[PageName].jsx
import { Helmet } from 'react-helmet'; // Optional: for SEO
import './[PageName].css';

export default function [PageName]() {
  return (
    <div className="[page-name]-page">
      <Helmet>
        <title>[Page Title] | Your Name</title>
        <meta name="description" content="Page description here" />
      </Helmet>

      <section className="page-header">
        <div className="container">
          <h1>[Page Title]</h1>
          <p className="subtitle">Subtitle or description</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          {/* Page-specific content here */}
        </div>
      </section>
    </div>
  );
}
```

---

## 6. HOME PAGE REFACTORED

```jsx
// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section - Keep ONLY chaos mode version */}
      <section className="hero">
        <div className="hero-content">
          <h1>Hi, I'm [Your Name]</h1>
          <p>Full-stack designer & developer creating beautiful digital experiences</p>
          <div className="hero-cta">
            <Link to="/projects" className="btn btn-primary">
              View My Work
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="featured-projects">
        <div className="container">
          <h2>Featured Projects</h2>
          <p className="section-subtitle">Selection of my recent work</p>
          
          <div className="projects-grid">
            {/* Show 3-4 featured projects */}
            {/* This would typically map through data */}
          </div>

          <div className="section-cta">
            <Link to="/projects" className="btn btn-outline">
              View All Projects →
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Skills Overview */}
      <section className="skills-preview">
        <div className="container">
          <h2>What I Do</h2>
          <p className="section-subtitle">Core skills & expertise</p>
          
          <div className="skills-summary">
            {/* Show skill categories */}
            {/* Link to full skills page */}
          </div>

          <div className="section-cta">
            <Link to="/skills" className="btn btn-outline">
              Learn More About My Skills →
            </Link>
          </div>
        </div>
      </section>

      {/* About Quick Intro */}
      <section className="about-preview">
        <div className="container">
          <h2>About Me</h2>
          <p className="section-subtitle">Brief introduction</p>
          
          <p className="about-excerpt">
            [Brief 2-3 sentence bio highlighting who you are and what you do]
          </p>

          <div className="section-cta">
            <Link to="/about" className="btn btn-outline">
              Read Full Story →
            </Link>
          </div>
        </div>
      </section>

      {/* Call To Action - Contact */}
      <section className="cta-section">
        <div className="container">
          <h2>Let's Work Together</h2>
          <p>Interested in collaborating? Let's talk!</p>
          
          <Link to="/contact" className="btn btn-primary btn-large">
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
```

---

## 7. SKILLS DATA FILE (CLEANED)

```javascript
// src/data/skillsData.js
// ❌ REMOVED: symbol, code, ascii properties (work mode only)
// ✅ KEPT: Simple chaos mode structure

export const skillsData = {
  design: [
    { name: 'UI/UX Design', level: 90 },
    { name: 'Figma', level: 90 },
    { name: 'Prototyping', level: 85 },
    { name: 'Design Systems', level: 80 },
    { name: 'User Research', level: 75 },
  ],
  frontend: [
    { name: 'React', level: 90 },
    { name: 'JavaScript', level: 90 },
    { name: 'HTML/CSS', level: 95 },
    { name: 'Responsive Design', level: 90 },
    { name: 'Framer Motion', level: 85 },
  ],
  tools: [
    { name: 'Git/GitHub', level: 90 },
    { name: 'VS Code', level: 90 },
    { name: 'Adobe XD', level: 80 },
    { name: 'Notion', level: 85 },
  ],
};

export const skillCategories = Object.keys(skillsData);
```

**What was DELETED:**
```javascript
// ❌ REMOVED work mode skill structure (looked like this):
// {
//   name: 'React',
//   level: 90,
//   symbol: '⚛️',
//   code: 'REACT',
//   ascii: '[▓▓▓▓▓░░░░]'  // ASCII bar
// }

// ❌ REMOVED work mode data file entirely
// ❌ REMOVED ASCII animation code that rendered these
```

---

## 8. SKILLS PAGE (REFACTORED)

```jsx
// src/pages/Skills.jsx
// This is refactored from SkillsSection.jsx
// ❌ REMOVED: useMode() hook
// ❌ REMOVED: workModeSkillsData
// ❌ REMOVED: ASCII animations
// ✅ KEPT: Chaos mode structure only

import { skillsData, skillCategories } from '../data/skillsData';
import './Skills.css';

export default function Skills() {
  return (
    <div className="skills-page">
      <section className="page-header">
        <div className="container">
          <h1>Skills & Experience</h1>
          <p className="subtitle">Technologies and expertise I've developed</p>
        </div>
      </section>

      <section className="skills-content">
        <div className="container">
          <div className="skills-grid">
            {skillCategories.map(category => (
              <div key={category} className="skill-category">
                <h2 className="category-title">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>

                <div className="skills-list">
                  {skillsData[category].map(skill => (
                    <div key={skill.name} className="skill-item">
                      <div className="skill-header">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div 
                          className="skill-progress"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 9. PROJECTS DATA FILE

```javascript
// src/data/projectsData.js
// ❌ REMOVED: Terminal-style project variation
// ✅ UNIFIED: Single project structure for all

export const projectsData = [
  {
    id: 1,
    title: 'Project Title',
    description: 'Brief description of the project',
    longDescription: 'Longer description with more details',
    technologies: ['React', 'JavaScript', 'CSS', 'Figma'],
    image: '/images/project1.jpg',
    date: '2024',
    link: 'https://project-link.com',
    github: 'https://github.com/username/project',
    featured: true,
  },
  {
    id: 2,
    title: 'Another Project',
    description: 'Project description',
    longDescription: 'More details here',
    technologies: ['React', 'Next.js', 'TailwindCSS'],
    image: '/images/project2.jpg',
    date: '2024',
    link: 'https://another-project.com',
    github: 'https://github.com/username/another-project',
    featured: true,
  },
  // ... more projects
];

export const getFeaturedProjects = (count = 3) => 
  projectsData.filter(p => p.featured).slice(0, count);
```

---

## 10. PROJECTS PAGE TEMPLATE

```jsx
// src/pages/Projects.jsx
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projectsData';
import './Projects.css';

export default function Projects() {
  return (
    <div className="projects-page">
      <section className="page-header">
        <div className="container">
          <h1>My Projects</h1>
          <p className="subtitle">A selection of work I'm proud of</p>
        </div>
      </section>

      <section className="projects-content">
        <div className="container">
          <div className="projects-grid">
            {projectsData.map(project => (
              <article key={project.id} className="project-card">
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>

                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  <div className="project-tech">
                    {project.technologies.map(tech => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="project-links">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      View Project →
                    </a>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        GitHub →
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 11. ABOUT PAGE TEMPLATE

```jsx
// src/pages/About.jsx
import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <section className="page-header">
        <div className="container">
          <h1>About Me</h1>
          <p className="subtitle">My story, background, and what drives me</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Who I Am</h2>
              <p>
                [Your biographical information and professional background]
              </p>

              <h2>What I Do</h2>
              <p>
                [What you're passionate about and your professional focus]
              </p>

              <h2>Beyond Work</h2>
              <p>
                [Personal interests and hobbies]
              </p>
            </div>

            <div className="about-sidebar">
              {/* Optional: Photo, quick facts, etc. */}
            </div>
          </div>

          <div className="about-cta">
            <h3>Ready to collaborate?</h3>
            <Link to="/contact" className="btn btn-primary">
              Let's Talk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 12. CONTACT PAGE TEMPLATE

```jsx
// src/pages/Contact.jsx
import { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission (email service, etc.)
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page">
      <section className="page-header">
        <div className="container">
          <h1>Get In Touch</h1>
          <p className="subtitle">Let's talk about your project</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>

            <div className="contact-info">
              <h3>Let's Connect</h3>
              <p>Email: your.email@example.com</p>
              <p>Location: City, Country</p>
              
              <div className="social-links">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 13. 404 NOT FOUND PAGE

```jsx
// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>Sorry, the page you're looking for doesn't exist.</p>
          
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## 14. BASIC PAGE CSS TEMPLATE

```css
/* src/pages/[PageName].css */

/* Page Container */
.page-container {
  min-height: calc(100vh - 70px); /* Subtract navbar height */
  padding: 2rem 0;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 1rem;
  text-align: center;
}

.page-header h1 {
  font-size: 3rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.page-header .subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
}

/* Page Content */
.page-content {
  padding: 3rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Section Spacing */
section {
  margin-bottom: 4rem;
}

section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

/* CTA Buttons */
.section-cta {
  text-align: center;
  margin-top: 3rem;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background-color: #667eea;
  color: white;
}

.btn-primary:hover {
  background-color: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background-color: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background-color: #667eea;
  color: white;
}

.btn-outline {
  background-color: transparent;
  color: #333;
  border: 2px solid #333;
}

.btn-outline:hover {
  background-color: #333;
  color: white;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .page-header {
    padding: 2rem 1rem;
  }

  .page-content {
    padding: 2rem 0;
  }

  section {
    margin-bottom: 2rem;
  }
}
```

---

## 15. EXAMPLE: CLEANING CSS (BEFORE & AFTER)

### BEFORE (with mode variations):
```css
/* Home.css - OLD VERSION WITH MODE LOGIC */

.mode-chaos .hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
}

.mode-work .hero {
  background: #000;
  color: #0f0;
  font-family: 'Courier New', monospace;
  border: 1px solid #0f0;
  padding: 3rem 2rem;
}

.mode-work .hero::before {
  content: '$ ';
  color: #0f0;
}

.mode-chaos .projects-header {
  font-size: 2rem;
  font-weight: bold;
}

.mode-work .projects-header {
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.mode-chaos .skill-item {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
}

.mode-work .skill-item {
  background: #000;
  color: #0f0;
  border: 1px solid #0f0;
  font-family: monospace;
}

.mode-work .skill-bar {
  display: none;
}

.mode-chaos .skill-bar {
  display: block;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
}
```

### AFTER (mode-free):
```css
/* Home.css - REFACTORED, SINGLE VERSION ONLY */

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
}

.projects-header {
  font-size: 2rem;
  font-weight: bold;
}

.skill-item {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
}

.skill-bar {
  display: block;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin-top: 0.5rem;
}
```

**Changes:**
- ✅ Removed all `.mode-chaos` and `.mode-work` prefixes
- ✅ Removed conditional display logic
- ✅ Kept only the clean design (chaos version)
- ✅ Deleted all terminal/work mode styling entirely
- ✅ Much simpler, easier to maintain

---

## 16. COMMON CLEANUP PATTERNS

### Pattern 1: Removing useMode Hook
```jsx
// BEFORE
import { useMode } from '../contexts/ModeContext';

export default function Component() {
  const { mode } = useMode();

  return mode === 'WORK' ? <TerminalVersion /> : <ModernVersion />;
}

// AFTER
export default function Component() {
  return <ModernVersion />;
}
```

### Pattern 2: Removing Conditional CSS
```css
/* BEFORE */
.mode-work .header { font-family: monospace; }
.mode-chaos .header { font-family: 'San Francisco', sans-serif; }

/* AFTER */
.header { font-family: 'San Francisco', sans-serif; }
```

### Pattern 3: Removing Data Duplication
```javascript
// BEFORE
const workModeSkillsData = [
  { name: 'React', symbol: '⚛️', code: 'REACT', ascii: '[▓▓▓░░░░]' }
];

const chaosModeSkillsData = [
  { name: 'React', level: 90 }
];

// AFTER
const skillsData = [
  { name: 'React', level: 90 }
];
```

---

## 17. VALIDATION SCRIPT

You can run this to verify mode removal was successful:

```bash
#!/bin/bash
# verify-mode-removal.sh

echo "Checking for remaining mode references..."

echo ""
echo "1. Searching for useMode hook..."
if grep -r "useMode" src/ --include="*.jsx" --include="*.js" 2>/dev/null | head -5; then
  echo "   ⚠️  Found useMode references! Should be 0."
else
  echo "   ✅ No useMode references found"
fi

echo ""
echo "2. Searching for ModeContext..."
if grep -r "ModeContext" src/ --include="*.jsx" --include="*.js" 2>/dev/null | head -5; then
  echo "   ⚠️  Found ModeContext references! Should be 0."
else
  echo "   ✅ No ModeContext references found"
fi

echo ""
echo "3. Searching for .mode- CSS selectors..."
if grep -r "\.mode-" src/ --include="*.css" 2>/dev/null | head -5; then
  echo "   ⚠️  Found .mode- CSS selectors! Should be 0."
else
  echo "   ✅ No .mode- CSS selectors found"
fi

echo ""
echo "4. Searching for mode=... patterns..."
if grep -r "mode\s*=" src/ --include="*.jsx" --include="*.js" 2>/dev/null | grep -v "// " | head -5; then
  echo "   ⚠️  Found mode assignment patterns! Should be 0."
else
  echo "   ✅ No mode assignment patterns found"
fi

echo ""
echo "✅ Verification complete!"
```

---

## SUMMARY

This refactor transforms your portfolio from a **mode-based single page** to a **navigation-based multi-page site** by:

1. **Removing mode system** entirely (ModeContext, ModeSwitcher, all mode CSS)
2. **Creating dedicated pages** for different sections
3. **Extracting data** into organized files
4. **Implementing navigation** for site-wide menu
5. **Cleaning CSS** to remove all mode logic
6. **Keeping chaos design** as the single design system
7. **Improving maintainability** and scalability

Result: A cleaner, more professional, easier-to-maintain portfolio! 🎉
