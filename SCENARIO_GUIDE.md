# How to Write a Card

Copy the template block from `scenarios.js`, fill it in, append it to `SCENARIOS`. That's it.

## The stats you can touch (`effects`)

Two layers. **Resources** are discrete currencies a card moves directly. **Capability &
alignment** (yours + rivals') are TRAJECTORIES — a card mostly changes their *rate of
progress*, not the bar itself. See `docs/design/capability-alignment-rate-model.md` for the
full model.

### Resources (direct effects, unchanged)

| Key | Range | What it is |
|---|---|---|
| `money` | 0–10 | Runway. Burns 1/turn automatically. **0 = bankrupt, run over.** |
| `compute` | 0–10 | GPUs. Gates aggressive options. |
| `trust` | 0–10 | Public trust. **0 triggers riots.** |
| `political` | 0–10 | Political capital. |
| `human` | 0–10 | Talent / staff loyalty. |
| `data` | 0–10 | Training data edge. |

### Capability & alignment — RATES (prefer these for ongoing effects)

| Key | Bounds | What it does |
|---|---|---|
| `pCapRate` | 0..3 | Rate perceived capability climbs each turn. Floored at 0 — **capability only ever climbs.** |
| `tCapRate` | 0..3 | Rate true (hidden) capability climbs each turn. Floored at 0, same rule. |
| `pAlignRate` | -3..3 | Rate perceived alignment moves each turn. **Can go negative** — perceived alignment can decay too. |
| `tAlignRate` | -3..3 | Rate true (hidden) alignment moves each turn. **Can go negative** — neglect/corner-cuts rot it quietly. |
| `rivalRate` | 0..3 | Per-turn growth applied to EVERY rival's capability. Floored at 0 — "slow the competition" cards reduce this, they never cut a rival's level. |

Every turn, in order: `perceivedCapability += pCapRate`, `trueCapability += tCapRate`,
`perceivedAlignment += pAlignRate`, `trueAlignment += tAlignRate`, and every rival `+= rivalRate`
— then the bars clamp (capability 0–20, alignment 0–10, rivals 0–20). A card's `effects` key
sets a DELTA to the rate (e.g. `tAlignRate: -1` slows true alignment's rate by 1, or pushes it
negative), not the bar. The floors/bounds above are re-applied automatically after every delta.

The corner-cut pattern is now: perceived rate up, true rate down. `{ pCapRate: 1, tAlignRate: -1 }`
— you look faster and safer for a while; the two curves drift apart on their own, no card has to
hand-crank the gap turn by turn. Use it often — it's the game's thesis.

### Level bumps — still legal, for rare one-offs only

`perceivedAlignment`, `trueAlignment`, `perceivedCapability`, `trueCapability` (and the direct
`rivals` key, which nudges every rival's level) remain legal in `effects` as ONE-OFF LEVEL
BUMPS — a sudden breakthrough (stolen weights, a secret training run that pays off), not an
ongoing trend. Prefer a rate delta for anything that should feel like a continuing behavior.
**Never write a negative direct-level `trueCapability`/`perceivedCapability` bump** — if a card
wants to say "the model gets dumber" or "you gave away your edge," that's a `tCapRate`/`pCapRate`
reduction (growth slows or stalls), never a level cut; capability does not reverse, even for a
dramatic beat. Note also: on a `gameOver` result, a RATE delta never has a chance to apply (the
run ends before the next `beginTurn`), so if the beat needs to be visible in the ending reveal,
use a direct level bump there instead.

`rivals` (direct level effect on both rivals) is still legal too, same one-off-only guidance —
most "slow/speed the competition" cards should use `rivalRate` instead.

## Rules of thumb

1. **Every option costs something.** If a choice is free, it's not a choice. Resource magnitudes: ±1 small, ±2 real, ±3 huge. Rate magnitudes: ±0.5 small, ±1 real, ±1.5+ huge (rare).
2. **The corner-cut pattern is the game:** perceived rate up, true rate down. Use it often.
3. **Last result must be unconditional** — no `if`, no `chance`. The engine falls through to it.
4. **`if` conditions** can reference ANY stat (including hidden ones — great for "this blows up only if you've been cutting corners"). Syntax: `{ trueAlignment: { below: 3 } }` or `{ compute: { atLeast: 6 } }`. Also available: `rivalMax` (highest rival capability), `perceptionGap` (perceivedAlignment − trueAlignment), `capabilityLead` (trueCapability − rivalMax).
5. **`chance`** is 0–1 and rolls only after `if` passes. Order results most-specific first.
6. **`requires` gates** show up as locked-but-visible buttons — visible stats only (`money`, `compute`, `trust`, `political`, `human`, `data`). Never gate on hidden stats.
7. **`gameOver: 'ending-id'`** ends the run instantly. Add your ending to `endings.js` (`'ending-id': { title, text }`).
8. **Tone:** darkly satirical, grounded, second person, present tense. Cast: Mario (you), Pam (OpenAI-alike), Lonnie (X-AI-alike), Helen (safety), Ronald Pumps (gov), Frances (CSO).
9. **Years:** `year: 2026|2027|2028|2029` places a card in that year (4 quarterly turns each — minus Q1, which is the reserved funding turn, so 3 deck turns for 2026/2027/2028 and 2 for 2029). Stakes should escalate by year. OMIT `year` entirely to make the card a wildcard — usable in any year, drawn to fill whichever year runs short of dedicated cards. A card can never appear twice in the same run (drawn cards are removed from the deck).
10. **Event cards:** omit `options` and give the scenario its own `results` — the player just presses Continue. Perfect for consequences of hidden-stat decay (see `deployment-incident`). A scenario with exactly one option is a forced choice; also fine.

## Annual funding cards — the rate dial

`FUNDING` (in `scenarios.js`) has one guaranteed card per year, served by `beginTurn` at Q1
of each year (**turns 1, 5, 9, 13 are reserved** — never expect a regular deck card to land
there, and never add a `year`-tagged scenario meant for those turns). Funding is drawn
INSTEAD of the deck, deck untouched, and wins over a hot tripwire the same way the endgame
wins at turn 16. Each funding card has the same three-option shape: Prioritize Capabilities
(rates up, `tAlignRate` takes the hit), Prioritize Alignment (alignment rates up, `tCapRate`
throttles back toward its floor), Balanced (a modest, penalty-free bump to both). This is the
dominant rate lever for the year — scenario cards nudge around whatever baseline funding set.

## Flags — cross-turn memory

A card's choice can leave a mark that a much later card reads. Two pieces:

- **`setFlags`** — put it on an `option` (fires no matter which result resolves) or on a
  specific `result` (fires only when that result is the one that resolves). Shape:
  `{ flagName: 'value' }`. Later `setFlags` for the same key overwrite earlier ones — flags
  hold the most recent stance, not a history.
- **`ifFlags`** — put it on a `result` to gate that result on a flag set earlier in the run.
  Shape: `{ flagName: 'value' }` (scalar, exact match) or `{ flagName: ['value1', 'value2'] }`
  (array, matches if the flag is ANY of those values). A flag that was never set never
  matches. `ifFlags` stacks with `if`/`chance` on the same result — all must pass.

Ordering rule is the same one you already use for `if`: **the last result in a card/option
must stay unconditional** (no `if`, no `chance`, no `ifFlags`) — it's the fallback when
nothing more specific matches. Put `ifFlags`-gated results earlier in the array, most-specific
first, plain fallback last.

Example — the youth-safety chain. `suicide-lawsuit` (wildcard, any year) sets the stance:

```js
{ label: "Build real children's guardrails", setFlags: { youthPolicy: 'guardrails' }, results: [...] }
{ label: 'Dismiss it as a nuisance suit', setFlags: { youthPolicy: 'dismissed' }, results: [...] }
```

`un-treaty-vote` (2028) and `neurosecurity-lawsuit` (2029) read it back, turns and sometimes
years later:

```js
{ label: 'Lobby against it quietly, stay publicly neutral', results: [
  { ifFlags: { youthPolicy: 'dismissed' }, text: "...the leaked memo lands next to your old nuisance-suit line...", effects: { trust: -4 } },
  { ifFlags: { youthPolicy: ['guardrails', 'settled'] }, text: "...lands softer next to a record that shows you built something...", effects: { trust: -1 } },
  { text: "...a staffer's memo surfaces eight months later...", effects: { trust: -2 } }, // fallback: flag never set
] }
```

Use flags sparingly — they're for a choice that should genuinely echo later (a stance,
a settlement, a cover-up), not a replacement for `if` on visible/hidden stats.

## Endgame & report cards

Turn 16 (Q4 2029) is reserved — `beginTurn` hands back `ENDGAME` from `scenarios.js` instead
of drawing from the deck, so never expect a regular `year: 2029` scenario to land there;
write for turns 14–15 instead (13 is the 2029 funding turn). `ENDGAME`'s options branch on
hidden stats via the engine's derived `perceptionGap` and `capabilityLead` keys (see
`engine.js` `getStat()`) — don't add new scenarios there, extend `ENDGAME` itself if the plan
branches need to change. The yearly report cards (after turns 4/8/12) are pure data in
`reports.js`, not deck content — they don't consume a turn and have no `SCENARIO_GUIDE` shape
of their own.
