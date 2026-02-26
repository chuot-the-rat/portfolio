# Portfolio Refactor: Convert Mode System to Multi-Page Navigation

## OBJECTIVE
Completely remove the work/chaos mode toggle system and replace it with a multi-page navigation structure. The default "chaos" mode design and UX should become the foundation for all pages. All "work" mode code, styling, and features must be removed entirely.

---

## PHASE 1: PLANNING & CLEANUP

### 1.1 Mode System Removal
**DELETE entirely:**
- `src/contexts/ModeContext.jsx` (global state management)
- `src/components/ModeSwitcher.jsx` (UI toggle component)
- All `*-work-mode.css` files:
  - `Home-work-mode.css`
  - `ModeSwitcher-work-mode.css`
  - `SkillsSection-work-mode.css`
  - `EducationSection-work-mode.css`

**REMOVE from all files:**
- All `import { useMode } from '../contexts/ModeContext'`
- All `const { mode } = useMode();` declarations
- All conditional rendering based on mode: `{mode === 'WORK' ? ... : ...}`
- All CSS rules starting with `.mode-work` or `.mode-chaos`
- All localStorage references to mode switching

### 1.2 Clean CSS Architecture
**Action:**
- Extract all `.mode-chaos` styles and rename to default selectors (remove the `.mode-chaos` prefix)
- Delete all `.mode-work` and `.mode-chaos` conditional CSS
- Remove `mode-${mode}` class application from document body
- Consolidate remaining CSS into single, clean files per component (no -work-mode variants)

---

## PHASE 2: NEW PAGE STRUCTURE

### 2.1 Create New Page Components
Create these new page components in `src/pages/`:

```
src/pages/
├── Home.jsx (landing/intro page)
├── About.jsx (about me section)
├── Projects.jsx (work/projects showcase - replaces mode-based project list)
├── Skills.jsx (skills & experience)
├── Education.jsx (education history)
├── Contact.jsx (contact form or info)
└── NotFound.jsx (404 page)
```

