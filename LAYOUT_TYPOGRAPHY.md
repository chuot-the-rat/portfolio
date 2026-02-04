# Layout & Typography System

## 📐 Page Layouts

### Homepage Layout
```
┌─────────────────────────────────────┐
│  Theme Toggle              [☀️/🌙] │
├─────────────────────────────────────┤
│                                     │
│         Hero Section                │
│  • Large name/title                 │
│  • Short tagline                    │
│  • CTA buttons                      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      Selected Work Grid             │
│  [Project] [Project]                │
│  [Project] [Project]                │
│                                     │
├─────────────────────────────────────┤
│  About Section (Optional)           │
│  • Skills                           │
│  • Tools                            │
│  • Contact                          │
└─────────────────────────────────────┘
```

---

## 📝 Typography System

### Font Stack
```css
/* Primary - System Sans */
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                Roboto, 'Helvetica Neue', Arial, sans-serif;

/* Alternative - Modern Sans Options */
/* Option 1: Inter (recommended - clean, professional) */
@import url('https://rsms.me/inter/inter.css');
--font-primary: 'Inter', sans-serif;

/* Option 2: IBM Plex Sans (slightly warmer) */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
--font-primary: 'IBM Plex Sans', sans-serif;

/* Monospace (for code, tags) */
--font-mono: 'SF Mono', 'Roboto Mono', 'Courier New', monospace;
```

### Type Scale
```css
/* Size Scale (Major Third - 1.250 ratio) */
--text-xs: 0.75rem;      /* 12px - Micro labels */
--text-sm: 0.875rem;     /* 14px - Small labels, captions */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Large body */
--text-xl: 1.25rem;      /* 20px - Small headings */
--text-2xl: 1.563rem;    /* 25px - Subheadings */
--text-3xl: 1.953rem;    /* 31px - Section headers */
--text-4xl: 2.441rem;    /* 39px - Page titles */
--text-5xl: 3.052rem;    /* 49px - Hero titles */
--text-6xl: 3.815rem;    /* 61px - Display text */
```

### Font Weights
```css
--font-normal: 400;      /* Body text */
--font-medium: 500;      /* Emphasis */
--font-semibold: 600;    /* Headings, buttons */
--font-bold: 700;        /* Titles, strong emphasis */
```

### Line Heights
```css
--leading-tight: 1.2;    /* Large headings */
--leading-snug: 1.4;     /* Smaller headings */
--leading-normal: 1.6;   /* Body text */
--leading-relaxed: 1.8;  /* Comfortable reading */
```

### Letter Spacing
```css
--tracking-tight: -0.02em;   /* Large headings */
--tracking-normal: 0em;      /* Body text */
--tracking-wide: 0.02em;     /* Small text */
--tracking-wider: 0.05em;    /* Uppercase labels */
--tracking-widest: 0.1em;    /* Category tags */
```

---

## 🎯 Typography Usage

### Headlines
```css
/* Hero Title (Homepage) */
.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

/* Page Title */
.page-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

/* Section Heading */
.section-heading {
  font-size: 1.953rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

/* Card Title */
.card-title {
  font-size: 1.563rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}
```

### Body Text
```css
/* Large Body (Intros, emphasis) */
.text-large {
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: 0;
  color: var(--text-primary);
}

/* Body Text */
.text-body {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0;
  color: var(--text-secondary);
}

/* Small Text */
.text-small {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0;
  color: var(--text-secondary);
}
```

### Labels & Tags
```css
/* Category Tag */
.category-tag {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}

/* Badge */
.badge {
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--accent-primary);
}
```

---

## 📏 Spacing System

### Grid System
```css
/* Container widths */
--container-sm: 640px;   /* Narrow content */
--container-md: 768px;   /* Text-heavy pages */
--container-lg: 1024px;  /* Standard */
--container-xl: 1280px;  /* Wide layouts */
--container-2xl: 1536px; /* Max width */

/* Default container */
.container {
  width: 100%;
  max-width: var(--container-lg);
  margin: 0 auto;
  padding: 0 2rem;
}
```

### Spacing Scale (8px base)
```css
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */
```

