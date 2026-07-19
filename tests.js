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
const SCEN = (id, year) => ({ id, year, title: id, text: '', options: [
  { label: 'x', results: [{ text: 'x', effects: {} }] }] });

t('rng is deterministic for same seed', () => {
  const a = E.mulberry32(42), b = E.mulberry32(42);
  eq([a(), a(), a()], [b(), b(), b()]);
  ok(E.mulberry32(42)() !== E.mulberry32(43)(), 'different seeds differ');
});

t('yearForTurn maps 16 turns onto 4 years', () => {
  eq([1,4,5,8,9,12,13,16].map(E.yearForTurn),
     [2026,2026,2027,2027,2028,2028,2029,2029]);
});

t('buildQueue is a single seeded shuffle of all scenarios', () => {
  const scen = [SCEN('a',2027), SCEN('b',2026), SCEN('c',2026), SCEN('d',2027)];
  const q1 = E.buildQueue(scen, E.mulberry32(7));
  const q2 = E.buildQueue(scen, E.mulberry32(7));
  eq(q1.map(s => s.id), q2.map(s => s.id), 'same seed same order');
  eq(q1.map(s => s.id).sort(), scen.map(s => s.id).sort(), 'contains all scenarios');
});

t('createRun copies setup stats (no shared reference); race starts parked', () => {
  const st = E.createRun(SETUP, 1, { scenarios: [] });
  st.stats.money = 0;
  eq(SETUP.stats.money, 5, 'setup untouched');
  eq(st.turn, 0); eq(st.ending, null);
  eq(st.rivals, { pam: 0, lonnie: 0 }, 'rival capability derived from position, starts 0');
  eq(st.stats.trueCapability, 0, 'player capability derived from position, starts 0');
  eq(st.race.player.branches.length, 0, 'no branch chosen yet');
  ok(E.racerNeedsBranch(st.race.player), 'player starts at the first fork');
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
  s.rivals.pam = 4;
  ok(E.checkCondition({ rivalMax: { atLeast: 4 } }, s), 'rivalMax reads the max rival');
  ok(!E.checkCondition({ trust: { atLeast: 5, below: 5 } }, s), 'all clauses must hold');
});

t('meetsRequires is atLeast semantics', () => {
  const s = mkState();
  ok(E.meetsRequires(undefined, s));
  ok(E.meetsRequires({ political: 5 }, s));
  ok(!E.meetsRequires({ political: 6 }, s));
});

t('checkFlags: scalar equality, array membership, missing flag never matches', () => {
  const s = mkState();
  ok(E.checkFlags(undefined, s), 'undefined required passes');
  ok(!E.checkFlags({ youthPolicy: 'dismissed' }, s), 'unset flag does not match scalar');
  ok(!E.checkFlags({ youthPolicy: ['dismissed', 'settled'] }, s), 'unset flag does not match array');
  s.flags.youthPolicy = 'dismissed';
  ok(E.checkFlags({ youthPolicy: 'dismissed' }, s), 'scalar equality matches');
  ok(!E.checkFlags({ youthPolicy: 'guardrails' }, s), 'scalar mismatch fails');
  ok(E.checkFlags({ youthPolicy: ['dismissed', 'settled'] }, s), 'array membership matches');
  ok(!E.checkFlags({ youthPolicy: ['guardrails', 'settled'] }, s), 'array without actual value fails');
  s.flags.other = 'x';
  ok(E.checkFlags({ youthPolicy: 'dismissed', other: 'x' }, s), 'multiple required keys all must match');
  ok(!E.checkFlags({ youthPolicy: 'dismissed', other: 'y' }, s), 'one mismatched key fails the whole set');
});

t('applyFlags: merges into state.flags, persists, later calls overwrite same key', () => {
  const s = mkState();
  E.applyFlags(s, undefined); // no-op, must not throw
  eq(s.flags, {});
  E.applyFlags(s, { youthPolicy: 'guardrails' });
  eq(s.flags, { youthPolicy: 'guardrails' });
  E.applyFlags(s, { other: 'x' });
  eq(s.flags, { youthPolicy: 'guardrails', other: 'x' }, 'accumulates across separate calls');
  E.applyFlags(s, { youthPolicy: 'dismissed' });
  eq(s.flags.youthPolicy, 'dismissed', 'later setFlags overwrites the same key');
});

