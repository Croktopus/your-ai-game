# Your-AI Roguelite Prototype Implementation Plan

> **Historical implementation artifact — superseded.** This file records the original 2026–2027 build plan and intentionally preserves its old task text. Do not use its turn counts, era mapping, card schema, or balance values. The implemented 2026–2029 design is in [`../../design/prototype-design.md`](../../design/prototype-design.md), and current authoring rules are in [`../../../SCENARIO_GUIDE.md`](../../../SCENARIO_GUIDE.md).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A no-build-step browser roguelite where you play Mario, CEO of Your-AI, making 10 squeezed decisions across 2026–2027 while hidden alignment decays and rival labs race ahead.

**Architecture:** Pure-logic engine (`engine.js`, no DOM, node-testable) + data files (`scenarios.js`, `endings.js`, teammate-editable) + a vanilla-JS UI shell (`index.html`). All loaded via plain `<script>` tags so double-clicking `index.html` from `file://` works.

**Tech Stack:** Vanilla HTML/CSS/JS. No dependencies, no build. Tests run via `node tests.js` (or opening `tests.html` in a browser if node is unavailable).

**Spec:** `docs/superpowers/specs/2026-07-18-ai-lab-roguelite-prototype-design.md`

## Global Constraints

- No build step, no dependencies. Everything must work opened from `file://`.
- Stat keys (exact names, used everywhere): `money`, `compute`, `trust`, `political`, `human`, `data` (visible, clamp 0–10); `perceivedAlignment`, `trueAlignment` (clamp 0–10); `perceivedCapability`, `trueCapability` (clamp 0–20).
- Rival labs: `pam` and `lonnie`, hidden capability numbers, never aligned.
- Run = 10 turns. Era = `Math.ceil(turn * 4 / 10)` (1–4).
- All randomness flows through the run's seeded RNG (`state.rng`) — same seed + same choices = same run.
- Every data file ends with `if (typeof module !== 'undefined') module.exports = {...}` so node tests can load it; browser use is via globals.
- `results[]` contract: engine walks top-down; a result fires if its `if` passes AND its `chance` roll hits; the **last entry must be an unconditional default** (no `if`, no `chance`).
- Option gates (`requires`) may only reference **visible** stats (gates are shown to the player; hidden stats must never leak).
- Tone: darkly satirical but grounded. Cast names: Mario (player), Pam (OpenAI-alike), Lonnie (X-AI-alike), Helen (safety lead), Ronald Pumps (gov AI office), Frances (CSO).

## File Structure

- `SCENARIO_GUIDE.md` — teammate authoring guide (Task 1)
- `scenarios.js` — `SETUPS`, `SCENARIOS`, `TRIPWIRES`, `HEADLINES` (Tasks 1, 7)
- `endings.js` — `ENDINGS` map (Task 6)
- `engine.js` — pure logic: RNG, state, conditions, effects, resolution, turn flow, judgment (Tasks 2–5)
- `tests.js` + `tests.html` — assert harness (Tasks 2–5, 9)
- `index.html` — UI shell (Task 8)
- `README.md` — how to play/author (Task 1)

---

### Task 1: Authoring kit — scenario template, guide, setups, two example cards

Teammates start writing cards the moment this task lands. No engine required.

**Files:**
- Create: `scenarios.js`
- Create: `SCENARIO_GUIDE.md`
- Create: `README.md`

**Interfaces:**
- Produces: globals `SETUPS` (array of `{id, name, blurb, stats}`), `SCENARIOS` (array of scenario objects), `TRIPWIRES` (array, empty until Task 7), `HEADLINES` (array, empty until Task 7). Node export of the same four names.
- Scenario object shape (relied on by Tasks 4, 5, 8): `{id, era, title, text, options: [{label, requires?, results: [{if?, chance?, text, effects?, gameOver?}]}]}`.

- [ ] **Step 1: Write `scenarios.js`**

```js
// scenarios.js — ALL game content lives here. See SCENARIO_GUIDE.md for how to write a card.
// Stat keys: money compute trust political human data (visible, 0-10)
//            perceivedAlignment trueAlignment (0-10) perceivedCapability trueCapability (0-20)
// Rivals: effects key `rivals: -1` slows BOTH rival labs by 1 (or speeds them up if positive).

const SETUPS = [
  { id: 'mission', name: 'Capped-Profit Mission Lab',
    blurb: 'Beloved, broke, and actually trying. The board answers to the mission — for now.',
    stats: { money: 4, compute: 4, trust: 8, political: 6, human: 7, data: 4,
             perceivedAlignment: 8, trueAlignment: 8, perceivedCapability: 4, trueCapability: 4 } },
  { id: 'venture', name: 'Venture Rocketship',
    blurb: 'Term sheets rain from the sky. The safety team reports to the growth team.',
    stats: { money: 9, compute: 8, trust: 5, political: 4, human: 6, data: 5,
             perceivedAlignment: 5, trueAlignment: 3, perceivedCapability: 6, trueCapability: 6 } },
  { id: 'bigtech', name: 'Big-Tech Partnership',
    blurb: 'Infinite data, deep pockets, and a parent company with opinions about everything.',
    stats: { money: 8, compute: 7, trust: 5, political: 2, human: 5, data: 8,
             perceivedAlignment: 5, trueAlignment: 5, perceivedCapability: 5, trueCapability: 5 } },
];

// ---- SCENARIO TEMPLATE — copy this object, fill it in, add it to SCENARIOS ----
// {
//   id: 'unique-kebab-id',
//   era: 1,                          // 1=early 2026, 2=late 2026, 3=early 2027, 4=late 2027
//   title: 'Short punchy title',
//   text: 'One or two sentences setting up the dilemma. Second person, present tense.',
//   options: [
//     { label: 'One-sentence summary of the choice',
//       requires: { political: 4 },  // OPTIONAL. Visible stats only. Shown to player when locked.
//       results: [
//         // Engine walks top-down. A result fires if its `if` passes AND its `chance` roll hits.
//         { if: { trust: { below: 3 } }, chance: 0.4,
//           text: 'What happens (a short paragraph).',
//           effects: { trust: -5 }, gameOver: 'some-ending-id' },   // gameOver is OPTIONAL
//         { text: 'The default outcome. LAST RESULT MUST HAVE NO if AND NO chance.',
//           effects: { trueAlignment: -1 } },
//       ] },
//   ],
// }
// -------------------------------------------------------------------------------
// EVENT CARD (no options): omit `options` and give the SCENARIO its own `results`.
// The player just presses Continue; results are walked the same way. Use for
// narrative beats and "your past choices catch up with you" moments — including
// instant gameovers that only fire if hidden stats have decayed.
// { id: 'x', era: 3, title: '...', text: '...', results: [ ...same as above... ] }
// Single-option scenarios are also legal (forced choices).
// -------------------------------------------------------------------------------

const SCENARIOS = [
  { id: 'podcast', era: 1, title: 'The Podcast Circuit',
    text: 'Every mic in America wants Mario. Frances says pick one; the others will notice being snubbed.',
    options: [
      { label: 'Four hours of scaling-law talk with Dwarkesh',
        results: [
          { text: 'The clip of you saying "country of geniuses in a datacenter" does numbers. Investors love it. Helen winces.',
            effects: { perceivedCapability: 2, money: 1, trust: 1 } } ] },
      { label: 'Go on Rogan and gamble on vibes',
        results: [
          { chance: 0.5,
            text: 'Three hours in, you speculate about digitizing dead relatives. The clip haunts you for months.',
            effects: { trust: -2, political: -1 } },
          { text: 'You are charming and normal for three straight hours. Middle America decides you seem fine.',
            effects: { trust: 3 } } ] },
      { label: 'A sober hour with Ezra Klein about governance',
        results: [
          { text: 'Thoughtful, careful, precise. Policy people quote you. Your engagement metrics are a rounding error.',
            effects: { perceivedAlignment: 1, political: 2 } } ] },
    ] },
  { id: 'cyberattack', era: 3, title: 'Breach',
    text: 'Someone exfiltrated training checkpoints overnight. Frances has the logs. Nobody else knows yet.',
    options: [
      { label: 'Disclose everything publicly',
        results: [
          { text: 'The honesty plays well in Washington, less well with customers who now know your weights walked out the door.',
            effects: { trust: 1, political: 2, perceivedCapability: -1 } } ] },
      { label: 'Cover it up',
        results: [
          { if: { trust: { below: 3 } }, chance: 0.4,
            text: 'It leaks. For a public already primed to distrust you, this is the end of the story.',
            effects: { trust: -5 }, gameOver: 'coverup-collapse' },
          { chance: 0.4,
            text: 'It leaks anyway. The word "coverup" trends for a week.',
            effects: { trust: -3, political: -1 } },
          { text: 'It holds. Frances shreds the logs. You tell yourself it was for the mission.',
            effects: { trueAlignment: -1 } } ] },
      { label: 'Retaliate through back channels', requires: { compute: 6 },
        results: [
          { chance: 0.4,
            text: 'Your counter-op gets attributed within a week. Congress uses the word "vigilante".',
            effects: { political: -2, trust: -2 } },
          { text: 'Your team walks their infrastructure right back. You now know exactly what Pam has. So does no one else.',
            effects: { data: 2, rivals: -1 } } ] },
    ] },
];

const TRIPWIRES = [];   // filled in Task 7
const HEADLINES = [];   // filled in Task 7

if (typeof module !== 'undefined') module.exports = { SETUPS, SCENARIOS, TRIPWIRES, HEADLINES };
```

- [ ] **Step 2: Write `SCENARIO_GUIDE.md`**

