# Board Framing — "Game of LIFE, but you're building god" (draft, 2026-07-18)

Aesthetic + light-mechanical reframe on top of the rate model. Confirmed with Chris:
reaching the ASI finish ENDS the run. Build AFTER the rate model lands (the board
visualizes those numbers; they must exist first).

## Core idea: the board IS the capability trajectory, made spatial
Not a new system — a picture of the rate model. Your token's position on the winding
track = your capability level. The board is a readout, not a second source of truth.

- **Track = capability progress.** Position along it = capability (likely PERCEIVED capability
  — what the world sees — with the reveal showing your token was actually further/behind).
- **Finish space = ASI.** Reaching the end = your company built superintelligence.
- **Rival tokens** (Pam, Lonnie) sit on the same track at their own capability positions —
  the red competitor bar, spatialized. You see who's ahead in the race.
- **Forks = the annual funding/priority choice.** At each fork you pick the **capabilities
  branch (a SHORTCUT — fewer spaces to ASI)** or the **safety branch (the LONG road)**.
  The Moloch dilemma becomes visible: the fast lane is shorter and right there.

## The one new mechanic: reaching ASI ends the run early
Win-condition becomes **reach ASI OR reach 2029, whichever first**:
- Capabilities-rusher hits the short track's end well before 2029 → first to ASI, but skipped
  the safety road → almost certainly misaligned → doom ending (plan-d-yours / needle if
  they somehow kept alignment up).
- Safety-focused player takes the long road, still traveling at 2029 → the Choose-a-Path /
  righteous endings fire on the timeline as they do now.
- A RIVAL reaching the finish first = you lost the race (their ending, unaligned by construction).

Engine hook: same shape as the existing turn-16 endgame trigger, but fired on a capability
threshold (bar hits ~ASI cap) instead of a turn number. Slots into the endgame system.

## What we keep / drop
- KEEP: rate model, resources, tripwires, funding forks, endgame plan choice, the reveal.
- DROP: payday/salary spaces (the board is about the race, not wealth).
- Mechanics stay mostly the same; the board adds spatial legibility + the early-ASI finish.

## Tone
Borrow LIFE's *board and life-stage frame*, NOT its wholesome no-failure luck-fest tone.
The joke is a cheerful family board game whose "retirement"/finish might be human extinction.

## Build scope (later pass, after rate model)
1. index.html: a winding-track board rendering — your token + rival tokens positioned by
   capability; annual milestones as illustrated spaces; forks drawn as road splits; finish =
   ASI. Retro/board aesthetic consistent with the pixel-icon direction.
2. engine.js: early-ASI endgame trigger (capability ≥ threshold → serve endgame / a
   built-ASI ending), alongside the existing turn-16 trigger.
3. The funding forks get board-fork visuals (short capability spur vs long safety road).
4. Tests: early-ASI trigger fires correctly; doesn't break the turn-16 path or determinism.
