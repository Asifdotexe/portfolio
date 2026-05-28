---
target: footer.site-footer
total_score: 0
p0_count: 0
p1_count: 0
p2_count: 0
p3_count: 2
p4_count: 2
timestamp: 2026-05-28T16-26-16Z
slug: index-html-site-footer
---
## Footer Critique: .site-footer

### Assessment Notes

Single-line p bar with copyright, role/company/location, and llms links. Muted var(--light-gray-70), 11px, centered, 1px solid var(--jet) top border. En spaces separate segments.

### What's Working

**Recessive by design.** Muted color, small scale, single-line layout keep footer in the background. No green accent competes. border-top separates without shouting.

**Compact not cramped.** Three content segments in one line with en-space spacing reads cleanly.

**Semantic HTML.** footer element, descriptive link text, rel on external link.

### Issues

**[P3] Hardcoded year.** 2025 wont roll forward. Should update to 2026 or be dynamic.

**[P3] En-space separators invisible to screen readers.** en-space has no semantic meaning for AT. Use visible separator like middle dot with aria-hidden.

**[P4] llms.txt link missing rel attribute.** Add rel="nofollow" for crawler guidance.

**[P4] border-top nearly invisible on some displays.** 1px solid var(--jet) on dark bg is very subtle.

### Minor Observations

- No micro-interaction on links (intentional, recessive)
- On <360px screens line wraps to 2-3 lines; line-height:2 handles it
- External link behavior inconsistent (one target="_blank", llms are not)

### Verdict

Clean, well-executed, successfully recessive footer. Two P3 issues worth fixing.