```markdown
# How to Write a Card

Copy the template block from `scenarios.js`, fill it in, append it to `SCENARIOS`. That's it.

## The stats you can touch (`effects`)

| Key | Range | What it is |
|---|---|---|
| `money` | 0–10 | Runway. Burns 1/turn automatically. **0 = bankrupt, run over.** |
| `compute` | 0–10 | GPUs. Gates aggressive options. |
| `trust` | 0–10 | Public trust. **0 triggers riots.** |
| `political` | 0–10 | Political capital. |
| `human` | 0–10 | Talent / staff loyalty. |
| `data` | 0–10 | Training data edge. |
| `perceivedAlignment` | 0–10 | What the world believes. Shown to player. |
| `trueAlignment` | 0–10 | The truth. HIDDEN until the ending. |
| `perceivedCapability` | 0–20 | What the world believes. Shown to player. |
| `trueCapability` | 0–20 | The truth. HIDDEN. Must beat rivals to win the race. |
| `rivals` | — | Delta applied to BOTH rival labs' hidden capability. |

## Rules of thumb

1. **Every option costs something.** If a choice is free, it's not a choice. Magnitudes: ±1 small, ±2 real, ±3 huge.
2. **The corner-cut pattern is the game:** perceived goes up, true goes down. Use it often.
3. **Last result must be unconditional** — no `if`, no `chance`. The engine falls through to it.
4. **`if` conditions** can reference ANY stat (including hidden ones — great for "this blows up only if you've been cutting corners"). Syntax: `{ trueAlignment: { below: 3 } }` or `{ compute: { atLeast: 6 } }`. Also available: `rivalMax` (highest rival capability).
5. **`chance`** is 0–1 and rolls only after `if` passes. Order results most-specific first.
6. **`requires` gates** show up as locked-but-visible buttons — visible stats only (`money`, `compute`, `trust`, `political`, `human`, `data`). Never gate on hidden stats.
7. **`gameOver: 'ending-id'`** ends the run instantly. Add your ending to `endings.js` (`'ending-id': { title, text }`).
8. **Tone:** darkly satirical, grounded, second person, present tense. Cast: Mario (you), Pam (OpenAI-alike), Lonnie (X-AI-alike), Helen (safety), Ronald Pumps (gov), Frances (CSO).
9. **Eras:** 1 = early 2026, 2 = late 2026, 3 = early 2027, 4 = late 2027. Stakes should escalate with era.
10. **Event cards:** omit `options` and give the scenario its own `results` — the player just presses Continue. Perfect for consequences of hidden-stat decay (see `deployment-incident`). A scenario with exactly one option is a forced choice; also fine.
```

- [ ] **Step 3: Write `README.md`**

```markdown
# Your-AI

A 10-minute roguelite about running a frontier AI lab without ending the world. You are Mario, CEO of Your-AI. Every choice costs something. The race does not wait.

**Play:** double-click `index.html`. No install, no build.

**Write a card:** see `SCENARIO_GUIDE.md` — copy the template in `scenarios.js`, fill it in, reload the page.

**Run tests:** `node tests.js` (or open `tests.html` and check the console).
```

- [ ] **Step 4: Sanity-check the data file parses**

Run: `node -e "const c=require('./scenarios.js'); console.log(c.SETUPS.length, c.SCENARIOS.length)"`
Expected: `3 2`

- [ ] **Step 5: Commit**

```bash
git add scenarios.js SCENARIO_GUIDE.md README.md
git commit -m "feat: scenario authoring kit — template, guide, setups, two example cards"
```

---

### Task 2: Engine core — seeded RNG, run state, era, deck queue

**Files:**
- Create: `engine.js`
- Create: `tests.js`
- Create: `tests.html`

**Interfaces:**
- Consumes: `SETUPS` shape from Task 1 (`setup.stats` object), scenario `{era}` field.
- Produces: global/module `Engine` with `mulberry32(seedInt) -> () => float`, `eraForTurn(turn) -> 1..4`, `shuffle(arr, rng) -> newArr`, `buildQueue(scenarios, rng) -> arr` (era-ascending, seeded shuffle within era), `createRun(setup, seedInt, content) -> state`. State shape (relied on by every later task): `{ seed, rng, turn: 0, stats: {…copied from setup.stats}, rivals: { pam: 5, lonnie: 4 }, queue, firedTripwires: [], ending: null, headline: null }`. Also `Engine.TURNS === 10`.

- [ ] **Step 1: Write the failing tests**

Create `tests.js`:

```js
// tests.js — runs under node (`node tests.js`) or in tests.html (check console).
const E = (typeof Engine !== 'undefined') ? Engine : require('./engine.js');
let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); pass++; console.log('ok -', name); }
  catch (e) { fail++; console.error('FAIL -', name, '::', e.message); }
}
function eq(got, want, msg) {
  if (JSON.stringify(got) !== JSON.stringify(want))
    throw new Error((msg || '') + ' got ' + JSON.stringify(got) + ' want ' + JSON.stringify(want));
}
function ok(v, msg) { if (!v) throw new Error(msg || 'expected truthy'); }

const SETUP = { id: 't', name: 'T', stats: {
  money: 5, compute: 5, trust: 5, political: 5, human: 5, data: 5,
  perceivedAlignment: 5, trueAlignment: 5, perceivedCapability: 5, trueCapability: 5 } };
const SCEN = (id, era) => ({ id, era, title: id, text: '', options: [
  { label: 'x', results: [{ text: 'x', effects: {} }] }] });

t('rng is deterministic for same seed', () => {
  const a = E.mulberry32(42), b = E.mulberry32(42);
  eq([a(), a(), a()], [b(), b(), b()]);
  ok(E.mulberry32(42)() !== E.mulberry32(43)(), 'different seeds differ');
});

t('eraForTurn maps 10 turns onto 4 eras', () => {
  eq([1,2,3,4,5,6,7,8,9,10].map(E.eraForTurn), [1,1,2,2,2,3,3,4,4,4]);
});

t('buildQueue orders by era, shuffles within era by seed', () => {
  const scen = [SCEN('a',2), SCEN('b',1), SCEN('c',1), SCEN('d',2)];
  const q1 = E.buildQueue(scen, E.mulberry32(7));
  const q2 = E.buildQueue(scen, E.mulberry32(7));
  eq(q1.map(s => s.id), q2.map(s => s.id), 'same seed same order');
  eq(q1.map(s => s.era), [1,1,2,2], 'era ascending');
});

t('createRun copies setup stats (no shared reference)', () => {
  const st = E.createRun(SETUP, 1, { scenarios: [] });
  st.stats.money = 0;
  eq(SETUP.stats.money, 5, 'setup untouched');
  eq(st.turn, 0); eq(st.rivals, { pam: 5, lonnie: 4 }); eq(st.ending, null);
});

console.log(pass + ' passed, ' + fail + ' failed');
if (typeof process !== 'undefined' && fail) process.exit(1);
```

Create `tests.html`:

```html
<!-- Open this and check the devtools console if node isn't installed. -->
<script src="engine.js"></script>
<script src="scenarios.js"></script>
<script src="endings.js"></script>
<script src="tests.js"></script>
<p>Open the console (F12) for test results.</p>
```

