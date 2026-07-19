# Board-of-LIFE report

## Note on the spec doc
`docs/design/board-life-framing.md` does not exist anywhere in this repo's history
(checked `git log --all`), even after merging my stale worktree branch forward onto
the latest `proto` tip (my worktree was 5 commits behind proto when I started — I
merged `proto` into the worktree branch first, commit `317dc3c`, so engine.js/index.html
etc. all reflect the current rate-model work). I built off `docs/design/capability-alignment-rate-model.md`
plus the detailed mechanic spec in my own task instructions, which fully pinned down the
early-ASI rule (thresholds, priority order, which endings to reuse). If that framing doc
lands later and says something materially different about the board, it'll need a look.

## Build 1 — engine.js: early-ASI finish
`ASI_CAP = 20` (top of the existing capability clamp — CLAMPS.trueCapability/perceivedCapability
are already `[0,20]`, so this is literally the top of the track, no new range introduced).
Added `asiReached(state)`: checks rivals first (`plan-d-theirs` if any rival >= ASI_CAP, this
wins even if the player is also >= ASI_CAP), else if player `trueCapability >= ASI_CAP` routes
by the same alignment test as judgeEnding's beat-branch → `plan-d-needle` (aligned, gap < 3) or
`plan-d-yours` (otherwise). Wired into `beginTurn` right after the bankruptcy check and before
the turn-16 endgame check — returns `null` (no card) and sets `state.ending`, same pattern as
bankruptcy. Consumes no rng. Exported `ASI_CAP` and `asiReached` from the module.

## Build 2 — index.html board
Added `#board`: a 3-lane horizontal track (YOU / PAM / LONNIE) below the ticker, above the
card zone, inside `#game-screen` (so it's naturally hidden on setup/ending screens, untouched
by existing HUD/card/overlay markup). Player token = `perceivedCapability/ASI_CAP`, rival
tokens = their true capability/ASI_CAP (rivals have no perception layer, per spec). Player =
accent blue, Pam = bad red, Lonnie = a lighter red-orange — same family as the existing red
Competitor Capability bar. Year ticks at 0/25/50/75% labeled 2026-2029, dashed gold "ASI
FINISH" line at 100%. One-line fork-flavor caption under the track (capabilities spur vs
safety road), non-functional. Re-render hooked into the single `renderHUD()` function (added
`renderBoard()` call at its end) so every existing call site (turn start, post-choice) picks
it up automatically — no new call sites needed. Verified visually in a browser (local static
server against the worktree, screenshots): tokens render at correct positions and animate on
turn advance; existing HUD/card/overlay/report/ending flows all unaffected.

## Build 3 — tests-board.js
`node tests-board.js` → **8 passed, 0 failed**. Covers: (a) player at cap + high alignment/small
gap → plan-d-needle; (b1/b2) player at cap with low alignment or large gap → plan-d-yours;
(c/c2) either rival at cap → plan-d-theirs, even over a simultaneously-qualifying player; (d)
below threshold → no early ending, normal card served; (e) turn-16 endgame still fires when
ASI is never reached; plus a rate-zero no-op sanity check on `beginTurn`.

## Balance note (existing sim, unretouched)
`node tests.js`: 34 passed, 1 failed — same failure category as expected. Ending distribution
over the existing 150-run sim (3 setups × 50 seeds):
```
plan-d-yours: 60, plan-d-theirs: 26, plan-d-needle: 22, shut-it-down: 16,
bioweapon-extinction: 8, bankrupt: 6, signed-the-treaty: 7, summit-leak: 4, nationalized: 1
```
The `deaths should be 20-45%` assertion now fails at 12.7% — early-ASI finishes (108/150 runs,
72%) are cutting runs short before death tripwires/endgame can fire, exactly the shift the task
predicted. `rivalRate` defaults (~1.5/turn, rivals start at pam=4/lonnie=3) mean a rival often
crosses cap 20 around turn ~11, well before the old turn-16 endgame — this is a content/rebalance
question for the later pass, not something I adjusted ASI_CAP or engine constants to chase. No
other test regressed; the failure is purely the pre-existing balance-target assertion.

## Files touched
- `engine.js` — `ASI_CAP`, `asiReached()`, one new check in `beginTurn`, updated exports.
- `index.html` — additive `#board` CSS block, additive `#board` markup in `#game-screen`,
  additive `renderBoard()` function + one-line hook at the end of `renderHUD()`.
- `tests-board.js` — new file.
- `BOARD-REPORT.md` — this file.
- Also: merged `proto` into the worktree branch (fast-forward content merge, no conflicts) to
  pick up 5 commits (`146dc30`..`7cd42e2`) my worktree was missing at start — see merge commit
  below.

## Merge-risk notes
- `engine.js`: only touched `beginTurn` (inserted 3 lines) and added new top-level consts/fn +
  export list — no existing logic lines changed. Low collision risk unless someone else is also
  editing `beginTurn`'s ordering.
- `index.html`: only touched `<style>` (new rules, all `#board`-scoped) and added new markup
  block + two new JS functions (`renderBoard`, the hook line in `renderHUD`) — nothing existing
  was restructured. Low collision risk unless someone else is also editing `renderHUD` or the
  HUD/ticker markup region.
- Did not touch scenarios.js, tests.js, endings.js, docs/, or SCENARIO_GUIDE.md.
