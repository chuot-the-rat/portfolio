# FIZZU Project - Simplified Visual Presentation

## 🎨 Design Principle
**This is NOT a case study.** FIZZU is a visual/branding project presented as a gallery piece.

**No:**
- ❌ Problem/solution sections
- ❌ Challenge/objectives
- ❌ Process timeline
- ❌ Research findings

**Yes:**
- ✅ Short description (2-3 paragraphs max)
- ✅ Visual system overview
- ✅ Clean can mockup grid
- ✅ Minimal captions

---

## 📐 Layout Structure

```
FIZZU Page Layout:

┌─────────────────────────────────────┐
│  Hero Section                       │
│  • Title                            │
│  • Category tag                     │
│  • Short description (2-3 para)     │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Three Can Grid                     │
│  [Can 1]  [Can 2]  [Can 3]         │
│  Kewpie   Ponzu    Ginger          │
│   Pop     Zing     Zinger          │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Visual Details (Optional)          │
│  • Short flavor notes               │
│  • Design approach in 1 sentence    │
└─────────────────────────────────────┘
```

---

## 📄 React Component

```jsx
// pages/projects/fizzu-soda-cans.jsx
import { motion } from 'framer-motion';
import Image from 'next/image';

const FizzuProject = () => {
  const cans = [
    {
      name: 'Kewpie Pop',
      color: '#E5B8CD',
      image: '/projects/fizzu/kewpie.jpg',
    },
    {
      name: 'Ponzu Zing',
      color: '#7EC8E3',
      image: '/projects/fizzu/yuzu.jpg',
    },
    {
      name: 'Ginger Zinger',
      color: '#F4EAA8',
      image: '/projects/fizzu/ginger.jpg',
    },
  ];

  return (
    <div className="project-page">
      {/* Hero Section */}
      <motion.section 
        className="project-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="project-hero__container">
          <motion.span 
            className="project-category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Packaging Design · Illustration · Branding
          </motion.span>
          
          <motion.h1 
            className="project-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            FIZZU Soda Can Series
          </motion.h1>

          <motion.div 
            className="project-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p>
              FIZZU is a concept soda brand featuring bold, unexpected flavours 
              brought to life through playful, graphic packaging. The goal was to 
              create a cohesive can series that stands out on shelf while keeping 
              each flavour instantly recognizable.
            </p>
            <p>
              The visual system uses strong colour blocking, simple illustrations, 
              and flowing linework to suggest movement, fizz, and flavour. Each can 
              follows the same structure, with distinct palettes and ingredient-inspired 
              graphics differentiating the three flavours at a glance.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Can Grid */}
      <section className="can-grid-section">
        <div className="can-grid">
          {cans.map((can, index) => (
            <motion.div
              key={can.name}
              className="can-item"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.4 + index * 0.1, 
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <div 
                className="can-item__image-wrap"
                style={{ backgroundColor: can.color }}
              >
                <Image
                  src={can.image}
                  alt={can.name}
                  width={600}
                  height={800}
                  className="can-item__image"
                />
              </div>
              <h3 className="can-item__name">{can.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Back Link */}
      <section className="project-footer">
        <a href="/projects" className="back-link">
          ← Back to Projects
        </a>
      </section>
    </div>
  );
};

export default FizzuProject;
```

---

## 🎨 Styles

```css
/* pages/fizzu.css */

/* =================================================================
   FIZZU PROJECT - SIMPLIFIED VISUAL PRESENTATION
   ================================================================= */

.project-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* Hero Section */
.project-hero {
  padding: 8rem 2rem 6rem;
  background: var(--bg-secondary);
}

.project-hero__container {
  max-width: 800px;
  margin: 0 auto;
}

.project-category {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.project-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.project-description {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.project-description p {
  margin-bottom: 1.5rem;
}

.project-description p:last-child {
  margin-bottom: 0;
}

/* Can Grid Section */
.can-grid-section {
  padding: 6rem 2rem;
}

.can-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 3rem;
}

.can-item {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.can-item__image-wrap {
  aspect-ratio: 3 / 4;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  transition: transform 300ms ease;
}

.can-item:hover .can-item__image-wrap {
  transform: translateY(-8px);
}

.can-item__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

.can-item:hover .can-item__image {
  transform: scale(1.05);
}

.can-item__name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  letter-spacing: -0.01em;
}

/* Footer */
.project-footer {
  padding: 4rem 2rem 6rem;
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 8px;
  text-decoration: none;
  transition: all 200ms ease;
}

.back-link:hover {
  background: var(--bg-elevated);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--accent-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .project-hero {
    padding: 4rem 1.5rem 3rem;
  }

  .can-grid-section {
    padding: 4rem 1.5rem;
  }

  .can-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .can-item__image-wrap {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .project-title {
    font-size: 2rem;
  }

  .project-description {
    font-size: 1rem;
  }

  .can-item__name {
    font-size: 1.25rem;
  }
}
```

---

## 📊 Comparison: FIZZU vs UX Projects

### FIZZU (Visual Project)
```
Structure:
├── Title + Category
├── 2-3 paragraph description
├── Can grid (visual showcase)
└── Back link

Content: ~200 words total
Emphasis: Visual presentation
Scrolling: Minimal
```

### UX Projects (Case Studies)
```
Structure:
├── Hero
├── Overview
├── Problem
├── Solution
├── Process
├── Outcomes
└── Next project

Content: 800-1500 words
Emphasis: Process + thinking
Scrolling: Multiple sections
```

---

## ✅ FIZZU Checklist

What to include:
- [x] Project title
- [x] Category tag
- [x] Short description (2-3 paragraphs)
- [x] Three can mockups in grid
- [x] Flavour names
- [x] Hover interactions

What NOT to include:
- [ ] ~~Problem statement~~
- [ ] ~~Objectives/goals~~
- [ ] ~~Design process timeline~~
- [ ] ~~Research section~~
- [ ] ~~Challenges faced~~
- [ ] ~~Outcomes/metrics~~

---

## 💡 Content Guidelines

### Description (Keep it brief)
**Good Example:**
```
FIZZU is a concept soda brand featuring bold, unexpected 
flavours brought to life through playful, graphic packaging. 
The goal was to create a cohesive can series that stands 
out on shelf while keeping each flavour instantly recognizable.

The visual system uses strong colour blocking, simple 
illustrations, and flowing linework to suggest movement, 
fizz, and flavour.
```

**Too Detailed (Avoid):**
```
The challenge was to design packaging that would appeal to 
Gen Z consumers while maintaining shelf presence in a crowded 
beverage market. Through extensive competitive analysis and 
user research, I identified that...
[This sounds like a case study - too much process detail]
```

---

## 🎯 Key Differences from Case Study

| Aspect | FIZZU (Visual) | UX Project (Case Study) |
|--------|----------------|------------------------|
| **Length** | Short (~200 words) | Long (800-1500 words) |
| **Structure** | Simple, flat | Multi-section |
| **Focus** | Visual showcase | Process + thinking |
| **Tone** | Gallery piece | Professional analysis |
| **Scrolling** | Minimal | Multiple sections |
| **Images** | Hero role | Supporting role |

---

## 🚀 Implementation

1. **Copy component** to `/pages/projects/fizzu-soda-cans.jsx`
2. **Add CSS** to your global styles or as module
3. **Add images** to `/public/projects/fizzu/`
4. **Update projects list** to link to FIZZU page
5. **Keep it simple** - resist urge to add more sections

---

**Remember:** FIZZU is a visual/branding showcase, not a UX case study. Let the work speak for itself with minimal text.