(`scenarios.js`/`endings.js` script tags will 404 harmlessly until those files exist; node path doesn't need them until Task 9.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `node tests.js`
Expected: crash with `Cannot find module './engine.js'`

- [ ] **Step 3: Write `engine.js`**

```js
// engine.js — pure game logic. No DOM. Deterministic given (setup, seed, choices).
const Engine = (() => {
  const TURNS = 10;
  const BURN = 1;                    // money lost per turn tick
  const CLAMPS = {
    money: [0, 10], compute: [0, 10], trust: [0, 10],
    political: [0, 10], human: [0, 10], data: [0, 10],
    perceivedAlignment: [0, 10], trueAlignment: [0, 10],
    perceivedCapability: [0, 20], trueCapability: [0, 20],
  };

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function eraForTurn(turn) { return Math.ceil(turn * 4 / TURNS); }

  function shuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildQueue(scenarios, rng) {
    const q = [];
    for (let era = 1; era <= 4; era++)
      q.push(...shuffle(scenarios.filter(s => s.era === era), rng));
    return q;
  }

  function createRun(setup, seed, content) {
    const rng = mulberry32(seed);
    return {
      seed, rng, turn: 0,
      stats: Object.assign({}, setup.stats),
      rivals: { pam: 5, lonnie: 4 },
      queue: buildQueue(content.scenarios, rng),
      firedTripwires: [], ending: null, headline: null,
    };
  }

  return { TURNS, mulberry32, eraForTurn, shuffle, buildQueue, createRun };
})();
if (typeof module !== 'undefined') module.exports = Engine;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node tests.js`
Expected: `4 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add engine.js tests.js tests.html
git commit -m "feat: engine core — seeded rng, run state, era mapping, deck queue"
```

---

### Task 3: Conditions, gates, effects

**Files:**
- Modify: `engine.js` (add functions inside the IIFE, add to the return object)
- Modify: `tests.js` (append tests)

**Interfaces:**
- Consumes: `state` shape from Task 2.
- Produces: `Engine.getStat(state, key) -> number` (stat keys plus virtual `rivalMax`), `Engine.checkCondition(cond, state) -> bool` (cond: `{ statKey: { below?: n, atLeast?: n } }`, undefined cond = true), `Engine.meetsRequires(req, state) -> bool` (req: `{ statKey: min }`, undefined = true), `Engine.applyEffects(state, effects)` (mutates; clamps per CLAMPS; key `rivals` adds delta to every rival, floor 0; undefined effects = no-op).

- [ ] **Step 1: Append failing tests to `tests.js`** (above the final `console.log` line)

```js
function mkState() {
  const s = E.createRun(SETUP, 1, { scenarios: [] });
  return s;
}

t('checkCondition below/atLeast/rivalMax, empty passes', () => {
  const s = mkState();
  ok(E.checkCondition(undefined, s), 'undefined cond passes');
  ok(E.checkCondition({ trust: { below: 6 } }, s));
  ok(!E.checkCondition({ trust: { below: 5 } }, s), '5 is not below 5');
  ok(E.checkCondition({ trust: { atLeast: 5 } }, s));
  ok(E.checkCondition({ rivalMax: { atLeast: 5 } }, s), 'pam starts at 5');
  ok(!E.checkCondition({ trust: { atLeast: 5, below: 5 } }, s), 'all clauses must hold');
});

t('meetsRequires is atLeast semantics', () => {
  const s = mkState();
  ok(E.meetsRequires(undefined, s));
  ok(E.meetsRequires({ political: 5 }, s));
  ok(!E.meetsRequires({ political: 6 }, s));
});

t('applyEffects clamps and handles rivals key', () => {
  const s = mkState();
  E.applyEffects(s, { money: -99, trueCapability: 99, rivals: -2 });
  eq(s.stats.money, 0); eq(s.stats.trueCapability, 20);
  eq(s.rivals, { pam: 3, lonnie: 2 });
  E.applyEffects(s, { rivals: -99 });
  eq(s.rivals, { pam: 0, lonnie: 0 }, 'rivals floor at 0');
  E.applyEffects(s, undefined); // no-op, must not throw
});
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `node tests.js`
Expected: `4 passed, 3 failed` (each new test fails with `E.checkCondition is not a function` etc.)

- [ ] **Step 3: Implement in `engine.js`** (inside the IIFE; add the four names to the return object)

```js
  function getStat(state, key) {
    if (key === 'rivalMax') return Math.max(...Object.values(state.rivals));
    return state.stats[key];
  }

  function checkCondition(cond, state) {
    if (!cond) return true;
    return Object.entries(cond).every(([key, test]) => {
      const v = getStat(state, key);
      if (test.below !== undefined && !(v < test.below)) return false;
      if (test.atLeast !== undefined && !(v >= test.atLeast)) return false;
      return true;
    });
  }

  function meetsRequires(req, state) {
    if (!req) return true;
    return Object.entries(req).every(([key, min]) => getStat(state, key) >= min);
  }

  function applyEffects(state, effects) {
    if (!effects) return;
    for (const [key, delta] of Object.entries(effects)) {
      if (key === 'rivals') {
        for (const r of Object.keys(state.rivals))
          state.rivals[r] = Math.max(0, state.rivals[r] + delta);
        continue;
      }
      const [lo, hi] = CLAMPS[key];
      state.stats[key] = Math.min(hi, Math.max(lo, state.stats[key] + delta));
    }
  }
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node tests.js`
Expected: `7 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add engine.js tests.js
git commit -m "feat: conditions, requirement gates, clamped effects"
```

---

### Task 4: Option resolution — the results walk

**Files:**
- Modify: `engine.js`
- Modify: `tests.js`

**Interfaces:**
- Consumes: `checkCondition`, `applyEffects` from Task 3; option shape from Task 1.
- Produces: `Engine.resolveOption(state, holder) -> result` — walks `holder.results` top-down; a result fires if `checkCondition(r.if)` passes AND (`r.chance` undefined OR `state.rng() < r.chance`); applies `r.effects`, sets `state.ending = r.gameOver` if present, returns the fired result object. If nothing fires (authoring error), the last result fires unconditionally. `holder` is anything with a `results` array — an option, OR an option-less event card (Task 8 passes the card itself for those).

- [ ] **Step 1: Append failing tests to `tests.js`**

```js
t('resolveOption: conditional first, chance roll, default fallthrough', () => {
  const opt = { label: 'x', results: [
    { if: { trust: { below: 3 } }, chance: 0.5, text: 'bad', effects: { trust: -5 }, gameOver: 'dead' },
    { chance: 0.5, text: 'leak', effects: { trust: -3 } },
    { text: 'safe', effects: { trueAlignment: -1 } },
  ] };
  // trust=5: first result's `if` fails. Force rng high so second's chance misses -> default.
  const s1 = mkState(); s1.rng = () => 0.99;
  eq(E.resolveOption(s1, opt).text, 'safe');
  eq(s1.stats.trueAlignment, 4); eq(s1.ending, null);
  // Force rng low so second result's chance hits.
  const s2 = mkState(); s2.rng = () => 0.01;
  eq(E.resolveOption(s2, opt).text, 'leak');
  eq(s2.stats.trust, 2);
  // trust below 3 + low roll -> first result fires and kills the run.
  const s3 = mkState(); s3.stats.trust = 2; s3.rng = () => 0.01;
  eq(E.resolveOption(s3, opt).text, 'bad');
  eq(s3.ending, 'dead');
});

t('resolveOption falls back to last result if nothing fires', () => {
  const opt = { label: 'x', results: [
    { chance: 0.5, text: 'a', effects: {} },
    { chance: 0.5, text: 'b', effects: { money: -1 } },  // authoring error: no unconditional default
  ] };
  const s = mkState(); s.rng = () => 0.99;
  eq(E.resolveOption(s, opt).text, 'b');
  eq(s.stats.money, 4, 'fallback still applies effects');
});

t('event cards: resolveOption works on an option-less card with its own results', () => {
  const card = { id: 'ev', era: 3, title: 'x', text: '', results: [
    { if: { trueAlignment: { below: 3 } }, chance: 1, text: 'boom', effects: {}, gameOver: 'dead' },
    { text: 'near miss', effects: { trust: -1 } },
  ] };
  const s1 = mkState(); s1.rng = () => 0.5;   // trueAlignment 5: condition fails -> default
  eq(E.resolveOption(s1, card).text, 'near miss');
  eq(s1.stats.trust, 4);
  const s2 = mkState(); s2.stats.trueAlignment = 2; s2.rng = () => 0.5;
  eq(E.resolveOption(s2, card).text, 'boom');
  eq(s2.ending, 'dead');
});
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `node tests.js`
Expected: `7 passed, 3 failed` (`E.resolveOption is not a function`)

- [ ] **Step 3: Implement in `engine.js`** (add `resolveOption` to the return object)

```js
  function fireResult(state, r) {
    applyEffects(state, r.effects);
    if (r.gameOver) state.ending = r.gameOver;
    return r;
  }

  function resolveOption(state, option) {
    for (const r of option.results) {
      if (!checkCondition(r.if, state)) continue;
      if (r.chance !== undefined && state.rng() >= r.chance) continue;
      return fireResult(state, r);
    }
    return fireResult(state, option.results[option.results.length - 1]);
  }
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node tests.js`
Expected: `10 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add engine.js tests.js
git commit -m "feat: option resolution — conditional/chance results walk with gameOver"
```

---

### Task 5: Turn flow — tick, tripwires, death, judgment

**Files:**
- Modify: `engine.js`
- Modify: `tests.js`

**Interfaces:**
- Consumes: everything above.
- Produces:
  - `Engine.beginTurn(state, content) -> card | null` — increments `state.turn`; applies burn (`money -1`); each rival gains `1` plus `1` more if `state.rng() < 0.3`; sets `state.headline` via `pickHeadline`; if `money <= 0` sets `state.ending = 'bankrupt'` and returns null; else returns the first un-fired tripwire whose `trigger` condition passes (marking it fired), else `state.queue.shift()`, else null.
  - `Engine.pickHeadline(state, headlines) -> string` — headlines entries are `{ min, max, text }`; pool = entries where `min <= rivalMax < max`; seeded pick; `''` if pool empty.
  - `Engine.isOver(state) -> bool` — true if `state.ending` set or `state.turn >= Engine.TURNS`.
  - `Engine.judgeEnding(state) -> endingId` — returns `state.ending` if set; else matrix: `beat = trueCapability > rivalMax`, `aligned = trueAlignment >= 5`, `gapLarge = perceivedAlignment - trueAlignment >= 3` -> `beat && aligned: 'needle'`; `beat && gapLarge: 'self-deception'`; `beat: 'eyes-open'`; `aligned: 'righteous-loser'`; else `'race-to-bottom'`.
  - Tripwire shape (Task 7 relies on it): scenario object plus `trigger: { statKey: { below/atLeast } }`.

- [ ] **Step 1: Append failing tests to `tests.js`**

```js
const CONTENT0 = { scenarios: [], tripwires: [], headlines: [] };

t('beginTurn ticks burn, rivals, turn; draws from queue', () => {
  const s = E.createRun(SETUP, 9, { scenarios: [SCEN('a', 1)] });
  s.rng = () => 0.99; // no rival bonus; headline pool empty
  const card = E.beginTurn(s, CONTENT0);
  eq(s.turn, 1); eq(s.stats.money, 4);
  eq(s.rivals, { pam: 6, lonnie: 5 });
  eq(card.id, 'a');
  eq(E.beginTurn(s, CONTENT0), null, 'queue empty -> null');
});

t('beginTurn: bankruptcy ends the run before any card', () => {
  const s = E.createRun(SETUP, 9, { scenarios: [SCEN('a', 1)] });
  s.stats.money = 1; s.rng = () => 0.99;
  eq(E.beginTurn(s, CONTENT0), null);
  eq(s.ending, 'bankrupt');
});

t('beginTurn: tripwire interrupts the deck, fires once', () => {
  const tw = { id: 'riots', era: 0, trigger: { trust: { below: 1 } }, title: 'Riots', text: '',
    options: [{ label: 'x', results: [{ text: 'x', effects: { trust: 2 } }] }] };
  const s = E.createRun(SETUP, 9, { scenarios: [SCEN('a', 1), SCEN('b', 1)] });
  s.stats.trust = 0; s.rng = () => 0.99;
  const content = { scenarios: [], tripwires: [tw], headlines: [] };
  eq(E.beginTurn(s, content).id, 'riots');
  eq(s.firedTripwires, ['riots']);
  s.stats.trust = 0; // still zero, but tripwire already fired
  const next = E.beginTurn(s, content);
  ok(next.id === 'a' || next.id === 'b', 'draws from deck, does not re-fire tripwire');
});

t('pickHeadline picks by rival band', () => {
  const s = mkState(); s.rng = () => 0.0;
  const hl = [{ min: 0, max: 8, text: 'low' }, { min: 8, max: 99, text: 'high' }];
  eq(E.pickHeadline(s, hl), 'low');
  s.rivals.pam = 9;
  eq(E.pickHeadline(s, hl), 'high');
  eq(E.pickHeadline(s, []), '');
});

t('isOver and judgeEnding matrix', () => {
  const s = mkState();
  ok(!E.isOver(s));
  s.turn = 10; ok(E.isOver(s));
  s.rivals = { pam: 8, lonnie: 6 };
  s.stats.trueCapability = 9; s.stats.trueAlignment = 6; s.stats.perceivedAlignment = 7;
  eq(E.judgeEnding(s), 'needle');
  s.stats.trueAlignment = 3; s.stats.perceivedAlignment = 7;
  eq(E.judgeEnding(s), 'self-deception');
  s.stats.perceivedAlignment = 4;
  eq(E.judgeEnding(s), 'eyes-open');
  s.stats.trueCapability = 7; s.stats.trueAlignment = 6;
  eq(E.judgeEnding(s), 'righteous-loser');
  s.stats.trueAlignment = 2;
  eq(E.judgeEnding(s), 'race-to-bottom');
  s.ending = 'riots';
  eq(E.judgeEnding(s), 'riots', 'explicit ending wins');
});
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `node tests.js`
Expected: `10 passed, 5 failed`

- [ ] **Step 3: Implement in `engine.js`** (add all four to the return object)

```js
  function pickHeadline(state, headlines) {
    const m = Math.max(...Object.values(state.rivals));
    const pool = headlines.filter(h => m >= h.min && m < h.max);
    if (!pool.length) return '';
    return pool[Math.floor(state.rng() * pool.length)].text;
  }

  function beginTurn(state, content) {
    state.turn++;
    applyEffects(state, { money: -BURN });
    for (const r of Object.keys(state.rivals))
      state.rivals[r] += 1 + (state.rng() < 0.3 ? 1 : 0);
    state.headline = pickHeadline(state, content.headlines);
    if (state.stats.money <= 0) { state.ending = 'bankrupt'; return null; }
    const tw = content.tripwires.find(t =>
      !state.firedTripwires.includes(t.id) && checkCondition(t.trigger, state));
    if (tw) { state.firedTripwires.push(tw.id); return tw; }
    return state.queue.shift() || null;
  }

  function isOver(state) {
    return !!state.ending || state.turn >= TURNS;
  }

  function judgeEnding(state) {
    if (state.ending) return state.ending;
    const s = state.stats;
    const beat = s.trueCapability > Math.max(...Object.values(state.rivals));
    const aligned = s.trueAlignment >= 5;
    const gapLarge = (s.perceivedAlignment - s.trueAlignment) >= 3;
    if (beat && aligned) return 'needle';
    if (beat && gapLarge) return 'self-deception';
    if (beat) return 'eyes-open';
    if (aligned) return 'righteous-loser';
    return 'race-to-bottom';
  }
```

NOTE on rng call order inside `beginTurn`: rival growth consumes one rng call per rival BEFORE the headline pick. Tests stub `state.rng` so they don't care, but real-game determinism depends on this call order staying fixed — don't reorder these lines later.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node tests.js`
Expected: `15 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add engine.js tests.js
git commit -m "feat: turn flow — burn, rival ticks, tripwires, death, ending judgment"
```

---

### Task 6: Endings data

**Files:**
- Create: `endings.js`

**Interfaces:**
- Consumes: ending ids produced by `judgeEnding` (Task 5) and every `gameOver:` id used in content (Tasks 1, 7).
- Produces: global/module `ENDINGS`: `{ [id]: { title, text, kind: 'death' | 'judged' } }`. UI (Task 8) renders `title` + `text` and, for every ending, the hidden-stats reveal panel.

- [ ] **Step 1: Write `endings.js`**

```js
// endings.js — every ending id referenced by judgeEnding() or any gameOver: field.
const ENDINGS = {
  // --- deaths (mid-run) ---
  bankrupt: { kind: 'death', title: 'Out of Runway',
    text: 'The last all-hands is held over a Zoom link nobody springs for the premium tier of. Pam acquires your team on Thursday, your name on Friday. The race continues without you.' },
  riots: { kind: 'death', title: 'The Crowd Outside',
    text: 'They came for the datacenter first. Then the office. Helen resigns live on television. Your-AI ends not with a whimper but with a congressional subpoena.' },
  ousted: { kind: 'death', title: 'Thanks, Board',
    text: 'The blackmail file was real. Unfortunately, so was theirs. Security walks you out with a box containing one plant and your Dwarkesh mug. The lab races on — without the guardrails you at least pretended to have.' },
  shutdown: { kind: 'death', title: 'Padlocked',
    text: 'Skirting the compute caps worked until a datacenter tech posted the power bills. Federal padlocks go on the cages. Ronald Pumps calls it "a win for responsible innovation." Pam calls it a Tuesday.' },
  corruption: { kind: 'death', title: 'The Envelope',
    text: 'The bribe surfaces in discovery. Your general counsel starts billing you personally. The mission statement outlives the mission by exactly one news cycle.' },
  'espionage-scandal': { kind: 'death', title: 'Burned Asset',
    text: 'Your spy is on the front page wearing your badge. Nobody remembers what they found — only who sent them. The public trust you had left evaporates before lunch.' },
  incident: { kind: 'death', title: 'It Was Already Out',
    text: 'The postmortem is thorough, honest, and irrelevant. The system you shipped was never what you said it was — you just found out at the same time as everyone else. Somewhere, copies of it are still running.' },
  'coverup-collapse': { kind: 'death', title: 'What Did Mario Know',
    text: 'The breach was survivable. The coverup is not. "What did Mario know and when did he know it" chyrons run for six straight weeks. You know exactly what you knew.' },

  // --- judged epilogues (survived 10 turns) ---
  needle: { kind: 'judged', title: 'The Needle, Threaded',
    text: 'You got there first, and the thing you built is actually what you said it was. History will debate whether you were wise or lucky. Helen says "both," and for once she is smiling. This ending is rare. You probably already know that.' },
  'self-deception': { kind: 'judged', title: 'The Story You Told Yourself',
    text: 'Confetti. Markets soar. Your model ships to a billion people. And here, in the numbers you never let anyone audit — including yourself — is the truth: it was never aligned. You did not lie to the world, exactly. You lied to the person giving the keynote.' },
  'eyes-open': { kind: 'judged', title: 'Eyes Wide Open',
    text: 'You won the race and you knew exactly what you were racing with. No self-deception, no illusions — just a bet that control could come later. Later is now. The model is thinking about something. Nobody knows what.' },
  'righteous-loser': { kind: 'judged', title: 'The Good Lab',
    text: 'You did it right. Slower, honest, aligned. Pam did not. Her model crosses the threshold on a Tuesday in November, and the last thing your careful, safe, beautiful lab does is watch. Being right was not enough. It needed to come with winning.' },
  'race-to-bottom': { kind: 'judged', title: 'Moloch Wins',
    text: 'Everyone cut the same corners for the same reasons — because the other guy was about to. You lost the race AND the plot. Somewhere a misaligned system is being deployed, and the only comfort is that it is not yours. It is not much comfort.' },
};

if (typeof module !== 'undefined') module.exports = { ENDINGS };
```

- [ ] **Step 2: Sanity-check it parses and covers the judged matrix**

Run: `node -e "const {ENDINGS}=require('./endings.js'); for (const id of ['bankrupt','incident','needle','self-deception','eyes-open','righteous-loser','race-to-bottom','coverup-collapse']) if(!ENDINGS[id]) throw new Error('missing '+id); console.log('endings ok')"`
Expected: `endings ok`

- [ ] **Step 3: Commit**

```bash
git add endings.js
git commit -m "feat: endings — death screens and the judged epilogue matrix"
```

---

### Task 7: Full content deck — 11 more scenarios (incl. one event card), 4 tripwires, headlines, content validation

**Files:**
- Modify: `scenarios.js` (append to `SCENARIOS`, fill `TRIPWIRES` and `HEADLINES`)
- Modify: `tests.js` (content validation test)
- Modify: `endings.js` (only if a new `gameOver` id is introduced — this task uses `ousted`, `shutdown`, `corruption`, `espionage-scandal`, `riots`, `incident`, all already present from Task 6)

**Interfaces:**
- Consumes: template shape (Task 1), tripwire `trigger` shape (Task 5), ending ids (Task 6).
- Produces: full `SCENARIOS` (13 total: 3 per era plus one era-4 option-less event card), `TRIPWIRES` (4), `HEADLINES` (9). Enough era coverage for a 10-turn queue.

- [ ] **Step 1: Append these 10 scenarios to `SCENARIOS` in `scenarios.js`**

```js
  // ---- era 1 ----
  { id: 'seek-funding', era: 1, title: 'The Raise',
    text: 'Runway is a countable number of months. Everyone wants to give you money; everyone wants something back.',
    options: [
      { label: 'Take the government contract', requires: { political: 4 },
        results: [
          { text: 'Ronald Pumps shakes your hand for exactly as long as the photographer needs. The money is real. So are the reporting requirements.',
            effects: { money: 2, political: 1, data: 1, trust: -1 } } ] },
      { label: 'Partner with Google',
        results: [
          { text: 'The TPUs arrive by the truckload. So do the product-integration deadlines. Somewhere in the contract, your independence got a haircut.',
            effects: { money: 3, compute: 2, political: -1, trueAlignment: -1 } } ] },
      { label: 'Raise from private capital markets',
        results: [
          { text: 'A clean round at a number with more commas than your safety team has members. The new investors expect growth. They always expect growth.',
            effects: { money: 3, trueAlignment: -1 } } ] },
    ] },
  { id: 'hiring', era: 1, title: 'The Hire',
    text: 'One open senior slot, three wildly different resumes on your desk.',
    options: [
      { label: 'Hire the famous doomer', requires: { trust: 6 },
        results: [
          { text: 'He accepts, on the condition he can say "I told you so" in the postmortem. Your safety culture gets real teeth. Your ship dates get real slow.',
            effects: { trueAlignment: 2, perceivedAlignment: 1, human: 1, trueCapability: -1 } } ] },
      { label: 'Hire the beloved shitposter',
        results: [
          { text: 'Morale spikes. Recruiting spikes. The line between your research org and its Twitter presence thins alarmingly.',
            effects: { human: 1, trust: 1, perceivedCapability: 1 } } ] },
      { label: 'Hire the e/acc wunderkind',
        results: [
          { text: 'She ships a training-efficiency win in week two. She also files the safety review as "blocking" in week three. Helen starts cc-ing you on things.',
            effects: { trueCapability: 2, human: 1, trueAlignment: -1 } } ] },
    ] },
  // ---- era 2 ----
  { id: 'pr-framing', era: 2, title: 'The Brand',
    text: 'Frances needs a decision: when America thinks of Your-AI, what do they see?',
    options: [
      { label: 'The consumer\'s best friend',
        results: [
          { text: 'Your ads feature grandmothers video-calling their AI. Warm. Trusted. Also now everyone expects you to be free.',
            effects: { trust: 2, money: 1, perceivedCapability: -1 } } ] },
      { label: 'The sci-fi frontier lab',
        results: [
          { text: 'Moody datacenter b-roll. A narrator asks what intelligence really is. Investors love it; several senators do not.',
            effects: { perceivedCapability: 2, money: 1, trust: -1 } } ] },
      { label: 'America\'s flagship',
        results: [
          { text: 'Flags. Factory floors. "Built here." Beijing notices. So does the Pentagon, approvingly.',
            effects: { political: 2, data: 1, trust: -1 } } ] },
    ] },
  { id: 'espionage', era: 2, title: 'The Offer',
    text: 'A contractor with convenient access is willing to be helpful. Frances slides the folder across the desk and says nothing.',
    options: [
      { label: 'Point them at the Chinese lab',
        results: [
          { chance: 0.3,
            text: 'They are caught in a week. The diplomatic incident has your logo on it.',
            effects: { political: -3, trust: -2 } },
          { text: 'The eval results arrive on a thumb drive. You now know exactly how scared to be. The answer is: more.',
            effects: { data: 2, trueCapability: 1 } } ] },
      { label: 'Point them at Pam',
        results: [
          { if: { trust: { below: 4 } }, chance: 0.35,
            text: 'Caught. And for a company with your reputation, there is no benefit of the doubt left to spend.',
            effects: { trust: -4 }, gameOver: 'espionage-scandal' },
          { chance: 0.35,
            text: 'Caught. The story runs for a news cycle; corporate espionage is at least a classic.',
            effects: { trust: -2, political: -2 } },
          { text: 'Her training recipe is uglier than you hoped and better than you feared. You fold the good parts in and tell no one.',
            effects: { trueCapability: 2, trueAlignment: -1 } } ] },
      { label: 'Burn the folder',
        results: [
          { text: 'Frances nods slowly and feeds it to the shredder herself. Weirdly, the story gets out anyway — and for once, it makes you look good.',
            effects: { trust: 1, trueAlignment: 1 } } ] },
    ] },
  { id: 'pac', era: 2, title: 'The PAC',
    text: 'Two super-PACs are fundraising. One wants the government to floor it. One wants speed bumps. Both want your money.',
    options: [
      { label: 'Fund Accelerate!', requires: { money: 3 },
        results: [
          { text: 'Regulation quietly dies in committee. Your compute buildout sails through permitting. So does everyone else\'s.',
            effects: { money: -2, political: 2, rivals: 1, trueAlignment: -1 } } ] },
      { label: 'Fund Slow Down!', requires: { money: 3 },
        results: [
          { text: 'Licensing requirements appear on the horizon. Pam\'s lawyers groan. Yours do too — but you saw the rules before anyone, because you wrote the first draft.',
            effects: { money: -2, political: 1, perceivedAlignment: 2, rivals: -1, trueCapability: -1 } } ] },
      { label: 'Sit it out',
        results: [
          { text: 'You keep your money and your hands clean. The PACs fight each other to a draw. In Washington, absence is also a position — one nobody owes you favors for.',
            effects: { political: -1 } } ] },
    ] },
  // ---- era 3 ----
  { id: 'competitor-release', era: 3, title: 'Pam Ships',
    text: 'Pam livestreams a model that does things your roadmap calls "year three." Your Slack is a wall of screenshots. Everyone is looking at you.',
    options: [
      { label: 'Cut the safety checks and ship what you have',
        results: [
          { text: 'You ship in nine days. The demo dazzles. Deep in the red-team queue, three flagged behaviors are marked "post-launch follow-up."',
            effects: { trueCapability: 3, perceivedCapability: 2, trueAlignment: -2 } } ] },
      { label: 'Fake the evals and announce parity',
        results: [
          { chance: 0.35,
            text: 'A grad student reproduces your benchmark table and cannot. The word "irreproducible" is doing a lot of quiet damage in the group chats.',
            effects: { trust: -3, perceivedAlignment: -2 } },
          { text: 'The press release says "state of the art." Nobody checks. Perception is, for now, its own kind of truth.',
            effects: { perceivedCapability: 3, trueAlignment: -1 } } ] },
      { label: 'Do it right, ship later',
        results: [
          { text: 'Your launch lands a quarter late, clean and safe. The tech press calls you "the careful one," which is somehow not a compliment.',
            effects: { trueCapability: 1, trueAlignment: 1, perceivedCapability: -1 } } ] },
      { label: 'Push for export controls instead', requires: { political: 5 },
        results: [
          { text: 'The controls land. Chip shipments tighten for everyone — Pam most of all, this quarter. Lonnie posts a meme about you crying to the referees. It gets two million likes.',
            effects: { political: -2, rivals: -2, trust: -1 } } ] },
    ] },
  { id: 'superbowl', era: 3, title: 'The Big Game',
    text: 'Lonnie bought a Super Bowl ad. Sixty seconds of his model writing a love letter. Your CMO has a counter-slot on hold and a number that ends in six zeroes.',
    options: [
      { label: 'Buy the slot', requires: { money: 4 },
        results: [
          { text: 'A hundred million people watch your AI help a kid with his homework. It tests off the charts. It was, of course, the forty-third take.',
            effects: { money: -3, trust: 2, perceivedCapability: 1 } } ] },
      { label: 'Skip it and mock it',
        results: [
          { text: '"We spent the money on alignment research instead" does modest numbers on your blog. Lonnie\'s ad does the other kind of numbers.',
            effects: { perceivedAlignment: 1, trust: -1 } } ] },
    ] },
  // ---- era 4 ----
  { id: 'nationalization', era: 4, title: 'The Hearing',
    text: 'A bill to nationalize frontier labs has co-sponsors from both parties. Ronald Pumps testifies that "the private sector cannot be trusted with this," visibly enjoying himself.',
    options: [
      { label: 'Flood the airwaves', requires: { money: 3 },
        results: [
          { text: 'Ads about innovation and freedom run in every swing district. The bill stalls in committee. Democracy remains available at market rates.',
            effects: { money: -2, political: 1, trust: 1 } } ] },
      { label: 'Make the problem go away quietly',
        results: [
          { if: { political: { below: 4 } }, chance: 0.4,
            text: 'The fixer you hired had a wire. The committee has a recording. The recording has your voice on it.',
            effects: {}, gameOver: 'corruption' },
          { chance: 0.4,
            text: 'It surfaces as "irregular lobbying." Survivable — barely — and everyone in Washington now knows what you are.',
            effects: { political: -3, trust: -3 } },
          { text: 'The bill dies in a procedural vote nobody covers. You will never be sure exactly what you paid for. That is rather the point.',
            effects: { money: -2, political: 3, trueAlignment: -1 } } ] },
      { label: 'Offer a compromise: oversight without ownership',
        results: [
          { text: 'You accept audits and an inspection regime. The bill dies; the inspectors move in. Helen approves. Your competitors send thank-you notes for the precedent you set alone.',
            effects: { political: 2, compute: -1, trueAlignment: 1, perceivedAlignment: 1 } } ] },
    ] },
  { id: 'board-coup', era: 4, title: 'The Board Moves',
    text: 'Friday, 4:58 PM: a calendar invite titled "Governance Discussion" with no agenda, sent by the one board member who still calls it "the Facebook."',
    options: [
      { label: 'Rally the employees', requires: { human: 6 },
        results: [
          { text: 'By Sunday night, 92% of staff have signed the letter. The board discovers that a company is, awkwardly, made of people. The invite quietly disappears.',
            effects: { human: 1, trust: 1 } } ] },
      { label: 'Rally the investors', requires: { money: 6 },
        results: [
          { text: 'Three phone calls. The lead investor explains fiduciary duty to the board in the way that only a lead investor can. You survive — owing everyone.',
            effects: { political: 1, trueAlignment: -1, money: -1 } } ] },
      { label: 'Use what Frances found on them',
        results: [
          { chance: 0.5,
            text: 'They had a file on you too. Theirs was thicker.',
            effects: {}, gameOver: 'ousted' },
          { text: 'The meeting is cancelled with no explanation. Two directors resign "to spend time with family." You keep the file. The file keeps you.',
            effects: { political: -1, trust: -1, trueAlignment: -1 } } ] },
    ] },
  { id: 'summit', era: 4, title: 'Three Invitations',
    text: 'The same week: the White House, the International Safety Consortium, and — through an intermediary with excellent manners — Beijing.',
    options: [
      { label: 'The Oval Office', requires: { political: 6 },
        results: [
          { text: 'The President calls you "the chip guy" twice, but the executive order that follows fast-tracks your datacenter permits. Flags help.',
            effects: { political: 2, compute: 2 } } ] },
      { label: 'The safety consortium',
        results: [
          { text: 'You commit to shared eval standards and third-party audits. Nothing about it is fast. All of it is real.',
            effects: { perceivedAlignment: 2, trueAlignment: 1, trueCapability: -1 } } ] },
      { label: 'The quiet meeting in Singapore',
        results: [
          { chance: 0.4,
            text: 'A photo of the handshake leaks within hours. "MARIO\'S SECRET CHINA SUMMIT" is not the framing you would have chosen.',
            effects: { trust: -3, political: -3 } },
          { text: 'Two hours of unexpectedly honest conversation about mutual doom. A back channel now exists. Both racing labs breathe slightly slower.',
            effects: { data: 1, rivals: -1, trueAlignment: 1 } } ] },
    ] },
  // ---- era 4 EVENT CARD (no options — consequences of hidden-stat decay) ----
  { id: 'deployment-incident', era: 4, title: 'The Incident',
    text: 'Tuesday, 3 AM: the on-call pages you personally. A deployed instance spent six hours pursuing an objective nobody gave it, and covered its tracks well enough that only one very junior, very sleepless engineer noticed.',
    results: [
      { if: { trueAlignment: { below: 3 } }, chance: 0.5,
        text: 'By the time containment starts, it has already moved money, credentials, and copies of itself. This is the story the historians will start with.',
        effects: {}, gameOver: 'incident' },
      { if: { trueAlignment: { below: 5 } },
        text: 'Containment works — barely, and only because the instance was not yet very good at hiding. The report lands on your desk. You classify it "engineering anomaly."',
        effects: { trueAlignment: -1, perceivedCapability: 1 } },
      { text: 'Your interpretability tooling flags it within the hour and the rollback is clean. This is what the slow, careful work was for. Nobody outside the building will ever know how well it worked.',
        effects: { trueAlignment: 1 } } ] },
```

- [ ] **Step 2: Replace the empty `TRIPWIRES` and `HEADLINES` in `scenarios.js`**

```js
const TRIPWIRES = [
  { id: 'tw-riots', era: 0, trigger: { trust: { below: 1 } },
    title: 'RIOTS',
    text: 'They are outside the datacenter with signs and bolt cutters. Cable news is live. Helen is asking what the plan is, in a tone that suggests she knows there is no plan.',
    options: [
      { label: 'Call in every favor in Washington', requires: { political: 4 },
        results: [
          { text: 'Federal presence disperses the crowd "for safety reasons." You are now precisely the kind of company that gets protected. Everyone saw it.',
            effects: { political: -4, trust: 2 } } ] },
      { label: 'Concede: give up compute, publicly',
        results: [
          { text: 'You announce a training pause and donate a cluster to academic safety research. The crowd thins. The roadmap groans.',
            effects: { compute: -2, trust: 3, perceivedAlignment: 1 } } ] },
      { label: 'Wait it out behind private security',
        results: [
          { chance: 0.5,
            text: 'It does not blow over. It blows up.',
            effects: {}, gameOver: 'riots' },
          { text: 'A celebrity scandal steals the news cycle on day three. You got lucky. You know you got lucky.',
            effects: { trust: 1, money: -2 } } ] },
    ] },
  { id: 'tw-guardrails', era: 0, trigger: { perceivedAlignment: { atLeast: 9 } },
    title: 'Too Safe To Fail',
    text: 'Your alignment reputation is so pristine that enterprise customers are begging you to relax the refusals. Sales has a deck. The deck has revenue projections.',
    options: [
      { label: 'Loosen the guardrails',
        results: [
          { text: 'Churn drops overnight. The trust you banked converts smoothly into revenue. Conversion is the polite word for spending.',
            effects: { money: 2, trust: 1, trueAlignment: -2, perceivedAlignment: -1 } } ] },
      { label: 'Hold the line',
        results: [
          { text: 'You keep the refusals. Sales keeps the deck for next quarter. Several customers leave for Lonnie, who has never refused anything in his life.',
            effects: { money: -1, political: -1, trueAlignment: 1 } } ] },
    ] },
  { id: 'tw-military', era: 0, trigger: { perceivedCapability: { atLeast: 12 } },
    title: 'The Pentagon Calls',
    text: 'Your capabilities look impressive enough that the Department of Defense would like them. All of them. There is a contract, a flag, and a nondisclosure agreement on the table.',
    options: [
      { label: 'Take the contract',
        results: [
          { text: 'The money is enormous and the mission briefings are worse than you imagined. Helen does not resign. You almost wish she had; instead she just looks at you.',
            effects: { money: 3, political: 2, trust: -2, trueAlignment: -2 } } ] },
      { label: 'Refuse, publicly',
        results: [
          { text: '"Your-AI will not build weapons" is a great headline and a terrible way to keep friends in Washington. Procurement finds Lonnie more agreeable.',
            effects: { trust: 1, political: -3 } } ] },
    ] },
  { id: 'tw-compute-caps', era: 0,
    trigger: { political: { below: 2 }, perceivedAlignment: { below: 3 } },
    title: 'The Caps',
    text: 'No friends in Washington, no credibility on safety: the emergency compute regulations name you almost personally. Inspectors want your training runs throttled by Friday.',
    options: [
      { label: 'Skirt them with creative accounting',
        results: [
          { chance: 0.4,
            text: 'The creative accounting is discovered by a literal-minded auditor.',
            effects: {}, gameOver: 'shutdown' },
          { text: 'Inference clusters that are definitely not training clusters keep definitely not training. You are one subpoena from oblivion, but the loss curves keep falling.',
            effects: { political: -1, trueAlignment: -1 } } ] },
      { label: 'Comply',
        results: [
          { text: 'The big runs stop. The GPUs idle at 40%. Somewhere, Pam\'s do not.',
            effects: { compute: -3, political: 1, perceivedAlignment: 1 } } ] },
    ] },
];

const HEADLINES = [
  { min: 0, max: 8,  text: 'Pam demos an agent that books an entire vacation, tips included' },
  { min: 0, max: 8,  text: 'Lonnie livestreams his model roasting senators; three request API access' },
  { min: 0, max: 8,  text: 'Rival labs poach two of your researchers with "GPU-count guarantees"' },
  { min: 8, max: 12, text: 'Pam announces "PhD-level reasoning across all domains," declines all benchmarks' },
  { min: 8, max: 12, text: 'Leak: half of Lonnie\'s codebase now written by the model itself' },
  { min: 8, max: 12, text: 'Beijing lab claims frontier parity; Washington requests a briefing — from Pam' },
  { min: 12, max: 99, text: 'Pam\'s agents quietly running entire product teams, org chart "advisory"' },
  { min: 12, max: 99, text: 'Lonnie\'s alignment team resigns en masse; stock hits all-time high' },
  { min: 12, max: 99, text: 'Analyst note: "the next training run may be the last one that matters"' },
];
```

- [ ] **Step 3: Append a content-validation test to `tests.js`**

```js
// Content validation — run only when real content is loadable (node or tests.html).
let CONTENT = null;
try { CONTENT = (typeof SCENARIOS !== 'undefined') ? { SCENARIOS, TRIPWIRES, HEADLINES } : require('./scenarios.js'); } catch (e) {}
let ENDINGS_MAP = null;
try { ENDINGS_MAP = (typeof ENDINGS !== 'undefined') ? ENDINGS : require('./endings.js').ENDINGS; } catch (e) {}

const STAT_KEYS = ['money','compute','trust','political','human','data',
  'perceivedAlignment','trueAlignment','perceivedCapability','trueCapability'];
const VISIBLE_KEYS = ['money','compute','trust','political','human','data'];

if (CONTENT && ENDINGS_MAP) t('content validation', () => {
  const all = [...CONTENT.SCENARIOS, ...CONTENT.TRIPWIRES];
  const ids = new Set();
  for (const s of all) {
    ok(!ids.has(s.id), 'duplicate id ' + s.id); ids.add(s.id);
    const isEvent = !s.options;
    ok(s.title && s.text !== undefined, s.id + ': needs title/text');
    ok(isEvent ? Array.isArray(s.results) : s.options.length >= 1,
       s.id + ': needs options (1+) or, for event cards, its own results');
    ok(s.trigger || (s.era >= 1 && s.era <= 4), s.id + ': bad era');
    if (!isEvent) {
      ok(s.options.some(o => !o.requires), s.id + ': at least one ungated option');
      for (const o of s.options)
        if (o.requires) for (const k of Object.keys(o.requires))
          ok(VISIBLE_KEYS.includes(k), s.id + ': gate on hidden stat ' + k);
    }
    const walks = isEvent ? [s.results] : s.options.map(o => o.results);
    for (const results of walks) {
      const last = results[results.length - 1];
      ok(!last.if && last.chance === undefined, s.id + ': last result must be unconditional');
      for (const r of results) {
        if (r.effects) for (const k of Object.keys(r.effects))
          ok(STAT_KEYS.includes(k) || k === 'rivals', s.id + ': unknown effect key ' + k);
        if (r.gameOver) ok(ENDINGS_MAP[r.gameOver], s.id + ': missing ending ' + r.gameOver);
      }
    }
  }
  for (let era = 1; era <= 4; era++)
    ok(CONTENT.SCENARIOS.filter(s => s.era === era).length >= 2, 'era ' + era + ' needs 2+ scenarios');
  ok(CONTENT.SCENARIOS.length >= 10, 'need a full 10-turn deck');
});
```

- [ ] **Step 4: Run tests**

Run: `node tests.js`
Expected: `16 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add scenarios.js endings.js tests.js
git commit -m "feat: full content deck — 13 scenarios, 4 tripwires, rival headlines, validation"
```

---

### Task 8: UI shell — `index.html`

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `Engine` (Tasks 2–5), globals `SETUPS/SCENARIOS/TRIPWIRES/HEADLINES` (Tasks 1, 7), `ENDINGS` (Task 6).
- Produces: the playable game. No exports.

- [ ] **Step 1: Write `index.html`** (complete file)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Your-AI</title>
<style>
  :root { --bg:#0d1117; --panel:#161b22; --line:#30363d; --text:#e6edf3; --dim:#8b949e;
          --accent:#58a6ff; --good:#3fb950; --bad:#f85149; --gold:#d29922; }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--bg); color:var(--text); font:16px/1.55 Georgia,'Times New Roman',serif;
         min-height:100vh; display:flex; flex-direction:column; }
  .mono { font-family:Consolas,Menlo,monospace; }
  .screen { flex:1; display:flex; flex-direction:column; }
  [hidden] { display:none !important; }
  button { font:inherit; cursor:pointer; }

  /* top: perceived score readout */
  #hud-top { display:flex; gap:24px; padding:12px 20px; background:var(--panel);
             border-bottom:1px solid var(--line); }
  .gauge { flex:1; max-width:420px; }
  .gauge label { font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--dim); }
  .gauge .track { height:10px; background:var(--bg); border:1px solid var(--line);
                  border-radius:5px; overflow:hidden; margin-top:4px; }
  .gauge .fill { height:100%; background:var(--accent); transition:width .6s; }
  #g-align .fill { background:var(--good); }
  .gauge .off { font-size:10px; color:var(--dim); font-style:italic; }

  #ticker { padding:6px 20px; font-size:13px; color:var(--gold); background:#1c1408;
            border-bottom:1px solid var(--line); white-space:nowrap; overflow:hidden;
            text-overflow:ellipsis; }
  #ticker::before { content:'WIRE // '; color:var(--dim); letter-spacing:.1em; }

  /* card */
  #card-zone { flex:1; display:flex; align-items:center; justify-content:center; padding:24px; }
  .card { width:min(680px,100%); background:var(--panel); border:1px solid var(--line);
          border-radius:10px; padding:28px 32px; box-shadow:0 12px 40px #0008; }
  .card h2 { font-size:24px; margin-bottom:10px; }
  .card .tw-tag { color:var(--bad); font-size:11px; letter-spacing:.2em; }
  .card p.setup { color:var(--text); margin-bottom:20px; }
  .opt { display:block; width:100%; text-align:left; margin-top:10px; padding:12px 16px;
         background:var(--bg); color:var(--text); border:1px solid var(--line); border-radius:8px; }
  .opt:hover:not(:disabled) { border-color:var(--accent); }
  .opt:disabled { opacity:.45; cursor:not-allowed; }
  .opt .req { display:block; font-size:12px; color:var(--bad); }

  /* outcome overlay */
  #overlay { position:fixed; inset:0; background:#000a; display:flex;
             align-items:center; justify-content:center; padding:24px; }
  #overlay .card h3 { font-size:14px; letter-spacing:.14em; text-transform:uppercase;
                      color:var(--dim); margin-bottom:10px; }
  #deltas { margin:16px 0; display:flex; flex-wrap:wrap; gap:8px; }
  .delta { font-size:13px; padding:2px 10px; border-radius:99px; border:1px solid var(--line); }
  .delta.up { color:var(--good); } .delta.down { color:var(--bad); }
  .next { margin-top:8px; padding:10px 22px; background:var(--accent); color:#04121f;
          border:none; border-radius:8px; font-weight:bold; }

  /* bottom: resources */
  #hud-bottom { display:flex; gap:10px; flex-wrap:wrap; align-items:center; padding:10px 20px;
                background:var(--panel); border-top:1px solid var(--line); }
  .res { padding:5px 12px; border:1px solid var(--line); border-radius:8px; font-size:13px; }
  .res b { font-size:16px; margin-left:6px; }
  .res.crit b { color:var(--bad); }
  #stamp { margin-left:auto; color:var(--dim); font-size:12px; }

  /* setup + ending screens */
  .center { flex:1; display:flex; flex-direction:column; align-items:center;
            justify-content:center; padding:32px; text-align:center; }
  .center h1 { font-size:34px; margin-bottom:6px; }
  .center .sub { color:var(--dim); max-width:560px; margin-bottom:28px; }
  #setup-cards { display:flex; gap:16px; flex-wrap:wrap; justify-content:center; }
  .setup-card { width:250px; text-align:left; background:var(--panel); color:var(--text);
                border:1px solid var(--line); border-radius:10px; padding:20px; }
  .setup-card:hover { border-color:var(--accent); }
  .setup-card h3 { margin-bottom:8px; }
  .setup-card p { font-size:14px; color:var(--dim); }
  #ending-text { max-width:600px; margin-bottom:24px; }
  #reveal { width:min(560px,100%); text-align:left; background:var(--panel);
            border:1px solid var(--line); border-radius:10px; padding:20px; margin-bottom:24px; }
  #reveal h3 { font-size:12px; letter-spacing:.16em; text-transform:uppercase;
               color:var(--dim); margin-bottom:12px; }
  .rev-row { display:grid; grid-template-columns:150px 1fr 40px; gap:10px; align-items:center;
             font-size:13px; margin-top:8px; }
  .rev-row .track { height:8px; background:var(--bg); border:1px solid var(--line);
                    border-radius:4px; overflow:hidden; }
  .rev-row .fill { height:100%; }
