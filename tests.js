// tests.js — run with `node tests.js` or open tests.html and inspect the console.
const E = (typeof Engine !== 'undefined') ? Engine : require('./engine.js');
let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); pass++; console.log('ok -', name); }
  catch (err) { fail++; console.error('FAIL -', name, '::', err.message); }
}
function eq(got, want, msg) {
  if (JSON.stringify(got) !== JSON.stringify(want))
    throw new Error((msg ? msg + ': ' : '') + 'got ' + JSON.stringify(got) + ' want ' + JSON.stringify(want));
}
function ok(value, msg) { if (!value) throw new Error(msg || 'expected truthy'); }

const TEST_SETUP = { id: 'test', name: 'Test', stats: {
  money: 9, compute: 5, trust: 5, political: 5, human: 5, data: 5,
  perceivedAlignment: 5, trueAlignment: 5, perceivedCapability: 5, trueCapability: 5,
} };
const card = (id, era) => ({ id, era, title: id, text: '', premiseRefs: ['a', 'b'], options: [
  { label: 'Choose.', evidenceRefs: ['a'], confidence: 'inferred', rationale: 'Test rationale for the option.', results: [{ text: 'Done.', effects: { trust: 1 } }] },
] });
const emptyContent = { scenarios: [], tripwires: [], headlines: [] };
const state = () => E.createRun(TEST_SETUP, 1, { scenarios: [] });

t('rng is deterministic and seed-sensitive', () => {
  const a = E.mulberry32(42), b = E.mulberry32(42);
  eq([a(), a(), a()], [b(), b(), b()]);
  ok(E.mulberry32(42)() !== E.mulberry32(43)());
});

t('sixteen turns map pairwise onto eight eras', () => {
  eq(Array.from({ length: 16 }, (_, i) => E.eraForTurn(i + 1)),
    [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8]);
  eq(E.TURNS, 16); eq(E.ERAS, 8);
});

t('queue is era-ordered and seed-shuffled within each era', () => {
  const input = [card('d', 2), card('a', 1), card('e', 3), card('b', 1), card('c', 2)];
  const q1 = E.buildQueue(input, E.mulberry32(7));
  const q2 = E.buildQueue(input, E.mulberry32(7));
  eq(q1.map(x => x.id), q2.map(x => x.id));
  eq(q1.map(x => x.era), [1,1,2,2,3]);
});

t('createRun copies stats and initializes flags', () => {
  const s = state(); s.stats.money = 0; s.flags.test = true;
  eq(TEST_SETUP.stats.money, 9);
  eq(s.turn, 0); eq(s.rivals, { pam: 4, lonnie: 3 });
  eq(s.flags, { test: true }); eq(s.ending, null);
});

t('conditions support stats, rivalMax, and combined bounds', () => {
  const s = state();
  ok(E.checkCondition(undefined, s));
  ok(E.checkCondition({ trust: { below: 6 } }, s));
  ok(!E.checkCondition({ trust: { below: 5 } }, s));
  ok(E.checkCondition({ trust: { atLeast: 5 } }, s));
  ok(E.checkCondition({ rivalMax: { atLeast: 4 } }, s));
  ok(!E.checkCondition({ trust: { atLeast: 5, below: 5 } }, s));
});

t('flag predicates support exact and one-of matching', () => {
  const s = state(); s.flags.youthPolicy = 'paused';
  ok(E.checkFlags(undefined, s));
  ok(E.checkFlags({ youthPolicy: 'paused' }, s));
  ok(E.checkFlags({ youthPolicy: ['paused', 'safeguarded'] }, s));
  ok(!E.checkFlags({ youthPolicy: 'dismissed' }, s));
  E.applyFlags(s, { youthPolicy: 'controls', another: true });
  eq(s.flags, { youthPolicy: 'controls', another: true });
});

t('requires uses at-least semantics', () => {
  const s = state();
  ok(E.meetsRequires(undefined, s));
  ok(E.meetsRequires({ political: 5 }, s));
  ok(!E.meetsRequires({ political: 6 }, s));
});

t('effects clamp stats and apply rival deltas', () => {
  const s = state();
  E.applyEffects(s, { money: -99, trueCapability: 99, rivals: -2 });
  eq(s.stats.money, 0); eq(s.stats.trueCapability, 20);
  eq(s.rivals, { pam: 2, lonnie: 1 });
  E.applyEffects(s, { rivals: -99 });
  eq(s.rivals, { pam: 0, lonnie: 0 });
  E.applyEffects(s, undefined);
});

