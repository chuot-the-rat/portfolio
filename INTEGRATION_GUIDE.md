# FIZZU Project Integration Guide

## Overview
This guide explains how to integrate the FIZZU Soda Can Series project into your portfolio with minimal, professional design inspired by jackiehu.design.

---

## 📁 File Structure

```
portfolio/
├── data/
│   └── fizzu-project/
│       ├── data.json                 # Complete project data
│       └── images/
│           ├── kewpie.jpg
│           ├── yuzu.jpg
│           └── ginger.jpg
├── components/
│   └── ProjectCard.jsx               # Reusable card component
├── pages/
│   └── projects/
│       └── fizzu-soda-cans.jsx       # Project detail page
└── styles/
    ├── components/
    │   └── ProjectCard.css
    └── pages/
        └── fizzu-project.css
```

---

## 🎨 Design Philosophy

### Key Principles:
1. **Minimal & Clean** - Generous whitespace, clear hierarchy
2. **Intentional Motion** - Subtle, smooth animations with purpose
3. **Professional Tone** - Sophisticated, not playful or childish
4. **Visual Consistency** - Cohesive with your UI/UX focus

### Inspiration from jackiehu.design:
- ✅ Hover reveals with smooth transitions
- ✅ Card-based project grid
- ✅ Clean typography hierarchy
- ✅ Subtle micro-interactions
- ❌ Not copied - adapted to your brand

---

## 🎭 Animation Specifications

### Timing & Easing

```javascript
// Use consistent easing function throughout
const easing = [0.22, 1, 0.36, 1]; // Cubic bezier (expo out)

// Standard durations
const durations = {
  fast: 0.3,    // Hover states, simple fades
  medium: 0.5,  // Card animations, transitions
  slow: 0.8,    // Page loads, hero animations
};
```

### Key Animations

#### 1. Project Card Hover
```javascript
// Image Scale
{
  scale: isHovered ? 1.05 : 1,
  transition: { duration: 0.6, ease: easing }
}

// Title Slide
{
  x: isHovered ? 4 : 0,
  transition: { duration: 0.4, ease: easing }
}

// Arrow Reveal
{
  x: isHovered ? 4 : 0,
  opacity: isHovered ? 1 : 0,
  transition: { duration: 0.3 }
}
```

#### 2. Fade In Up (Default)
```javascript
{
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: easing }
}
```

#### 3. Staggered Children
```javascript
const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

---

## 🎯 Component Implementation

### 1. Add FIZZU to projects.json

```json
{
  "projects": [
    {
      "id": "fizzu-soda-cans",
      "folder": "fizzu-project",
      "thumbnail": "fizzu-project/images/kewpie.jpg",
      "title": "FIZZU Soda Can Series",
      "category": "Packaging Design · Illustration · Branding",
      "year": "2024",
      "featured": true
    }
    // ... other projects
  ]
}
```

### 2. Import ProjectCard Component

```jsx
// pages/projects/index.jsx
import ProjectCard from '@/components/ProjectCard';
import projectsData from '@/data/projects.json';

