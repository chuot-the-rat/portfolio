# Portfolio Theme System - Light & Dark Modes

## ✅ Status: IMPLEMENTED

**Implementation Date:** February 4, 2026

**Files Modified:**

- `styles.css` - Theme variables and transitions
- `index.html` - Theme toggle button and script
- `project-fizzu.html` - Theme-aware FIZZU page

**Features:**

- ✅ Light mode with subtle pink accent (#E879A3)
- ✅ Dark mode with deep red accent (#C13048)
- ✅ Smooth 300ms transitions
- ✅ localStorage persistence
- ✅ Anti-flash on page load
- ✅ Floating theme toggle button

---

## 🎨 Design Tokens

### Color System

```javascript
// theme-tokens.js
export const colors = {
    light: {
        // Backgrounds
        bg: {
            primary: "#FFFFFF", // Main background (pure white)
            secondary: "#FAFAFA", // Secondary surfaces (off-white)
            tertiary: "#F5F5F5", // Cards, hover states
            elevated: "#FFFFFF", // Modals, dropdowns
        },

        // Text
        text: {
            primary: "#0A0A0A", // Headlines, primary text (near-black)
            secondary: "#525252", // Body text, labels (soft grey)
            tertiary: "#A3A3A3", // Captions, disabled (light grey)
            inverted: "#FFFFFF", // Text on dark backgrounds
        },

        // Accent - Subtle Pink (inspired by ChatGPT)
        accent: {
            primary: "#E879A3", // Links, CTAs, highlights
            hover: "#D65B8A", // Hover states
            subtle: "#FCF1F5", // Light backgrounds
            border: "#F5D7E3", // Borders, dividers
        },

        // Neutrals
        border: "#E5E5E5", // Dividers, outlines
        divider: "#F0F0F0", // Section separators
        shadow: "rgba(0, 0, 0, 0.04)", // Subtle elevation
    },

    dark: {
        // Backgrounds
        bg: {
            primary: "#000000", // True black base
            secondary: "#0A0A0A", // Slightly elevated black
            tertiary: "#141414", // Cards, surfaces
            elevated: "rgba(20, 20, 20, 0.95)", // Modals with transparency
        },

        // Text
        text: {
            primary: "#FFFFFF", // Headlines (pure white)
            secondary: "#A3A3A3", // Body text (medium grey)
            tertiary: "#525252", // Captions (darker grey)
            inverted: "#0A0A0A", // Text on light backgrounds
        },

        // Accent - Deep Red (sophisticated, not neon)
        accent: {
            primary: "#C13048", // Links, CTAs
            hover: "#D84A5F", // Hover states (slightly brighter)
            subtle: "rgba(193, 48, 72, 0.1)", // Transparent backgrounds
            border: "rgba(193, 48, 72, 0.3)", // Borders
        },

        // Neutrals
        border: "rgba(255, 255, 255, 0.1)", // Subtle dividers
        divider: "rgba(255, 255, 255, 0.05)", // Very subtle separators
        shadow: "rgba(0, 0, 0, 0.3)", // Deeper shadows
    },
};

// Typography
export const typography = {
    fontFamily: {
        primary:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: '"SF Mono", "Roboto Mono", "Courier New", monospace',
    },

    fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem", // 48px
        "6xl": "3.75rem", // 60px
    },

    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },

    lineHeight: {
        tight: 1.2,
        snug: 1.4,
        normal: 1.6,
        relaxed: 1.8,
    },

    letterSpacing: {
        tight: "-0.02em",
        normal: "0",
        wide: "0.02em",
    },
};

// Spacing (8px base grid)
export const spacing = {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    32: "8rem", // 128px
};

// Shadows
export const shadows = {
    light: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        base: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
    },
    dark: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        base: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.5)",
    },
};

// Border Radius
export const borderRadius = {
    sm: "0.25rem", // 4px
    base: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    full: "9999px", // Pill shape
};

// Transitions
export const transitions = {
    duration: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
        slower: "500ms",
    },

    easing: {
        default: "cubic-bezier(0.4, 0, 0.2, 1)", // ease-in-out
        in: "cubic-bezier(0.4, 0, 1, 1)", // ease-in
        out: "cubic-bezier(0, 0, 0.2, 1)", // ease-out
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)", // custom smooth
    },
};

export default {
    colors,
    typography,
    spacing,
    shadows,
    borderRadius,
    transitions,
};
```

---

## 🎨 CSS Variables Implementation

```css
/* theme.css */

/* Light Mode (Default) */
:root {
    /* Backgrounds */
    --bg-primary: #ffffff;
    --bg-secondary: #fafafa;
    --bg-tertiary: #f5f5f5;
    --bg-elevated: #ffffff;

    /* Text */
    --text-primary: #0a0a0a;
    --text-secondary: #525252;
    --text-tertiary: #a3a3a3;
    --text-inverted: #ffffff;

    /* Accent - Subtle Pink */
    --accent-primary: #e879a3;
    --accent-hover: #d65b8a;
    --accent-subtle: #fcf1f5;
    --accent-border: #f5d7e3;

    /* Neutrals */
    --border: #e5e5e5;
    --divider: #f0f0f0;
    --shadow-color: rgba(0, 0, 0, 0.04);

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
    --shadow-base:
        0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02);
    --shadow-md:
        0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
    --shadow-lg:
        0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
}

/* Dark Mode */
[data-theme="dark"] {
    /* Backgrounds */
    --bg-primary: #000000;
    --bg-secondary: #0a0a0a;
    --bg-tertiary: #141414;
    --bg-elevated: rgba(20, 20, 20, 0.95);

    /* Text */
    --text-primary: #ffffff;
    --text-secondary: #a3a3a3;
    --text-tertiary: #525252;
    --text-inverted: #0a0a0a;

    /* Accent - Deep Red */
    --accent-primary: #c13048;
    --accent-hover: #d84a5f;
    --accent-subtle: rgba(193, 48, 72, 0.1);
    --accent-border: rgba(193, 48, 72, 0.3);

    /* Neutrals */
    --border: rgba(255, 255, 255, 0.1);
    --divider: rgba(255, 255, 255, 0.05);
    --shadow-color: rgba(0, 0, 0, 0.3);

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-base:
        0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3);
    --shadow-md:
        0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4);
    --shadow-lg:
        0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.5);
}

/* Smooth theme transition */
* {
    transition:
        background-color 300ms ease,
        border-color 300ms ease,
        color 300ms ease;
}

/* Prevent transition on page load */
.no-transition * {
    transition: none !important;
}
```

---

## 🌓 Theme Toggle Component

```jsx
// components/ThemeToggle.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);

        // Remove no-transition class after mount
        setTimeout(() => {
            document.body.classList.remove("no-transition");
        }, 100);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === "dark" ? 180 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
                {theme === "light" ? (
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <circle
                            cx="10"
                            cy="10"
                            r="3"
                            fill="currentColor"
                        />
                        <path
                            d="M10 1v2M10 17v2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M1 10h2M17 10h2M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                ) : (
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <path
                            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                            fill="currentColor"
                        />
                    </svg>
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
```

```css
/* components/ThemeToggle.css */
.theme-toggle {
    position: fixed;
    top: 2rem;
    right: 2rem;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-primary);
    transition: all 200ms ease;
    z-index: 1000;
}

.theme-toggle:hover {
    background: var(--bg-elevated);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
}

.theme-toggle:active {
    transform: translateY(0);
}

@media (max-width: 768px) {
    .theme-toggle {
        top: 1rem;
        right: 1rem;
        width: 40px;
        height: 40px;
    }
}
```

---

## 🎯 Usage Example

```jsx
// App.jsx or _app.jsx
import ThemeToggle from "./components/ThemeToggle";
import "./theme.css";

function App() {
    useEffect(() => {
        // Add no-transition class on mount
        document.body.classList.add("no-transition");
    }, []);

    return (
        <div className="app">
            <ThemeToggle />
            {/* Rest of your app */}
        </div>
    );
}
```

---

## 📊 Theme Comparison

### Light Mode Characteristics

- **Inspired by:** ChatGPT light mode
- **Feel:** Clean, airy, calm
- **Backgrounds:** Pure white to soft off-white
- **Accent:** Subtle pink (#E879A3)
- **Use case:** Daytime reading, detailed work

### Dark Mode Characteristics

- **Inspired by:** Editorial/luxury magazines
- **Feel:** Sleek, sophisticated, minimal
- **Backgrounds:** True black with transparent layers
- **Accent:** Deep red (#C13048)
- **Use case:** Evening browsing, visual focus

Both modes:

- Maintain exact same layout
- Equal attention to polish
- Smooth 300ms transition
- Consistent spacing/typography
- Professional, mature tone

---

This theme system provides a solid foundation for your entire portfolio. All colors are carefully chosen to feel professional and cohesive while maintaining excellent readability in both modes.
