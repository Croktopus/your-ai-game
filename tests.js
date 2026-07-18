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

t('eraForTurn maps 16 turns onto 4 eras (years)', () => {
  eq([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(E.eraForTurn),
     [1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4]);
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
  eq(st.turn, 0); eq(st.rivals, { pam: 4, lonnie: 3 }); eq(st.ending, null);
});

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
  ok(E.checkCondition({ rivalMax: { atLeast: 4 } }, s), 'pam starts at 4');
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
  eq(s.rivals, { pam: 2, lonnie: 1 });
  E.applyEffects(s, { rivals: -99 });
  eq(s.rivals, { pam: 0, lonnie: 0 }, 'rivals floor at 0');
  E.applyEffects(s, undefined); // no-op, must not throw
});

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

const CONTENT0 = { scenarios: [], tripwires: [], headlines: [] };

t('beginTurn ticks burn, rivals, turn; draws from queue', () => {
  const s = E.createRun(SETUP, 9, { scenarios: [SCEN('a', 1)] });
  s.rng = () => 0.99; // no rival bonus; headline pool empty
  const card = E.beginTurn(s, CONTENT0);
  eq(s.turn, 1); eq(s.stats.money, 4);
  eq(s.rivals, { pam: 5, lonnie: 4 });
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

t('beginTurn: era-aware draw prefers current era over older leftovers', () => {
  const s = E.createRun(SETUP, 9, { scenarios: [] });
  s.rng = () => 0.99;
  const eraOne = SCEN('a', 1), eraFour = SCEN('d', 4);
  s.queue = [eraOne, eraFour];
  s.turn = 12; // beginTurn increments to 13 -> era 4
  const card = E.beginTurn(s, CONTENT0);
  eq(card.id, 'd', 'era-4 card drawn ahead of era-1 leftover');
  eq(s.queue.map(x => x.id), ['a'], 'era-1 leftover remains in queue');
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
  s.turn = E.TURNS; ok(E.isOver(s));
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

// Content validation — run only when real content is loadable (node or tests.html).
let CONTENT = null;
try { CONTENT = (typeof SCENARIOS !== 'undefined') ? { SCENARIOS, TRIPWIRES, HEADLINES, ENDGAME } : require('./scenarios.js'); } catch (e) {}
let ENDINGS_MAP = null;
try { ENDINGS_MAP = (typeof ENDINGS !== 'undefined') ? ENDINGS : require('./endings.js').ENDINGS; } catch (e) {}
let REPORTS_ARR = null;
try { REPORTS_ARR = (typeof REPORTS !== 'undefined') ? REPORTS : require('./reports.js').REPORTS; } catch (e) {}

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
  ok(CONTENT.SCENARIOS.length >= 15, 'need a full 15-turn deck (turn 16 is the endgame)');
});

if (CONTENT && ENDINGS_MAP && CONTENT.ENDGAME) t('endgame content validation', () => {
  const eg = CONTENT.ENDGAME;
  ok(Array.isArray(eg.options) && eg.options.length >= 1, 'endgame needs options');
  ok(eg.options.some(o => !o.requires), 'endgame needs at least one ungated option (Plan D)');
  for (const o of eg.options) {
    if (o.requires) for (const k of Object.keys(o.requires))
      ok(VISIBLE_KEYS.includes(k), 'endgame "' + o.label + '": gate on hidden stat ' + k);
    const last = o.results[o.results.length - 1];
    ok(!last.if && last.chance === undefined, 'endgame "' + o.label + '": last result must be unconditional');
    for (const r of o.results) {
      if (r.effects) for (const k of Object.keys(r.effects))
        ok(STAT_KEYS.includes(k) || k === 'rivals', 'endgame "' + o.label + '": unknown effect key ' + k);
      if (r.gameOver) ok(ENDINGS_MAP[r.gameOver], 'endgame "' + o.label + '": missing ending ' + r.gameOver);
    }
  }
});

if (REPORTS_ARR) t('REPORTS: 3 entries, afterTurn 4/8/12, events(state) is non-empty strings', () => {
  eq(REPORTS_ARR.length, 3, 'expected 3 yearly reports');
  eq(REPORTS_ARR.map(r => r.afterTurn), [4, 8, 12]);
  const st = E.createRun(SETUP, 1, { scenarios: [] });
  for (const r of REPORTS_ARR) {
    ok(r.year, r.afterTurn + ': needs a year');
    ok(Array.isArray(r.stats) && r.stats.length > 0, r.year + ': needs stats');
    const lines = r.events(st);
    ok(Array.isArray(lines) && lines.length > 0, r.year + ': events(state) must be non-empty');
    for (const line of lines) ok(typeof line === 'string' && line.length > 0, r.year + ': event line must be a string');
  }
});

t('beginTurn: endgame wins over a hot tripwire at turn 16', () => {
  const tw = { id: 'tw-always', era: 0, trigger: { trust: { below: 100 } }, title: 'T', text: '',
    options: [{ label: 'x', results: [{ text: 'x', effects: {} }] }] };
  const endgame = { id: 'endgame', title: 'Choose a Path', text: '', options: [] };
  const s = E.createRun(SETUP, 9, { scenarios: [] });
  s.turn = 15; s.rng = () => 0.99;
  const content = { scenarios: [], tripwires: [tw], headlines: [], endgame };
  const card = E.beginTurn(s, content);
  eq(s.turn, 16);
  ok(card === endgame, 'endgame card returned, tripwire did not preempt it');
});

t('beginTurn: turn 16 with no content.endgame is null-safe', () => {
  const s = E.createRun(SETUP, 9, { scenarios: [] });
  s.turn = 15; s.rng = () => 0.99;
  const content = { scenarios: [], tripwires: [], headlines: [] };
  eq(E.beginTurn(s, content), null, 'no endgame content -> null, no crash');
});

if (CONTENT && ENDINGS_MAP) t('150 random full runs all terminate in known endings', () => {
  const SETS = (typeof SETUPS !== 'undefined') ? SETUPS : require('./scenarios.js').SETUPS;
  const content = { scenarios: CONTENT.SCENARIOS, tripwires: CONTENT.TRIPWIRES,
                    headlines: CONTENT.HEADLINES, endgame: CONTENT.ENDGAME };
  const tally = {};
  for (const setup of SETS) for (let seed = 1; seed <= 50; seed++) {
    const st = E.createRun(setup, seed, content);
    let guard = 0;
    while (!E.isOver(st) && guard++ < 20) {
      const card = E.beginTurn(st, content);
      if (!card) break;
      if (!card.options) { E.resolveOption(st, card); continue; } // event card: no options, walk its own results
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

  const TOTAL = 150; // 3 setups * 50 seeds
  const DEATH_IDS = new Set(['bankrupt','riots','ousted','shutdown','corruption',
    'espionage-scandal','incident','coverup-collapse']);
  let deaths = 0, trueWins = 0;
  const planEndingsSeen = new Set();
  for (const [id, count] of Object.entries(tally)) {
    ok(count / TOTAL <= 0.5, 'no single ending should exceed 50% of runs: ' + id + ' = ' + count);
    if (DEATH_IDS.has(id)) deaths += count;
    if (id === 'plan-d-needle' || id === 'plan-a-nick-of-time') trueWins += count;
    if (id.indexOf('plan-') === 0) planEndingsSeen.add(id);
  }
  const deathPct = deaths / TOTAL, winPct = trueWins / TOTAL;
  ok(deathPct >= 0.20 && deathPct <= 0.45, 'deaths should be 20-45% of runs, got ' + (deathPct * 100).toFixed(1) + '%');
  ok(winPct >= 0.01 && winPct <= 0.08, 'true wins (plan-d-needle + plan-a-nick-of-time) should be 1-8%, got ' + (winPct * 100).toFixed(1) + '%');
  ok(planEndingsSeen.size >= 4, 'expected at least 4 distinct plan endings, got ' + planEndingsSeen.size + ': ' + [...planEndingsSeen].join(','));
});

console.log(pass + ' passed, ' + fail + ' failed');
if (typeof process !== 'undefined' && fail) process.exit(1);
