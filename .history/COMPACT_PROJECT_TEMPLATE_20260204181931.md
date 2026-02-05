# Compact Project Template

## Overview

Use this template for smaller projects like packaging designs, illustrations, or concept work that don't require full case study treatment. These projects maintain the Jackie Hu editorial aesthetic with free-floating visuals and intentional negative space.

---

## When to Use Compact Format

✅ **Use for:**
- Packaging design concepts
- Illustration series
- Brand identity explorations
- Conceptual work
- Spec projects
- Quick visual explorations

❌ **Don't use for:**
- Full UX/UI case studies (use full format)
- Projects requiring research documentation
- Multi-phase design processes
- Projects with detailed iterations

---

## Data Structure

### File Location
Create: `projects/[project-id]/data.json`

### JSON Template

```json
{
    "id": "project-id",
    "title": "Project Title",
    "subtitle": "One-line description of the project concept",
    "category": "Category Name",
    "year": "2024",
    "format": "compact",
    "description": "2-3 concise sentences describing the project, tools used, and creative approach. Keep it simple, readable, and editorial. Focus on what makes this project unique without overexplaining.",
    "heroImage": {
        "src": "projects/project-id/images/hero.png",
        "alt": "Descriptive alt text for accessibility"
    },
    "links": {
        "live": "https://example.com",
        "behance": "https://behance.net/gallery/...",
        "dribbble": "https://dribbble.com/shots/..."
    },
    "hoverImages": [
        "projects/project-id/images/detail-1.png",
        "projects/project-id/images/detail-2.png",
        "projects/project-id/images/detail-3.png"
    ]
}
```

---

## Field Guidelines

### Required Fields

**id** - Unique identifier (lowercase, hyphens)
```json
"id": "fizzu-soda"
```

**title** - Short, clear project name
```json
"title": "FIZZU Soda Can Series"
```

**category** - Project type
```json
"category": "Packaging Design"
```

**year** - Completion year
```json
"year": "2024"
```

**format** - Must be "compact"
```json
"format": "compact"
```

**heroImage** - Main visual
```json
"heroImage": {
    "src": "projects/fizzu-soda/images/overview.png",
    "alt": "FIZZU Soda Can Series featuring three unique flavours"
}
```

### Optional Fields

**subtitle** - One-line context
```json
"subtitle": "Concept packaging design for bold, unexpected flavours"
```

**description** - 2-3 sentence project description
```json
"description": "Concept packaging design exploring bold typography and vibrant colour blocking for a fictional soda brand. Created three distinct flavour identities using Adobe Illustrator and Photoshop, each designed to create shelf impact and communicate playful, unexpected energy through strong graphic forms."
```

**links** - External project links
```json
"links": {
    "live": "https://...",
    "behance": "https://behance.net/...",
    "dribbble": "https://dribbble.com/..."
}
```

**hoverImages** - Additional visuals (3-6 recommended)
```json
"hoverImages": [
    "projects/fizzu-soda/images/detail-1.png",
    "projects/fizzu-soda/images/detail-2.png",
    "projects/fizzu-soda/images/detail-3.png"
]
```

---

## Layout Components

When rendered, compact projects display:

### 1. Hero Section
- Large centered title (48-64px)
- Optional subtitle (light gray, 16-18px)
- Category + year tags
- CTA button grid (if links provided)

### 2. Hero Image
- Free-floating with subtle shadow
- Hover: slight scale + rotation
- No container backgrounds
- Full-width responsive

### 3. Description
- 2-3 sentences centered
- 18px, line-height 1.8
- Secondary text color
- Max-width 700px

### 4. Gallery Grid
- Asymmetric auto-fit grid (min 400px)
- Each image: hover scale + rotate
- Subtle overlay on hover
- Free-floating, no containers

---

## Design Principles

### Typography
- **Title:** Bold, 48-64px, centered
- **Subtitle:** Light, 16-18px, secondary color
- **Description:** 18px, line-height 1.8, centered
- **Font:** Inter variable

### Spacing
- Generous vertical rhythm (96-128px between sections)
- Intentional negative space
- No tight containers

### Visuals
- Free-floating images
- Subtle shadows (no heavy borders)
- Snappy hover animations (0.3s, custom ease)
- Respect prefers-reduced-motion

### Color
- Minimal use of color
- Primary for CTAs
- Secondary text for descriptions
- Subtle borders and overlays

---

## Image Guidelines

### Hero Image
- **Dimensions:** 1600x1200px minimum
- **Format:** PNG or WebP
- **Content:** Main project visual or hero mockup
- **Alt text:** Descriptive, includes project name

