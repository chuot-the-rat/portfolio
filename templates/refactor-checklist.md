# Portfolio Refactor - Quick Reference & Progress Tracker

## QUICK START COMMANDS

### Search for files to delete/refactor:
```bash
# Find all files with "mode" in name or path
find src -name "*mode*" -o -name "*Mode*"

# Find all -work-mode.css files
find src -name "*-work-mode.css"

# Search for useMode hook usage
grep -r "useMode" src/

# Search for mode context imports
grep -r "ModeContext" src/

# Search for .mode- CSS selectors
grep -r "\.mode-" src/

# Search for localStorage mode references
grep -r "localStorage.*mode" src/
```

---

## PHASE 1: DELETION CHECKLIST

### Remove Files (7 files total)
```
Context & Components:
- [ ] src/contexts/ModeContext.jsx
- [ ] src/components/ModeSwitcher.jsx

CSS Files:
- [ ] src/styles/Home-work-mode.css
- [ ] src/styles/ModeSwitcher-work-mode.css
- [ ] src/styles/SkillsSection-work-mode.css
- [ ] src/styles/EducationSection-work-mode.css

Package Dependencies (if any):
- [ ] Check package.json for unused mode-specific libraries
```

### Remove Code from Files (5 files to clean)

#### App.jsx / main.jsx
- [ ] Remove `import { ModeProvider } from ...`
- [ ] Remove `<ModeProvider>` wrapper component
- [ ] Remove mode-related localStorage code
- [ ] Keep only the cleaned Router setup

#### Home.jsx
- [ ] Remove `const { mode } = useMode();`
- [ ] Delete terminal hero section (keep chaos hero only)
- [ ] Delete conditional rendering: `{mode === 'WORK' ? ... : ...}`
- [ ] Delete all ternary operators for mode
- [ ] Remove projects header variations
- [ ] Keep only chaos mode version of all JSX

#### SkillsSection.jsx
- [ ] Remove `const { mode } = useMode();`
- [ ] Delete `workModeSkillsData` completely
- [ ] Delete all work mode JSX blocks
- [ ] Delete ASCII animation code
- [ ] Delete symbols, code, ascii properties from skill data
- [ ] Keep only chaos mode skill structure

#### EducationSection.jsx
- [ ] Remove `const { mode } = useMode();`
- [ ] Remove mode-based conditional rendering
- [ ] Keep single, clean education display

#### PreviewPanel.jsx
- [ ] Remove `const { mode } = useMode();`
- [ ] Remove mode-based styling logic
- [ ] Keep functional component logic only

---

## PHASE 2: FOLDER STRUCTURE CREATION

### Create Folders
```bash
mkdir -p src/pages
mkdir -p src/data
mkdir -p src/components
```

### Resulting Structure:
```
src/
├── components/
│   ├── Navigation.jsx          [NEW]
│   ├── Navigation.css          [NEW]
│   ├── Header.jsx              [existing]
│   ├── Footer.jsx              [existing]
│   ├── PreviewPanel.jsx        [cleaned]
│   └── [other shared components]
├── pages/
│   ├── Home.jsx                [NEW - refactored]
│   ├── Home.css                [cleaned]
│   ├── About.jsx               [NEW]
│   ├── About.css               [NEW]
│   ├── Projects.jsx            [NEW]
│   ├── Projects.css            [NEW]
│   ├── Skills.jsx              [NEW - from SkillsSection]
│   ├── Skills.css              [NEW - cleaned]
│   ├── Education.jsx           [NEW - from EducationSection]
│   ├── Education.css           [cleaned]
│   ├── Contact.jsx             [NEW]
│   ├── Contact.css             [NEW]
│   └── NotFound.jsx            [NEW]
├── data/                        [NEW FOLDER]
│   ├── skillsData.js           [NEW - extracted]
│   ├── projectsData.js         [NEW - extracted]
│   ├── educationData.js        [NEW - extracted]
│   ├── socialLinks.js          [NEW]
│   └── navItems.js             [NEW]
├── contexts/
│   └── [other contexts - ModeContext DELETED]
├── App.jsx                      [REFACTORED]
├── main.jsx                     [REFACTORED]
└── [other files]
```

---

## PHASE 3: DATA EXTRACTION CHECKLIST

### Create src/data/skillsData.js
- [ ] Extract skill categories from SkillsSection.jsx
- [ ] Use ONLY chaos mode skill structure
- [ ] Remove symbol, code, ascii, level properties that don't exist in chaos
- [ ] Verify all required properties exist (name, level at minimum)

**Example Structure:**
```javascript
export const skillsData = {
  design: [
    { name: 'Figma', level: 90 },
    // ... keep it simple
  ],
  frontend: [
    // ...
  ],
  // ... other categories
};
```

### Create src/data/projectsData.js
- [ ] Extract all projects (unify work + chaos versions if different)
- [ ] Include: title, description, technologies, link, image, date
- [ ] Remove any terminal-style or mode-specific formatting
- [ ] Create consistent structure for all projects

