# Scenario authoring guide

All game content lives in `scenarios.js`. A valid addition needs player-facing prose, balanced effects, and an auditable evidence trail.

## Prototype structure

- A run lasts 16 turns.
- Every pair of turns is one era:

| Era | Date |
|---|---|
| 1 | Early 2026 |
| 2 | Late 2026 |
| 3 | Early 2027 |
| 4 | Late 2027 |
| 5 | Early 2028 |
| 6 | Late 2028 |
| 7 | Early 2029 |
| 8 | Late 2029 |

- Each era is shuffled independently from the seed. A turn draws only from its current era; expired cards never return.
- Money burn and rival growth happen on the first turn of each era, for eight ticks total.
- A tripwire consumes the current turn, fires only once, and is checked in this fixed priority: riots, compute caps, military pressure, guardrail pressure.
- The current bank is intentionally fixed at 31 choice cards, one optionless incident, and four tripwires.

## Evidence standard

1. Add every source once to `EVIDENCE_SOURCES` with a stable ID, title, publisher, year, source type, and direct URL.
2. Give every card at least two `premiseRefs`. Prefer a primary paper, law, regulator action, court document, lab publication, or direct researcher post.
3. Give every option these direct fields:
   - `evidenceRefs`: the sources supporting the effect direction;
   - `confidence`: `observed`, `inferred`, or `speculative`;
   - `rationale`: one short causal explanation.
4. Treat LessWrong, 80,000 Hours, MIRI, lab positions, and researcher posts as arguments or proposals unless they report a directly observed event. Do not present a position as consensus.
5. Evidence supports the premise and causal direction, not the exact stat delta or game probability. Those are balancing decisions.
6. Keep real people and organizations in evidence notes and the dossier. Player-facing copy uses the fictional cast and recognizable roles.

Confidence meanings:

- `observed`: a documented event or demonstrated mechanism.
- `inferred`: a documented mechanism applied to the fictional situation.
- `speculative`: a plausible future branch without an empirical frequency claim.

## Card template

```js
{
  id: 'unique-kebab-id',
  era: 4,
  title: 'Short title',
  text: 'One or two sentences in second person, present tense.',
  ...premise('PRIMARY_SOURCE_ID', 'SECOND_SOURCE_ID'),
  options: [
    {
      label: 'Take one clear action.',
      requires: { political: 4 }, // optional; visible stats only
      setFlags: { priorDecision: 'chosen' }, // optional
      ...evidence(
        ['PRIMARY_SOURCE_ID'],
        'inferred',
        'The documented mechanism supports this direction in the fictional case.'
      ),
      results: [
        {
          if: { trust: { below: 3 } },
          ifFlags: { earlierPolicy: ['weak', 'dismissed'] },
          chance: 0.35,
          text: 'A short consequence paragraph.',
          effects: { trust: -3, political: -2 },
        },
        {
          text: 'The unconditional fallback result.',
          effects: { trust: 1, money: -1 },
        },
      ],
    },
    // Add two or three genuinely different options.
  ],
}
```

The final result in every result list must be unconditional: no `if`, `ifFlags`, or `chance`.

## Effects and balancing

| Key | Range | Meaning |
|---|---:|---|
| `money` | 0–10 | Runway. The era tick burns one. Zero ends the run. |
| `compute` | 0–10 | Available accelerator capacity. |
| `trust` | 0–10 | Public legitimacy. Below one triggers public revolt. |
| `political` | 0–10 | Government access and influence. |
| `human` | 0–10 | Talent, loyalty, and organizational capacity. |
| `data` | 0–10 | Legal, secure, useful data advantage. |
| `perceivedAlignment` | 0–10 | The public safety reputation. |
| `trueAlignment` | 0–10 | Hidden safety reality, revealed at the end. |
| `perceivedCapability` | 0–20 | The public capability estimate. |
| `trueCapability` | 0–20 | Hidden capability, compared with rival labs. |
| `rivals` | — | A delta applied to both rivals’ hidden capability. |

Use integer deltas only:

- `±1`: minor;
- `±2`: substantial;
- `±3`: severe;
- `±4`: catastrophic, reserved for catastrophic branches.

Use only `0.25`, `0.35`, or `0.5` for fictional random branches. These are game odds, not real-world estimates.

Every choice card must have three or four meaningfully different options, at least one ungated option, a one-sentence option label, a short consequence paragraph, and at least one visible non-zero resource change in every result. Gates may use only `money`, `compute`, `trust`, `political`, `human`, or `data`.

Safe decisions may cost money, capability, or race position. They do not end the game merely for being slow. Immediate endings are limited to:

- bankruptcy;
- merger or nationalization that removes player control;
- removal as CEO;
- an actual catastrophic outcome.

## Conditions and flags

Stat conditions may use any stat plus `rivalMax`:

```js
if: { trueAlignment: { below: 4 }, rivalMax: { atLeast: 12 } }
```

Flags preserve authored consequences across eras. An option writes them only when selected:

```js
setFlags: { youthPolicy: 'safeguarded' }
```

A later result can require an exact value or one of several values:

```js
ifFlags: { youthPolicy: 'dismissed' }
ifFlags: { youthPolicy: ['paused', 'safeguarded'] }
```

The child-safety arc in `scenarios.js` is the reference implementation.

## Event cards and tripwires

An optionless event omits `options` and owns its result list. The player presses Continue; hidden stats determine the outcome.

```js
{
  id: 'deployment-event',
  era: 8,
  title: 'The Event',
  text: 'The situation is already underway.',
  ...premise('SOURCE_A', 'SOURCE_B'),
  results: [
    { if: { trueAlignment: { below: 3 } }, chance: 0.5, text: '...', effects: { trust: -4 }, gameOver: 'incident', ...evidence(['SOURCE_A'], 'speculative', '...') },
    { text: '...', effects: { trust: 1 }, ...evidence(['SOURCE_B'], 'inferred', '...') },
  ],
}
```

Tripwires have `era: 0` and a `trigger`. Their array order is their priority; changing it is a gameplay change and requires a test update.

## Validation

Run:

```sh
node tests.js
```

The suite validates schema, source resolution, stat keys, deltas, odds, flags, deterministic seeds, era isolation, tripwire behavior, exact content totals, and 1,200 seeded full runs.
