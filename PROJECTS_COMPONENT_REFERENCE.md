# Projects Grid Component - Complete Reference

## Component Overview

**Location:** `/src/pages/Projects.jsx` (237 lines)
**Styling:** `/src/pages/Projects.css` (493 lines)

The Projects component demonstrates:
1. **Hover Dominance Pattern** (non-hovered cards fade to 38% opacity)
2. **Asymmetrical Grid** (featured projects are larger)
3. **Strong Visual Hierarchy** (shadows, lifts, typography strengthening)
4. **Data Merging** (case studies + standalone projects)

---

## Data Loading Flow

### Step 1: Get Case Studies
```javascript
const caseStudyProjects = getAllProjects();  // From centralized mapper
```

### Step 2: Fetch Master Projects List
```javascript
fetch("/projects.json")
    .then((res) => res.json())
    .then(async (projectsList) => { ... })
```

### Step 3: Merge Case Studies with Metadata
```javascript
const caseStudyCards = await Promise.all(
    caseStudyProjects.map(async (project) => {
        const projectMeta = projectsList.find((p) => p.id === project.id) || {};
        return { ...projectMeta, ...project };  // Combine data
    })
);
```

### Step 4: Load Standalone Projects
```javascript
const standaloneCards = await Promise.all(
    standaloneEntries.map(async (entry) => {
        const res = await fetch(`/projects/${entry.id}/data.json`);
        if (!res.ok) return null;
        const data = await res.json();
        return { ...entry, ...data };
    })
);
```

### Step 5: Combine & Display
```javascript
setProjects([
    ...caseStudyCards,
    ...standaloneCards.filter(Boolean),
]);
```

---

## JSX Structure

### Hero Section
```jsx
<motion.section className="projects-hero"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
>
    <h1 className="projects-title">Selected Work</h1>
    <p className="projects-subtitle">
        {projects.length} {projects.length === 1 ? "project" : "projects"}
    </p>
</motion.section>
```

**CSS:**
```css
.projects-title {
    font-size: var(--font-size-4xl);        /* 48px */
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: var(--space-6);
    letter-spacing: var(--letter-spacing-tight);
}

.projects-subtitle {
    font-size: var(--font-size-base);
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin: 0;
}
```

---

### Loading State
```jsx
{loading ? (
    <div className="projects-loading">
        <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    </div>
) : (
    <section className="projects-grid">
        {/* Grid renders here */}
    </section>
)}
```

**CSS:**
```css
.projects-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-accent);
    border-radius: var(--radius-full);
    animation: spin 1s linear infinite;
}
```

---

### Projects Grid Layout

#### Grid Container
```jsx
<section className="projects-grid">
    {projects.map((project, index) => (
        <motion.div key={project.id} className="project-card">
            {/* Card content */}
        </motion.div>
    ))}
</section>
```

**CSS:**
```css
.projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-16);                   /* 64px gap */
    width: 100%;
    margin-top: var(--section-spacing-lg);
}
```

#### Asymmetrical Sizing
```css
/* Featured project (first) — LARGE */
.project-card:first-child {
    grid-column: 1 / 2;
    grid-row: span 2;                       /* Takes 2 vertical spaces */
}

/* Third project — also featured */
.project-card:nth-child(3) {
    grid-column: 2;
    grid-row: 1 / 3;                        /* Takes 2 vertical spaces */
}

/* Larger screens get 3-column layout */
@media (min-width: 1200px) {
    .projects-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .project-card:first-child {
        grid-column: span 2;                /* Spans 2 columns */
        grid-row: span 2;                   /* Spans 2 rows */
    }
}
```

---

### Individual Project Card

#### Card Container
```jsx
<motion.div
    key={project.id}
    className="project-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
        duration: 0.5,
        delay: 0.08 * index,                /* Staggered entrance */
        ease: [0.4, 0, 0.2, 1],
    }}
    onMouseEnter={() => setHoveredProject(project)}
    onMouseLeave={() => setHoveredProject(null)}
>
```

#### Card Link
```jsx
<Link to={getProjectPath(project.id)} className="project-card-link">
    {/* Card content */}
</Link>
```

**CSS:**
```css
.project-card-link {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--space-8);                /* 32px padding */
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    text-decoration: none;
    cursor: pointer;

    transition:
        background-color var(--duration-base) var(--ease-smooth),
        border-color var(--duration-base) var(--ease-smooth),
        box-shadow var(--duration-base) var(--ease-smooth),
        transform var(--duration-base) var(--ease-smooth),
        opacity var(--duration-base) var(--ease-smooth);
}

/* Default state */
.project-card-link {
    background-color: var(--color-bg);
    border-color: var(--color-border);
    box-shadow: none;
}

/* Hover state — STRONG elevation */
.project-card-link:hover {
    background-color: var(--color-bg-secondary);  /* White → off-white */
    border-color: var(--color-text-secondary);    /* Darker border */
    box-shadow: var(--shadow-lg);                 /* Strong shadow */
    transform: translateY(-4px);                  /* Lift up */
}
```

---

