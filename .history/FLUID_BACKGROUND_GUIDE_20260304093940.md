// FluidBackgroundCanvas Customization Guide
// ═══════════════════════════════════════════════════════════════════

// The new fluid background uses CSS variables for easy customization.
// Add these to your src/styles/index.css :root section to customize:

:root {
    /* Opacity & Visual Intensity */
    --fluid-opacity: 0.6;           /* Lower = more subtle, Higher = more prominent (0–1) */
    --fluid-speed: 1;               /* Animation speed (0.5 = slow, 1 = normal, 2 = fast) */
    --fluid-intensity: 1;           /* Particle movement (0.5 = gentle, 2 = wild) */
    
    /* Particle System */
    --fluid-particle-count: 50;     /* Number of floating particles (20–100) */
    --fluid-glow: 0.3;              /* Particle glow effect (0.1–1) */
    
    /* Colors – Change these to match your brand */
    --fluid-color-1: hsl(220, 80%, 50%);   /* Primary: Blue */
    --fluid-color-2: hsl(280, 70%, 55%);   /* Secondary: Purple */
    --fluid-color-3: hsl(180, 60%, 50%);   /* Tertiary: Cyan */
}

// ═══════════════════════════════════════════════════════════════════
// PRESET PALETTES
// ═══════════════════════════════════════════════════════════════════

// Option 1: Cool Nebula (Current Default - Recommended)
:root {
    --fluid-color-1: hsl(220, 80%, 50%);   /* Blue */
    --fluid-color-2: hsl(280, 70%, 55%);   /* Purple */
    --fluid-color-3: hsl(180, 60%, 50%);   /* Cyan */
}

// Option 2: Warm Sunset
:root {
    --fluid-opacity: 0.5;
    --fluid-color-1: hsl(25, 95%, 53%);    /* Orange */
    --fluid-color-2: hsl(0, 100%, 50%);    /* Red */
    --fluid-color-3: hsl(45, 100%, 51%);   /* Golden */
}

// Option 3: Elegant Monochrome (Minimalist)
:root {
    --fluid-opacity: 0.4;
    --fluid-particle-count: 30;
    --fluid-speed: 0.7;
    --fluid-color-1: hsl(0, 0%, 40%);      /* Light Gray */
    --fluid-color-2: hsl(0, 0%, 50%);      /* Gray */
    --fluid-color-3: hsl(0, 0%, 60%);      /* Darker Gray */
}

// Option 4: Vibrant & Bold
:root {
    --fluid-opacity: 0.8;
    --fluid-speed: 1.5;
    --fluid-intensity: 1.8;
    --fluid-glow: 0.6;
    --fluid-color-1: hsl(280, 100%, 50%);  /* Hot Magenta */
    --fluid-color-2: hsl(200, 100%, 50%);  /* Electric Blue */
    --fluid-color-3: hsl(320, 100%, 50%);  /* Hot Pink */
}

// Option 5: Subtle & Professional
:root {
    --fluid-opacity: 0.3;
    --fluid-speed: 0.5;
    --fluid-intensity: 0.6;
    --fluid-particle-count: 30;
    --fluid-glow: 0.15;
    --fluid-color-1: hsl(220, 50%, 60%);   /* Soft Blue */
    --fluid-color-2: hsl(240, 40%, 65%);   /* Soft Purple */
    --fluid-color-3: hsl(200, 40%, 65%);   /* Soft Cyan */
}

// ═══════════════════════════════════════════════════════════════════
// DARK MODE CUSTOMIZATION
// ═══════════════════════════════════════════════════════════════════

[data-theme="dark"] {
    /* Optional: Brighter colors for dark backgrounds */
    /* --fluid-color-1: hsl(220, 100%, 60%); */
    /* --fluid-color-2: hsl(280, 100%, 65%); */
    /* --fluid-color-3: hsl(180, 100%, 60%); */
    /* --fluid-opacity: 0.7; */
}

// ═══════════════════════════════════════════════════════════════════
// HOW IT WORKS
// ═══════════════════════════════════════════════════════════════════

// FluidBackgroundCanvas creates:
// 1. Animated gradient layers that slowly morph through the three colors
// 2. Floating particles with organic Perlin-like motion
// 3. Subtle glow effects on particles
// 4. Optional subtle connections between nearby particles (lines)
// 5. Smooth fading trails for premium feel

// The animation respects prefers-reduced-motion for accessibility.

// ═══════════════════════════════════════════════════════════════════
// PERFORMANCE TIPS
// ═══════════════════════════════════════════════════════════════════

// To optimize for lower-end devices:
// – Reduce --fluid-particle-count (try 20-30 instead of 50)
// – Reduce --fluid-opacity slightly (0.4-0.5)
// – Set --fluid-speed to 0.7 or lower
// – Disable particle connections by setting opacity to 0 in CSS

// To make it more dramatic:
// – Increase --fluid-opacity (0.7-1.0)
// – Increase --fluid-speed (1.5-3.0)
// – Increase --fluid-intensity (1.5-2.0)
// – Increase --fluid-glow (0.5-1.0)
// – Add more particles (60-100)

// ═══════════════════════════════════════════════════════════════════