### Create src/data/educationData.js
- [ ] Extract education history
- [ ] Include: school, degree, field, date, description (optional)
- [ ] Keep simple, chronological or reverse-chronological order

### Create src/data/socialLinks.js
- [ ] Extract social media/contact info
- [ ] Include: platform, url, icon (optional)

### Create src/data/navItems.js
- [ ] Define navigation menu structure
- [ ] Include: path, label, and optionally: icon, description

---

## PHASE 4: NEW PAGE COMPONENTS CHECKLIST

### Home.jsx (Landing Page)
- [ ] Remove all mode logic
- [ ] Keep only chaos hero section
- [ ] Create sections:
  - [ ] Hero/Intro section
  - [ ] Featured projects preview (link to /projects)
  - [ ] Skills overview (link to /skills)
  - [ ] About quick intro (link to /about)
  - [ ] CTA to contact
- [ ] Create cohesive flow from top to bottom
- [ ] Use consistent styling

### About.jsx
- [ ] Create AboutPage structure
- [ ] Sections:
  - [ ] Page header/title
  - [ ] Bio/introduction
  - [ ] Background/experience timeline (optional)
  - [ ] Interests/personality
  - [ ] CTA to projects or contact
- [ ] Keep engaging but professional

### Projects.jsx
- [ ] Create Projects showcase
- [ ] Sections:
  - [ ] Page header/title
  - [ ] Projects grid or list
  - [ ] Project cards with: image, title, description, tech, links
  - [ ] Optional filters (by type, technology, date)
  - [ ] Ensure unified design (remove terminal styling)
- [ ] Link each project to detail or external link

### Skills.jsx (refactored from SkillsSection)
- [ ] Move SkillsSection.jsx → pages/Skills.jsx
- [ ] Remove mode logic and work data
- [ ] Import skillsData from data folder
- [ ] Display skills by category
- [ ] Clean, modern design (no ASCII art)

### Education.jsx
- [ ] Move relevant content from EducationSection.jsx
- [ ] Create page-level component
- [ ] Sections:
  - [ ] Page header
  - [ ] Education timeline or list
  - [ ] Key achievements/certifications
  - [ ] Link to contact or resume

### Contact.jsx
- [ ] Create contact page
- [ ] Options:
  - [ ] Contact form (with validation)
  - [ ] Direct email link
  - [ ] Social media links
  - [ ] Location/availability info
- [ ] Clear call-to-action

### NotFound.jsx (404 page)
- [ ] Create 404 error page
- [ ] Include:
  - [ ] Friendly error message
  - [ ] Link back to home
  - [ ] Quick navigation

---

## PHASE 5: NAVIGATION COMPONENT CHECKLIST

### Create Navigation.jsx
- [ ] Import Link from react-router-dom
- [ ] Import useLocation for active state
- [ ] Define navItems array with paths and labels
- [ ] Render navigation links
- [ ] Highlight active page/route
- [ ] Add className logic for active state
- [ ] Implement for desktop (mobile optional for now)

### Style Navigation.css
- [ ] Navigation bar styling
- [ ] Link styling
- [ ] Active state styling
- [ ] Hover effects
- [ ] Responsive behavior (optional)

### Update App.jsx Layout
- [ ] Place Navigation in layout (above Routes or in wrapper)
- [ ] Ensure Navigation renders on all pages
- [ ] Test active state updates on route change

---

## PHASE 6: ROUTING UPDATE CHECKLIST

### Update App.jsx Routes
- [ ] Remove old single route
- [ ] Add new route for each page:
  - [ ] `path="/" → <Home />`
  - [ ] `path="/about" → <About />`
  - [ ] `path="/projects" → <Projects />`
  - [ ] `path="/skills" → <Skills />`
  - [ ] `path="/education" → <Education />`
  - [ ] `path="/contact" → <Contact />`
  - [ ] `path="*" → <NotFound />`
- [ ] Test each route renders correct component
- [ ] Verify no console errors

---

## PHASE 7: CSS CLEANUP CHECKLIST

### For Each CSS File:
1. [ ] Open file
2. [ ] Search for `.mode-work` selectors → DELETE entire rule
3. [ ] Search for `.mode-chaos` selectors → KEEP but remove prefix
4. [ ] Search for `display: none` toggles → DELETE if mode-based
5. [ ] Verify no mode-related media queries remain
6. [ ] Test styling still works correctly

### CSS Files to Clean:
- [ ] Home.css (remove mode variations)
- [ ] SkillsSection.css → Skills.css
- [ ] EducationSection.css → Education.css
- [ ] PreviewPanel.css
- [ ] Any other component CSS with mode variants
- [ ] Global styles (check for body.mode-work/chaos)

### Global CSS Cleanup:
- [ ] Remove `body.mode-work` or `body.mode-chaos` rules
- [ ] Remove body class assignment code
- [ ] Keep only clean, universal styles

---

## PHASE 8: VALIDATION & CLEANUP

### Code Search & Destroy
Search for and verify all instances are removed:

