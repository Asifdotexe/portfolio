---
name: Asif Sayyed Portfolio
description: Personal brand portfolio for a data scientist
colors:
  page-bg: "#121212"
  surface-dark: "#1c1c20"
  surface-mid: "#202024"
  surface-muted: "#2b2b2c"
  border: "#383838"
  text-primary: "#fafafa"
  text-body: "#d6d6d6"
  text-muted: "#a0a0a8"
  accent-green: "#a8e43a"
  accent-green-deep: "#9eda2f"
  error: "#b74c4c"
typography:
  display:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.3
  headline:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(1.125rem, 3vw, 1.5rem)"
    fontWeight: 500
    lineHeight: 1.3
  title:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(1rem, 2.5vw, 1.125rem)"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(0.875rem, 2vw, 0.9375rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Poppins, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.6
rounded:
  sm: "8px"
  md: "12px"
  lg: "14px"
  xl: "16px"
  full: "20px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "15px"
  lg: "20px"
  xl: "25px"
  xxl: "30px"
components:
  button-primary:
    backgroundColor: "{colors.surface-mid}"
    textColor: "{colors.accent-green}"
    rounded: "{rounded.lg}"
    padding: "13px 20px"
  button-primary-hover:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.accent-green}"
    rounded: "{rounded.lg}"
    padding: "13px 20px"
  card-default:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.xl}"
    padding: "15px"
  input-text:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "13px 20px"
  chip:
    backgroundColor: "#2b2b2c"
    textColor: "#76e340"
    rounded: "10px"
    padding: "2px 6px"
  nav-link:
    textColor: "{colors.text-body}"
    fontSize: "0.6875rem"
    padding: "20px 7px"
  nav-link-active:
    textColor: "{colors.accent-green}"
    fontSize: "0.6875rem"
    padding: "20px 7px"
---

# Design System: Asif Sayyed Portfolio

## 1. Overview

**Creative North Star: "The Problem Solver's Studio"**

A personal portfolio for a data scientist who treats data as raw material and code as craft. The design is a workshop at night: dark, focused, with green as the signal light. It communicates professional competence without flash, showing evidence of depth rather than claiming it. Every element earns its place. Nothing is decorative for its own sake.

The system explicitly rejects glassmorphism, gradient text, hero-metric templates, and any pattern that prioritizes appearance over clarity. The dark theme is not a stylistic choice made because tools look cool dark; it suits the audience (recruiters and peers scanning from various environments, often on their own time) and lets the accent green function as a clear attention signal across the interface.

**Key Characteristics:**
- Dark-by-default with warm-neutral undertones (hue 240 at trace saturation)
- Single green accent used as an interactive signal, not surface decoration
- Clean rounded corners (12-20px) throughout for a polished but not playful feel
- Typography-driven hierarchy with one family, three weights
- Data as visual evidence (GitHub activity graph, project screenshots, certificates)
- Staggered entrance animations that feel intentional, not gratuitous
- Tilt-as-reveal on card hover (subtle 3D perspective, never bouncy)

## 2. Colors

A restrained single-accent palette built for readability and attention signaling on dark surfaces. The green is the working light: it marks interactive states, dates, tags, and the active navigation target. Its rarity is the point.

### Primary

