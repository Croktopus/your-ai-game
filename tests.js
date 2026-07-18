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