```bash
# Should return 0 results:
grep -r "useMode" src/              # 0 results ✓
grep -r "ModeContext" src/          # 0 results ✓
grep -r "\.mode-" src/              # 0 results ✓
grep -r "mode-work" src/            # 0 results ✓
grep -r "mode-chaos" src/           # 0 results ✓
grep -r "localStorage.*mode" src/   # 0 results ✓
grep -r "WORK" src/components       # 0 results ✓
grep -r "CHAOS" src/components      # 0 results ✓
```

### Import Checks
- [ ] No imports of deleted ModeContext
- [ ] No imports of deleted ModeSwitcher
- [ ] All imports of data files are correct
- [ ] All page imports are correct in App.jsx

### Testing Checklist
- [ ] App builds without errors: `npm run build`
- [ ] Dev server runs without errors: `npm run dev`
- [ ] No console errors on page load
- [ ] Navigation renders and is visible
- [ ] All navigation links work:
  - [ ] "/" loads Home
  - [ ] "/about" loads About
  - [ ] "/projects" loads Projects
  - [ ] "/skills" loads Skills
  - [ ] "/education" loads Education
  - [ ] "/contact" loads Contact
  - [ ] "/invalid" loads NotFound
- [ ] Active nav state updates on route change
- [ ] Page refresh maintains correct route
- [ ] Browser back/forward buttons work
- [ ] Styling is consistent across all pages
- [ ] No layout shifts or visual bugs
- [ ] Mobile responsive (if applicable)

---

## VISUAL VERIFICATION CHECKLIST

### Before & After
- [ ] Old mode toggle is completely gone
- [ ] New navigation menu appears on all pages
- [ ] Terminal-style hero is gone
- [ ] Terminal-style projects list is gone
- [ ] ASCII animations are gone
- [ ] All pages use same design language (chaos aesthetic)
- [ ] No work mode styling visible anywhere

---

## FINAL CLEANUP

### Delete After Confirming No References:
- [ ] `src/contexts/ModeContext.jsx`
- [ ] `src/components/ModeSwitcher.jsx`
- [ ] `*-work-mode.css` files (all 4)
- [ ] Any commented-out mode code
- [ ] Any dead code from deleted components

### Code Quality:
- [ ] No commented-out code blocks
- [ ] No `// TODO: remove mode logic` comments
- [ ] All imports are used
- [ ] All exports are used or intentional
- [ ] Consistent code style across new pages
- [ ] Descriptive variable and function names

---

## SUCCESS METRICS

### Before
- 1 page with mode toggle
- 2 different hero implementations
- 2 different skill data structures
- Conditional rendering throughout
- Mode stored in localStorage
- 4 *-work-mode.css files
- ModeContext and ModeSwitcher components

### After
- 6+ pages with clear purposes
- 1 hero implementation (chaos style only)
- 1 skill data structure
- No conditional mode rendering
- Clean, simple routing
- 0 *-work-mode.css files
- No ModeContext or ModeSwitcher
- Navigation component for site-wide menu
- Data organized in src/data/
- ~30%+ reduction in total code complexity

---

## TROUBLESHOOTING COMMON ISSUES

### Issue: "Cannot find module 'ModeContext'"
**Solution:** Remove import of ModeContext from all files. Check for remaining imports with `grep -r "ModeContext" src/`

### Issue: "useMode is not defined"
**Solution:** Remove all `useMode()` hook calls. Use `grep -r "useMode" src/` to find remaining instances.

### Issue: Navigation not highlighting active page
**Solution:** Verify Navigation.jsx uses `useLocation()` and compares `location.pathname` with route paths correctly.

### Issue: Styles look wrong on some pages
**Solution:** 
1. Verify CSS file paths are correct
2. Ensure no `.mode-chaos` or `.mode-work` selectors exist
3. Check for conflicting global styles
4. Inspect element to see what styles are applied

### Issue: Pages not rendering
**Solution:**
1. Check routes in App.jsx are correct
2. Verify all page components export default
3. Check for import path errors
4. Look for console errors showing missing modules

### Issue: Still seeing terminal/work mode styling
**Solution:**
1. Search for remaining `.mode-work` CSS rules
2. Check HTML for `mode-work` or `mode-chaos` classes
3. Look for inline styles applying mode-specific styling
4. Clear browser cache and rebuild

---

## NOTES FOR FUTURE MAINTENANCE

- Navigation paths defined in `src/data/navItems.js` - update there for site-wide consistency
- Page components are now independent - easy to add, modify, or remove pages
- Data is centralized in `src/data/` - update data without touching component logic
- CSS is no longer mode-dependent - simpler styling, easier to maintain
- New pages should follow the same structure/template for consistency

---

## ESTIMATED TIME

- **Data extraction:** 15-30 min
- **Page component creation:** 45 min - 1 hour
- **Navigation setup:** 15-20 min
- **Routing configuration:** 10-15 min
- **CSS cleanup:** 20-30 min
- **Testing & verification:** 20-30 min
- **Total:** 2-3 hours for complete refactor

---

## FINAL SIGN-OFF

Once all items are checked, your portfolio will be:
✅ Mode-free
✅ Navigation-based
✅ Clean and maintainable
✅ Ready for future expansion
✅ Consistent design across all pages