### Spacing Usage
```css
/* Section Padding */
section {
  padding: var(--space-24) 0; /* 96px top/bottom */
}

/* Card Spacing */
.card {
  padding: var(--space-6);    /* 24px internal */
  margin-bottom: var(--space-8); /* 32px between */
}

/* Element Gaps */
.heading + .text {
  margin-top: var(--space-4);  /* 16px */
}

/* Component Spacing */
.button-group {
  gap: var(--space-3);         /* 12px between buttons */
}
```

---

## 🎨 Layout Examples

### Hero Section
```jsx
<section className="hero">
  <div className="container">
    <h1 className="hero-title">Leana Le</h1>
    <p className="hero-subtitle">UI/UX Designer & Developer</p>
    <p className="hero-description">
      Digital Design and Development student at BCIT creating 
      thoughtful user experiences through research-driven design.
    </p>
    <div className="hero-actions">
      <a href="/resume.pdf" className="button button--primary">
        Download Resume
      </a>
      <a href="mailto:hello@leanale.com" className="button button--secondary">
        Get in Touch
      </a>
    </div>
  </div>
</section>
```

```css
.hero {
  padding: 8rem 2rem 6rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--divider);
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 600px;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
```

---

### Project Grid
```jsx
<section className="projects">
  <div className="container">
    <header className="section-header">
      <h2 className="section-heading">Selected Work</h2>
      <p className="section-description">
        UX/UI design and visual projects
      </p>
    </header>
    
    <div className="projects-grid">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  </div>
</section>
```

```css
.projects {
  padding: 6rem 2rem;
}

.section-header {
  margin-bottom: 4rem;
}

.section-heading {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
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
```

---

## 🎯 Buttons & CTAs

```jsx
// Button Component
const Button = ({ children, variant = 'primary', ...props }) => {
  return (
    <button className={`button button--${variant}`} {...props}>
      {children}
    </button>
  );
};
```

```css
/* Base Button */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* Primary Button */
.button--primary {
  background: var(--accent-primary);
  color: white;
}

.button--primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Secondary Button */
.button--secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.button--secondary:hover {
  background: var(--bg-elevated);
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Ghost Button */
.button--ghost {
  background: transparent;
  color: var(--text-primary);
}

.button--ghost:hover {
  background: var(--bg-tertiary);
}
```

---

## 📱 Responsive Typography

```css
/* Responsive Type Scale */
@media (max-width: 768px) {
  :root {
    --text-5xl: 2.5rem;   /* Reduce large headings */
    --text-4xl: 2rem;
    --text-3xl: 1.75rem;
  }
}

@media (max-width: 480px) {
  :root {
    --text-5xl: 2rem;     /* Further reduce on mobile */
    --text-4xl: 1.75rem;
    --text-3xl: 1.5rem;
  }
}

/* Responsive Spacing */
@media (max-width: 768px) {
  section {
    padding: var(--space-16) 0; /* Reduce from 96px to 64px */
  }
  
  .container {
    padding: 0 1.5rem;
  }
}

@media (max-width: 480px) {
  section {
    padding: var(--space-12) 0; /* Further reduce to 48px */
  }
  
  .container {
    padding: 0 1rem;
  }
}
```

---

## ✅ Typography Best Practices

### Readability
```css
/* Optimal line length: 60-75 characters */
.text-content {
  max-width: 65ch;
}

/* Comfortable line height for body text */
p {
  line-height: 1.6;
}

/* Tighter for headings */
h1, h2, h3 {
  line-height: 1.2;
}
```

### Hierarchy
```
1. Hero Title (largest, boldest)
   ↓
2. Page Title
   ↓
3. Section Heading
   ↓
4. Card Title
   ↓
5. Body Text
   ↓
6. Small Text / Captions
```

### Consistency
- Use the same font family throughout
- Stick to 4-5 font sizes max per page
- Consistent spacing between elements
- Clear visual rhythm

---

## 🎨 Dark Mode Adjustments

```css
/* Slightly increase font weight in dark mode for better readability */
[data-theme="dark"] {
  --font-normal: 450;  /* Slightly heavier than 400 */
  --font-medium: 550;  /* Slightly heavier than 500 */
}

/* Reduce letter spacing slightly in dark mode */
[data-theme="dark"] h1,
[data-theme="dark"] h2,
[data-theme="dark"] h3 {
  letter-spacing: -0.015em;
}
```

---

**This typography and layout system provides a solid foundation for a professional, minimal portfolio that works beautifully in both light and dark modes.**
