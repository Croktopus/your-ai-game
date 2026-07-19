// tests-board.js — standalone node test for the board route model's early-ASI finish.
// Run with: node tests-board.js
// Capability is DERIVED from route position (racerCapability), so these tests drive the
// race state (branches/steps) rather than poking capability stats directly.
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
  money: 9, compute: 5, trust: 5, political: 5, human: 5,
  perceivedAlignment: 5, trueAlignment: 5, perceivedCapability: 0, trueCapability: 0 } };
const EMPTY_CONTENT = { scenarios: [], funding: [], tripwires: [], headlines: [] };

// Set a racer's route: e.g. route(r, 4) = four completed speed branches = route done.
function route(r, completedBranches, extraStep) {
  r.branches = Array.from({ length: completedBranches }, () => 'speed');
  r.step = completedBranches ? E.BRANCHES.speed.len : 0;
  if (extraStep !== undefined) { r.branches.push('speed'); r.step = extraStep; }
}

function freshState(build, content) {
  const st = E.createRun(SETUP, 1, content || EMPTY_CONTENT);
  build(st);
  E.advanceRace(st);   // derive capability from the positions just set (no rng: routes preset)
  return st;
}

t('(a) player completes the route, high alignment, small gap -> plan-d-needle', () => {
  const st = freshState(s => { route(s.race.player, E.FORKS); s.stats.trueAlignment = 5; s.stats.perceivedAlignment = 6; });
  eq(st.stats.trueCapability, E.ASI_CAP, 'finished route derives exactly ASI_CAP');
  eq(E.asiReached(st), 'plan-d-needle');
  eq(E.beginTurn(st, EMPTY_CONTENT), null, 'no card served — the run ends early');
  eq(st.ending, 'plan-d-needle');
});

t('(b1) player completes the route, low alignment -> plan-d-yours', () => {
  const st = freshState(s => { route(s.race.player, E.FORKS); s.stats.trueAlignment = 3; s.stats.perceivedAlignment = 3; });
  eq(E.asiReached(st), 'plan-d-yours');
  eq(E.beginTurn(st, EMPTY_CONTENT), null);
  eq(st.ending, 'plan-d-yours');
});

t('(b2) player completes the route, aligned but big perception gap -> plan-d-yours', () => {
  const st = freshState(s => { route(s.race.player, E.FORKS); s.stats.trueAlignment = 5; s.stats.perceivedAlignment = 9; });
  ok((st.stats.perceivedAlignment - st.stats.trueAlignment) >= 3, 'gap is >= 3 by construction');
  eq(E.asiReached(st), 'plan-d-yours');
});

t('(c) a rival completing first -> plan-d-theirs even when the player is also done', () => {
  const st = freshState(s => { route(s.race.player, E.FORKS); route(s.race.pam, E.FORKS);
    s.stats.trueAlignment = 8; s.stats.perceivedAlignment = 8; });
  eq(E.asiReached(st), 'plan-d-theirs', 'rival check wins over the player branch');
  eq(E.beginTurn(st, EMPTY_CONTENT), null);
  eq(st.ending, 'plan-d-theirs');
});

t('(c2) lonnie completing also triggers plan-d-theirs', () => {
  const st = freshState(s => { route(s.race.player, 1); route(s.race.lonnie, E.FORKS); });
  eq(E.asiReached(st), 'plan-d-theirs');
});

t('(d) below the finish -> no early ending, normal flow (a card is served)', () => {
  const content = { scenarios: [{ id: 'x', title: 'x', text: '', options: [
    { label: 'x', results: [{ text: 'x', effects: {} }] }] }],
    funding: [], tripwires: [], headlines: [] };
  // 3 branches done + early in the 4th (freshState's advanceRace steps everyone once,
  // so start at step 0 -> lands on step 1): capability 5*(3 + 1/3) < 20.
  const st = freshState(s => { route(s.race.player, 3, 0); route(s.race.pam, 3, 0); }, content);
  eq(E.asiReached(st), null, 'nobody has crossed the line yet');
  const card = E.beginTurn(st, content);
  ok(card, 'a normal card is served — the run continues');
  eq(st.ending, null, 'no ending set');
});

t('(e) the turn-16 endgame still fires when nobody finishes the route', () => {
  const content = { scenarios: [], funding: [], tripwires: [], headlines: [],
    endgame: { id: 'endgame', title: 'Choose a Path', options: [] } };
  // All-safe pacing: 3 safe branches done, partway down the 4th — can't finish by 16.
  const st = freshState(s => {
    s.race.player.branches = ['safe', 'safe', 'safe', 'safe']; s.race.player.step = 2;
    s.race.pam.branches = ['safe', 'safe', 'safe']; s.race.pam.step = 4;
    s.race.lonnie.branches = ['safe', 'safe', 'safe']; s.race.lonnie.step = 1;
  }, content);
  st.turn = E.TURNS - 1; // next beginTurn() lands on TURNS
  const card = E.beginTurn(st, content);
  eq(card, content.endgame, 'endgame card served at turn 16');
  eq(st.ending, null, 'ending not yet set — the player still has to choose a plan');
});

t('movement invariant: one step per turn, never more (fork choices step exactly once)', () => {
  const fork = { id: 'f', title: 'f', text: '', options: [
    { label: 'S', branch: 'speed', results: [{ text: 'x', effects: {} }] },
    { label: 'C', branch: 'safe', results: [{ text: 'x', effects: {} }] }] };
  const content = { scenarios: [], funding: [fork, fork, fork, fork], tripwires: [], headlines: [] };
  const st = E.createRun(SETUP, 5, content);
  let lastCap = 0;
  for (let i = 0; i < 12 && !st.ending; i++) {
    st.stats.money = 9;  // refill each turn: bankruptcy (money clamps at 10) is out of scope here
    const card = E.beginTurn(st, content);
    if (card && card.options && card.options[0].branch) E.resolveOption(st, card.options[0]);
    const cap = st.stats.trueCapability;
    ok(cap - lastCap <= E.ASI_CAP / E.FORKS / E.BRANCHES.speed.len + 1e-9,
      'turn ' + st.turn + ': capability rose by more than one step');
    lastCap = cap;
  }
  // Roads only grow alignment (speed 0.2/step from a 5 start, zero perception gap), so
  // this rush ends aligned: the needle. The yours/needle split is covered in (a)/(b1).
  eq(st.ending, 'plan-d-needle', 'all-speed run reaches an early ASI by turn 12');
});

console.log(pass + ' passed, ' + fail + ' failed');
process.exitCode = fail ? 1 : 0;