### Gallery Images
- **Dimensions:** 1200x900px minimum
- **Format:** PNG or WebP
- **Quantity:** 3-6 images ideal
- **Content:** Detail shots, variations, process

### File Naming
```
projects/
  project-id/
    images/
      hero.png          # Main visual
      detail-1.png      # Gallery image 1
      detail-2.png      # Gallery image 2
      detail-3.png      # Gallery image 3
```

---

## Writing Guidelines

### Title
- Short and clear
- 3-6 words ideal
- Capitalize important words

Examples:
- ✅ "FIZZU Soda Can Series"
- ✅ "Midnight Sky Poster Collection"
- ❌ "A Series of Experimental Packaging Designs for a Fictional Soda Brand"

### Subtitle
- One-line context or concept
- 5-10 words
- Lowercase except proper nouns

Examples:
- ✅ "Concept packaging design for bold, unexpected flavours"
- ✅ "Editorial illustrations exploring digital identity"
- ❌ "This is a packaging design project I did in 2024"

### Description
- 2-3 sentences maximum
- Mention tools used naturally
- Explain creative approach
- Avoid bullet points or lists

Example:
```
"Concept packaging design exploring bold typography and vibrant 
colour blocking for a fictional soda brand. Created three distinct 
flavour identities using Adobe Illustrator and Photoshop, each 
designed to create shelf impact and communicate playful, unexpected 
energy through strong graphic forms."
```

---

## Example: FIZZU Soda

```json
{
    "id": "fizzu-soda",
    "title": "FIZZU Soda Can Series",
    "subtitle": "Concept packaging design for bold, unexpected flavours",
    "category": "Packaging Design",
    "year": "2024",
    "format": "compact",
    "description": "Concept packaging design exploring bold typography and vibrant colour blocking for a fictional soda brand. Created three distinct flavour identities using Adobe Illustrator and Photoshop, each designed to create shelf impact and communicate playful, unexpected energy through strong graphic forms.",
    "heroImage": {
        "src": "projects/fizzu-soda/images/overview.png",
        "alt": "FIZZU Soda Can Series featuring three unique flavours"
    },
    "links": {
        "behance": "https://behance.net/gallery/fizzu-soda",
        "dribbble": "https://dribbble.com/shots/fizzu-soda"
    },
    "hoverImages": [
        "projects/fizzu-soda/images/solution-1.png",
        "projects/fizzu-soda/images/solution-2.png",
        "projects/fizzu-soda/images/process.png"
    ]
}
```

---

## Checklist

Before publishing a compact project:

- [ ] Created `projects/[project-id]/data.json`
- [ ] Added hero image (1600x1200px min)
- [ ] Added 3-6 gallery images (1200x900px min)
- [ ] Set `format: "compact"`
- [ ] Wrote 2-3 sentence description
- [ ] Added external links (if applicable)
- [ ] Registered project in `projects.json`
- [ ] Tested on localhost
- [ ] Verified hover animations work
- [ ] Checked mobile responsive layout

---

## Adding to Portfolio

1. **Create project folder:**
   ```
   projects/your-project-id/
   ```

2. **Add images:**
   ```
   projects/your-project-id/images/
     hero.png
     detail-1.png
     detail-2.png
   ```

3. **Create data.json:**
   Use template above

4. **Register in projects.json:**
   ```json
   {
       "id": "your-project-id",
       "title": "Your Project Title",
       "category": "Category",
       "year": "2024",
       "thumbnail": "projects/your-project-id/images/hero.png",
       "path": "projects/your-project-id"
   }
   ```

5. **Test:**
   ```bash
   npm run dev
   ```
   Visit: `http://localhost:5173/project/your-project-id`

---

## Technical Notes

- **Framework:** React 18 + Vite
- **Animations:** Framer Motion 11
- **Motion:** 0.3s duration, custom ease [0.16, 1, 0.3, 1]
- **Accessibility:** Respects prefers-reduced-motion
- **Responsive:** Mobile-first, breakpoint at 768px
- **Images:** Lazy loading enabled

---

## Tips

✨ **Keep it simple** - Compact projects are meant to be elegant, not comprehensive
🎨 **Let visuals speak** - Use strong imagery, minimal text
📏 **Embrace whitespace** - Don't fill every pixel
⚡ **Snappy interactions** - Quick, confident animations
🔗 **Link externally** - Use CTA links to direct to full portfolios on Behance/Dribbble
