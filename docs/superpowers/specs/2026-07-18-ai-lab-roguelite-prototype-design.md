# AI Lab CEO Roguelite — Prototype Design

**Date:** 2026-07-18
**Status:** Approved design, pre-implementation
**Working title:** *Your-AI* (also the player company's name)

## Purpose

A ~10-minute browser prototype testing three hypotheses as thin slices:

1. **The squeeze is fun** — CEO decisions where every option costs something, under race pressure.
2. **The message lands** — the player feels the Moloch dynamic: acting ethically loses ground; winning tempts defection. The ending reveal should gut-punch.
3. **The replay pull works** — death → one-click restart → different corporate setup / seed creates "one more run."

Target audience (from brainstorm): gen pop (understanding), AI optimists (persuasion), EA/rat (emotional).

## Player & framing

The player is always **Mario, CEO of Your-AI** (Dario analogue). Cast from brainstorm: Pam (OpenAI analogue), Lonnie (X-AI analogue), Helen (head of safety), Ronald Pumps (government AI office), Frances (CSO). Tone: darkly satirical but grounded.

> **Design revision (2026-07-18, post-implementation):** timeline is now **Q1 2026 → Q4 2029,
> 16 quarterly turns**, with the world following ai-2040.com's default (Plan D) trajectory —
> see `docs/world/ai-2040-worldbible.md`. Yearly report-card interstitials show world state
> after 2026/2027/2028 (no turn cost). Turn 16 is a forced **"Choose a Path"** endgame card:
> the five AI-2040 plans as options gated by visible performance, with outcomes branching on
> hidden stats. The original judged-epilogue matrix remains as death/fallback handling.
> Paragraphs below describe the original 10-turn prototype design.

## Run structure

- Timeline: **2026–2027, 10 turns** (5 choices per year).
- **Corporate setup screen** (~30 sec) replaces character creation. Player picks 1 of 3 structures, which sets starting resources and hidden true stats:
  - **Capped-Profit Mission Lab** — high Trust & true Alignment, low Money.
  - **Venture Rocketship** — high Money & Compute, low true Alignment.
  - **Big-Tech Partnership** — high Money & Data, low Political Capital.
  (Exact numbers tuned during playtesting.)
- Run seed: chosen at start (random by default), displayed on screen, shareable. Seed drives scenario shuffle and risk rolls.

### Turn loop

1. **Tick** — flat Money burn applies (Money is a clock). A competitor-news headline appears in the ticker (noisy signal of hidden rival capability).
2. **Trip-wire check** — threshold-triggered crisis cards interrupt the deck (see Trip wires).
3. **Scenario card** — drawn from the current era's pool, order shuffled by seed. 2–4 options; options may be resource-gated. Gated options are **visible but locked**, showing the unmet requirement.
4. **Consequence** — outcome paragraph + animated resource deltas. Hidden true-stat changes are not shown.
5. **Competitor tick** — each rival's hidden capability increases every turn regardless of player actions.

## Resources & stats

**Six visible resources** (concrete numeric values, bottom of screen):
Money, Compute, Public Trust, Political Capital, Human Capital, Data.

**Perceived Alignment** and **Perceived Capability** — score-style bars across the **top** of the screen. These are what the world believes; they move only via scenario effects.

**Hidden stats** (revealed at epilogue only):

- **True Alignment** — drifts down when corners are cut even while perception is maintained.
- **True Capability** — actual model strength.
- **Competitor Capability** (one per rival, e.g. Pam's lab and Lonnie's lab) — climbs every turn plus event bumps. Competitors are mechanically **never aligned**.

The gap between perceived and true alignment is the core message mechanic.

## Scenario data model

All content in `scenarios.js`; teammates author scenarios by copying a template object.

```js
{
  id: "cyberattack",
  era: 2,                    // timeline chunk (1–4; ~half-year each, 2–3 turns) where this can appear
  title: "You've been cyber-attacked",
  text: "Setup paragraph…",
  options: [
    {
      label: "Cover it up",                    // one-sentence summary
      requires: { politicalCapital: 3 },       // optional gate; locked-but-visible if unmet
      results: [
        // engine walks top-down; first entry whose `if` passes AND whose
        // `chance` roll hits, fires. Last entry = unconditional default.
        { if: { trust: { below: 3 } }, chance: 0.4,
          text: "The cover-up leaks…", effects: { trust: -5 },
          gameOver: "coverup-collapse" },
        { chance: 0.4, text: "It leaks but you survive…", effects: { trust: -3 } },
        { text: "You get away with it.", effects: { trueAlignment: -1 } }
      ]
    }
  ]
}
```

- `results[]` supports: `if` (conditions on any visible or hidden stat), `chance` (0–1, seeded roll), `effects` (deltas on any stat incl. hidden), `text`, optional `gameOver` (ending id). This covers both **random loss states** and **losses triggered by current capability/alignment levels** — the same choice can be safe for a careful lab and fatal for a corner-cutting one, invisibly.
- **Event cards (option-less scenarios):** a scenario may omit `options` and carry its own `results[]`, walked the same way when the player hits Continue. Used for narrative beats and events that just *happen* — including instant game-overs judged against current hidden stats (e.g. a deployment incident that is catastrophic only if true alignment has decayed). Scenarios with a single option are also legal (forced choices).
- **Trip wires** use the same scenario format plus a `trigger` condition field (e.g. `{ trust: { below: 1 } }`); they interrupt instead of being drawn. Initial set from brainstorm: Trust ≤ 0 → Riots; Perceived Capability high → military-use pressure; Political Capital and Perceived Alignment both low → imposed compute caps.
- Prototype content target: **~10 deck scenarios + 3–4 trip wires**, seeded from the brainstorm list (espionage, podcast, PR framing, hiring, PAC funding, funding round, nationalization debate, cyberattack, board coup, competitor release).

## Endings

`endings.js` holds a judgment matrix plus death endings.

- **Death endings** (instant, mid-run): bankrupt (Money ≤ 0), riots (Trust ≤ 0 unresolved), board coup, nationalization, and scenario-specific `gameOver` states. Fast, darkly funny, one-click restart (same seed or new).
- **Judged epilogue** (survive 10 turns), keyed on three questions:
  1. Did your True Capability beat the best competitor's?
  2. Is your True Alignment above the safety bar?
  3. Was your perception gap (perceived − true alignment) small or large?
  ~5 endings, including the flagship: *you win the race, the crowd cheers, and the reveal shows your alignment numbers were a story you told yourself.* Losing the race to a rival is also doom (they're never aligned), with the epilogue noting how your choices sped them up or slowed them down.

## UI

Single screen, dark terminal-meets-boardroom aesthetic.

- **Top:** Perceived Alignment & Perceived Capability as score-readout bars (styled slightly "official" — these are PR numbers).
- **Ticker strip:** competitor headlines.
- **Center:** scenario card; option buttons; locked options greyed with requirement shown; consequence overlay with animated deltas.
- **Bottom:** six resources as concrete numeric values.
- **Corner:** run seed + date label derived from turn number (e.g. "Mid 2026", "Late 2027").
- Full-screen death/epilogue screens with restart.

## Architecture

Approach: **single-file-ish vanilla web app, no build step.**

- `index.html` — engine + UI, inline CSS/JS. Engine logic (effect application, result resolution, trip-wire checks, seeded RNG) as pure functions at the top of the script for testability and playtest tweaking.
- `scenarios.js` — all scenario/trip-wire content (teammate-editable).
- `endings.js` — ending matrix + death endings.

Double-click `index.html` to play; plain `<script src>` includes so `file://` works. No server, no dependencies.

## Testing

- Engine pure functions (result resolution order, gating, trip-wire triggers, seeded RNG determinism) testable via a small dev-only harness page or console asserts.
- Balance/fun validated by playtesting, not automated tests: a full run should take ≤ 10 minutes; each corporate setup should have at least one survivable line through the deck.

## Out of scope (prototype)

- Meta-progression / card unlocks across runs.
- Secret projects ("civ wonders"), budget-allocation turns, funding-priority picks.
- More than 2 rival labs; named-character relationship systems beyond flavor.
- Sound, art beyond CSS, mobile layout.