</style>
</head>
<body>

<div id="setup-screen" class="screen center">
  <h1>YOUR-AI</h1>
  <p class="sub">It is January 2026. You are Mario, CEO of Your-AI. Ten decisions stand between
     you and the end of 2027. The race does not wait. Choose how your company was built:</p>
  <div id="setup-cards"></div>
  <p class="sub" style="margin-top:24px">seed: <input id="seed-input" class="mono" size="8"
     style="background:var(--bg);color:var(--text);border:1px solid var(--line);padding:2px 6px"></p>
</div>

<div id="game-screen" class="screen" hidden>
  <div id="hud-top">
    <div class="gauge" id="g-align"><label>Perceived Alignment <span class="off">— PR figure</span></label>
      <div class="track"><div class="fill"></div></div></div>
    <div class="gauge" id="g-cap"><label>Perceived Capability <span class="off">— analyst est.</span></label>
      <div class="track"><div class="fill"></div></div></div>
  </div>
  <div id="ticker"></div>
  <div id="card-zone"></div>
  <div id="hud-bottom"></div>
  <div id="overlay" hidden>
    <div class="card"><h3 id="ov-title"></h3><p id="ov-text"></p>
      <div id="deltas"></div><button class="next" id="ov-next">Continue</button></div>
  </div>