### 2.2 Update Routing (App.jsx)
Replace current single-route setup with:
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/projects" element={<Projects />} />
  <Route path="/skills" element={<Skills />} />
  <Route path="/education" element={<Education />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### 2.3 Remove ModeContext Provider
In `App.jsx` or `main.jsx`, remove:
- `<ModeProvider>` wrapper
- Any mode context initialization
- localStorage setup for mode persistence

---

## PHASE 3: COMPONENT REFACTORING

### 3.1 Home.jsx Refactoring
**Current State:** 412 lines with dual hero sections and conditional rendering

**Action:**
1. Keep ONLY the chaos mode hero section (delete terminal hero entirely)
2. Remove `useMode()` hook
3. Remove conditional rendering blocks for hero variations
4. Simplify Projects header - keep only the chaos version
5. Make Home.jsx a clean landing page that:
   - Shows intro/hero
   - Links to other pages (About, Projects, etc.)
   - Highlights featured work or recent updates
6. Move detailed skill data to `/Skills.jsx` page
7. Remove inline data structures - reference them from data files instead

**Example Structure:**
```jsx
// Home.jsx - Landing Page
export default function Home() {
  return (
    <>
      {/* Hero Section - Keep only chaos version */}
      <HeroSection />
      
      {/* Featured Work Preview */}
      <FeaturedProjects />
      
      {/* Quick Stats or CTA */}
      <CallToAction />
      
      {/* Links to other sections */}
      <NavigationCards />
    </>
  );
}
```

### 3.2 SkillsSection.jsx → Skills.jsx Page
**Current State:** 277 lines with dual skill data structures and ASCII animations

**Action:**
1. Convert to standalone page: `src/pages/Skills.jsx`
2. DELETE entirely:
   - All `workModeSkillsData` (work mode specific data)
   - All `.mode-work` conditional JSX blocks
   - All ASCII animation code and rendering logic
   - All `useMode()` references
3. KEEP:
   - Chaos mode skill data structure (rename to just `skillsData`)
   - Chaos mode JSX layout and styling
   - Skill categories (design, front-end, motion, tools)
4. Clean up CSS:
   - Extract only `.mode-chaos .skill-*` selectors
   - Remove `.mode-chaos` prefix (make them default)
   - Delete `SkillsSection-work-mode.css` entirely
   - Merge cleaned CSS into `Skills.module.css` or `Skills.css`

**New File Structure:**
```jsx
// src/pages/Skills.jsx
import skillsData from '../data/skillsData'

export default function Skills() {
  return (
    <div className="skills-page">
      <PageHeader title="Skills & Experience" />
      {/* Render skills using chaos mode structure only */}
    </div>
  );
}
```

### 3.3 Extract Data to Separate Files
Create `src/data/` folder:

```
src/data/
├── skillsData.js (chaos mode skill data only)
├── projectsData.js (all projects, unified structure)
├── educationData.js (education history)
├── socialLinks.js (contact/social info)
└── navItems.js (navigation menu items)
```

**Example - skillsData.js:**
```javascript
// Keep ONLY the chaos mode data, clean structure
export const skillsData = [
  {
    category: 'Design',
    skills: [
      { name: 'Figma', level: 90 },
      { name: 'UI Design', level: 85 },
      // ... remove any 'symbol', 'code', 'ascii' properties
    ]
  },
  // ... other categories
];
```

### 3.4 New Page Components to Build

**About.jsx:**
- Biographical information
- Background/history
- Career goals
- Personal interests
- Call to action to view projects

**Projects.jsx:**
- Unified project showcase (replaces mode-based project variations)
- Filter or category options (optional)
- Detail view for individual projects
- Link to GitHub/live demos
- Remove terminal-style project list, keep clean design

**Contact.jsx:**
- Contact form (or email link)
- Social media links
- Location info
- Availability/response time

**Education.jsx:**
- Schools/certifications
- Courses/bootcamps
- Key achievements
- Timeline view (optional)

---

## PHASE 4: NAVIGATION COMPONENT

### 4.1 Replace ModeSwitcher with Navigation
**Delete:** `ModeSwitcher.jsx` and related CSS

**Create:** `src/components/Navigation.jsx` (or Navbar/Header component)

```jsx
// src/components/Navigation.jsx
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/skills', label: 'Skills' },
    { path: '/contact', label: 'Contact' },
  ];
  
  return (
    <nav className="navbar">
      {navItems.map(item => (
        <Link 
          key={item.path}
          to={item.path}
          className={location.pathname === item.path ? 'active' : ''}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

### 4.2 Update Layout
- Place Navigation in persistent layout (App.jsx or Layout wrapper)
- Navigation visible on all pages
- Active state highlighting for current page
- Mobile-responsive hamburger menu (optional)

---

## PHASE 5: CSS CLEANUP

### 5.1 Remove Mode-Based CSS
**DELETE all:**
- Lines with `.mode-work .selector`
- Lines with `.mode-chaos .selector`
- Conditional display toggling: `display: none` based on mode class

**ACTION FOR EACH CSS FILE:**
1. Open file with mode variants
2. Search for `.mode-work` and `.mode-chaos` selectors
3. Extract `.mode-chaos` rules and remove the prefix
4. Delete all `.mode-work` rules entirely
5. Delete the entire `-work-mode.css` file

**Example Conversion:**
```css
/* BEFORE */
.mode-chaos .skill-item {
  background: #f0f0f0;
  padding: 1rem;
}

.mode-work .skill-item {
  background: #000;
  color: #0f0;
  font-family: monospace;
}

/* AFTER */
.skill-item {
  background: #f0f0f0;
  padding: 1rem;
}
```

### 5.2 Consolidate Component CSS
- Each page component should have one CSS file (no -work-mode variants)
- Use CSS Modules if preferred: `Skills.module.css`
- Or single stylesheet per page: `Skills.css`
- Keep naming consistent and clear

---

## PHASE 6: CLEANUP & VALIDATION

### 6.1 Search & Destroy Work Mode References
Search codebase for:
- `"work"` (mode name)
- `"WORK"` (constant)
- `"mode"` (leftover mode logic)
- `"chaos"` (should only be in comments if anywhere)
- `useMode` (should have 0 results)
- `.mode-` (CSS prefix - should have 0 results)
- `localStorage.*mode` (should have 0 results)

### 6.2 Verify Component Imports
Ensure all components:
- ✅ Do NOT import ModeContext or useMode
- ✅ Import navigation or routing as needed
- ✅ Reference data from `src/data/` folder
- ✅ Have clean, single-purpose CSS files

### 6.3 Test Routing
- [ ] All routes render correct pages
- [ ] Navigation links work correctly
- [ ] Active nav state updates on page change
- [ ] No console errors related to mode
- [ ] Page refresh maintains correct route
- [ ] Back/forward browser buttons work

### 6.4 Verify Styling
- [ ] No work mode terminal styling visible
- [ ] Chaos mode design is consistent across all pages
- [ ] No CSS targeting `.mode-work` or `.mode-chaos`
- [ ] Responsive design works on all pages
- [ ] No layout shifts when navigating

---

## DETAILED FILE-BY-FILE CHECKLIST

### Files to DELETE:
- [ ] `src/contexts/ModeContext.jsx`
- [ ] `src/components/ModeSwitcher.jsx`
- [ ] `src/styles/Home-work-mode.css`
- [ ] `src/styles/ModeSwitcher-work-mode.css`
- [ ] `src/styles/SkillsSection-work-mode.css`
- [ ] `src/styles/EducationSection-work-mode.css`

### Files to REFACTOR:
- [ ] `src/App.jsx` - Remove ModeProvider, update routes
- [ ] `src/main.jsx` - Remove mode context initialization
- [ ] `src/components/Home.jsx` - Remove mode logic, convert to landing page
- [ ] `src/components/SkillsSection.jsx` - Convert to `src/pages/Skills.jsx`, remove work mode
- [ ] `src/components/EducationSection.jsx` - Possibly move to page or keep as component
- [ ] `src/components/PreviewPanel.jsx` - Remove mode styling logic
- [ ] All CSS files - Remove mode-based selectors

### Files to CREATE:
- [ ] `src/pages/Home.jsx` (new landing page)
- [ ] `src/pages/About.jsx`
- [ ] `src/pages/Projects.jsx`
- [ ] `src/pages/Skills.jsx` (from refactored SkillsSection)
- [ ] `src/pages/Education.jsx`
- [ ] `src/pages/Contact.jsx`
- [ ] `src/pages/NotFound.jsx`
- [ ] `src/components/Navigation.jsx`
- [ ] `src/data/skillsData.js`
- [ ] `src/data/projectsData.js`
- [ ] `src/data/educationData.js`
- [ ] `src/data/socialLinks.js`

---

## IMPLEMENTATION ORDER (Recommended)

1. **Create data folder & files** - Extract all inline data
2. **Create page components** - Create skeleton pages
3. **Update routing** - Wire up new routes in App.jsx
4. **Create Navigation component** - Replace ModeSwitcher
5. **Refactor Home.jsx** - Make it a proper landing page
6. **Refactor SkillsSection → Skills.jsx** - Remove all work mode code
7. **Refactor other components** - Remove mode logic, move to pages
8. **Clean CSS** - Remove all mode-based selectors
9. **Delete work mode files** - Remove ModeContext, ModeSwitcher, -work-mode.css files
10. **Test & validate** - Verify all routes and styling work

---

## KEY PRINCIPLES FOR REFACTORING

### ✅ DO:
- Keep the chaos mode design (it's your preferred aesthetic)
- Create reusable, single-purpose page components
- Extract data into separate, maintainable files
- Use clear, descriptive file and folder names
- Test routing thoroughly after changes
- Keep navigation consistent across all pages
- Use CSS Modules or clean namespaced CSS
- Add comments explaining page purposes

### ❌ DON'T:
- Keep any work mode code "just in case"
- Leave dead code or commented-out mode logic
- Mix mode-based logic with page-based logic
- Create duplicate components for different pages
- Keep the terminal hero or ASCII animations
- Leave localStorage mode persistence code
- Maintain any `.mode-work` or `.mode-chaos` CSS selectors
- Create confusion between modes and pages

---

## EXPECTED OUTCOMES

After completing this refactor, your portfolio will:

1. **Navigation-Based:** Users navigate between pages using a menu/navbar instead of toggling modes
2. **Single Design System:** Only the chaos mode design exists - clean, modern, consistent
3. **Organized Structure:** Clear folder hierarchy for pages, components, data, and styles
4. **Maintainable Code:** No conditional rendering based on modes, no duplicate JSX blocks
5. **Better UX:** Users can easily explore different sections (About, Projects, Skills, Contact)
6. **Scalable:** Easy to add new pages or sections in the future
7. **Clean:** No dead code, no work mode references, no CSS targeting obsolete classes

---

## NOTES & WARNINGS

⚠️ **LocalStorage:** If you want users to remember which page they were on, add simple routing-based history (browser's native behavior handles this). Don't recreate mode-based localStorage persistence.

⚠️ **PreviewPanel:** This component had mode-based styling - review its purpose. If it's no longer needed, delete it. If it is, clean its CSS.

⚠️ **Data Duplication:** Currently skills have different structures per mode (with symbol, level, code, ascii). Keep ONLY the chaos structure. The work structure (with ASCII and code properties) should be deleted entirely.

⚠️ **Hero Sections:** Two completely different implementations exist. Delete the terminal hero section entirely. Keep only the chaos mode hero as your Home page intro.

---

## QUESTIONS TO ANSWER BEFORE STARTING

1. What content should the Home (landing) page show?
   - Hero intro? Featured projects? Quick navigation? Call-to-action?

2. What belongs on the About page?
   - Biography? Background? Career timeline? Personal interests?

3. Should Projects have filters/categories or just a list?
   - By project type? By year? By technology? Simple list?

4. Contact page - form or just links?
   - Contact form submission? Email link? Social media links?

5. Do you want a sidebar navigation or top navbar?
   - Mobile-responsive design preference?

6. Any other pages or sections you want to add?
   - Blog? Resume/CV? Testimonials? Photo gallery?

---

## TEMPLATE STRUCTURE FOR NEW PAGES

```jsx
// src/pages/[PageName].jsx
import { Helmet } from 'react-helmet'; // Optional: for SEO
import './[PageName].css';

export default function [PageName]() {
  return (
    <div className="[page-name]-page">
      <Helmet>
        <title>[Page Title] | Your Name</title>
      </Helmet>
      
      <div className="page-header">
        <h1>[Page Title]</h1>
      </div>
      
      <div className="page-content">
        {/* Page-specific content here */}
      </div>
    </div>
  );
}
```

---

## SUCCESS CRITERIA

You'll know you're done when:
- ✅ All mode-related code is removed
- ✅ Navigation works between 5+ pages
- ✅ No console errors about missing context or undefined mode
- ✅ CSS contains zero `.mode-work` or `.mode-chaos` selectors
- ✅ All pages use consistent design language (chaos mode aesthetic)
- ✅ Data is organized in `src/data/` folder
- ✅ Each page has clear purpose and content
- ✅ Project still builds without warnings
- ✅ All routes tested and working
- ✅ Navigation highlights active page
