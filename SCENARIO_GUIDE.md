# How to Write a Card

Copy the template block from `scenarios.js`, fill it in, append it to `SCENARIOS`. That's it.

## The stats you can touch (`effects`)

| Key | Range | What it is |
|---|---|---|
| `money` | 0–10 | Runway. Burns 1/turn automatically. **0 = bankrupt, run over.** |
| `compute` | 0–10 | GPUs. Gates aggressive options. |
| `trust` | 0–10 | Public trust. **0 triggers riots.** |
| `political` | 0–10 | Political capital. |
| `human` | 0–10 | Talent / staff loyalty. |
| `data` | 0–10 | Training data edge. |
| `perceivedAlignment` | 0–10 | What the world believes. Shown to player. |
| `trueAlignment` | 0–10 | The truth. HIDDEN until the ending. |
| `perceivedCapability` | 0–20 | What the world believes. Shown to player. |
| `trueCapability` | 0–20 | The truth. HIDDEN. Must beat rivals to win the race. |
| `rivals` | — | Delta applied to BOTH rival labs' hidden capability. |

## Rules of thumb

1. **Every option costs something.** If a choice is free, it's not a choice. Magnitudes: ±1 small, ±2 real, ±3 huge.
2. **The corner-cut pattern is the game:** perceived goes up, true goes down. Use it often.
3. **Last result must be unconditional** — no `if`, no `chance`. The engine falls through to it.
4. **`if` conditions** can reference ANY stat (including hidden ones — great for "this blows up only if you've been cutting corners"). Syntax: `{ trueAlignment: { below: 3 } }` or `{ compute: { atLeast: 6 } }`. Also available: `rivalMax` (highest rival capability).
5. **`chance`** is 0–1 and rolls only after `if` passes. Order results most-specific first.
6. **`requires` gates** show up as locked-but-visible buttons — visible stats only (`money`, `compute`, `trust`, `political`, `human`, `data`). Never gate on hidden stats.
7. **`gameOver: 'ending-id'`** ends the run instantly. Add your ending to `endings.js` (`'ending-id': { title, text }`).
8. **Tone:** darkly satirical, grounded, second person, present tense. Cast: Mario (you), Pam (OpenAI-alike), Lonnie (X-AI-alike), Helen (safety), Ronald Pumps (gov), Frances (CSO).
9. **Eras:** 1 = 2026, 2 = 2027, 3 = 2028, 4 = 2029. Each era is a full year (4 quarterly turns). Stakes should escalate with era.
10. **Event cards:** omit `options` and give the scenario its own `results` — the player just presses Continue. Perfect for consequences of hidden-stat decay (see `deployment-incident`). A scenario with exactly one option is a forced choice; also fine.

## Endgame & report cards

Turn 16 (Q4 2029) is reserved — `beginTurn` hands back `ENDGAME` from `scenarios.js` instead
of drawing from the deck, so never tag a regular scenario `era: 4` expecting it to land there;
write for turns 13–15 instead. `ENDGAME`'s options branch on hidden stats via the engine's
derived `perceptionGap` and `capabilityLead` keys (see `engine.js` `getStat()`) — don't add new
scenarios there, extend `ENDGAME` itself if the plan branches need to change. The yearly report
cards (after turns 4/8/12) are pure data in `reports.js`, not deck content — they don't consume
a turn and have no `SCENARIO_GUIDE` shape of their own.
