# 🚀 QUICK START GUIDE

## ✅ What's Fixed

1. **Font Changed to Rubik** - Clean, modern typography throughout
2. **GitHub Link Fixed** - Now points to https://github.com/chuot-the-rat
3. **Side-by-Side Layout** - Text on left, image on right (scrolls together!)
4. **JSON Template System** - Easy to add/remove projects

## 🎯 Your Portfolio Structure

```
portfolio/
├── index.html           ← Open this to view your portfolio
├── styles.css           ← Rubik font + side-by-side styles
├── projects.json        ← List of all projects
├── projects/
│   └── fintech-app/     ← Example project (fully set up)
│       ├── icon.svg
│       ├── data.json
│       └── images/
└── README.md           ← Full documentation
```

## 📝 Top 3 Things to Customize

### 1. Your Personal Info (in index.html)
Search for and replace:
- `your.email@example.com` → Your actual email
- `778 994 8400` → Your phone
- `linkedin.com/in/leanale` → Your LinkedIn
- Bio and description text

### 2. Add Your Real Projects
The portfolio comes with:
- ✅ **fintech-app** - Fully completed example
- ⚠️ **3 other projects** - Templates ready for your content

To add your content:
1. Go to `projects/your-project/data.json`
2. Replace the template text with your content
3. Add your screenshots to `projects/your-project/images/`

### 3. Change the Color (Optional)
In `styles.css`, line 33-34:
```css
--accent: #0ea5e9;  ← Change this color
```

## 🎨 The Side-by-Side Case Study Layout

### How It Looks:
```
┌─────────────────────────────────────┐
│  📄 TEXT           │  🖼️ IMAGE      │
│  Title             │                │
│  Description       │  [Screenshot]  │
│  More text...      │                │
│                    │  (scrolls with │
│  Even more text    │   the text)    │
└─────────────────────────────────────┘
```

### Sections That Use It:
- **Overview** - Project introduction + main screenshot
- **Problem** - Challenge description + problem visual
- **Solution** - Your solution + solution screenshot

### On Mobile:
Text and image stack vertically (text first, then image below)

## 📸 Image Recommendations

| Type | Size | Format | Location |
|------|------|--------|----------|
| Project Icon | 180x180 | SVG/PNG | `projects/*/icon.svg` |
| Screenshots | 800x600 | PNG/JPG | `projects/*/images/*.png` |

## ⚡ Common Tasks

### Add a New Project:
```bash
1. Create folder: projects/new-project/images/
2. Add to projects.json
3. Create data.json (copy template from fintech-app)
4. Add icon.svg and screenshots
```

### Remove a Project:
```bash
1. Delete from projects.json
2. Delete the folder (optional)
```

### Change Colors:
```bash
Edit styles.css → :root section → --accent and --accent-light
```

## 🐛 Troubleshooting

**Q: Projects not appearing?**
A: Check projects.json is valid (use jsonlint.com)

**Q: Images not loading?**
A: Verify paths in data.json match actual file locations

**Q: Case study won't open?**
A: Make sure data.json has all required fields (see template)

**Q: Want different layout?**
A: The side-by-side layout is in `.cs-section-sidebyside` in styles.css

## 📱 Test Checklist

Before sharing:
- [ ] Open index.html in browser
- [ ] Drag project icons around
- [ ] Click a project to open case study
- [ ] Scroll through the case study
- [ ] Test on phone/tablet
- [ ] Check all your links work

## 🎉 You're Ready!

Your portfolio has:
- ✅ Rubik font everywhere
- ✅ Correct GitHub link
- ✅ Beautiful side-by-side case studies
- ✅ Easy JSON-based project system
- ✅ One complete example (fintech-app)
- ✅ Three templates ready for your content

**Next step:** Open `index.html` in your browser and start customizing!

---

Need more help? Check `README.md` for complete documentation.