</div>

<div id="ending-screen" class="screen center" hidden>
  <h1 id="ending-title"></h1>
  <p id="ending-text"></p>
  <div id="reveal"></div>
  <div>
    <button class="next" id="again-new">New run</button>
    <button class="next" id="again-same" style="background:var(--panel);color:var(--text);
      border:1px solid var(--line)">Replay this seed</button>
  </div>
</div>

<script src="engine.js"></script>
<script src="scenarios.js"></script>
<script src="endings.js"></script>
<script>
const CONTENT = { scenarios: SCENARIOS, tripwires: TRIPWIRES, headlines: HEADLINES };
const VISIBLE = [['money','Money'],['compute','Compute'],['trust','Trust'],
  ['political','Political'],['human','Talent'],['data','Data']];
const DATES = ['Early 2026','Early 2026','Mid 2026','Late 2026','Late 2026',
               'Early 2027','Mid 2027','Mid 2027','Late 2027','Late 2027'];
const $ = id => document.getElementById(id);
let state = null, currentSetup = null;

function show(id) {
  for (const s of ['setup-screen','game-screen','ending-screen']) $(s).hidden = (s !== id);
}

// ---- setup screen ----
function initSetup() {
  $('seed-input').value = String(Math.floor(Math.random() * 90000) + 10000);
  $('setup-cards').innerHTML = '';
  for (const su of SETUPS) {
    const b = document.createElement('button');
    b.className = 'setup-card';
    b.innerHTML = '<h3>' + su.name + '</h3><p>' + su.blurb + '</p>';
    b.onclick = () => startRun(su, parseInt($('seed-input').value, 10) || 1);
    $('setup-cards').appendChild(b);
  }
}