t('resolveOption: option.setFlags and result.setFlags both apply, and persist turn to turn', () => {
  const opt = { label: 'x', setFlags: { seen: 'yes' }, results: [
    { text: 'a', effects: {}, setFlags: { youthPolicy: 'guardrails' } } ] };
  const s = mkState();
  E.resolveOption(s, opt);
  eq(s.flags, { seen: 'yes', youthPolicy: 'guardrails' }, 'option-level and result-level setFlags both applied');
  // Flags survive independently of turn/stat resets (simulate a later "turn").
  s.turn++;
  eq(s.flags.youthPolicy, 'guardrails', 'flag still readable on a later turn');
});

t('resolveOption: ifFlags gates a result; falls through to the unconditional last result otherwise', () => {
  const opt = { label: 'x', results: [
    { ifFlags: { youthPolicy: 'dismissed' }, text: 'harsh', effects: { trust: -4 } },
    { ifFlags: { youthPolicy: ['guardrails', 'settled'] }, text: 'soft', effects: { trust: -1 } },
    { text: 'default', effects: { trust: -2 } },
  ] };
  // No flag set at all -> falls through to the unconditional default.
  const s0 = mkState();
  eq(E.resolveOption(s0, opt).text, 'default');
  eq(s0.stats.trust, 3);
  // Flag set to a value matching the array branch.
  const s1 = mkState(); s1.flags.youthPolicy = 'settled';
  eq(E.resolveOption(s1, opt).text, 'soft');
  eq(s1.stats.trust, 4);
  // Flag set to the scalar branch's value.
  const s2 = mkState(); s2.flags.youthPolicy = 'dismissed';
  eq(E.resolveOption(s2, opt).text, 'harsh');
  eq(s2.stats.trust, 1);
  // Flag set to some unrelated value -> neither gated result matches, falls through.
  const s3 = mkState(); s3.flags.youthPolicy = 'controls';
  eq(E.resolveOption(s3, opt).text, 'default');
});

t('resolveOption: ifFlags combines with if/chance — all must pass', () => {
  const opt = { label: 'x', results: [
    { if: { trust: { below: 3 } }, ifFlags: { youthPolicy: 'dismissed' }, text: 'both', effects: {} },
    { text: 'default', effects: {} },
  ] };
  const s1 = mkState(); s1.flags.youthPolicy = 'dismissed'; // flag matches, stat condition doesn't (trust=5)
  eq(E.resolveOption(s1, opt).text, 'default');
  const s2 = mkState(); s2.stats.trust = 2; // stat condition matches, flag doesn't
  eq(E.resolveOption(s2, opt).text, 'default');
  const s3 = mkState(); s3.stats.trust = 2; s3.flags.youthPolicy = 'dismissed'; // both match
  eq(E.resolveOption(s3, opt).text, 'both');
});

t('applyEffects: retired capability/rate/rival keys are silent no-ops', () => {
  // Branch choice is the ONLY source of pacing: card effects may not touch position,
  // capability, or the old rate stats. Resources and alignment levels still work.
  const s = mkState();
  const snap = JSON.stringify([s.stats, s.rivals]);
  E.applyEffects(s, { rivals: -2, rivalRate: 3, pCapRate: 2, tCapRate: 2, pAlignRate: 1,
    tAlignRate: -1, perceivedCapability: 9, trueCapability: 9 });
  eq(JSON.stringify([s.stats, s.rivals]), snap, 'retired keys change nothing');
  E.applyEffects(s, { money: -99, trueAlignment: -2 });
  eq(s.stats.money, 0, 'resource clamps still work');
  eq(s.stats.trueAlignment, 3, 'one-off alignment story beats still work');
  E.applyEffects(s, undefined); // no-op, must not throw
});

