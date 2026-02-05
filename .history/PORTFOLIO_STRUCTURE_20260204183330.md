# Portfolio Structure

## Overview

Your portfolio follows a clean, editorial structure with a single-page main site and separate project pages. All pages maintain consistent Jackie Hu-style aesthetics with free-floating visuals and snappy interactions.

---

## Routing Structure

### Main Routes

```
/ → Single-page portfolio (Home)
/projects/:slug → Individual project page (ProjectDetail)
```

### Examples

```
https://yoursite.com/ → Main portfolio
https://yoursite.com/projects/inklink → InkLink project
https://yoursite.com/projects/fizzu-soda → Fizzu project
https://yoursite.com/projects/prolog → ProLog project
```

---

## Page Architecture

### Main Page (/)

**Components:**
- Header (logo + CTA buttons)
- Hero section
- Intro/subtitle
- Project previews grid
- Footer

**Features:**
- Continuous single-page scroll
- Asymmetric project cards with hover previews
- Free-floating preview media in whitespace
- Cursor-aware parallax on cards
- Snappy animations (0.3s, custom ease)

**Sections:**
1. **Hero** - Name + tagline
2. **Selected Work** - Project cards with hover previews
3. **Footer** - Contact links + copyright

### Project Pages (/projects/:slug)

**Components:**
- Back button navigation
- Project hero (title, meta, tags)
- Case study sections (overview, research, solution, etc.)
- Scroll-linked reveals
- Interactive hover effects

**Features:**
- Same editorial typography and spacing
- Free-floating section images
- Structured case study format OR short project format
- Consistent animations and micro-interactions
- Optional CTA links to live site/Behance

---

## Header Navigation

### Current Structure

```jsx
<Header>
  <Logo>Leana Le</Logo>
  <Nav>
    <CTALink>Contact</CTALink>
    <CTALink>Download Resume</CTALink>
    <ThemeToggle />
  </Nav>
</Header>
```

**Removed:**
- ❌ "Work" tab
- ❌ "About" tab

**Kept:**
- ✅ Logo (links to home)
- ✅ Contact CTA
- ✅ Download Resume CTA
- ✅ Theme toggle

---

## Project Data Structure

### Standard Case Study Format

Used for full UX/UI projects with research and iterations:

```json
{
    "id": "project-slug",
    "title": "Project Title",
    "category": "Category",
    "year": "2025",
    "tagline": "Short project description",
    "overview": { ... },
    "research": { ... },
    "lofi": { ... },
    "iterations": { ... },
    "solution": { ... },
    "outcomes": { ... }
}
```

### Short Project Format

Used for smaller projects (packaging, illustrations, concepts):

```json
{
    "id": "project-slug",
    "title": "Project Title",
    "category": "Category",
    "year": "2024",
    "tagline": "Short project description",
    "overview": {
        "title": "Project Overview",
        "description": "2-3 concise sentences...",
        "images": [...]
    },
    "solution": {
        "title": "The Solution",
        "description": "Short description...",
        "images": [...]
    }
}
```

**Key Difference:** Short projects use the same layout but with fewer sections and more concise text.

---

## Styling Consistency

### Typography

All pages use the same type scale:

```css
Title: 48-96px (hero) / 32-48px (sections)
Subtitle: 18-24px
Body: 16-18px
Small: 14px
```

### Spacing

Consistent vertical rhythm:

```css
Section gaps: 96-128px
Content spacing: 32-64px
Element spacing: 16-32px
```

### Animations

All interactions use the same timing:

```css
Duration: 0.3s
Easing: cubic-bezier(0.16, 1, 0.3, 1)
Hover scale: 1.01-1.02
Hover rotate: 0.5-2deg
```

### Layout Principles

- **Free-floating visuals** - No heavy containers
- **Asymmetric grid** - Diagonal offsets, varied positioning
- **Intentional negative space** - Generous whitespace
- **Borderless design** - Subtle shadows instead of borders
- **Editorial hierarchy** - Strong typography, minimal chrome

---

## Component Architecture

### Home Components

