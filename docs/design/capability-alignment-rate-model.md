# Capability & Alignment — the Rate Model (locked 2026-07-18)

Replaces the old "cards nudge capability/alignment levels directly" model. Locked with
Chris; both design forks chosen (alignment can decay; both perceived & true ride rates).

## Two layers

**Layer 1 — Resources** (money, compute, trust, political, human): discrete currencies,
moved *directly* by card `effects`. Roles: gate choices (`requires`) and fire trigger
events when depleted. UNCHANGED by this doc.

**Layer 2 — Trajectories** (capability & alignment, yours + rivals'): NOT poked per card.
Each advances every turn by a **rate**. Cards and the annual funding card mostly change
the *rate of progress*, not the bar. Bars still accumulate; the endgame/judge logic reads
the accumulated levels exactly as before.

## The rate stats (new engine state)

Per player: `pCapRate`, `tCapRate`, `pAlignRate`, `tAlignRate` (perceived/true × capability/alignment).
Per run: `rivalRate` — the per-turn growth applied to every rival's capability.

Each turn, in `beginTurn` (after the money burn, before the card):
```
perceivedCapability += pCapRate
trueCapability      += tCapRate
perceivedAlignment  += pAlignRate
trueAlignment       += tAlignRate
for each rival: rival += rivalRate
```
Then clamp the *bars* to their ranges (capability 0–20, alignment 0–10, rivals 0–20+).

## Rules that fall out of this

- **Capability only goes up**: `pCapRate`, `tCapRate`, and `rivalRate` are **floored at 0**.
  A card can speed capability or slow it, never reverse it. "Slow the competition" cards
  reduce `rivalRate` (never the rival's level), so the red bar always climbs.
- **Alignment can decay**: `pAlignRate` and `tAlignRate` may go **negative**. Neglect /
  corner-cuts drive `tAlignRate` below zero — true alignment actively falls while the
  perceived bar keeps rising.
- **The gap is emergent drift**: a corner-cut card does e.g. `pAlignRate +1, tAlignRate -1`;
  the two alignment bars separate a little more each quarter. No card hand-cranks the gap.
- Rates themselves are bounded (suggest −3..+3 for player rates, 0..+3 for rivalRate) so a
  couple of cards can't run away.

## How cards express effects

New effect keys usable in `effects` / funding: `pCapRate`, `tCapRate`, `pAlignRate`,
`tAlignRate`, `rivalRate` (all are *deltas to the rate*). Example corner-cut:
```
effects: { money: 2, trust: 1, pCapRate: 1, tAlignRate: -1 }   // ship fast, look good, rot quietly
```
Direct level bumps (`trueCapability: +2`) remain LEGAL for rare one-off breakthroughs, but
the guide should steer authors to rate deltas for anything ongoing ("most of this stuff is
about rate of progress, not pushing the bar up" — Chris).

## Annual funding card (the rate dial)

Guaranteed card at the start of each year (turns 1/5/9/13). Three options set the year's
capability-vs-alignment rate baseline:
- **Prioritize Capabilities**: `tCapRate +`, `pCapRate +`, `tAlignRate −` (you sprint, safety slips)
- **Prioritize Alignment**: `tAlignRate +`, `pAlignRate +`, `tCapRate −toward-baseline` (you slow, you're honest)
- **Balanced**: modest bump to both, no penalty
Funding SETS rates (it's the dominant rate lever); scenario cards nudge around that baseline.

## HUD (three bars, top of screen)

Plain-labeled (never "perceived"): **Alignment**, **Capability**, and **Competitor
Capability** (red). The first two are the player's *perceived* bars; the red one is the
leading rival (`rivalMax`) shown honestly (rivals have no perception layer). Optional polish:
a small trend glyph per bar (↑↑ fast / ↑ slow / → flat / ↓ decaying) so the *rate* is
visible, not just the level — this is what makes the funding choice legible turn to turn.

## Starting rates

Set per corporate setup (Mission Lab honest+slow, Venture fast+drifting, Big-Tech middling)
and tuned in the rebalance pass. Rough baselines: `rivalRate ≈ 1.5`, player `tCapRate ≈ 1`,
`tAlignRate ≈ 0` (flat until you invest), perceived rates ≈ true rates at start.

## Unchanged

Endgame "Choose a Path" gates + hidden-stat branches, tripwires, resource trigger events,
the reveal panel — all read accumulated levels and keep working. Only the *source* of the
level changes (rate accumulation instead of direct card bumps).

## Implementation scope (one careful pass, after batch-1 fixes land)

1. engine.js: rate state in createRun (per setup), advance loop in beginTurn, floors/bounds,
   new effect keys in applyEffects.
2. scenarios.js: sweep all 23 cards — convert capability/alignment level effects to rate
   deltas; keep resource effects as-is; remove any remaining negative-capability (they
   become rate reductions instead).
3. Add the 4 annual funding cards (guaranteed at turns 1/5/9/13).
4. index.html: third red competitor bar + optional trend glyphs.
5. SCENARIO_GUIDE.md: document rate effect keys + the "prefer rate deltas" rule.
6. tests.js: rate-advance tests, floor/decay tests, funding-card presence, content
   validation for new keys; full sim rebalance to targets.