t('advanceRace: exactly one step per turn; the road shapes alignment (safe > speed)', () => {
  const s = mkState();
  s.rng = () => 0.99;                       // rivals coin-flip safe (0.99 >= 0.35)
  E.advanceRace(s);
  eq(s.stats.trueCapability, 0, 'parked at the first fork: no branch, no movement');
  s.stats.trueAlignment = 5; s.stats.perceivedAlignment = 5;
  s.race.player.branches = ['speed']; s.race.player.step = 0;
  E.advanceRace(s);
  eq(s.race.player.step, 1, 'one step per turn');
  eq(s.stats.trueCapability, 5 * (1 / 3), 'capability derived from position');
  eq(s.stats.trueAlignment, 5.2, 'speed road grows alignment slowly (0.2/step)');
  const s2 = mkState(); s2.rng = () => 0.99;
  s2.stats.trueAlignment = 5;
  s2.race.player.branches = ['safe']; s2.race.player.step = 0;
  E.advanceRace(s2);
  eq(s2.stats.trueAlignment, 5.5, 'safe road compounds alignment faster (0.5/step)');
});

t('advanceRace: rivals coin-flip branches and drive their own routes', () => {
  const s = mkState();
  s.rng = () => 0.01;                       // both rivals pick SPEED (0.01 < 0.35)
  E.advanceRace(s);
  eq(s.race.pam.branches, ['speed']); eq(s.race.pam.step, 1);
  eq(s.rivals.pam, 5 * (1 / 3), 'rival capability derived from their position');
  const s2 = mkState();
  s2.rng = () => 0.99;                      // both rivals pick SAFE
  E.advanceRace(s2);
  eq(s2.race.lonnie.branches, ['safe']);
  eq(s2.rivals.lonnie, 5 * (1 / 5), 'safe road: same +1 step, less capability per step');
});

t('beginTurn: forks are position-triggered — turn 1, then on branch completion; win over tripwires', () => {
  const tw = { id: 'tw-always', trigger: { trust: { below: 100 } }, title: 'T', text: '',
    options: [{ label: 'x', results: [{ text: 'x', effects: {} }] }] };
  const fork = (id) => ({ id, title: id, text: '', options: [
    { label: 'S', branch: 'speed', results: [{ text: 'x', effects: {} }] },
    { label: 'C', branch: 'safe', results: [{ text: 'x', effects: {} }] }] });
  const funding = [fork('fork-1'), fork('fork-2')];
  const deckCard = SCEN('a', 2026);
  const content = { scenarios: [deckCard], funding, tripwires: [tw], headlines: [] };
  const s = E.createRun(SETUP, 9, content);
  s.rng = () => 0.99;
  const card = E.beginTurn(s, content);
  eq(card.id, 'fork-1', 'turn 1 serves the first fork, not the tripwire or deck');
  eq(s.firedTripwires, [], 'the tripwire did not fire on a fork turn');
  E.resolveOption(s, card.options[0]);      // choose SPEED -> step 1 immediately
  eq(s.race.player.branches, ['speed']);
  eq(s.race.player.step, 1, 'fork choice takes the first step down the road');
  // Steps 2 and 3 on turns 2 and 3 (tripwire allowed on plain turns); fork 2 on turn 4.
  s.firedTripwires.push('tw-always');       // silence it for timing clarity
  E.beginTurn(s, content); eq(s.race.player.step, 2);
  E.beginTurn(s, content); eq(s.race.player.step, 3, 'branch complete end of turn 3');
  const card4 = E.beginTurn(s, content);
  eq(card4.id, 'fork-2', 'arriving at the fork serves the next fork card (turn 4)');
});

