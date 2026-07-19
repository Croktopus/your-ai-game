// tests-board.js — standalone node test for the early-ASI finish (Game-of-LIFE board layer).
// Run with: node tests-board.js
// Does NOT touch tests.js (owned elsewhere). Same tiny assert-harness style as tests.js.
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

// Base setup: rates all zero so advanceTrajectories doesn't move anything on its own —
// each test pokes state.stats/state.rivals directly to the exact scenario it wants, then
// calls beginTurn once (advances by a zero rate, i.e. a no-op nudge) to exercise the real
// call path used by index.html.
const SETUP = { id: 't', name: 'T', stats: {
  money: 5, compute: 5, trust: 5, political: 5, human: 5, data: 5,
  perceivedAlignment: 5, trueAlignment: 5, perceivedCapability: 5, trueCapability: 5,
  pCapRate: 0, tCapRate: 0, pAlignRate: 0, tAlignRate: 0, rivalRate: 0 } };
const EMPTY_CONTENT = { scenarios: [], funding: [], tripwires: [], headlines: [] };

function freshState(overrides, content) {
  const st = E.createRun(SETUP, 1, content || EMPTY_CONTENT);
  Object.assign(st.stats, overrides.stats || {});
  Object.assign(st.rivals, overrides.rivals || {});
  return st;
}

t('(a) player at ASI_CAP, high alignment, small gap -> plan-d-needle', () => {
  const st = freshState({ stats: { trueCapability: 20, trueAlignment: 5, perceivedAlignment: 6 },
                           rivals: { pam: 4, lonnie: 3 } });
  eq(E.asiReached(st), 'plan-d-needle');
  const card = E.beginTurn(st, EMPTY_CONTENT);
  eq(card, null, 'no card served — the run ends early');
  eq(st.ending, 'plan-d-needle');
});

t('(b1) player at ASI_CAP, low alignment -> plan-d-yours', () => {
  const st = freshState({ stats: { trueCapability: 20, trueAlignment: 4, perceivedAlignment: 4 },
                           rivals: { pam: 4, lonnie: 3 } });
  eq(E.asiReached(st), 'plan-d-yours');
  eq(E.beginTurn(st, EMPTY_CONTENT), null);
  eq(st.ending, 'plan-d-yours');
});

t('(b2) player at ASI_CAP, aligned but big perception gap -> plan-d-yours', () => {
  const st = freshState({ stats: { trueCapability: 20, trueAlignment: 5, perceivedAlignment: 9 },
                           rivals: { pam: 4, lonnie: 3 } });
  ok((st.stats.perceivedAlignment - st.stats.trueAlignment) >= 3, 'gap is >= 3 by construction');
  eq(E.asiReached(st), 'plan-d-yours');
  eq(E.beginTurn(st, EMPTY_CONTENT), null);
  eq(st.ending, 'plan-d-yours');
});

t('(c) a rival at ASI_CAP -> plan-d-theirs even when the player is also high/aligned', () => {
  const st = freshState({ stats: { trueCapability: 20, trueAlignment: 8, perceivedAlignment: 8 },
                           rivals: { pam: 20, lonnie: 3 } });
  eq(E.asiReached(st), 'plan-d-theirs', 'rival check wins over the player branch');
  eq(E.beginTurn(st, EMPTY_CONTENT), null);
  eq(st.ending, 'plan-d-theirs');
});

t('(c2) lonnie at ASI_CAP also triggers plan-d-theirs', () => {
  const st = freshState({ stats: { trueCapability: 2, trueAlignment: 5, perceivedAlignment: 5 },
                           rivals: { pam: 4, lonnie: 20 } });
  eq(E.asiReached(st), 'plan-d-theirs');
});

t('(d) below threshold -> no early ending, normal flow (a card is served)', () => {
  // The deck is built from content.scenarios at createRun time, so the content with the
  // scenario in it has to be passed there too — beginTurn only reads state.queue.
  const content = { scenarios: [{ id: 'x', title: 'x', text: '', options: [
    { label: 'x', results: [{ text: 'x', effects: {} }] }] }],
    funding: [], tripwires: [], headlines: [] };
  const st = freshState({ stats: { trueCapability: 19.999, trueAlignment: 5, perceivedAlignment: 5 },
                           rivals: { pam: 19.999, lonnie: 3 } }, content);
  eq(E.asiReached(st), null, 'nobody has crossed the line yet');
  const card = E.beginTurn(st, content);
  ok(card, 'a normal card is served — the run continues');
  eq(st.ending, null, 'no ending set');
});

t('(e) the turn-16 endgame still fires when ASI is never reached', () => {
  const content = { scenarios: [], funding: [], tripwires: [], headlines: [],
    endgame: { id: 'endgame', title: 'Choose a Path', options: [] } };
  const st = freshState({ stats: { trueCapability: 10, trueAlignment: 5, perceivedAlignment: 5 },
                           rivals: { pam: 4, lonnie: 3 } });
  st.turn = E.TURNS - 1; // next beginTurn() lands on TURNS
  const card = E.beginTurn(st, content);
  eq(card, content.endgame, 'endgame card served at turn 16');
  eq(st.ending, null, 'ending not yet set — the player still has to choose a plan');
});

t('rivalRate=0/tCapRate=0 keeps beginTurn a true no-op on the trajectories (sanity check)', () => {
  const st = freshState({ stats: { trueCapability: 5 }, rivals: { pam: 4, lonnie: 3 } });
  const snap = s => JSON.stringify({
    tc: s.stats.trueCapability, pc: s.stats.perceivedCapability, r: s.rivals });
  const before = snap(st);
  E.beginTurn(st, EMPTY_CONTENT); // money still burns — that's expected, just not checked here
  eq(snap(st), before, 'capability/rivals unchanged when every rate is 0 (money burn is separate)');
});

console.log(pass + ' passed, ' + fail + ' failed');
process.exitCode = fail ? 1 : 0;
