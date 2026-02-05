# Portfolio Sections - Skills, Education & Contact

New modular React components for your portfolio, designed to match the Jackie Hu–style editorial aesthetic.

## 📁 Files Overview

```
src/
└── components/
    ├── index.js                 # Component exports
    ├── SkillsSection.jsx        # Skills grid component
    ├── SkillsSection.css        # Skills styles
    ├── EducationSection.jsx     # Education timeline component
    ├── EducationSection.css     # Education styles
    ├── ContactSection.jsx       # Contact with optional form
    ├── ContactSection.css       # Contact styles
    └── SectionLayout.css        # Layout utilities
```

## 🚀 Quick Start

### 1. Copy Files to Your Project

Copy the entire `components/` folder to your `src/` directory.

### 2. Import Sections

```jsx
import { SkillsSection, EducationSection, ContactSection } from './components';
import './components/SectionLayout.css';
```

### 3. Add to Your Page

```jsx
function App() {
  return (
    <div className="container">
      {/* Your existing content */}
      
      <div className="sections-container">
        <SkillsSection variant="grid" />
        <EducationSection variant="timeline" />
        <ContactSection variant="full" showForm={true} />
      </div>
    </div>
  );
}
```

## 🎨 Component Variants

### SkillsSection

| Prop | Values | Description |
|------|--------|-------------|
| `variant` | `"grid"` (default), `"compact"` | Grid for main content, compact for sidebar |

```jsx
// Full editorial grid
<SkillsSection variant="grid" />

// Compact tag cloud for sidebar
<SkillsSection variant="compact" />
```

### EducationSection

| Prop | Values | Description |
|------|--------|-------------|
| `variant` | `"timeline"` (default), `"compact"` | Timeline for main, cards for sidebar |

```jsx
// Full timeline with descriptions
<EducationSection variant="timeline" />

// Compact cards for sidebar
<EducationSection variant="compact" />
```

### ContactSection

| Prop | Values | Description |
|------|--------|-------------|
| `variant` | `"full"` (default), `"compact"` | Full with CTAs, compact links only |
| `showForm` | `true`, `false` | Include contact form |

```jsx
// Full section with contact form
<ContactSection variant="full" showForm={true} />

// Links only, no form
<ContactSection variant="full" showForm={false} />

// Minimal for sidebar
<ContactSection variant="compact" />
```

## ✏️ Customizing Content

### Skills Data

Edit `SkillsSection.jsx` to update your skills:

```jsx
const skillsData = {
  design: {
    label: 'Design',
    skills: [
      { name: 'User Research', level: 'advanced' },
      { name: 'Wireframing', level: 'intermediate' },
      // Add more...
    ],
  },
  // Add more categories...
};
```

**Skill Levels:** `'advanced'`, `'intermediate'`, `'learning'`

### Education Data

Edit `EducationSection.jsx`:

```jsx
const educationData = [
  {
    id: 'unique-id',
    institution: 'School Name',
    program: 'Program Name',
    degree: 'Diploma',
    period: '2024 – 2026',
    status: 'In Progress', // or 'Completed'
    description: 'Program description...',
    highlights: ['Skill 1', 'Skill 2'],
  },
  // Add more entries...
];
```

### Contact Links

Edit `ContactSection.jsx`:

```jsx
const socialLinks = [
  {
    id: 'email',
    label: 'Email',
    value: 'your@email.com',
    href: 'mailto:your@email.com',
    icon: '📧',
  },
  // Add more links...
];
```

## 🎭 Accessibility & Motion

All sections respect `prefers-reduced-motion`:

- Animations are disabled for users who prefer reduced motion
- Focus states are clearly visible
- Semantic HTML with proper ARIA labels
- Keyboard navigation support

## 📐 Layout Options

### Standard Flow
```jsx
<div className="sections-container">
  <SkillsSection />
  <EducationSection />
  <ContactSection />
</div>
```

### Staggered Editorial
```jsx
<div className="staggered-layout">
  <SkillsSection />
  <EducationSection />
  <ContactSection />
</div>
```

### Full-Width Accent
```jsx
<div className="section-full-width">
  <ContactSection />
</div>
```

## 🎨 Theming

Sections use CSS variables from your existing `styles.css`:

```css
:root {
  --bg-primary: #fafaf9;
  --bg-secondary: #ffffff;
  --text-primary: #1c1917;
  --text-secondary: #57534e;
  --accent: #212121;
  --accent-light: #616161;
  --border: #e7e5e4;
}
```

## 📱 Responsive Behavior

- **Desktop (1200px+):** Full layouts with all details
- **Tablet (768px-1199px):** Adjusted grids, maintained hierarchy
- **Mobile (<768px):** Single column, optimized touch targets

## 🔧 Form Handling

The contact form is currently a placeholder. To connect it to a backend:

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Replace with your API endpoint
  const response = await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(formState),
  });
  
  // Handle response...
};
```

**Options:**
- [Formspree](https://formspree.io/)
- [Netlify Forms](https://www.netlify.com/products/forms/)
- [EmailJS](https://www.emailjs.com/)

---

Made with ❤️ for Leana Le's Portfolio