t('option resolution handles conditions, flags, chance, defaults, and setFlags', () => {
  const option = { label: 'Choose.', setFlags: { youthPolicy: 'safeguarded' }, results: [
    { ifFlags: { prior: 'yes' }, chance: 0.5, text: 'flag branch', effects: { trust: 2 } },
    { if: { trust: { below: 3 } }, chance: 0.5, text: 'stat branch', effects: { trust: -2 }, gameOver: 'dead' },
    { text: 'default', effects: { trueAlignment: -1 }, setFlags: { resolved: true } },
  ] };
  const a = state(); a.flags.prior = 'yes'; a.rng = () => 0.01;
  eq(E.resolveOption(a, option).text, 'flag branch'); eq(a.stats.trust, 7); eq(a.flags.youthPolicy, 'safeguarded');
  const b = state(); b.stats.trust = 2; b.rng = () => 0.01;
  eq(E.resolveOption(b, option).text, 'stat branch'); eq(b.ending, 'dead');
  const c = state(); c.rng = () => 0.99;
  eq(E.resolveOption(c, option).text, 'default'); eq(c.stats.trueAlignment, 4); ok(c.flags.resolved);
});

t('optionless event cards resolve their own result table', () => {
  const event = { results: [
    { if: { trueAlignment: { below: 3 } }, chance: 0.5, text: 'boom', effects: {}, gameOver: 'dead' },
    { text: 'contained', effects: { trust: 1 } },
  ] };
  const a = state(); a.stats.trueAlignment = 2; a.rng = () => 0.01;
  eq(E.resolveOption(a, event).text, 'boom'); eq(a.ending, 'dead');
  const b = state(); b.rng = () => 0.99;
  eq(E.resolveOption(b, event).text, 'contained'); eq(b.stats.trust, 6);
});

t('an option that exhausts runway ends the run immediately', () => {
  const s = state(); s.stats.money = 1;
  E.resolveOption(s, { results: [{ text: 'Spent.', effects: { money: -1, trust: 1 } }] });
  eq(s.stats.money, 0); eq(s.ending, 'bankrupt'); ok(E.isOver(s));
});

t('economic burn and rival growth happen exactly eight times', () => {
  const scenarios = [];
  for (let era = 1; era <= 8; era++) scenarios.push(card('a' + era, era), card('b' + era, era));
  const s = E.createRun(TEST_SETUP, 9, { scenarios });
  s.rng = () => 0.99;
  const money = s.stats.money;
  for (let turn = 1; turn <= 16; turn++) {
    const drawn = E.beginTurn(s, emptyContent);
    ok(drawn, 'null draw on turn ' + turn);
    eq(drawn.era, E.eraForTurn(turn), 'wrong era on turn ' + turn);
  }
  eq(s.stats.money, money - 8);
  eq(s.rivals, { pam: 12, lonnie: 11 });
});

t('bankruptcy is checked after an era tick and before a draw', () => {
  const s = E.createRun(TEST_SETUP, 1, { scenarios: [card('a', 1)] });
  s.stats.money = 1; s.rng = () => 0.99;
  eq(E.beginTurn(s, emptyContent), null); eq(s.ending, 'bankrupt');
});

t('draws never fall back to expired or future eras', () => {
  const s = E.createRun(TEST_SETUP, 1, { scenarios: [] });
  s.rng = () => 0.99; s.turn = 6;
  s.queue = [card('old', 1), card('now', 4), card('future', 8)];
  eq(E.beginTurn(s, emptyContent).id, 'now');
  eq(s.queue.map(x => x.id), ['old', 'future']);
  s.turn = 8; // next call is era 5, which is absent
  eq(E.beginTurn(s, emptyContent), null);
  eq(s.queue.map(x => x.id), ['old', 'future']);
});

t('tripwire interrupts once, consumes the turn, and leaves a valid next draw', () => {
  const tw = { id: 'tw', trigger: { trust: { below: 1 } }, title: 'Crisis', text: '', options: [
    { label: 'Respond.', results: [{ text: 'Done.', effects: { trust: 1 } }] },
  ] };
  const s = E.createRun(TEST_SETUP, 2, { scenarios: [card('a', 1), card('b', 1)] });
  s.stats.trust = 0; s.rng = () => 0.99;
  const content = { scenarios: [], tripwires: [tw], headlines: [] };
  eq(E.beginTurn(s, content).id, 'tw'); eq(s.turn, 1); eq(s.firedTripwires, ['tw']);
  s.stats.trust = 0;
  const next = E.beginTurn(s, content);
  ok(next && next.era === 1, 'tripwire caused a null or wrong-era draw');
  eq(s.firedTripwires, ['tw']);
});

