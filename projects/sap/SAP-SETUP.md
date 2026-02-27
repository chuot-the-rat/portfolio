# SAP Project Integration Guide

Quick setup for adding the SAP project to your portfolio.

## Files Provided

1. **sap-data.json** - Project data with all sections organized
2. **ProjectDetail.jsx** - Reusable component for any project
3. **ProjectDetail.css** - Styling using your existing design tokens

---

## Installation

### 1. Add Files to Your Project

```
src/
├── components/
│   ├── ProjectDetail.jsx
│   └── ProjectDetail.css
├── data/
│   └── sap-data.json (or your projects data file)
```

### 2. Import & Use

```jsx
// In your project page or detail page
import ProjectDetail from '../components/ProjectDetail';
import sapData from '../data/sap-data.json';

export default function SAPProject() {
  return (
    <div className="container">
      <ProjectDetail project={sapData} />
    </div>
  );
}
```

### 3. Folder Structure

Ensure your public folder has:
```
public/
└── projects/
    └── sap/
        ├── sapVid.mp4
        └── SVG/
            ├── [all your SVG files]
```

---

## What It Includes

✅ **Video First** - Displays at top without autoplay
✅ **Bento Grid** - Three grid sizes: small (buttons), medium (animals), large (backgrounds)
✅ **Organized Sections** - Text sections + gallery sections in defined order
✅ **Lightbox** - Click images to view fullscreen
✅ **Responsive** - Works on all screen sizes
✅ **Design Tokens** - Uses your existing color, spacing, typography variables
✅ **Minimal** - No extra dependencies or complex features

---

## Data Structure

The `sap-data.json` has:

```json
{
  "id": "sap",
  "title": "...",
  "video": { "src": "...", "autoplay": false },
  "sections": [
    {
      "type": "text",
      "title": "...",
      "content": "..."
    },
    {
      "type": "gallery",
      "gridVariant": "small|medium|large",
      "images": [...]
    }
  ]
}
```

---

## Grid Variants

- **small** - Compact buttons/assets (120px min)
- **medium** - Animals/creatures (150px min)
- **large** - Backgrounds (280px min)

---

## Customization

### Change grid sizes
Edit `ProjectDetail.css`:
```css
.grid-small {
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
}
```

### Modify colors
Component uses CSS variables from your `index.css`:
- `--color-bg`
- `--color-text`
- `--color-border`
- etc.

---

## For Multiple Projects

1. Create separate JSON files for each project:
   - `sap-data.json`
   - `another-project-data.json`
   - `etc.json`

2. Use same `ProjectDetail.jsx` component for all

3. Route to each project:
```jsx
<Route path="/projects/sap" element={<ProjectPage project={sapData} />} />
<Route path="/projects/other" element={<ProjectPage project={otherData} />} />
```

---

## No Extra Dependencies

Everything works with React only. No additional libraries needed.

---

## Browser Support

- Works in all modern browsers
- Video: MP4 support required
- CSS Grid: Supported in all modern browsers
- Lightbox: Uses native HTML/CSS

---

## That's it!

The component handles:
- Video playback with controls
- Image gallery with hover effects
- Lightbox modal with keyboard support
- Responsive grid layouts
- All styling via design tokens

Just import the data, use the component, and you're done.
