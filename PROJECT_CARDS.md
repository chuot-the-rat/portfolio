# Project Cards & Hover Interactions

## 🎴 Project Card Design

### Visual Hierarchy
```
Card Structure:
┌─────────────────────────────┐
│                             │
│    [Project Thumbnail]      │ ← Image preview
│                             │
├─────────────────────────────┤
│  Category                   │ ← Small, uppercase
│  Project Title           →  │ ← Large, bold, arrow on hover
│  Short Description          │ ← Optional teaser
└─────────────────────────────┘
```

---

## 📦 Component Code

```jsx
// components/ProjectCard.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/projects/${project.slug}`}>
      <motion.article
        className="project-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Image Container */}
        <div className="project-card__media">
          <motion.div
            className="project-card__image-wrap"
            animate={{
              scale: isHovered ? 1.03 : 1,
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={project.thumbnail}
              alt={project.title}
              className="project-card__image"
            />
          </motion.div>

          {/* Subtle overlay on hover */}
          <motion.div
            className="project-card__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="project-card__content">
          <motion.span
            className="project-card__category"
            animate={{
              opacity: isHovered ? 0.6 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {project.category}
          </motion.span>

          <h3 className="project-card__title">
            <motion.span
              animate={{
                x: isHovered ? 4 : 0,
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {project.title}
            </motion.span>
            
            <motion.span
              className="project-card__arrow"
              animate={{
                x: isHovered ? 4 : 0,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              →
            </motion.span>
          </h3>

          {project.description && (
            <p className="project-card__description">
              {project.description}
            </p>
          )}
        </div>
      </motion.article>
    </Link>
  );
};

export default ProjectCard;
```

---

## 🎨 Styles

```css
/* components/ProjectCard.css */

.project-card {
  display: block;
  text-decoration: none;
  cursor: pointer;
  margin-bottom: 4rem;
  color: inherit;
}

/* Media Container */
.project-card__media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 12px;
  background: var(--bg-tertiary);
  margin-bottom: 1.5rem;
}

.project-card__image-wrap {
  width: 100%;
  height: 100%;
}

.project-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Subtle overlay */
.project-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--shadow-color) 100%
  );
  pointer-events: none;
}

/* Content */
.project-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.project-card__category {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  transition: opacity 200ms ease;
}

.project-card__title {
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.project-card__arrow {
  font-size: 1.5rem;
  color: var(--accent-primary);
}

.project-card__description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  max-width: 90%;
}

/* Hover state for entire card */
@media (hover: hover) {
  .project-card:hover {
    /* Subtle lift - optional */
  }
}

/* Responsive */
@media (max-width: 768px) {
  .project-card {
    margin-bottom: 3rem;
  }

  .project-card__title {
    font-size: 1.5rem;
  }

  .project-card__media {
    aspect-ratio: 4 / 3;
  }
}
```

---

## 📐 Project Grid Layout

```jsx
// pages/projects/index.jsx
import ProjectCard from '@/components/ProjectCard';

const ProjectsPage = ({ projects }) => {
  return (
    <div className="projects-page">
      <section className="projects-hero">
        <div className="container">
          <h1 className="projects-title">Selected Work</h1>
          <p className="projects-subtitle">
            UX/UI design and visual projects
          </p>
        </div>
      </section>

      <section className="projects-grid-section">
        <div className="container">
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
```

```css
/* pages/projects.css */

.projects-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* Hero */
.projects-hero {
  padding: 8rem 2rem 4rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--divider);
}

.projects-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.projects-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Grid */
.projects-grid-section {
  padding: 6rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6rem;
}

@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 4rem 3rem;
  }
}

@media (min-width: 1200px) {
  .projects-grid {
    gap: 6rem 4rem;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .projects-hero {
    padding: 4rem 1.5rem 3rem;
  }

  .projects-grid-section {
    padding: 4rem 1.5rem;
  }
}
```

---

## 🎭 Hover Behavior Details

### Animation Timing
```javascript
// Smooth, refined motion
const transitions = {
  imageScale: {
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1], // Expo out
  },
  
  titleSlide: {
    duration: 0.3,
    ease: [0.22, 1, 0.36, 1],
  },
  
  overlayFade: {
    duration: 0.3,
    ease: 'easeOut',
  },
};
```

### Movement Scale
```
Image zoom:    1.00 → 1.03  (3% - very subtle)
Title shift:   0px → 4px    (Small horizontal slide)
Arrow reveal:  opacity 0 → 1
```

### Color Changes
```css
/* Light mode hover */
Category text: opacity 1 → 0.6

/* Dark mode hover */
Category text: opacity 1 → 0.6
```

---

## 🎨 Theme-Specific Adjustments

### Light Mode
```css
/* Softer shadows, minimal overlay */
[data-theme="light"] .project-card__overlay {
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.02) 100%
  );
}
```

### Dark Mode
```css
/* Stronger contrast, subtle glow */
[data-theme="dark"] .project-card__overlay {
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
}

[data-theme="dark"] .project-card__media {
  /* Optional: subtle border in dark mode */
  border: 1px solid var(--border);
}
```

---

## 📱 Mobile Considerations

### Touch Devices
```css
/* Disable hover effects on touch */
@media (hover: none) {
  .project-card__overlay {
    opacity: 0 !important;
  }
  
  .project-card__arrow {
    opacity: 0.5;
  }
}
```

### Performance
```css
/* Use transform for animations (GPU accelerated) */
.project-card__image-wrap {
  will-change: transform;
}

/* Remove will-change after animation */
.project-card:not(:hover) .project-card__image-wrap {
  will-change: auto;
}
```

---

## 🎯 Interaction States

### Default
```
Image: scale(1)
Title: translateX(0)
Arrow: opacity 0
Overlay: opacity 0
Category: opacity 1
```

### Hover
```
Image: scale(1.03)
Title: translateX(4px)
Arrow: opacity 1, translateX(4px)
Overlay: opacity 1
Category: opacity 0.6
```

### Focus (Keyboard)
```css
.project-card:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 4px;
  border-radius: 12px;
}
```

### Active (Click)
```css
.project-card:active .project-card__media {
  transform: scale(0.99);
  transition: transform 150ms ease;
}
```

---

## ✅ Accessibility

```jsx
// Proper semantic HTML
<Link href={`/projects/${project.slug}`}>
  <article 
    className="project-card"
    aria-label={`View ${project.title} project`}
  >
    {/* Content */}
  </article>
</Link>
```

```css
/* Focus states */
.project-card:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 4px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .project-card *,
  .project-card *::before,
  .project-card *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 💡 Design Principles

### Subtlety
- Small movements (4px max horizontal)
- Low scale factors (1.03x)
- Quick timing (300-500ms)
- Smooth easing

### Clarity
- Arrow clearly indicates clickability
- Category fades to reduce clutter
- Title shifts forward
- Image responds to attention

### Performance
- GPU-accelerated transforms
- Will-change used sparingly
- No layout shifts
- Smooth 60fps animations

### Consistency
- All cards behave the same
- Same timing across interactions
- Predictable behavior
- Works in both themes

---

**Remember:** Interactions should feel natural and refined, not flashy. Every animation has a purpose—guiding attention and confirming interactivity.