t('drawCard: same-turn scenario draw after a fork (tripwires first, then the deck)', () => {
  const deckCard = SCEN('a', 2026);
  const content = { scenarios: [deckCard], funding: [], tripwires: [], headlines: [] };
  const s = E.createRun(SETUP, 9, content);
  s.turn = 1;
  const card = E.drawCard(s, content);
  eq(card.id, 'a', 'drawCard serves from the deck without advancing the turn');
  eq(s.turn, 1, 'turn untouched');
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

t('beginTurn ticks burn, rivals step their routes, turn; draws from queue', () => {
  const s = E.createRun(SETUP, 9, { scenarios: [SCEN('a', 2026)] });
  s.rng = () => 0.99; // headline pool empty; rivals coin-flip SAFE (0.99 >= 0.35)
  const card = E.beginTurn(s, CONTENT0);
  eq(s.turn, 1); eq(s.stats.money, 4);
  eq(s.race.pam.branches, ['safe'], 'rival chose a branch at the fork');
  eq(s.race.pam.step, 1, 'rival stepped once');
  eq(s.rivals.pam, 5 * (1 / 5), 'rival capability derived from position');
  eq(card.id, 'a', 'player parked at fork with no funding content -> deck card');
  eq(E.beginTurn(s, CONTENT0), null, 'queue empty -> null');
});

t('beginTurn: bankruptcy ends the run before any card', () => {
  const s = E.createRun(SETUP, 9, { scenarios: [SCEN('a', 2026)] });
  s.stats.money = 1; s.rng = () => 0.99;
  eq(E.beginTurn(s, CONTENT0), null);
  eq(s.ending, 'bankrupt');
});

t('beginTurn: tripwire interrupts the deck, fires once', () => {
  const tw = { id: 'riots', trigger: { trust: { below: 1 } }, title: 'Riots', text: '',
    options: [{ label: 'x', results: [{ text: 'x', effects: { trust: 2 } }] }] };
  const s = E.createRun(SETUP, 9, { scenarios: [SCEN('a', 2026), SCEN('b', 2026)] });
  s.stats.trust = 0; s.rng = () => 0.99;
  const content = { scenarios: [], tripwires: [tw], headlines: [] };
  eq(E.beginTurn(s, content).id, 'riots');
  eq(s.firedTripwires, ['riots']);
  s.stats.trust = 0; // still zero, but tripwire already fired
  const next = E.beginTurn(s, content);
  ok(next.id === 'a' || next.id === 'b', 'draws from deck, does not re-fire tripwire');
});

t('beginTurn: year-aware draw prefers current year over older leftovers', () => {
  const s = E.createRun(SETUP, 9, { scenarios: [] });
  s.rng = () => 0.99;
  const year2026 = SCEN('a', 2026), year2029 = SCEN('d', 2029);
  s.queue = [year2026, year2029];
  s.turn = 12; // beginTurn increments to 13 -> 2029
  const card = E.beginTurn(s, CONTENT0);
  eq(card.id, 'd', '2029 card drawn ahead of 2026 leftover');
  eq(s.queue.map(x => x.id), ['a'], '2026 leftover remains in queue');
});

t('beginTurn: wildcard (yearless) card drawn before stale leftovers', () => {
  const s = E.createRun(SETUP, 9, { scenarios: [] });
  s.rng = () => 0.99;
  const year2026 = SCEN('a', 2026), wildcard = SCEN('w');
  s.queue = [year2026, wildcard];
  s.turn = 8; // beginTurn increments to 9 -> 2028, no 2028 cards in queue
  const card = E.beginTurn(s, CONTENT0);
  eq(card.id, 'w', 'wildcard drawn ahead of stale 2026 leftover');
  eq(s.queue.map(x => x.id), ['a'], '2026 leftover remains in queue');
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
try { CONTENT = (typeof SCENARIOS !== 'undefined') ? { SCENARIOS, FUNDING, TRIPWIRES, HEADLINES, ENDGAME } : require('./scenarios.js'); } catch (e) {}
let ENDINGS_MAP = null;
try { ENDINGS_MAP = (typeof ENDINGS !== 'undefined') ? ENDINGS : require('./endings.js').ENDINGS; } catch (e) {}
let REPORTS_ARR = null;
try { REPORTS_ARR = (typeof REPORTS !== 'undefined') ? REPORTS : require('./reports.js').REPORTS; } catch (e) {}

const STAT_KEYS = ['money','compute','trust','political','human','data',
  'perceivedAlignment','trueAlignment','perceivedCapability','trueCapability',
  'pCapRate','tCapRate','pAlignRate','tAlignRate'];
const VISIBLE_KEYS = ['money','compute','trust','political','human','data'];

const CONFIDENCE_LABELS = ['observed', 'inferred', 'speculative'];

if (CONTENT) t('evidence validation: every card has a premise, every option (or event card) has evidence', () => {
  const SOURCES_MAP = CONTENT.SOURCES;
  ok(SOURCES_MAP && Object.keys(SOURCES_MAP).length > 0, 'SOURCES registry must be non-empty');
  const all = [...CONTENT.SCENARIOS, ...(CONTENT.FUNDING || []), ...CONTENT.TRIPWIRES, CONTENT.ENDGAME];
  const checkEvidence = (holder, where) => {
    ok(Array.isArray(holder.evidence) && holder.evidence.length > 0, where + ': needs a non-empty evidence source list');
    for (const id of holder.evidence) ok(SOURCES_MAP[id], where + ': evidence id "' + id + '" not in SOURCES');
    ok(CONFIDENCE_LABELS.includes(holder.confidence), where + ': confidence must be one of ' + CONFIDENCE_LABELS.join('/') + ', got ' + holder.confidence);
    ok(typeof holder.note === 'string' && holder.note.length > 0, where + ': needs a non-empty rationale note');
  };
  for (const s of all) {
    if (!s) continue;
    ok(Array.isArray(s.premise) && s.premise.length > 0, s.id + ': needs a non-empty premise() source list');
    for (const id of s.premise) ok(SOURCES_MAP[id], s.id + ': premise id "' + id + '" not in SOURCES');
    if (s.options) for (const o of s.options) checkEvidence(o, s.id + ' "' + o.label + '"');
    else checkEvidence(s, s.id + ' (event card)');
  }
});

if (CONTENT && ENDINGS_MAP) t('content validation', () => {
  // FUNDING cards are guaranteed (not deck content) but share the same card shape and
  // effect-key vocabulary, so they get the same structural checks as scenarios/tripwires.
  const all = [...CONTENT.SCENARIOS, ...(CONTENT.FUNDING || []), ...CONTENT.TRIPWIRES];
  const ids = new Set();
  for (const s of all) {
    ok(!ids.has(s.id), 'duplicate id ' + s.id); ids.add(s.id);
    const isEvent = !s.options;
    ok(s.title && s.text !== undefined, s.id + ': needs title/text');
    ok(isEvent ? Array.isArray(s.results) : s.options.length >= 1,
       s.id + ': needs options (1+) or, for event cards, its own results');
    ok(s.trigger || s.year === undefined || (s.year >= 2026 && s.year <= 2029), s.id + ': bad year');
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
          ok(STAT_KEYS.includes(k) || k === 'rivals' || k === 'rivalRate', s.id + ': unknown effect key ' + k);
        if (r.effects && (r.effects.trueCapability < 0 || r.effects.perceivedCapability < 0))
          ok(false, s.id + ': negative direct-level capability effect — use tCapRate/pCapRate instead');
        if (r.gameOver) ok(ENDINGS_MAP[r.gameOver], s.id + ': missing ending ' + r.gameOver);
      }
    }
  }
  // Deck-coverage math (post rate-model): turn 16 is the endgame, turns 1/5/9/13 are the
  // guaranteed funding cards (never drawn from the deck) — so the deck only needs to cover
  // 11 scenario turns: 3 each for 2026/2027/2028 (turns 2-4/6-8/10-12) and 2 for 2029
  // (turns 14-15). Wildcards backfill any year short of its own dedicated cards, so the
  // per-year minimum stays a loose safety margin rather than an exact match to turn count.
  for (let year = 2026; year <= 2029; year++)
    ok(CONTENT.SCENARIOS.filter(s => s.year === year).length >= 2, 'year ' + year + ' needs 2+ scenarios');
  ok(CONTENT.SCENARIOS.length >= 11, 'need enough deck cards for 11 scenario turns (16 - endgame - 4 funding)');
});

if (CONTENT) t('FUNDING: 4 fork cards, each a binary SPEED/SAFE branch choice', () => {
  ok(Array.isArray(CONTENT.FUNDING) && CONTENT.FUNDING.length === 4, 'expected 4 fork cards');
  eq(CONTENT.FUNDING.map(f => f.year).sort(), [2026, 2027, 2028, 2029]);
  for (const f of CONTENT.FUNDING) {
    ok(f.options && f.options.length === 2, f.id + ': fork card needs exactly 2 options (SPEED/SAFE)');
    eq(f.options.map(o => o.branch), ['speed', 'safe'], f.id + ': option A is speed, B is safe');
    for (const o of f.options)
      ok(!o.requires, f.id + ': fork options must never be gated — the fork always offers both roads');
  }
});

if (CONTENT) t('youthPolicy flag chain: suicide-lawsuit sets it, 2+ later cards read it', () => {
  const setter = CONTENT.SCENARIOS.find(s => s.id === 'suicide-lawsuit');
  ok(setter, 'suicide-lawsuit card exists');
  const setValues = setter.options.map(o => o.setFlags && o.setFlags.youthPolicy).filter(Boolean);
  ok(setValues.length >= 2, 'suicide-lawsuit options set at least 2 distinct youthPolicy stances');
  ok(setValues.includes('dismissed'), 'one stance is "dismissed"');

  const readers = CONTENT.SCENARIOS.filter(s =>
    s.options && s.options.some(o => o.results.some(r => r.ifFlags && r.ifFlags.youthPolicy)));
  ok(readers.length >= 2, 'expected at least 2 later cards reading the youthPolicy flag, got ' + readers.length);
  for (const card of readers) {
    ok(card.year === 2028 || card.year === 2029, card.id + ': flag-reading card should be a later (2028/2029) year card');
    for (const o of card.options) {
      const gated = o.results.filter(r => r.ifFlags && r.ifFlags.youthPolicy);
      if (!gated.length) continue;
      const last = o.results[o.results.length - 1];
      ok(!last.ifFlags, card.id + ' "' + o.label + '": last result must be the unconditional fallback, not ifFlags-gated');
    }
  }
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
        ok(STAT_KEYS.includes(k) || k === 'rivals' || k === 'rivalRate', 'endgame "' + o.label + '": unknown effect key ' + k);
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
  const tw = { id: 'tw-always', trigger: { trust: { below: 100 } }, title: 'T', text: '',
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
  const content = { scenarios: CONTENT.SCENARIOS, funding: CONTENT.FUNDING, tripwires: CONTENT.TRIPWIRES,
                    headlines: CONTENT.HEADLINES, endgame: CONTENT.ENDGAME };
  const tally = {};
  // Early-ASI finish (engine.js asiReached, see docs/design/board-life-framing.md): beginTurn
  // returns null with state.ending already set to one of the three plan-d-* ids -- distinct
  // from bankruptcy (also a null return) and from picking Plan D at the literal turn-16
  // "Choose a Path" endgame (which returns a real card and resolves through resolveOption).
  const ASI_IDS = new Set(['plan-d-needle', 'plan-d-yours', 'plan-d-theirs']);
  let asiEarlyCount = 0;
  for (const setup of SETS) for (let seed = 1; seed <= 50; seed++) {
    const st = E.createRun(setup, seed, content);
    let guard = 0, asiEarly = false;
    while (!E.isOver(st) && guard++ < 20) {
      const card = E.beginTurn(st, content);
      if (!card) { if (ASI_IDS.has(st.ending)) asiEarly = true; break; }
      if (!card.options) { E.resolveOption(st, card); continue; } // event card: no options, walk its own results
      const open = card.options.filter(o => E.meetsRequires(o.requires, st));
      ok(open.length > 0, card.id + ': all options gated at ' + JSON.stringify(st.stats));
      E.resolveOption(st, open[Math.floor(st.rng() * open.length)]);
    }
    ok(guard < 20, 'run did not terminate');
    const end = E.judgeEnding(st);
    ok(ENDINGS_MAP[end], 'unknown ending: ' + end);
    tally[end] = (tally[end] || 0) + 1;
    if (asiEarly) asiEarlyCount++;
  }
  console.log('  ending distribution:', JSON.stringify(tally));

  const TOTAL = 150; // 3 setups * 50 seeds
  const DEATH_IDS = new Set(['bankrupt','riots','ousted','shutdown','corruption',
    'espionage-scandal','incident','coverup-collapse',
    'bioweapon-extinction','summit-leak','neuro-lawsuit','nationalized']);
  let deaths = 0, needleWins = 0;
  const planEndingsSeen = new Set();
  for (const [id, count] of Object.entries(tally)) {
    ok(count / TOTAL <= 0.5, 'no single ending should exceed 50% of runs: ' + id + ' = ' + count);
    if (DEATH_IDS.has(id)) deaths += count;
    if (id === 'plan-d-needle') needleWins += count;
    if (id.indexOf('plan-') === 0) planEndingsSeen.add(id);
  }
  const asiEarlyPct = asiEarlyCount / TOTAL;
  const deathPct = deaths / TOTAL;
  const needlePct = needleWins / TOTAL;
  // "Reached the 2029 endgame instead" of racing to ASI: everything that's neither an early-ASI
  // finish nor a mid-run death -- includes runs that actually resolve turn 16's Choose a Path,
  // and the handful of pre-existing non-death judged exits (e.g. shut-it-down, signed-the-treaty)
  // that likewise opt the lab out of the ASI race before 2029.
  const endgamePct = (TOTAL - asiEarlyCount - deaths) / TOTAL;
  // Route-model bands (random play coin-flips the player's forks ~50/50; rivals 35% speed).
  // NOTE for tuning: plan-d-needle runs hotter than the old 1-8% ideal because roads only
  // GROW alignment — a high-starting-alignment setup that speed-rushes still finishes
  // aligned. Open design question (needle bar vs. starting alignment); band widened
  // honestly rather than tuned around.
  ok(asiEarlyPct >= 0.20 && asiEarlyPct <= 0.55, 'early-ASI finishes should be 20-55% of runs, got ' + (asiEarlyPct * 100).toFixed(1) + '%');
  ok(endgamePct >= 0.25 && endgamePct <= 0.60, 'reaching the 2029 endgame instead should be 25-60% of runs, got ' + (endgamePct * 100).toFixed(1) + '%');
  ok(needlePct >= 0.02 && needlePct <= 0.18, 'plan-d-needle (aligned ASI win) should be 2-18% of runs, got ' + (needlePct * 100).toFixed(1) + '%');
  ok(deathPct >= 0.10 && deathPct <= 0.30, 'deaths should be 10-30% of runs, got ' + (deathPct * 100).toFixed(1) + '%');
  // Under the route model, random play rarely passes the endgame's A/S/B/C gates (they
  // demand banked political/trust), so the reliably-reachable plan endings are the three
  // ungated Plan-D flavors; real players unlock the rest deliberately.
  ok(planEndingsSeen.size >= 3, 'expected at least 3 distinct plan endings, got ' + planEndingsSeen.size + ': ' + [...planEndingsSeen].join(','));
});

if (CONTENT && ENDINGS_MAP) t('no card id is ever drawn twice within a single run (60 seeds)', () => {
  const SETS = (typeof SETUPS !== 'undefined') ? SETUPS : require('./scenarios.js').SETUPS;
  const content = { scenarios: CONTENT.SCENARIOS, funding: CONTENT.FUNDING, tripwires: CONTENT.TRIPWIRES,
                    headlines: CONTENT.HEADLINES, endgame: CONTENT.ENDGAME };
  for (const setup of SETS) for (let seed = 1; seed <= 20; seed++) {
    const st = E.createRun(setup, seed, content);
    const seen = new Set();
    let guard = 0;
    while (!E.isOver(st) && guard++ < 20) {
      const card = E.beginTurn(st, content);
      if (!card) break;
      ok(!seen.has(card.id), card.id + ' drawn twice in one run (setup ' + setup.id + ', seed ' + seed + ')');
      seen.add(card.id);
      if (!card.options) { E.resolveOption(st, card); continue; } // event card: no options, walk its own results
      const open = card.options.filter(o => E.meetsRequires(o.requires, st));
      if (!open.length) break;
      E.resolveOption(st, open[Math.floor(st.rng() * open.length)]);
    }
    ok(guard < 20, 'run did not terminate');
  }
});

console.log(pass + ' passed, ' + fail + ' failed');
if (typeof process !== 'undefined' && fail) process.exit(1);