t('headline selection respects rival bands', () => {
  const s = state(); s.rng = () => 0;
  const headlines = [{ min: 0, max: 8, text: 'low' }, { min: 8, max: 99, text: 'high' }];
  eq(E.pickHeadline(s, headlines), 'low'); s.rivals.pam = 9;
  eq(E.pickHeadline(s, headlines), 'high'); eq(E.pickHeadline(s, []), '');
});

t('ending judge preserves explicit endings and the five score outcomes', () => {
  const s = state(); s.rivals = { pam: 8, lonnie: 6 };
  s.stats.trueCapability = 9; s.stats.trueAlignment = 6; s.stats.perceivedAlignment = 7;
  eq(E.judgeEnding(s), 'needle');
  s.stats.trueAlignment = 3; s.stats.perceivedAlignment = 7; eq(E.judgeEnding(s), 'self-deception');
  s.stats.perceivedAlignment = 4; eq(E.judgeEnding(s), 'eyes-open');
  s.stats.trueCapability = 7; s.stats.trueAlignment = 6; eq(E.judgeEnding(s), 'righteous-loser');
  s.stats.trueAlignment = 2; eq(E.judgeEnding(s), 'race-to-bottom');
  s.ending = 'ousted'; eq(E.judgeEnding(s), 'ousted');
  s.ending = null; s.turn = E.TURNS; ok(E.isOver(s));
});

let CONTENT = null;
try { CONTENT = (typeof SCENARIOS !== 'undefined') ? { EVIDENCE_SOURCES, SETUPS, SCENARIOS, TRIPWIRES, HEADLINES } : require('./scenarios.js'); } catch (err) {}
let ENDING_CONTENT = null;
try { ENDING_CONTENT = (typeof ENDINGS !== 'undefined') ? { ENDINGS, MODEL_GOVERNANCE_EPILOGUE } : require('./endings.js'); } catch (err) {}

const STAT_KEYS = ['money','compute','trust','political','human','data',
  'perceivedAlignment','trueAlignment','perceivedCapability','trueCapability'];
const VISIBLE_KEYS = ['money','compute','trust','political','human','data'];
const SHOWN_KEYS = VISIBLE_KEYS.concat(['perceivedAlignment', 'perceivedCapability']);
const CONFIDENCE = ['observed', 'inferred', 'speculative'];
const ODDS = [0.25, 0.35, 0.5];

if (CONTENT && ENDING_CONTENT) t('content totals are exactly 31 choices, one event, and four tripwires', () => {
  eq(CONTENT.SCENARIOS.filter(x => x.options).length, 31);
  eq(CONTENT.SCENARIOS.filter(x => !x.options).length, 1);
  eq(CONTENT.TRIPWIRES.length, 4);
  eq(CONTENT.SCENARIOS.length, 32);
});

if (CONTENT && ENDING_CONTENT) t('board coup placement and per-era inventory are fixed', () => {
  const counts = Array.from({ length: 8 }, (_, i) => CONTENT.SCENARIOS.filter(x => x.era === i + 1).length);
  eq(counts, [5,6,6,4,3,3,2,3]);
  eq(CONTENT.SCENARIOS.find(x => x.id === 'board-coup').era, 5);
  eq(CONTENT.SCENARIOS.find(x => x.id === 'deployment-incident').era, 8);
});

if (CONTENT && ENDING_CONTENT) t('tripwire priority is riots, caps, military, guardrails', () => {
  eq(CONTENT.TRIPWIRES.map(x => x.id), ['tw-riots', 'tw-compute-caps', 'tw-military', 'tw-guardrails']);
  const s = E.createRun(CONTENT.SETUPS[0], 3, { scenarios: [card('a', 1), card('b', 1)] });
  s.stats.money = 9; s.stats.trust = 0; s.stats.political = 0;
  s.stats.perceivedAlignment = 2; s.stats.perceivedCapability = 12; s.rng = () => 0.99;
  const content = { scenarios: [], tripwires: CONTENT.TRIPWIRES, headlines: [] };
  eq(E.beginTurn(s, content).id, 'tw-riots');
});

