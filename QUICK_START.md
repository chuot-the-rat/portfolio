# FIZZU Quick Start - Add to Existing Portfolio

## 🚀 5-Minute Integration

### Step 1: Add Project Data (2 minutes)

**File:** `projects.json`

```json
{
  "projects": [
    {
      "id": "fizzu-soda-cans",
      "folder": "projects/fizzu-soda-cans",
      "thumbnail": "projects/fizzu-soda-cans/images/kewpie.jpg",
      "title": "FIZZU Soda Can Series",
      "category": "Packaging Design · Illustration · Branding",
      "year": "2024",
      "featured": true
    }
    // ... your other projects
  ]
}
```

---

### Step 2: Copy Files (1 minute)

```bash
# Copy the fizzu-project folder to your portfolio
cp -r fizzu-project/ your-portfolio/projects/fizzu-soda-cans/
```

**Result:**
```
your-portfolio/
└── projects/
    └── fizzu-soda-cans/
        ├── data.json
        ├── images/
        │   ├── kewpie.jpg
        │   ├── yuzu.jpg
        │   └── ginger.jpg
        └── components/
            ├── ProjectCard.jsx
            ├── ProjectCard.css
            ├── FizzuProject.jsx
            └── fizzu-project.css
```

---

### Step 3: Install Dependencies (1 minute)

```bash
npm install framer-motion
```

---

### Step 4: Use the Components (1 minute)

**Option A: If you already have a project grid**

```jsx
// Your existing projects page
import ProjectCard from './components/ProjectCard';
import projects from './projects.json';

function ProjectsPage() {
  return (
    <div className="projects-grid">
      {projects.projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

**Option B: Manual integration**

```jsx
// Add FIZZU card manually
<ProjectCard 
  project={{
    id: "fizzu-soda-cans",
    thumbnail: "/projects/fizzu-soda-cans/images/kewpie.jpg",
    title: "FIZZU Soda Can Series",
    category: "Packaging Design · Illustration · Branding",
    featured: true
  }}
/>
```

---

## 🎨 Minimal CSS Setup

If you don't have CSS variables set up, add these to your global CSS:

```css
/* global.css or index.css */
:root {
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-accent: #0ea5e9;
  --color-accent-subtle: #e0f2fe;
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--color-text-primary);
  background: var(--color-neutral-50);
}
```

---

## 📱 Responsive Grid (Copy-Paste Ready)

```css
/* Add to your global CSS */
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .projects-grid {
    padding: 6rem 3rem;
  }
}
```

---

## ⚡ Ultra-Minimal Version (No Framer Motion)

If you want to avoid Framer Motion, use this CSS-only version:

```jsx
// SimpleProjectCard.jsx
import './ProjectCard.css';

const SimpleProjectCard = ({ project }) => {
  return (
    <a href={`/projects/${project.id}`} className="project-card">
      <div className="project-card__preview">
        <div className="project-card__image-wrap">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="project-card__image"
          />
        </div>
        <div className="project-card__overlay" />
      </div>

      <div className="project-card__content">
        <span className="project-card__category">
          {project.category}
        </span>
        <h3 className="project-card__title">
          {project.title}
          <span className="project-card__arrow">→</span>
        </h3>
        {project.featured && (
          <span className="project-card__badge">Featured</span>
        )}
      </div>
    </a>
  );
};
```

**CSS for hover effects:**

```css
.project-card {
  display: block;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
}

.project-card__image {
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.project-card:hover .project-card__image {
  transform: scale(1.05);
}

.project-card__arrow {
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s ease;
}

.project-card:hover .project-card__arrow {
  opacity: 1;
  transform: translateX(0);
}

.project-card__overlay {
  opacity: 0;
  transition: opacity 0.4s ease;
}

.project-card:hover .project-card__overlay {
  opacity: 1;
}
```

---

## 🎯 Just Want the Images?

If you just want to add FIZZU images to your existing setup:

```jsx
<div className="project">
  <img src="/projects/fizzu-soda-cans/images/kewpie.jpg" alt="Kewpie Pop" />
  <img src="/projects/fizzu-soda-cans/images/yuzu.jpg" alt="Ponzu Zing" />
  <img src="/projects/fizzu-soda-cans/images/ginger.jpg" alt="Ginger Zinger" />
  
  <h2>FIZZU Soda Can Series</h2>
  <p>
    A concept soda brand featuring bold, unexpected flavours brought to life
    through playful, graphic packaging. Each can uses strong colour blocking,
    simple illustrations, and flowing linework to suggest movement and flavour.
  </p>
</div>
```

---

## 🔥 Common Issues & Fixes

### Issue: Images not loading
```javascript
// Make sure paths are correct
// If using Next.js:
src="/projects/fizzu-soda-cans/images/kewpie.jpg"

// If using React (create-react-app):
src={require('./projects/fizzu-soda-cans/images/kewpie.jpg')}

// If using Vite:
src="/projects/fizzu-soda-cans/images/kewpie.jpg"
```

### Issue: Hover not working on mobile
```css
/* Add this to disable hover on touch devices */
@media (hover: hover) {
  .project-card:hover {
    transform: translateY(-4px);
  }
}
```

### Issue: Animation feels too slow/fast
```javascript
// Adjust duration in your component
transition={{ duration: 0.4 }} // Faster
transition={{ duration: 0.8 }} // Slower
```

---

## ✅ Quick Verification

After integrating, check:
- [ ] FIZZU card appears in project grid
- [ ] Hover reveals work smoothly
- [ ] Image loads correctly
- [ ] Click navigates to detail page (if set up)
- [ ] Looks good on mobile
- [ ] No console errors

---

## 🎨 Color Customization

Want to match your brand? Change these:

```css
:root {
  /* Change this to your brand color */
  --color-accent: #0ea5e9;  /* Currently sky blue */
  
  /* Examples: */
  /* --color-accent: #8b5cf6; Purple */
  /* --color-accent: #ec4899; Pink */
  /* --color-accent: #10b981; Green */
  /* --color-accent: #f59e0b; Orange */
}
```

---

## 💡 Next Steps

1. **Test it** - Make sure everything works
2. **Customize** - Match your brand colors
3. **Add detail page** - Use FizzuProject.jsx component
4. **Optimize** - Compress images, test performance
5. **Deploy** - Push to production!

---

**That's it!** You now have a professional packaging project in your portfolio.

Need the full integration with detail page? See `INTEGRATION_GUIDE.md`
