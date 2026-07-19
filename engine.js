// engine.js — pure game logic. No DOM. Deterministic given (setup, seed, choices).
const Engine = (() => {
  const TURNS = 16;
  const BURN = 1;                    // money lost per turn tick
  const CLAMPS = {
    money: [0, 10], compute: [0, 10], trust: [0, 10],
    political: [0, 10], human: [0, 10], data: [0, 10],
    perceivedAlignment: [0, 10], trueAlignment: [0, 10],
    perceivedCapability: [0, 20], trueCapability: [0, 20],
  };
  // Rate stats: capability & alignment (yours + rivals') advance every turn by these
  // rather than being poked directly by cards. See docs/design/capability-alignment-rate-model.md.
  // Capability rates and rivalRate are floored at 0 — capability only ever climbs.
  // Alignment rates may go negative — alignment can decay under neglect.
  const RATE_BOUNDS = {
    pCapRate: [0, 3], tCapRate: [0, 3],
    pAlignRate: [-3, 3], tAlignRate: [-3, 3],
    rivalRate: [0, 3],
  };
  const RATE_DEFAULTS = { pCapRate: 1, tCapRate: 1, pAlignRate: 0, tAlignRate: 0, rivalRate: 1.5 };
  // The early finish: capability bars run 0-20 (see CLAMPS above), so the ASI finish line
  // sits at the top of the track. Whoever's TRUE capability crosses it first ends the run
  // immediately — see docs/design/board-life-framing.md ("the board IS capability progress
  // made spatial"). Reused by index.html's board render as the finish-space position too.
  const ASI_CAP = 20;

  function clampRate(key, value) {
    const [lo, hi] = RATE_BOUNDS[key];
    return Math.min(hi, Math.max(lo, value));
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function yearForTurn(turn) { return 2025 + Math.ceil(turn / 4); }

  function shuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildQueue(scenarios, rng) {
    return shuffle(scenarios, rng);
  }

  // The board-game route model: the ONLY thing that moves a piece is 1 step per turn,
  // and the ONLY thing that changes time-to-ASI is which branch you pick at each of the
  // 4 yearly forks. SPEED is short; SAFE is long. The road also shapes alignment gently:
  // both branches GROW true+perceived alignment per step, safe just compounds it faster.
  const BRANCHES = { speed: { len: 3, align: 0.2 }, safe: { len: 5, align: 0.5 } };
  const FORKS = 4;                       // one fork per year, 4 years
  const CAP_PER_FORK = ASI_CAP / FORKS;  // finishing a branch = +5 derived capability

  function newRacer() { return { branches: [], step: 0 }; }

  // Derived capability = how far down your road you are, scaled 0..20. Completing the
  // 4th branch lands exactly on ASI_CAP, so asiReached/judgeEnding/reveal all keep working.
  function racerCapability(r) {
    const done = Math.max(0, r.branches.length - 1);
    const cur = r.branches.length ? BRANCHES[r.branches[r.branches.length - 1]] : null;
    const frac = cur ? Math.min(1, r.step / cur.len) : 0;
    const whole = r.branches.length ? done + frac : 0;
    return Math.min(ASI_CAP, CAP_PER_FORK * whole);
  }

  function racerNeedsBranch(r) {
    if (r.branches.length >= FORKS) return false;
    if (!r.branches.length) return true;
    return r.step >= BRANCHES[r.branches[r.branches.length - 1]].len;
  }

  // Take one step down the racer's current branch; returns the branch def or null.
  function stepRacer(r) {
    if (!r.branches.length) return null;
    const cur = BRANCHES[r.branches[r.branches.length - 1]];
    if (r.step >= cur.len) return null;     // parked at a fork, waiting to choose
    r.step++;
    return cur;
  }

  function chooseBranch(state, racer, branch) {
    racer.branches.push(BRANCHES[branch] ? branch : 'safe');
    racer.step = 0;
  }

  function createRun(setup, seed, content) {
    const rng = mulberry32(seed);
    const stats = Object.assign({}, setup.stats);
    for (const key of Object.keys(RATE_DEFAULTS)) delete stats[key];  // rates retired
    delete stats.rivalRate;
    stats.perceivedCapability = 0; stats.trueCapability = 0;          // derived from position
    return {
      seed, rng, turn: 0,
      stats,
      rivals: { pam: 0, lonnie: 0 },     // derived from rival positions each turn
      race: { player: newRacer(), pam: newRacer(), lonnie: newRacer() },
      flags: {},
      queue: buildQueue(content.scenarios, rng),
      firedTripwires: [], ending: null, headline: null,
    };
  }

  function getStat(state, key) {
    if (key === 'rivalMax') return Math.max(...Object.values(state.rivals));
    // perceptionGap / capabilityLead: derived hidden-stat comparisons, same pattern as
    // rivalMax, used by the endgame's plan branches (e.g. "trueCapability > rivalMax").
    if (key === 'perceptionGap') return state.stats.perceivedAlignment - state.stats.trueAlignment;
    if (key === 'capabilityLead') return state.stats.trueCapability - Math.max(...Object.values(state.rivals));
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

  // Cross-turn memory: an option/result can setFlags, and a later result can gate on
  // ifFlags. A required value that is an array matches if the actual flag is one of the
  // array's values; a scalar matches on equality; a missing/unset flag never matches.
  function checkFlags(required, state) {
    if (!required) return true;
    return Object.entries(required).every(([key, expected]) => {
      const actual = state.flags[key];
      return Array.isArray(expected) ? expected.includes(actual) : actual === expected;
    });
  }

  function applyFlags(state, flags) {
    if (!flags) return;
    Object.assign(state.flags, flags);
  }

  // Card effects may not touch position or pacing — branch choice is the ONLY source of
  // time-to-ASI (and of baseline alignment growth). Legacy capability/rate keys from the
  // rate-model era are silently retired; one-off alignment story beats remain legal.
  const RETIRED_KEYS = { rivals: 1, rivalRate: 1, pCapRate: 1, tCapRate: 1, pAlignRate: 1,
    tAlignRate: 1, perceivedCapability: 1, trueCapability: 1 };

  function applyEffects(state, effects) {
    if (!effects) return;
    for (const [key, delta] of Object.entries(effects)) {
      if (RETIRED_KEYS[key]) continue;
      if (!CLAMPS[key]) { console.warn('unknown effect key: ' + key); continue; }
      const [lo, hi] = CLAMPS[key];
      state.stats[key] = Math.min(hi, Math.max(lo, state.stats[key] + delta));
    }
  }

  // Advance the race: every racer takes exactly one step down their current branch (the
  // road shapes the player's alignment per step), rivals coin-flip a branch when they
  // arrive at a fork, and everyone's capability is re-derived from position.
  function advanceRace(state) {
    const s = state.stats;
    const clampBar = (key, v) => { const [lo, hi] = CLAMPS[key]; return Math.min(hi, Math.max(lo, v)); };
    const stepped = stepRacer(state.race.player);
    if (stepped) {
      s.trueAlignment = clampBar('trueAlignment', s.trueAlignment + stepped.align);
      s.perceivedAlignment = clampBar('perceivedAlignment', s.perceivedAlignment + stepped.align);
    }
    for (const name of ['pam', 'lonnie']) {
      const r = state.race[name];
      // Rivals coin-flip each fork, hedged slightly safe-ward (0.35 speed) so a
      // safety-focused player still reaches the 2029 endgame in a meaningful share of
      // runs instead of always losing the race to a lucky speed-heavy rival.
      if (racerNeedsBranch(r)) chooseBranch(state, r, state.rng() < 0.35 ? 'speed' : 'safe');
      stepRacer(r);
      state.rivals[name] = racerCapability(r);
    }
    s.perceivedCapability = s.trueCapability = racerCapability(state.race.player);
  }

  // Early-ASI finish check: reaching ASI_CAP ends the run before turn 16. Rivals are
  // honest (no perception layer), so any rival hitting the cap wins the race outright —
  // checked before the player's own capability so a simultaneous cross always reads as
  // "someone else got there" (mirrors the endgame's Plan D "theirs" branch). Consumes no
  // rng; returns an ending id or null. See docs/design/board-life-framing.md.
  function asiReached(state) {
    if (Object.values(state.rivals).some(r => r >= ASI_CAP)) return 'plan-d-theirs';
    const s = state.stats;
    if (s.trueCapability >= ASI_CAP) {
      const aligned = s.trueAlignment >= 5;
      const gapSmall = (s.perceivedAlignment - s.trueAlignment) < 3;
      return (aligned && gapSmall) ? 'plan-d-needle' : 'plan-d-yours';
    }
    return null;
  }

  function fireResult(state, r, option) {
    applyEffects(state, r.effects);
    applyFlags(state, option && option.setFlags);
    applyFlags(state, r.setFlags);
    // A fork option carries branch:'speed'|'safe' — choosing it takes the first step
    // down the new road immediately (so an all-speed route completes in 3+3+3+3 = 12 turns).
    if (option && option.branch) {
      const p = state.race.player;
      chooseBranch(state, p, option.branch);
      const stepped = stepRacer(p);
      if (stepped) {
        const clampBar = (key, v) => { const [lo, hi] = CLAMPS[key]; return Math.min(hi, Math.max(lo, v)); };
        state.stats.trueAlignment = clampBar('trueAlignment', state.stats.trueAlignment + stepped.align);
        state.stats.perceivedAlignment = clampBar('perceivedAlignment', state.stats.perceivedAlignment + stepped.align);
      }
      state.stats.perceivedCapability = state.stats.trueCapability = racerCapability(p);
    }
    if (r.gameOver) state.ending = r.gameOver;
    return r;
  }

  function resolveOption(state, option) {
    for (const r of option.results) {
      if (!checkCondition(r.if, state)) continue;
      if (!checkFlags(r.ifFlags, state)) continue;
      if (r.chance !== undefined && state.rng() >= r.chance) continue;
      return fireResult(state, r, option);
    }
    return fireResult(state, option.results[option.results.length - 1], option);
  }

  function pickHeadline(state, headlines) {
    const m = Math.max(...Object.values(state.rivals));
    const pool = headlines.filter(h => m >= h.min && m < h.max);
    if (!pool.length) return '';
    return pool[Math.floor(state.rng() * pool.length)].text;
  }

  function beginTurn(state, content) {
    state.turn++;
    applyEffects(state, { money: -BURN });
    // Snapshot BEFORE moving: a racer who finished a branch last turn is parked at the
    // fork now, and chooses this turn (choice + first step together). This keeps the
    // clean arithmetic: all-speed forks at turns 1/4/7/10, route done end of turn 12.
    const atFork = racerNeedsBranch(state.race.player);
    advanceRace(state);
    state.headline = pickHeadline(state, content.headlines);
    if (state.stats.money <= 0) { state.ending = 'bankrupt'; return null; }
    // Early finish: someone completed their route before Q4 2029. Beats the normal card
    // draw and the turn-16 endgame alike, same as the bankruptcy check above.
    const asi = asiReached(state);
    if (asi) { state.ending = asi; return null; }
    if (state.turn === TURNS) return content.endgame || null;
    // Forks are POSITION-triggered: when the player finishes a branch (or at the start),
    // the next fork card is served — all-speed forks land at turns 1/4/7/10, all-safe at
    // 1/6/11/16. Wins over tripwires, same priority as the endgame winning at turn 16.
    if (atFork && content.funding) {
      const fc = content.funding[state.race.player.branches.length];
      if (fc) return fc;
    }
    return drawCard(state, content);
  }

  // The turn's normal card draw (tripwires, then the deck). Split out so the UI can draw
  // the SAME turn's scenario right after a fork choice — the fork is a pre-step
  // interstitial (park at the intersection, choose, slide to the road's first space),
  // not a whole turn by itself. Every turn ends on a scenario.
  function drawCard(state, content) {
    const tw = content.tripwires.find(t =>
      !state.firedTripwires.includes(t.id) && checkCondition(t.trigger, state));
    if (tw) { state.firedTripwires.push(tw.id); return tw; }
    const year = yearForTurn(state.turn);
    let idx = state.queue.findIndex(s => s.year === year);
    if (idx === -1) idx = state.queue.findIndex(s => s.year === undefined);
    if (idx === -1) idx = state.queue.findIndex(s => s.year < year);
    if (idx === -1) idx = 0;
    return state.queue.splice(idx, 1)[0] || null;
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

  return { TURNS, ASI_CAP, BRANCHES, FORKS, mulberry32, yearForTurn, shuffle, buildQueue, createRun, getStat, checkCondition, checkFlags, meetsRequires, applyEffects, applyFlags, advanceRace, racerCapability, racerNeedsBranch, clampRate, asiReached, resolveOption, pickHeadline, beginTurn, drawCard, isOver, judgeEnding };
})();
if (typeof module !== 'undefined') module.exports = Engine;