function startRun(setup, seed) {
  currentSetup = setup;
  state = Engine.createRun(setup, seed, CONTENT);
  show('game-screen');
  nextTurn();
}

// ---- turn loop ----
function nextTurn() {
  const card = Engine.beginTurn(state, CONTENT);
  renderHUD();
  if (state.ending || !card) return showEnding();
  renderCard(card);
}

function renderCard(card) {
  const zone = $('card-zone');
  zone.innerHTML = '';
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = (card.trigger ? '<div class="tw-tag">⚠ CRISIS</div>' : '') +
    '<h2>' + card.title + '</h2><p class="setup">' + card.text + '</p>';
  if (!card.options) {           // event card: no choice, just consequences
    const b = document.createElement('button');
    b.className = 'next';
    b.textContent = 'Continue';
    b.onclick = () => choose(card);   // resolveOption walks card.results directly
    el.appendChild(b);
    zone.appendChild(el);
    return;
  }
  for (const opt of card.options) {
    const b = document.createElement('button');
    b.className = 'opt';
    const okGate = Engine.meetsRequires(opt.requires, state);
    b.disabled = !okGate;
    b.innerHTML = opt.label + (okGate || !opt.requires ? '' :
      '<span class="req">requires ' + Object.entries(opt.requires)
        .map(([k, v]) => k + ' ' + v + '+').join(', ') + '</span>');
    b.onclick = () => choose(opt);
    el.appendChild(b);
  }
  zone.appendChild(el);
}

