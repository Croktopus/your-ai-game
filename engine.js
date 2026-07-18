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

  return { TURNS, mulberry32, eraForTurn, shuffle, buildQueue, createRun, getStat, checkCondition, meetsRequires, applyEffects };
})();
if (typeof module !== 'undefined') module.exports = Engine;
