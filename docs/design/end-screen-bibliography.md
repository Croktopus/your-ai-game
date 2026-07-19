# End-screen bibliography + "get involved" resources (queued)

Add a resources/bibliography section to the ENDING screen (after the true-vs-perceived
reveal, near the restart buttons). Build AFTER the finish pass (portraits/HUD/rebalance)
lands — both edit index.html's ending screen.

## Is the bibliography data from the merged branch?
Yes. The evidence-consolidation pass ported the branch's `SOURCES` registry into
`scenarios.js` (53 sources, 51 cited across the 32 cards) plus
`docs/research/scenario-evidence-dossier.md`. The per-card bibliography is generated from
SOURCES (filter to the cited ids), no new research needed.

## Two sections

### 1. "Where to actually start" — curated intro/get-involved links (prominent)
Hardcode as a small `RESOURCES` list (new const, e.g. in a resources.js or inline). Chris-provided:
- AI 2040 — the scenario this game's world is based on — https://ai-2040.com/
- 80,000 Hours — technical AI safety upskilling — https://80000hours.org/2025/06/technical-ai-safety-upskilling-resources/
- AI Safety Resources — https://ai-safety-resources.com/
- aisafety.info — Intro to AI safety — https://aisafety.info/questions/NM3Q/Intro-to-AI-safety

### 2. "Sources & evidence" — the per-card bibliography
Generated from `SOURCES` (the cited subset). Framing line: "Every dilemma here is grounded
in real events, policy, and research." List title + link per source; group or scroll.

## Implementation notes
- Ending screen: add a "The research behind this" panel or a toggle/button that reveals both
  sections; keep restart buttons accessible. Scrollable (many sources) inside its own
  overflow container; theme-consistent; works from file:// (plain <a href> links).
- Curated links open in a new tab (target=_blank rel=noopener).
- Keep it from crowding the reveal — collapsible or below-the-fold is fine.
