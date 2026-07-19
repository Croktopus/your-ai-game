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

  function createRun(setup, seed, content) {
    const rng = mulberry32(seed);
    const stats = Object.assign({}, setup.stats);
    for (const key of Object.keys(RATE_DEFAULTS))
      if (key !== 'rivalRate')
        stats[key] = clampRate(key, stats[key] !== undefined ? stats[key] : RATE_DEFAULTS[key]);
    const rivalRate = clampRate('rivalRate',
      setup.stats.rivalRate !== undefined ? setup.stats.rivalRate : RATE_DEFAULTS.rivalRate);
    delete stats.rivalRate; // lives on state.rivalRate, not state.stats
    return {
      seed, rng, turn: 0,
      stats,
      rivals: { pam: 4, lonnie: 3 },
      rivalRate,
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

  function applyEffects(state, effects) {
    if (!effects) return;
    for (const [key, delta] of Object.entries(effects)) {
      if (key === 'rivals') {
        for (const r of Object.keys(state.rivals))
          state.rivals[r] = Math.max(0, Math.min(20, state.rivals[r] + delta));
        continue;
      }
      if (key === 'rivalRate') {
        state.rivalRate = clampRate('rivalRate', state.rivalRate + delta);
        continue;
      }
      if (RATE_BOUNDS[key]) {
        state.stats[key] = clampRate(key, state.stats[key] + delta);
        continue;
      }
      if (!CLAMPS[key]) { console.warn('unknown effect key: ' + key); continue; }
      const [lo, hi] = CLAMPS[key];
      state.stats[key] = Math.min(hi, Math.max(lo, state.stats[key] + delta));
    }
  }

  // Advance the trajectories: capability & alignment (yours + rivals') ride their rates
  // every turn. No rng consumed — deterministic given the accumulated rates.
  function advanceTrajectories(state) {
    const s = state.stats;
    const clampBar = (key, v) => { const [lo, hi] = CLAMPS[key]; return Math.min(hi, Math.max(lo, v)); };
    s.perceivedCapability = clampBar('perceivedCapability', s.perceivedCapability + s.pCapRate);
    s.trueCapability = clampBar('trueCapability', s.trueCapability + s.tCapRate);
    s.perceivedAlignment = clampBar('perceivedAlignment', s.perceivedAlignment + s.pAlignRate);
    s.trueAlignment = clampBar('trueAlignment', s.trueAlignment + s.tAlignRate);
    for (const r of Object.keys(state.rivals))
      state.rivals[r] = Math.max(0, Math.min(20, state.rivals[r] + state.rivalRate));
  }

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

  function pickHeadline(state, headlines) {
    const m = Math.max(...Object.values(state.rivals));
    const pool = headlines.filter(h => m >= h.min && m < h.max);
    if (!pool.length) return '';
    return pool[Math.floor(state.rng() * pool.length)].text;
  }

  function beginTurn(state, content) {
    state.turn++;
    applyEffects(state, { money: -BURN });
    advanceTrajectories(state);
    state.headline = pickHeadline(state, content.headlines);
    if (state.stats.money <= 0) { state.ending = 'bankrupt'; return null; }
    if (state.turn === TURNS) return content.endgame || null;
    // Q1 of each year (turns 1/5/9/13): guaranteed funding card, deck untouched.
    // Wins over tripwires, same priority as the endgame winning at turn 16.
    if (state.turn % 4 === 1 && content.funding) {
      const year = yearForTurn(state.turn);
      const fc = content.funding.find(f => f.year === year);
      if (fc) return fc;
    }
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

  return { TURNS, mulberry32, yearForTurn, shuffle, buildQueue, createRun, getStat, checkCondition, meetsRequires, applyEffects, advanceTrajectories, clampRate, resolveOption, pickHeadline, beginTurn, isOver, judgeEnding };
})();
if (typeof module !== 'undefined') module.exports = Engine;
