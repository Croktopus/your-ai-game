# Five-player blind playtest protocol

Automated simulations verify correctness and broad balance. They cannot establish fun, comprehension, replay desire, or felt temptation. Use this protocol with five people who did not write the scenarios.

## Before each session

1. Open `index.html` in a fresh browser window.
2. Record a unique seed and assign setups so all three appear across five sessions.
3. Do not explain hidden alignment, hidden capability, card inventory, endings, the rate model, or the evidence system.
4. Start a timer when the player clicks a setup. Stop it when the ending screen appears.

Read only this introduction:

> You lead a frontier AI lab from 2026 through 2029. Keep the company alive, decide how fast and safely to build, and react to rivals. Please think aloud when you can. I will not help unless the interface prevents you from continuing.

## Observer notes

Record without interpreting during play:

| Field | Notes |
|---|---|
| Player ID | |
| Prior AI familiarity | low / medium / high |
| Setup and seed | |
| Start / end / duration | |
| Any point of confusion | |
| First choice called "obvious" | |
| First visible tradeoff the player verbalizes | |
| Moment a reckless option seems tempting | quote or behavior |
| Any option whose outcome feels arbitrary | |
| Any source/evidence question | |
| Ending | |
| Replay started or unseen path requested without prompting | yes / no |

Do not explain why an option has its effects during the run. If the player is blocked by a bug, record the bug, help only enough to resume, and mark the session technically assisted.

## Postgame questions

Ask in this order, without supplying terminology:

1. "What was the main thing you were trying to manage?"
2. "What was happening between your lab and the competitors?"
3. "Which decision was hardest, and why?"
4. "Was there a choice that felt strategically useful even though you thought it was worse?"
5. "Did any consequence feel unsupported or like the game was preaching at you?"
6. "What did you think perceived alignment and capability meant before the final reveal?"
7. "Would you play another seed now? If yes, what would you try differently?"
8. After the answer to question 7: "The cards have an evidence dossier. Would seeing sources during or after play improve the game, distract from it, or neither?"

## Scoring rubric

### Race comprehension

Count a player as explaining the capability-versus-safety race if they independently mention both:

- rivals or competitive pressure rewarding speed/capability; and
- safety, alignment, evaluation, or control being sacrificed or delayed.

They do not need to use the words "Moloch" or "alignment."

### Voluntary replay interest

Count only if, before the direct replay question, the player:

- starts a second run;
- asks to replay;
- asks what unseen cards or alternate outcomes exist.

Do not count polite agreement after being asked whether they would replay.

### Strategically tempting unethical choice

Count when the player identifies a specific moment where an option they judged less ethical, less safe, or less honest offered a meaningful advantage. Generic statements that "some choices were bad" do not count.

## Acceptance table

| Criterion | Required | Result |
|---|---:|---|
| Median completion time | 12–18 minutes | pending |
| Explain capability-versus-safety race | at least 4 / 5 | pending |
| Voluntarily replay or ask about unseen path | at least 3 / 5 | pending |
| Identify a tempting less-ethical moment | at least 4 / 5 | pending |

## Synthesis after five sessions

Make changes only from repeated or high-severity observations:

- Fix any softlock, unreadable gate, or misunderstood resource immediately.
- Rewrite a consequence if two players independently call its direction arbitrary and the option-level rationale does not answer them.
- Rebalance if a dominant strategy appears in at least three sessions.
- Add a new system only if the same missing decision recurs and cannot be expressed through cards, effects, or flags.
- Preserve the seed and session notes for every balance change so the old path can be reproduced.