- **Signal Green** (#a8e43a / oklch(80% 0.18 130)): The one accent. Hover states, active navigation, dates, tags, selection highlight, scrollbar thumb, form focus border. Used at saturation only on small elements and state changes; never as a page background.

### Neutral

- **Page Surface** (#121212): The ambient background. Pushed to near-black so the content containers feel like floating surfaces.
- **Surface Dark** (#1c1c20): Cards, sidebar, input backgrounds. The primary content surface.
- **Surface Mid** (#202024): Secondary surfaces, gradient bases, article backgrounds.
- **Surface Muted** (#2b2b2c): Tag backgrounds, separator hover, modal close button. The deepest surface layer.
- **Border** (#383838): 1px strokes that define surface edges. Thin, unobtrusive, visible only on inspection.
- **Text Primary** (#fafafa): Headings, names, important labels. Near-white for maximum contrast.
- **Text Body** (#d6d6d6): Paragraph text, descriptions. Slightly softened for extended reading.
- **Text Muted** (#a0a0a8): Metadata, dates, secondary labels. Recedes appropriately.

### Semantic

- **Error** (#b74c4c): Form validation error border. Muted red that signals without alarming.

### Named Rules

**The One Signal Rule.** The green accent appears on interactive states, active selections, and small metadata labels only. It never occupies more than 10% of any viewport. When it appears, the user knows something is actionable or has changed.

## 3. Typography

**Body Font:** Poppins (300, 400, 500, 600) with sans-serif fallback

A single-family system. Poppins at 300 has a light, airy quality that reads well on dark backgrounds; at 600 it tightens into confident headings. The absence of a second family is deliberate: one committed typeface with strong weight contrast reads as a choice, not a limitation.

**Character:** Geometric, clean, slightly technical without being cold. The circular terminals and open apertures keep it approachable. On dark surfaces, lighter weights (300-400) carry body text with added line-height (1.6) for readability.

### Hierarchy

- **Display** (600, clamp(1.5rem, 4vw, 2rem), 1.3): Page and section titles. The name "Asif Sayyed" in the sidebar.
- **Headline** (500, clamp(1.125rem, 3vw, 1.5rem), 1.3): Article titles ("About me", "Resume"), section headings within articles.
- **Title** (500, clamp(1rem, 2.5vw, 1.125rem), 1.3): Card titles, timeline item titles, project headings.
- **Body** (400, clamp(0.875rem, 2vw, 0.9375rem), 1.6): Paragraph text, descriptions, form inputs. Capped at 65ch max-width for the about-text section.
- **Label** (500, 0.8125rem, 1.6): Metadata, skill items, filter buttons, tag text, navbar links. Smaller but not fine-print small.

## 4. Elevation

Tonal layering with shadows. Depth is conveyed through surface lightness more than shadow reach. The page background (#121212) is the darkest point; content surfaces step up through #1c1c20 and #202024. Shadows provide separation but do not simulate realistic height.

### Shadow Vocabulary

- **Ambient Low** (`-4px 8px 24px hsla(0,0%,0%,0.25)`): Sidebar, icon boxes. A directional shadow that implies a left-from-center light source.
- **Ambient Mid** (`0 16px 30px hsla(0,0%,0%,0.25)`): Cards, modals, dropdown lists. Centered, wider spread.
- **Elevated** (`0 16px 40px hsla(0,0%,0%,0.25)`): Buttons at rest. Slightly taller reach.
- **Floating** (`0 25px 50px hsla(0,0%,0%,0.15)`): Hover states on cards and items. Softer but wider.
- **Modal** (`0 24px 80px hsla(0,0%,0%,0.25)`): The testimonial modal overlay. Wide, diffuse, receding.

### Named Rules

**The Layered Surface Rule.** Closer surfaces are lighter, not more shadowed. The page background is #121212; primary content surfaces are #1c1c20; the sidebar and modals use #202024. Shadows reinforce the separation but the tonal stack does the heavy lifting.

## 5. Components

### Buttons

- **Shape:** Rounded (14px radius). Full-width on mobile, auto-width on larger screens.
- **Primary:** Background uses the gradient-border trick (pseudo-element inset at 1px with dark gradient, parent has a lighter gradient border). Text is Signal Green. Internal padding 13px 20px.
- **Hover:** The gradient border swaps to the green gradient. The inner pseudo-element shifts to `bg-gradient-green-2`. Text remains Signal Green.
- **Disabled:** Opacity 0.7, cursor not-allowed. Hover does nothing.
- **Secondary (Recommend Me on LinkedIn):** Same shape and padding. White text. Ribbon icon before the label. No green until hover.

### Chips / Tags

- **Style:** Muted surface (#2b2b2c) background, #76e340 text, 10px radius. Compact: 2px 6px padding, 0.75rem font size.
- **Hover:** Background shifts to #5a6268. No color change on text.
- **Usage:** Project technology tags, category labels on cards.

### Cards / Containers

- **Corner Style:** 16px radius for project/event/certificate cards. 14px for content cards (.content-card). 12px for event banner images.
- **Background:** Surface Dark (#1c1c20) for cards. Surface Mid (#202024) for sidebar and contribution chart.
- **Border:** 1px solid Border (#383838) on all cards.
- **Shadow Strategy:** Ambient Mid at rest; Floating on hover.
- **Internal Padding:** 15px for content cards. 30px for skills sections. 20px for event content area. 10px for event post items.

### Inputs / Fields

- **Style:** Transparent background, 1px solid Border (#383838), 14px radius. Body text styling for entered text. Placeholder in 500 weight.
- **Focus:** Border shifts to Signal Green (#a8e43a). No glow, no box-shadow.
- **Error:** Border shifts to Error (#b74c4c) on `:invalid` with focus.
- **Textarea:** Min-height 100px, max-height 200px, vertical resize only. Resizer hidden.
- **Layout:** Input wrapper uses single-column grid at mobile, two-column at >=768px, gap 25px.

### Navigation

- **Style:** Tab-style navigation at the bottom of the viewport (top-right on desktop >=1024px). Links are uppercase, 11px/12px, spaced 20px 7px padding.
- **States:** Text Body (#d6d6d6) at rest, transitions to Text Muted (#a0a0a8) on hover, switches to Signal Green (#a8e43a) when active. Active link indicates the visible article page.

### Icon Boxes

- **Style:** 30x30px square with 8px radius, gradient border with dark inset fill, Signal Green icon. Used for contacts list icons and section title icons. Box-shadow adds separation.

### Timeline

- **Structure:** Vertical left-aligned connector (1px Border line) with 6px Signal Green dot at each item. Items indented 45px from the connector.
- **Date styling:** Signal Green (deep variant #9eda2f) for emphasis. Title in Text Primary, description in Text Body Light (300).

### Skills Pills

- **Style:** Chips with 12px radius, Surface Dark background, 1px Border stroke, 40px fixed height, icon in Signal Green, text in Text Primary. Gap 8px between icon and label.
- **Hover:** Background shifts to Surface Muted, border switches to Signal Green, lifts 2px up with Ambient Mid shadow.

## 6. Do's and Don'ts

### Do:

- **Do** use Signal Green on interactive states only. Its presence should always signal that something is actionable, active, or has changed.
- **Do** let the tonal surface stack do the elevation work. The page is #121212, surfaces are #1c1c20 and #202024. Trust the layering.
- **Do** keep body text at 65ch max-width. Reading comfort over full-width convenience.
- **Do** use staggered fade-in-up animations for dynamic content. Delay by 0.1s per item, duration 0.6s.
- **Do** keep tags compact (2px 6px padding, 0.75rem). They should label, not dominate.

### Don't:

- **Don't** use glassmorphism, blurred backdrops, or translucent surfaces. Decorative translucency is forbidden.
- **Don't** use gradient text (`background-clip: text`). Headings use a single solid color. The green underline accent on article titles is the only gradient in the system (and it is a line, not text).
- **Don't** use the hero-metric template (big number, small label, gradient accent).
- **Don't** use identical card grids with icon + heading + text repeated endlessly. Vary card composition by section: timeline lists, project image-led cards, certificate/text composites.
- **Don't** use side-stripe borders (border-left or border-right >1px as a colored accent). Use full borders, background tints, or leading icons instead.
- **Don't** use em dashes. Use commas, colons, semicolons, periods, or parentheses.
- **Don't** default to modals. The testimonial modal is the one exception and it progressively enhances inline content.