```
Home.jsx
├── Header.jsx
│   └── Header.css
├── ProjectCard.jsx
│   └── ProjectCard.css
├── PreviewPanel.jsx
│   └── PreviewPanel.css
└── Home.css
```

### Project Detail Components

```
ProjectDetail.jsx
├── Section component (inline)
└── ProjectDetail.css
```

---

## Navigation Flow

### User Journey

```
1. Land on main page (/)
   ↓
2. Scroll through hero + projects
   ↓
3. Hover over project card
   → Preview panel appears in whitespace
   ↓
4. Click project card
   ↓
5. Navigate to /projects/:slug
   ↓
6. Read full case study
   ↓
7. Click "Back" or logo to return home
```

---

## File Structure

```
src/
├── App.jsx                  # Routes (/, /projects/:id)
├── pages/
│   ├── Home.jsx            # Main single-page portfolio
│   ├── Home.css
│   ├── ProjectDetail.jsx   # Individual project pages
│   └── ProjectDetail.css
├── components/
│   ├── Header.jsx          # Logo + CTAs (no Work/About tabs)
│   ├── Header.css
│   ├── ProjectCard.jsx     # Minimal card with parallax
│   ├── ProjectCard.css
│   ├── PreviewPanel.jsx    # Free-floating hover preview
│   └── PreviewPanel.css
└── styles/
    └── App.css             # Global styles
```

---

## Deployment Checklist

### Before Deploying

- [x] Routing updated to `/projects/:slug`
- [x] All project links use new route format
- [x] Header simplified (no Work/About tabs)
- [x] Single-page home with continuous scroll
- [x] Consistent styling across all pages
- [x] Hover previews work with new routes
- [x] Back button navigates to home

### Build Command

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Development Workflow

### Adding a New Project

1. **Create project folder:**
   ```
   projects/new-project/
   └── data.json
   ```

2. **Add project data:**
   Use standard or short format depending on project type

3. **Register in projects.json:**
   ```json
   {
       "id": "new-project",
       "title": "Project Title",
       "category": "Category",
       "folder": "projects/new-project"
   }
   ```

4. **Test locally:**
   ```
   Visit: http://localhost:5173/
   Click project → http://localhost:5173/projects/new-project
   ```

5. **Verify:**
   - Project card appears on home
   - Hover preview works
   - Project page loads correctly
   - Back button returns home
   - Consistent styling throughout

---

## Technical Stack

- **Framework:** React 18.3
- **Build Tool:** Vite 7.2.4
- **Routing:** React Router 6.22.0
- **Animations:** Framer Motion 11.0.3
- **Styling:** CSS Modules
- **Typography:** Inter (Google Fonts)

---

## Key Features

### ✅ Single-Page Main Portfolio
- Continuous scroll experience
- Hero, intro, and project previews
- Footer with contact links

### ✅ Separate Project Pages
- Individual routes for each project
- Full case study OR short project layout
- Same editorial styling throughout

### ✅ Simplified Header
- Logo linking to home
- Contact + Resume CTAs
- No Work/About tabs

### ✅ Consistent Design
- Jackie Hu-style editorial layout
- Free-floating visuals in whitespace
- Snappy hover interactions
- Same typography and spacing

### ✅ Modern Routing
- Clean URLs (`/projects/inklink`)
- React Router for navigation
- Fast page transitions

---

## Resources

- 📘 [CONTENT_STRUCTURE.md](CONTENT_STRUCTURE.md) - Project data format
- 📘 [INTERACTION_GUIDE.md](INTERACTION_GUIDE.md) - Animation patterns
- 📘 [EDITORIAL_DESIGN.md](EDITORIAL_DESIGN.md) - Design principles
- 🎨 [Home.jsx](src/pages/Home.jsx) - Main page component
- 🎨 [ProjectDetail.jsx](src/pages/ProjectDetail.jsx) - Project page component
- 🎨 [Header.jsx](src/components/Header.jsx) - Header component

---

**Status:** ✅ Complete and ready for deployment

**Last Updated:** February 4, 2026