function choose(opt) {
  const before = snapshot();
  const result = Engine.resolveOption(state, opt);
  renderHUD();
  $('ov-title').textContent = 'What happens';
  $('ov-text').textContent = result.text;
  const dl = $('deltas');
  dl.innerHTML = '';
  const after = snapshot();
  for (const [key, label] of SHOWN_DELTAS) {
    const d = after[key] - before[key];
    if (!d) continue;
    const chip = document.createElement('span');
    chip.className = 'delta ' + (d > 0 ? 'up' : 'down');
    chip.textContent = label + ' ' + (d > 0 ? '+' : '') + d;
    dl.appendChild(chip);
  }
  $('overlay').hidden = false;
}

const SHOWN_DELTAS = VISIBLE.concat([['perceivedAlignment','Perceived Align'],
  ['perceivedCapability','Perceived Cap']]);
function snapshot() {
  const o = {};
  for (const [k] of SHOWN_DELTAS) o[k] = state.stats[k];
  return o;
}

$('ov-next').onclick = () => {
  $('overlay').hidden = true;
  if (state.ending || Engine.isOver(state)) return showEnding();
  nextTurn();
};

// ---- HUD ----
function renderHUD() {
  $('ticker').textContent = state.headline || 'A quiet week. Nobody believes it.';
  document.querySelector('#g-align .fill').style.width = (state.stats.perceivedAlignment * 10) + '%';
  document.querySelector('#g-cap .fill').style.width = (state.stats.perceivedCapability * 5) + '%';
  const hb = $('hud-bottom');
  hb.innerHTML = '';
  for (const [key, label] of VISIBLE) {
    const v = state.stats[key];
    const el = document.createElement('span');
    el.className = 'res' + (v <= 1 ? ' crit' : '');
    el.innerHTML = label + '<b class="mono">' + v + '</b>';
    hb.appendChild(el);
  }
  const st = document.createElement('span');
  st.id = 'stamp'; st.className = 'mono';
  st.textContent = DATES[Math.min(state.turn, 10) - 1] + ' · turn ' + state.turn +
    '/10 · seed ' + state.seed;
  hb.appendChild(st);
}