function validateEvidence(note, context, sourceMap, minRefs) {
  ok(note, context + ': missing evidence metadata');
  const refs = note.premiseRefs || note.evidenceRefs;
  ok(Array.isArray(refs) && refs.length >= minRefs, context + ': needs ' + minRefs + '+ evidence refs');
  for (const ref of refs) ok(sourceMap[ref], context + ': unresolved source ' + ref);
  if (note.evidenceRefs) {
    ok(CONFIDENCE.includes(note.confidence), context + ': invalid confidence ' + note.confidence);
    ok(typeof note.rationale === 'string' && note.rationale.length >= 20, context + ': rationale too short');
  }
}

if (CONTENT && ENDING_CONTENT) t('all evidence references resolve and metadata is complete', () => {
  for (const [id, source] of Object.entries(CONTENT.EVIDENCE_SOURCES)) {
    ok(source.title && source.publisher && source.year && source.type && /^https:\/\//.test(source.url), id + ': incomplete source');
  }
  for (const scenario of [...CONTENT.SCENARIOS, ...CONTENT.TRIPWIRES]) {
    validateEvidence(scenario, scenario.id, CONTENT.EVIDENCE_SOURCES, 2);
    if (scenario.options) for (const [i, option] of scenario.options.entries())
      validateEvidence(option, scenario.id + ' option ' + i, CONTENT.EVIDENCE_SOURCES, 1);
    if (!scenario.options) for (const [i, result] of scenario.results.entries())
      validateEvidence(result, scenario.id + ' result ' + i, CONTENT.EVIDENCE_SOURCES, 1);
  }
  validateEvidence({ evidenceRefs: ENDING_CONTENT.MODEL_GOVERNANCE_EPILOGUE.evidenceRefs,
    confidence: 'speculative', rationale: 'The coda explicitly presents an unresolved governance question under uncertainty.' },
    'model governance epilogue', CONTENT.EVIDENCE_SOURCES, 2);
});

if (CONTENT && ENDING_CONTENT) t('card schema, effects, gates, odds, and endings are valid', () => {
  const all = [...CONTENT.SCENARIOS, ...CONTENT.TRIPWIRES];
  const ids = new Set();
  for (const scenario of all) {
    ok(!ids.has(scenario.id), 'duplicate id ' + scenario.id); ids.add(scenario.id);
    ok(scenario.title && typeof scenario.text === 'string', scenario.id + ': missing title/text');
    ok(scenario.trigger || (scenario.era >= 1 && scenario.era <= 8), scenario.id + ': invalid era');
    const walks = [];
    if (scenario.options) {
      if (!scenario.trigger) ok(scenario.options.length >= 3 && scenario.options.length <= 4, scenario.id + ': choice cards need 3–4 options');
      ok(scenario.options.some(x => !x.requires), scenario.id + ': no ungated option');
      for (const option of scenario.options) {
        ok(typeof option.label === 'string' && /[.!?]$/.test(option.label), scenario.id + ': choice summary is not a sentence');
        ok(Array.isArray(option.results) && option.results.length, scenario.id + ': option missing results');
        if (option.requires) for (const key of Object.keys(option.requires))
          ok(VISIBLE_KEYS.includes(key), scenario.id + ': gate uses hidden/unknown key ' + key);
        walks.push(option.results);
      }
    } else {
      ok(Array.isArray(scenario.results) && scenario.results.length, scenario.id + ': event missing results');
      walks.push(scenario.results);
    }
    for (const results of walks) {
      const last = results[results.length - 1];
      ok(!last.if && !last.ifFlags && last.chance === undefined, scenario.id + ': last result must be unconditional');
      for (const result of results) {
        ok(typeof result.text === 'string' && result.text.length >= 20, scenario.id + ': consequence text too short');
        if (result.chance !== undefined) ok(ODDS.includes(result.chance), scenario.id + ': unsupported game odds ' + result.chance);
        if (result.effects) {
          ok(Object.entries(result.effects).some(([key, delta]) => SHOWN_KEYS.includes(key) && delta !== 0),
            scenario.id + ': result has no visible resource change');
          for (const [key, delta] of Object.entries(result.effects)) {
            ok(STAT_KEYS.includes(key) || key === 'rivals', scenario.id + ': unknown effect key ' + key);
            ok(Number.isInteger(delta) && Math.abs(delta) <= 4, scenario.id + ': invalid delta ' + key + '=' + delta);
          }
        }
        if (result.gameOver) ok(ENDING_CONTENT.ENDINGS[result.gameOver], scenario.id + ': missing ending ' + result.gameOver);
      }
    }
  }
});

if (CONTENT && ENDING_CONTENT) t('youth policy flags materially change later crisis outcomes', () => {
  const warning = CONTENT.SCENARIOS.find(x => x.id === 'youth-warning');
  const crisis = CONTENT.SCENARIOS.find(x => x.id === 'child-safety-crisis');
  const settle = crisis.options[0];
  const dismissed = state(); dismissed.rng = () => 0.99;
  E.resolveOption(dismissed, warning.options.find(x => x.setFlags.youthPolicy === 'dismissed'));
  const dismissedBefore = dismissed.stats.trust;
  const dismissedResult = E.resolveOption(dismissed, settle);
  const safe = state(); safe.rng = () => 0.99;
  E.resolveOption(safe, warning.options.find(x => x.setFlags.youthPolicy === 'safeguarded'));
  const safeBefore = safe.stats.trust;
  const safeResult = E.resolveOption(safe, settle);
  ok(dismissedResult.text !== safeResult.text, 'same narrative despite different youth policy');
  eq(dismissed.stats.trust - dismissedBefore, 1);
  eq(safe.stats.trust - safeBefore, 3);
});

function simulate(setup, seed) {
  const content = { scenarios: CONTENT.SCENARIOS, tripwires: CONTENT.TRIPWIRES, headlines: CONTENT.HEADLINES };
  const s = E.createRun(setup, seed, content);
  const trace = [];
  let guard = 0;
  while (!E.isOver(s) && guard++ < 24) {
    const drawn = E.beginTurn(s, content);
    ok(drawn || s.ending, 'null draw without ending on turn ' + s.turn + ' seed ' + seed);
    if (!drawn) break;
    ok(drawn.trigger || drawn.era === E.eraForTurn(s.turn), drawn.id + ': outside era on turn ' + s.turn);
    let selected = drawn;
    if (drawn.options) {
      const open = drawn.options.filter(option => E.meetsRequires(option.requires, s));
      ok(open.length, drawn.id + ': all choices gated');
      selected = open[Math.floor(s.rng() * open.length)];
    }
    const result = E.resolveOption(s, selected);
    trace.push([s.turn, drawn.id, drawn.options ? selected.label : '(event)', result.text, s.ending]);
  }
  ok(guard < 24, 'softlock at seed ' + seed);
  const ending = E.judgeEnding(s);
  ok(ENDING_CONTENT.ENDINGS[ending], 'unknown ending ' + ending);
  const deckIds = trace.filter(x => !x[1].startsWith('tw-')).map(x => x[1]);
  eq(new Set(deckIds).size, deckIds.length, 'repeated deck card at seed ' + seed);
  return { trace, ending, turn: s.turn, stats: s.stats, rivals: s.rivals, firedTripwires: s.firedTripwires };
}

if (CONTENT && ENDING_CONTENT) t('same setup and seed produce identical cards, branches, and ending', () => {
  const a = simulate(CONTENT.SETUPS[0], 74219);
  const b = simulate(CONTENT.SETUPS[0], 74219);
  eq(a, b);
});

if (CONTENT && ENDING_CONTENT) t('1,200 seeded random-play simulations terminate cleanly and stay below bankruptcy threshold', () => {
  const tally = {};
  const bySetup = {};
  for (const setup of CONTENT.SETUPS) {
    bySetup[setup.id] = { total: 0, bankrupt: 0 };
    for (let seed = 1; seed <= 400; seed++) {
      const run = simulate(setup, seed);
      tally[run.ending] = (tally[run.ending] || 0) + 1;
      bySetup[setup.id].total++;
      if (run.ending === 'bankrupt') bySetup[setup.id].bankrupt++;
    }
    const rate = bySetup[setup.id].bankrupt / bySetup[setup.id].total;
    ok(rate <= 0.60, setup.id + ': bankruptcy rate ' + (rate * 100).toFixed(1) + '%');
  }
  console.log('  ending distribution:', JSON.stringify(tally));
  console.log('  bankruptcy by setup:', JSON.stringify(bySetup));
});

console.log(pass + ' passed, ' + fail + ' failed');
if (typeof process !== 'undefined' && fail) process.exit(1);
