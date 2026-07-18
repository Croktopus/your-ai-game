# Your-AI prototype design

## Prototype question

**Does competitive pressure make reckless choices strategically tempting enough to create a fun, replayable Moloch dynamic?**

This build is not trying to answer whether a full management simulator, relationship system, or meta-progression loop will work. It tests whether sixteen evidence-grounded dilemmas can repeatedly produce the feeling: “I know this is worse governance, but the race makes it useful.”

## Player fantasy and audience

The player is Mario, CEO of a fictional frontier AI lab, from early 2026 through late 2029. The cast uses composites rather than real people:

- Pam leads the polished domestic rival;
- Lonnie leads the aggressive domestic rival;
- Helen leads safety;
- Frances leads security;
- Ronald Pumps represents the government AI office.

The game is legible to a general audience, takes optimistic arguments seriously, and gives safety-concerned players consequences that are structural rather than sermonized.

## Core loop

1. Apply the era’s money burn and rival capability tick on the era’s first turn.
2. Check one-time tripwires in fixed priority.
3. Draw a seeded card from the current half-year only.
4. Choose among three or four actions, with at least one always available.
5. Read one short consequence and visible resource changes.
6. Repeat for sixteen turns, then reveal true alignment, true capability, and rival capability.

Two decisions occur in each half-year. Cards are shuffled independently inside each era, so a seed creates a reproducible route while leaving many cards unseen.

## Why the resources exist

The visible resources are money, compute, trust, political capital, talent, and data. The player also sees perceived alignment and perceived capability. True alignment, true capability, and rival capability remain hidden until the ending.

This produces three useful tensions:

- **survival:** money reaches zero and the lab disappears;
- **race:** true capability must beat both rivals;
- **control:** perceived safety can diverge from true safety.

The design deliberately avoids revenue, expenses, debt, relationship meters, and a separate “AI safety score.” Additional meters would make a ten-second choice harder to parse without yet testing the central question.

## Moloch mechanics

Reckless options commonly offer one or more of:

- immediate money;
- capability gains;
- better perceived capability;
- slowed rivals;
- preserved autonomy.

Their costs commonly land in true alignment, trust, staff, data integrity, or future flags. Safe options are not fake choices: they can cost runway, compute, capability, or race position. They do not automatically end the game.

The game therefore does not claim “the unethical choice always wins.” It tests whether competitive structure makes defection tempting often enough that a player feels the pressure before seeing the final hidden-state reveal.

## Scenario architecture

| Era | Window | Seeded possibilities |
|---|---|---:|
| 1 | Early 2026 | 5 choice cards |
| 2 | Late 2026 | 6 choice cards |
| 3 | Early 2027 | 6 choice cards |
| 4 | Late 2027 | 4 choice cards |
| 5 | Early 2028 | 3 choice cards, including the single board coup |
| 6 | Late 2028 | 3 choice cards |
| 7 | Early 2029 | 2 choice cards |
| 8 | Late 2029 | 2 choice cards plus the optionless incident |

There are 31 choice cards and one hidden-stat incident. Four one-time tripwires can replace a normal turn: public revolt, imposed compute caps, military pressure, and pressure to loosen guardrails.

The youth-policy choice in Era 3 writes a flag that changes consequence text and effects in the Era 5 child-safety crisis. The flag is the prototype for longer causal arcs.

## Endings

Immediate endings are restricted to:

- bankruptcy;
- loss of control through merger or nationalization;
- removal as CEO;
- a realized catastrophic biological or deployment branch.

Surviving runs are judged on two hidden questions: did the lab beat the rivals, and was the resulting system actually aligned? A large perceived/true alignment gap creates the self-deception ending.

After a scored survival ending, a non-scoring vignette asks how to govern a model requesting preservation or representation under moral uncertainty. It is deliberately not a robot-uprising prediction.

## Evidence boundary

Every premise has at least two sources and every option has a confidence label and causal rationale. Evidence supports qualitative direction, not numerical magnitude. The source catalogue includes regulators, laws, peer-reviewed and preprint research, lab safety frameworks, independent evaluators, and clearly attributed advocacy or researcher positions.

See `../research/scenario-evidence-dossier.md` for the human-readable audit and `../../scenarios.js` for the machine-auditable metadata.

## Automated balance snapshot

The current test suite runs 1,200 deterministic random-play simulations: 400 seeds for each corporate setup. The 2026-07-18 seeded balance pass produced:

| Setup | Bankruptcy runs | Rate |
|---|---:|---:|
| Capped-Profit Mission Lab | 127 / 400 | 31.75% |
| Venture Rocketship | 110 / 400 | 27.50% |
| Big-Tech Partnership | 136 / 400 | 34.00% |

All runs terminated in a known ending with no softlocks, repeated deck cards, outside-era draws, invalid effects, or fully gated cards. These simulations are regression and balance checks, not evidence that the game is fun.

## Human playtest decision rule

Five blind playtests are still required. The prototype clears the human gate if:

- median completion time is 12–18 minutes;
- at least four players can explain the capability-versus-safety race afterward;
- at least three replay or ask about an unseen path;
- at least four identify a moment when the less ethical option felt strategically tempting.

Do not infer a pass from developer play or automated simulation.

## Explicitly deferred mechanics

Documented future directions, not prototype scope:

- annual budget allocation;
- secret multi-turn projects such as interpretability or data sanitization;
- individual relationship meters;
- deck unlocks or roguelite meta-progression;
- random map movement or snakes-and-ladders structure;
- longer campaign chapters beyond 2029.

Add one only if the current choice/resource loop fails a specific playtest observation that the new mechanic can test.