### Card Header (Title + Subtitle)
```jsx
<div className="project-card-header">
    <h3 className="project-card-title">
        {project.title}
    </h3>
    {(project.subtitle || project.tagline) && (
        <p className="project-card-subtitle">
            {project.subtitle || project.tagline}
        </p>
    )}
</div>
```

**CSS:**
```css
.project-card-header {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);                    /* 16px gap */
    margin-bottom: auto;                    /* Push metadata to bottom */
}

.project-card-title {
    font-size: var(--font-size-xl);         /* 24px */
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    transition:
        color var(--duration-base) var(--ease-smooth),
        font-weight 150ms var(--ease-smooth),
        opacity var(--duration-base) var(--ease-smooth);
}

/* Title strengthens on hover */
.project-card-link:hover .project-card-title {
    color: var(--color-accent);
    font-weight: 700;                       /* 600 → 700 */
}

/* Featured project titles are larger */
.project-card:first-child .project-card-title {
    font-size: clamp(var(--font-size-xl), 2.5vw, var(--font-size-3xl));
}

.project-card:nth-child(3) .project-card-title {
    font-size: clamp(var(--font-size-lg), 1.8vw, var(--font-size-2xl));
}

.project-card-subtitle {
    font-size: var(--font-size-base);       /* 16px */
    line-height: var(--line-height-relaxed);
    color: var(--color-text-secondary);
    margin: 0;

    transition:
        color var(--duration-base) var(--ease-smooth),
        opacity var(--duration-base) var(--ease-smooth);
}

.project-card-link:hover .project-card-subtitle {
    color: var(--color-text);               /* Darkens on hover */
    opacity: 0.9;
}
```

---

### Card Metadata (Category · Year)
```jsx
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
```

**CSS:**
```css
.project-card-meta {
    display: flex;
    align-items: center;
    gap: var(--space-4);                    /* 16px gap */
    margin-top: auto;                       /* Push to bottom */
    padding-top: var(--space-6);            /* 24px top */
    border-top: 1px solid var(--color-border);
    font-size: var(--font-size-xs);         /* 11px */
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 500;

    transition:
        border-color var(--duration-base) var(--ease-smooth),
        color var(--duration-base) var(--ease-smooth);
}

/* Border and text darken on hover */
.project-card-link:hover .project-card-meta {
    border-top-color: var(--color-text-secondary);
    color: var(--color-text-secondary);
}

.project-meta-dot {
    color: var(--color-border);
    font-weight: 300;
    transition: color var(--duration-base) var(--ease-smooth);
}

.project-card-link:hover .project-meta-dot {
    color: var(--color-text-secondary);
}
```

---

## Hover Dominance Pattern

### How It Works

**In CSS:**
```css
/* All cards fade when grid is hovered */
.projects-grid:hover .project-card-link {
    opacity: 0.38;                          /* De-emphasize */
}

/* Except the card being hovered becomes "the object" */
.project-card:hover .project-card-link {
    opacity: 1;                             /* Re-emphasize */
}

/* Mobile: don't punish touch users */
@media (max-width: 768px) {
    .projects-grid:hover .project-card-link {
        opacity: 1;                         /* All stay visible */
    }
}
```

**In JSX:**
```jsx
onMouseEnter={() => setHoveredProject(project)}    /* Track hovered */
onMouseLeave={() => setHoveredProject(null)}       /* Clear on leave */

{hoveredProject?.id === project.id && (
    <motion.div className="project-card-highlight">  /* Show highlight */
    </motion.div>
)}
```

### Visual Result
- **Grid hover:** All cards fade to 38% opacity (ghosted)
- **Card hover within grid:** Hovered card returns to 100% opacity
- **Card hover alone:** Standard hover effects apply
- **Mobile:** No fading (touch-friendly)

---

## Responsive Behavior

### Tablet (max-width: 1024px)
```css
.projects-grid {
    grid-template-columns: repeat(2, 1fr);
}
```

### Mobile (max-width: 768px)
```css
.projects-grid {
    grid-template-columns: 1fr;             /* Stack all cards */
    gap: var(--space-12);                   /* Slightly tighter */
}

.project-card-title {
    font-size: var(--font-size-lg);         /* Smaller on mobile */
}

.project-card-link {
    padding: var(--space-6);                /* Tighter padding */
}
```

---

## Design System Integration

| Element | Token Used | Purpose |
|---------|------------|---------|
| **Grid gap** | `var(--space-16)` | Generous breathing room |
| **Card padding** | `var(--space-8)` | Consistent internal spacing |
| **Card border** | `var(--color-border)` | Subtle definition |
| **Title font** | `var(--font-size-xl)` | Clear hierarchy |
| **Metadata font** | `var(--font-size-xs)` | Secondary information |
| **Hover shadow** | `var(--shadow-lg)` | Elevation feedback |
| **Transitions** | `var(--duration-base)` | Consistent timing |
| **Easing** | `var(--ease-smooth)` | Professional motion |

---

## Current Status ✅

✅ **Projects grid is fully optimized:**
- Hover dominance pattern working perfectly
- Asymmetrical grid creates visual interest
- Strong hover states provide feedback
- All tokens applied
- Responsive on all screen sizes

**Next:** ProjectDetail component review