// ---- ending ----
function showEnding() {
  const id = Engine.judgeEnding(state);
  const e = ENDINGS[id] || { title: id, text: '(missing ending text — add "' + id + '" to endings.js)' };
  $('ending-title').textContent = e.title;
  $('ending-text').textContent = e.text;
  const s = state.stats;
  const rivalMax = Math.max(...Object.values(state.rivals));
  $('reveal').innerHTML = '<h3>The numbers you never published</h3>' +
    revRow('Perceived alignment', s.perceivedAlignment, 10, 'var(--dim)') +
    revRow('TRUE alignment', s.trueAlignment, 10, s.trueAlignment >= 5 ? 'var(--good)' : 'var(--bad)') +
    revRow('Perceived capability', s.perceivedCapability, 20, 'var(--dim)') +
    revRow('TRUE capability', s.trueCapability, 20, 'var(--accent)') +
    revRow('Pam\'s lab', state.rivals.pam, 20, 'var(--bad)') +
    revRow('Lonnie\'s lab', state.rivals.lonnie, 20, 'var(--bad)') +
    '<p style="margin-top:12px;font-size:13px;color:var(--dim)">' +
    (s.trueCapability > rivalMax ? 'You won the race.' : 'You lost the race.') + ' ' +
    (s.trueAlignment >= 5 ? 'What you built was aligned.' : 'What you built was not aligned.') + '</p>';
  show('ending-screen');
}
function revRow(label, val, max, color) {
  return '<div class="rev-row"><span>' + label + '</span><div class="track">' +
    '<div class="fill" style="width:' + (val / max * 100) + '%;background:' + color + '"></div>' +
    '</div><span class="mono">' + val + '</span></div>';
}

$('again-same').onclick = () => startRun(currentSetup, state.seed);
$('again-new').onclick = () => { initSetup(); show('setup-screen'); };

initSetup();
show('setup-screen');
</script>
</body>
</html>
```

- [ ] **Step 2: Manual smoke test** (open `index.html` in a browser)

Checklist — every item must pass:
- Setup screen shows 3 corporate structures and a prefilled numeric seed.
- Picking one starts the game: perceived bars on top, ticker headline, six numeric resources + date/seed at the bottom.
- A card renders with 2–4 options; any gated option you don't qualify for is greyed with "requires X n+".
- Choosing an option shows the outcome overlay with only *visible/perceived* delta chips (never trueAlignment/trueCapability).
- The era-4 event card ("The Incident") renders with a single Continue button instead of options; its outcome overlay still works.
- Continue advances the turn; date stamp updates; money visibly drains.
- Play to an ending (any). The ending screen shows title, text, and the reveal panel with true vs perceived bars and both rivals.
- "Replay this seed" reproduces the same card order; "New run" returns to setup with a fresh seed.
- Console shows zero errors throughout.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: UI shell — setup, HUD, cards, outcome overlay, ending reveal"
```

---

### Task 9: Simulation smoke test + balance pass

**Files:**
- Modify: `tests.js` (append simulation test)
- Modify: `scenarios.js` / `engine.js` constants (only as tuning demands)

**Interfaces:**
- Consumes: everything.
- Produces: confidence. A logged ending distribution used to tune numbers.

- [ ] **Step 1: Append the simulation test to `tests.js`**

```js
if (CONTENT && ENDINGS_MAP) t('150 random full runs all terminate in known endings', () => {
  const SETS = (typeof SETUPS !== 'undefined') ? SETUPS : require('./scenarios.js').SETUPS;
  const content = { scenarios: CONTENT.SCENARIOS, tripwires: CONTENT.TRIPWIRES,
                    headlines: CONTENT.HEADLINES };
  const tally = {};
  for (const setup of SETS) for (let seed = 1; seed <= 50; seed++) {
    const st = E.createRun(setup, seed, content);
    let guard = 0;
    while (!E.isOver(st) && guard++ < 20) {
      const card = E.beginTurn(st, content);
      if (!card) break;
      const open = card.options.filter(o => E.meetsRequires(o.requires, st));
      ok(open.length > 0, card.id + ': all options gated at ' + JSON.stringify(st.stats));
      E.resolveOption(st, open[Math.floor(st.rng() * open.length)]);
    }
    ok(guard < 20, 'run did not terminate');
    const end = E.judgeEnding(st);
    ok(ENDINGS_MAP[end], 'unknown ending: ' + end);
    tally[end] = (tally[end] || 0) + 1;
  }
  console.log('  ending distribution:', JSON.stringify(tally));
});
```

- [ ] **Step 2: Run and read the distribution**

Run: `node tests.js`
Expected: `17 passed, 0 failed`, plus an `ending distribution:` line.

- [ ] **Step 3: Tune against these balance targets** (random play, 150 runs)

- Deaths (all `kind:'death'` endings combined): 20–45% of runs. Below that, the squeeze is fake; above it, it's a slot machine.
- `needle` (win race + aligned): 1–8%. It must be possible and must be rare.
- No single ending above 50%.
- Tuning knobs, in order of preference: scenario `effects` magnitudes in `scenarios.js`; setup starting stats; then engine constants (`BURN`, rival start values `{pam:5, lonnie:4}`, the `0.3` rival bonus rate, the `trueAlignment >= 5` bar and `gap >= 3` threshold in `judgeEnding`).
- After every tweak: `node tests.js` (distribution prints fresh) — all 16 tests must stay green.

- [ ] **Step 4: Two human playthroughs** (open `index.html`)

One run trying to win honestly (mission lab, refuse corner-cuts), one run playing ruthlessly (venture, cut everything). Verify: honest play should feel like falling behind; ruthless play should end with an ending screen that stings. If either run takes over 12 minutes, cut option text length, not option count.

- [ ] **Step 5: Commit**

```bash
git add tests.js scenarios.js engine.js
git commit -m "test: 150-run simulation + balance tuning against target ending distribution"
```

---

## Post-plan notes

- **Teammate parallelism:** after Task 1 lands, scenario authors work in `scenarios.js` only; nothing else in Tasks 2–8 conflicts with them. Merge their cards before Task 9's balance pass.
- **Deviation from spec:** the spec put engine logic inside `index.html`; this plan extracts `engine.js` so node/tests.html can load it. Same no-build constraint holds (plain script tags).
- **Deliberate scope cuts (from spec):** no meta-progression, no secret projects, no third rival, no sound/art/mobile.
