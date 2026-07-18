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

console.log(pass + ' passed, ' + fail + ' failed');
if (typeof process !== 'undefined' && fail) process.exit(1);