const ProjectsPage = () => {
  return (
    <div className="projects-grid">
      {projectsData.projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
```

### 3. Create Project Detail Route

```jsx
// pages/projects/[slug].jsx
import { useRouter } from 'next/router';
import FizzuProject from '@/components/FizzuProject';

const ProjectDetail = () => {
  const router = useRouter();
  const { slug } = router.query;

  if (slug === 'fizzu-soda-cans') {
    return <FizzuProject />;
  }

  // Handle other projects
};
```

---

## 🎨 Color Palette

### Base Colors (Neutral)
```css
:root {
  --color-text-primary: #1a1a1a;      /* Dark grey for headlines */
  --color-text-secondary: #666666;     /* Medium grey for body */
  --color-neutral-50: #fafafa;         /* Light background */
  --color-neutral-100: #f5f5f5;        /* Subtle background */
  --color-neutral-200: #e5e5e5;        /* Borders */
}
```

### Accent Color
```css
:root {
  --color-accent: #0ea5e9;             /* Sky blue */
  --color-accent-subtle: #e0f2fe;      /* Light blue background */
}
```

**Note:** Choose an accent color that:
- Complements your resume design
- Isn't too bright or playful
- Works well with the FIZZU can colors

---

## 📐 Typography System

### Font Stack
```css
/* Primary - Clean sans-serif */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Alternative Options: */
/* 'DM Sans' - Slightly warmer */
/* 'Outfit' - More geometric */
/* 'Satoshi' - Modern, neutral */
```

### Size Scale
```css
/* Headlines */
.hero-title: clamp(2.5rem, 5vw, 4rem);
.section-heading: clamp(2rem, 4vw, 3rem);
.card-title: 1.75rem;

/* Body */
.large-text: 1.375rem;
.body-text: 1.125rem;
.small-text: 0.875rem;
.label-text: 0.75rem;
```

### Font Weights
```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 📏 Spacing System

### Base Unit: 8px

```css
--spacing-xs: 8px;    /* 0.5rem */
--spacing-sm: 16px;   /* 1rem */
--spacing-md: 24px;   /* 1.5rem */
--spacing-lg: 32px;   /* 2rem */
--spacing-xl: 48px;   /* 3rem */
--spacing-2xl: 64px;  /* 4rem */
--spacing-3xl: 96px;  /* 6rem */
```

### Application
- **Sections:** 6rem (96px) vertical padding
- **Cards:** 3-4rem (48-64px) between cards
- **Content:** 2rem (32px) internal padding
- **Elements:** 1.5rem (24px) between related items

---

## 🔄 Hover Interactions

### Principles
1. **Subtle, not flashy** - Small movements (4-8px max)
2. **Smooth easing** - Always use cubic bezier
3. **Purposeful** - Every animation has a reason
4. **Consistent** - Same timing across similar elements

### Examples

#### Button/Link Hover
```css
.button {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
```

#### Card Hover
```css
.card {
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

#### Image Hover
```css
.image-container:hover .image {
  transform: scale(1.05);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small phones */
@media (max-width: 480px) {
  /* Reduce font sizes */
  /* Stack all grids */
  /* Increase touch targets */
}

/* Tablets */
@media (max-width: 768px) {
  /* 2-column grids become 1-column */
  /* Reduce padding */
  /* Simplify animations */
}

/* Desktop */
@media (min-width: 769px) {
  /* Multi-column layouts */
  /* Full animations */
  /* Hover states active */
}

/* Large screens */
@media (min-width: 1200px) {
  /* Max-width containers */
  /* Increased spacing */
}
```

---

## 🎬 Page Transitions

### Route Change Animation
```javascript
// Using Framer Motion
import { AnimatePresence, motion } from 'framer-motion';

<AnimatePresence mode="wait">
  <motion.div
    key={router.pathname}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### Scroll-triggered Animations
```javascript
// Fade in when scrolling into view
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6 }}
>
  {content}
</motion.div>
```

---

## ⚡ Performance Considerations

### Best Practices
1. **Use `transform` and `opacity`** - GPU accelerated
2. **Avoid animating `width`, `height`, `top`, `left`**
3. **Use `will-change` sparingly** - Only on hover
4. **Lazy load images** - Below fold content
5. **Optimize images** - WebP format, responsive sizes

### Example
```css
.card {
  /* Good - GPU accelerated */
  transform: translateY(0);
  opacity: 1;
  will-change: transform;
}

.card:hover {
  transform: translateY(-4px);
}
```

---

## ✅ Integration Checklist

### Setup
- [ ] Install Framer Motion: `npm install framer-motion`
- [ ] Add FIZZU data to `data/fizzu-project/data.json`
- [ ] Copy FIZZU images to `fizzu-project/images/`
- [ ] Add ProjectCard component
- [ ] Add FizzuProject component

### Styling
- [ ] Import CSS variables
- [ ] Set up typography system
- [ ] Configure spacing system
- [ ] Choose accent color
- [ ] Test responsive breakpoints

### Functionality
- [ ] Project card renders correctly
- [ ] Hover animations work smoothly
- [ ] Project detail page loads
- [ ] All images display
- [ ] Links work
- [ ] Mobile responsive

### Polish
- [ ] All animations use consistent easing
- [ ] Hover states are subtle
- [ ] Typography hierarchy is clear
- [ ] Spacing feels generous
- [ ] Colors match your brand

---

## 🎨 Design Tokens Reference

```javascript
// design-tokens.js
export const tokens = {
  colors: {
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
    accent: {
      primary: '#0ea5e9',
      subtle: '#e0f2fe',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
    },
  },
  
  typography: {
    fontFamily: {
      primary: 'Inter, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.375rem',
      '2xl': '1.75rem',
      '3xl': '2rem',
      '4xl': '2.5rem',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
  },
  
  animation: {
    easing: [0.22, 1, 0.36, 1],
    duration: {
      fast: 0.3,
      medium: 0.5,
      slow: 0.8,
    },
  },
};
```

---

## 🚀 Next Steps

1. **Test the integration** - Make sure everything works
2. **Customize colors** - Match your resume and brand
3. **Add more projects** - Use FIZZU as a template
4. **Optimize images** - Compress and convert to WebP
5. **Test performance** - Check Lighthouse scores
6. **Get feedback** - Test with real users

---

## 💡 Pro Tips

1. **Consistency > Complexity** - Keep animations simple and consistent
2. **Less is More** - Generous whitespace > cramped content
3. **Hierarchy Matters** - Clear visual hierarchy guides the eye
4. **Test on Real Devices** - Especially mobile
5. **Accessibility First** - Ensure keyboard navigation works

---

**Need help?** Check the example components in `fizzu-project/components/`
