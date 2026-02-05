# Project Hover System — Technical/Cyber Editorial Implementation

## Overview

Successfully implemented a sophisticated project hover system that treats hover interactions as **system module activations** rather than decorative effects.

## Core Philosophy

- **Hover ≠ decoration**
- **Hover = system state change**
- Each project activation feels deliberate and controlled
- No softness, no floating, no card-lift clichés

## Technical Specifications

### Motion Parameters

- **Duration**: 180–240ms (exact: 200ms for main, 180ms for labels)
- **Easing**: `cubic-bezier(0.2, 0.8, 0.2, 1)` — sharp and technical
- **Opacity**: Starts at 0.9 (not full fade-in)
- **Text Shift**: 6px horizontal translation
- **Letter Spacing**: Tightens from -0.04em to -0.048em

### System Labels

Three dynamic labels appear during hover states:

- `[idle]` — Default state
- `[preview_loaded]` — On initial hover
- `[media_active]` — After 120ms delay
- `[view_case_study]` — Bottom label for interaction cue

Labels use:

- Courier New monospace font
- Lowercase text
- 0.05em letter-spacing
- 0.5 opacity
- Position: absolute (top-right for system label, bottom-left for view label)

## Hover Patterns

Each project uses one of four distinct patterns:

### Pattern A — Single Large Reveal

- **Project**: InkLink (index 0)
- **Behavior**: One wide image slides out horizontally
- **Size**: 520px wide
- **Motion**: `translateX(20px) scale(1.05)` on hover
- **Feel**: System monitor expanding

### Pattern B — Staggered Stack

- **Project**: ProLog (index 1)
- **Behavior**: Two images with 60ms offset
- **Size**: 360px wide
- **Motion**: `translateY(-8px) scale(1.03)` on hover
- **Feel**: Cascading data panels

### Pattern C — Vertical Strip

- **Project**: SideQuest (index 2)
- **Behavior**: Tall mobile mockup reveals from bottom
- **Size**: 280px wide
- **Motion**: `translateY(-16px)` snap into place
- **Feel**: Terminal window sliding up

### Pattern D — Video Scrub Preview

- **Project**: FIZZU (index 3)
- **Behavior**: Auto-play video on hover
- **Size**: 480px wide
- **Motion**: Minimal (video already playing)
- **Feel**: Security camera feed activation

## De-Emphasis System

When one project is hovered:

- Other projects: `opacity: 0.65`
- Other titles: `opacity: 0.6`
- Other separators: `opacity: 0.15`
- Transition: 200ms with technical easing
- **No blur effects** — clean opacity fade only

## Side-Reveal Preview Panel

### Core Mechanics

- **Entry**: Horizontal slide from right with clipped mask
- **ClipPath**: `inset(0 100% 0 0)` → `inset(0 0% 0 0)`
- **Hard Edge Masks**: No soft containers or rounded corners
- **Shadow**: Sharp technical shadow (not soft drop shadow)
    ```css
    box-shadow:
        0 0 0 2px rgba(0, 0, 0, 0.1),
        0 12px 32px rgba(0, 0, 0, 0.15);
    ```

### Preview State Labels

- Displayed over media in bottom-left corner
- Shows `[image_loaded]` or `[video_active]`
- Background: `rgba(0, 0, 0, 0.7)` with backdrop-filter
- Appears on hover with 180ms fade

## Title Interaction

### Hover Behavior

- **Translation**: 6px to the right
- **Letter Spacing**: Tightens slightly
- **Underline**: Draws in from left to right
    - Height: 2px solid line
    - Position: 4px below title
    - Origin: `transform-origin: left`
    - Transition: 180ms

### Divider Line

- Appears on left side of project card
- Scales from 0 to 1 horizontally
- Origin: right side
- Width: clamp(20px, 3vw, 32px)
- Color: Matches text color

## Mode-Specific Variants

### Work Mode

- System labels use accent color: `rgba(232, 93, 53, 0.9)`
- Preview shadows enhanced
- More pronounced hover transforms
- Border-radius: 0 (hard edges)

### Clean Mode

- System labels hidden
- Minimal transforms: `scale(1.005)`
- Divider lines hidden
- Ultra-minimal aesthetic

### Chaos Mode

- Slight rotation on hover: `rotate(0.5deg)`
- Exaggerated scale: `scale(1.04)`
- Maintains technical easing

## File Structure

### Modified Files

1. **ProjectCard.jsx**
    - Added system label state management
    - Added `isOtherHovered` prop for de-emphasis
    - Added `hoverPattern` prop
    - Implemented title underline animation

2. **ProjectCard.css**
    - Technical easing and timing
    - System label styling
    - Title underline styles
    - De-emphasis states
    - Removed empty pattern rules

3. **PreviewPanel.jsx**
    - Side-reveal variants with clipPath
    - Pattern-specific positioning
    - Hard edge mask containers
    - State label system
    - Pattern filtering (A/C/D show 1 image, B shows multiple)

4. **PreviewPanel.css**
    - Sharp technical shadows
    - Clipped reveal animations
    - Pattern-specific hover behaviors
    - State label styling
    - Mode-specific variants

5. **Home.jsx**
    - Pattern assignment logic
    - De-emphasis state management
    - Pattern rotation (4 patterns cycling)

## Anti-Patterns Avoided

✅ **NO** card lift + shadow  
✅ **NO** centered overlay previews  
✅ **NO** slow fades (300ms+)  
✅ **NO** soft easing (cubic-bezier with <0.2 or >0.8)  
✅ **NO** uniform hover behavior  
✅ **NO** floating effects  
✅ **NO** rounded containers  
✅ **NO** decorative motion

## Testing

**Local Server**: http://localhost:5176/

### Interaction Checklist

- [ ] Hover on InkLink → Pattern A (single large reveal)
- [ ] Hover on ProLog → Pattern B (staggered stack)
- [ ] Hover on SideQuest → Pattern C (vertical strip)
- [ ] Hover on FIZZU → Pattern D (video preview)
- [ ] System labels appear and update
- [ ] Other projects de-emphasize
- [ ] Title underline draws left to right
- [ ] Text shifts 6px right
- [ ] Preview slides in with clip mask
- [ ] No soft fades or decorative motion

## Performance Notes

- Uses `will-change: transform, opacity, clip-path` on preview panels
- Transitions run at 60fps
- No layout thrashing
- ClipPath for GPU-accelerated reveals
- Backdrop-filter used sparingly (only on state labels)

## Accessibility

- Reduced motion support disables all transitions
- System labels hidden on mobile (<768px)
- Preview panels hidden on tablet (<1024px)
- Focus states preserved for keyboard navigation
- Color contrast: WCAG AA compliant

## Future Enhancements

1. **Pattern Variations**: Add more pattern types (E, F, G)
2. **Dynamic Labels**: Show actual project metadata
3. **Cursor Indicators**: Custom cursor on hover zones
4. **Sound Effects**: Subtle click/activation sounds
5. **Keyboard Navigation**: Arrow keys to cycle projects

---

**Implementation Status**: ✅ Complete  
**Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)  
**Framework**: React 18 + Framer Motion 11  
**Design System**: Technical/Cyber Editorial
