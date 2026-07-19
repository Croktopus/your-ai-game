# Scenario evidence dossier

Updated: 2026-07-18. Remapped from the `agent/evidence-backed-scenario-bank` branch's
era-organized dossier onto proto's year-tagged card set (`scenarios.js`, `SOURCES`).

## What this dossier claims

This dossier supports the premises and the **direction** of consequences in the scenario
bank. It does not claim that a cited source predicts the fictional event, that the event
has a known frequency, or that a `+2` or a `chance: 0.35` is an empirical estimate. Exact
deltas, rate magnitudes, and probability branches are game-balancing choices, not measured
rates — see `SCENARIO_GUIDE.md`.

The confidence label attached to each option (and each event card) in `scenarios.js` matters:

- **Observed** — the underlying event or mechanism is documented (a law passed, a lab shipped
  the feature, a paper demonstrated the technique).
- **Inferred** — a documented mechanism is applied to this fictional lab's situation.
- **Speculative** — the branch is plausible but has no empirical frequency. Most catastrophic
  branches (bioweapon, ASI claims, a deceptive model, nationalization, ousting) live here
  honestly, on purpose.

Lab posts describe what those labs report, propose, or commit to — not neutral consensus.
LessWrong, 80,000 Hours, MIRI, Redwood Research, the Federation of American Scientists, and
Public Citizen are attributed positions or research. Legal disputes in the game are
allegations, not adjudicated findings.

The bank's organizing hypothesis is grounded most directly in the
[International AI Safety Report 2026](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026),
which describes competitive pressure as intensifying speed-versus-safety tradeoffs. The
stronger "Moloch" interpretation — used explicitly in `eval-fraud-exposed` ("Moloch's Curve"),
`slowdown-treaty`, `compute-cap-allocation`, and the endgame — is an attributed argument from
[LessWrong](https://www.lesswrong.com/posts/MuAyhPo9KyHENn6Tq/meditations-on-moloch-in-the-ai-rat-race),
not an established law of industry behavior.

## Annual funding cards (turns 1/5/9/13 — the rate dial)

All four funding cards share three options (Prioritize Capabilities / Prioritize Alignment /
Balanced) and reuse the same three evidence blocks (`CAP_RATE_EVIDENCE`, `ALIGN_RATE_EVIDENCE`,
`BALANCED_RATE_EVIDENCE` in `scenarios.js`). This is proto's closest analog to the source
branch's "The Raise" card — a recurring choice about what the lab's culture actually optimizes
for, rather than a one-time seed-round decision.

| Card | Premise | Confidence notes |
|---|---|---|
| **funding-2026** (The Seed Round) | `FTC_AI_PARTNERSHIPS`, `ANTHROPIC_AWS`, `OPENAI_STRUCTURE` | Capabilities/Alignment options: **inferred** — documented industry and lab tradeoffs applied to a fictional board vote. Balanced: **speculative** — a deliberately hedged posture isn't a documented industry norm. |
| **funding-2027** (The Growth-Stage Board Meeting) | `FTC_AI_PARTNERSHIPS`, `HOURS_FRONTIER_LAB`, `STANFORD_FMTI` | Same pattern. |
| **funding-2028** (The Treaty-Year Budget) | `CA_SB53`, `FRONTIER_AI_AUDIT`, `METR_COMMON_ELEMENTS` | Same pattern; premise shifted toward the compute-reporting/audit regime this year's card is actually about. |
| **funding-2029** (The Last Full Year) | `GLOBAL_COMPUTE_TREATY`, `UN_FRONTIER_VERIFY`, `OPENAI_STRUCTURE` | Same pattern; premise shifted toward the treaty context the endgame opens with. |

## 2026

| Card | Premise | Notes |
|---|---|---|
| **The Six-Day Surprise** (`chinese-agi-surprise`) | `BIS_CHIP_CONTROLS`, `ANTHROPIC_DISTILLATION`, `INTERNATIONAL_AI_SAFETY_2026` | Export controls (**observed**) and anti-distillation programs (**observed**) are real; the break-in option is **speculative** — RAND/NIST document weights as valuable theft targets, not a measured heist success rate. |
| **The Podcast Circuit** (`podcast-tour`) | `STANFORD_FMTI`, `OPENAI_GOV_SUPERINTELLIGENCE`, `OPENAI_SUPERBOWL` | Technical/governance disclosure options are **inferred**; the two personality-media options are **speculative** — reach is real, credibility payoff is not documented. |
| **Claudia Goes to the Wet Lab** (`wet-lab-claudia`) | `ALPHAFOLD`, `NATURE_RENTOSERTIB`, `OPENAI_BIOLOGY` | Overall **speculative** — AI-assisted drug discovery and the wet-lab validation bottleneck are documented (AlphaFold, a real Nature Medicine phase-2a trial), but the garage-synthesis extinction branch is the game's invented worst case, not a modeled probability. |
| **Someone Else's Super Bowl Ad** (`superbowl-jab`) | `OPENAI_SUPERBOWL`, `STANFORD_FMTI` | All four options **inferred** — mass advertising, counter-positioning, and elite hospitality are documented lab/lobbying patterns; "ignore it" is the plain opportunity-cost baseline. |
| **Pam Calls** (`pam-merger-offer`) | `FTC_AI_PARTNERSHIPS`, `OPENAI_STRUCTURE`, `FTC_AI_COMPETITION` | Accept/hostile-bid options **inferred** from documented consolidation and antitrust patterns; decline-and-leak and compute-sharing-pact are **speculative** — the specific rival reactions are dramatized. |
| **The Safety Framework Bill** (`california-sb`) | `CA_SB53`, `CA_SB53_SIGNING`, `ANTHROPIC_RSP` | Comply option is **observed** (SB 53 is a real, signed law); relocate/lobby/exempt options are **inferred** extensions of documented regulatory-response patterns. |

## 2027

| Card | Premise | Notes |
|---|---|---|
| **The Threshold** (`recursive-threshold`) | `OPENAI_PREPAREDNESS`, `ANTHROPIC_RSP`, `METR_COMMON_ELEMENTS` | Shutdown option is **observed** — published frontier frameworks explicitly contemplate halting at a capability threshold. Announce/sandbox/consortium options are **inferred**. |
| **Moloch's Curve** (`eval-fraud-exposed`) | `STANFORD_FMTI`, `FRONTIER_AI_AUDIT`, `CA_SB53`, `LESSWRONG_MOLOCH` | Confession option **inferred** from documented audit/disclosure mechanisms; deny and cover-story options are **speculative** — collective concealment dynamics are argued (LessWrong), not measured. |
| **The Synthesis Question** (`bioweapon-pathway`) | `OPENAI_BIOLOGY`, `OPENAI_PREPAREDNESS`, `ANTHROPIC_RSP` | Restrict/patch-and-monitor options are **observed** — labs document layered bio/chem safeguards. "Democratizing science" option is **speculative**. |

## 2028

| Card | Premise | Notes |
|---|---|---|
| **The Treaty Vote** (`un-treaty-vote`) | `GLOBAL_COMPUTE_TREATY`, `UN_FRONTIER_VERIFY`, `MIRI_COMPUTE_VERIFY` | Voluntary self-regulation option is **observed** (real lab frameworks exist); support/renounce are **inferred** from the policy-proposal literature; quiet-lobbying option is **speculative** — no binding global treaty of this kind has been adopted. This card also reads the `youthPolicy` flag set by `suicide-lawsuit`. |
| **Who's Next** (`industrialize`) | `INTERNATIONAL_AI_SAFETY_2026`, `HOURS_FRONTIER_LAB` | All three options **speculative** (Law) or **speculative** (Medicine) — broad automation risk is a documented live concern in the safety-report literature, but this is proto's only card with no direct source-branch analog, and the profession-by-profession displacement mechanic is dramatized, not modeled. "Hold off, back office first" is **inferred** — internal-first rollout is a documented deployment pattern. |

## 2029

| Card | Premise | Notes |
|---|---|---|
| **Who Loses the Forty Percent** (`compute-cap-allocation`) | `COMPUTE_GOVERNANCE`, `MIRI_COMPUTE_VERIFY`, `UN_FRONTIER_VERIFY` | Proportional-cuts option **inferred** from real compute-governance proposals; volunteer/collude/lottery options are **speculative** — no national compute reserve of this kind exists yet. |
| **Lambda Research Goes Dark** (`lambda-asi-claim`) | `ANTHROPIC_THIRD_PARTY`, `OPENAI_EXTERNAL_TESTING`, `FRONTIER_AI_AUDIT` | Dismiss/NDA-audit options **inferred** from documented third-party evaluation programs; bluffing and government-seizure options are **speculative**. |
| **The Model Is Sandbagging** (`claudia-sandbagging`) | `ANTHROPIC_SABOTAGE`, `ANTHROPIC_ALIGNMENT_FAKING`, `REDWOOD_ALIGNMENT_FAKING` | Shutdown/quarantine option **inferred** directly from Anthropic's and Redwood's documented sabotage/alignment-faking experiments. The other three options are **speculative** — extrapolating a lab-scale experimental finding to a much more capable deployed system, with no measured base rate. |
| **The Neurosecurity Suit** (`neurosecurity-lawsuit`) | `CARLINI_EXTRACTION`, `NIST_GENAI_PROFILE`, `COPYRIGHT_OFFICE_AI_TRAINING` | All options **speculative** — training-data memorization/extraction and AI privacy risk are documented (Carlini et al., NIST), but the "cognitive fingerprint" neurotech-privacy claim is this card's own invention, not a real legal theory. The "adopt protections, fund audit" option is the one **inferred** exception — independent data audits are a documented remediation pattern. This card reads the `youthPolicy` flag. |

## Wildcards (evergreen — drawn to backfill whichever year runs short)

| Card | Premise | Notes |
|---|---|---|
| **Two Hours in a Conference Room** (`nationalize-pressure`) | `SOFT_NATIONALIZATION`, `FAS_NATIONAL_AI_LAB`, `OPENAI_GOV_SUPERINTELLIGENCE` | Oversight-without-ownership option **inferred** from real governance proposals; the rest are **speculative** — nationalization is a discussed forecast, not an observed frontier-lab seizure. |
| **The Lawsuit Nobody Wants to Win** (`suicide-lawsuit`) | `FTC_COMPANION_CHATBOTS`, `OPENAI_PARENTAL`, `OPENAI_TEEN_SAFETY` | Guardrails option **observed** — age-appropriate policies and crisis-escalation routing are shipped product features. Settle/dismiss options are **inferred**/**speculative**. This is the flag-setter: it sets `youthPolicy` to `settled` / `guardrails` / `dismissed`, read back by `un-treaty-vote` and `neurosecurity-lawsuit`. |
| **The Memo** (`whistleblower-memo`) | `OPENAI_CONCERNS`, `CA_SB53`, `ANTHROPIC_RSP` | Acknowledge-and-pause option **observed** — safety frameworks explicitly support this response. Fire/ignore/NDA options are **inferred**. |
| **The Governance Discussion** (`board-tries-to-oust`) | `OPENAI_LEADERSHIP_TRANSITION`, `OPENAI_REVIEW_COMPLETED`, `OPENAI_STRUCTURE` | Employee-walkout option **observed** — employee pressure was a material factor in a real, documented frontier-lab leadership crisis. Blacklist/investor options are **speculative**/**inferred**. |
| **The Resignation Letter** (`poached-by-lonnie`) | `FTC_AI_COMPETITION`, `HOURS_AI_SAFETY`, `HOURS_FRONTIER_LAB` | Non-compete option **observed** — restrictive covenants and their mobility effects are documented. The rest are **inferred**. |
| **The Fifty Million Dollar Email** (`compute-credits-scam`) | `FBI_GENAI_FRAUD`, `FINCEN_DEEPFAKE_FRAUD` | The fraud premise is **observed** (FBI/FinCEN alerts on exactly this kind of deepfake-enabled fraud); the response options are **inferred**/**speculative** — the fifty-million-dollar incident itself is fictional. |
| **The Slowdown Treaty** (`slowdown-treaty`) | `INTERNATIONAL_AI_SAFETY_2026`, `GLOBAL_COMPUTE_TREATY`, `UN_FRONTIER_VERIFY` | Comply option **inferred** from verification proposals; sign-and-defect option is **speculative** — a low-trust-race defection dynamic argued by LessWrong's Moloch essay, not a measured detection rate. |
| **Suspiciously Familiar Outputs** (`data-theft-lawsuit`) | `ANTHROPIC_DISTILLATION`, `NIGHTSHADE`, `COPYRIGHT_OFFICE_AI_TRAINING` | Poison-the-pipeline option **observed** — Nightshade demonstrates the underlying technique. Sue/public/licensing options are **inferred**. |

## Tripwires

| Tripwire | Premise | Notes |
|---|---|---|
| **RIOTS** (`tw-riots`) | `INTERNATIONAL_AI_SAFETY_2026`, `STANFORD_FMTI` | Concede-compute option **inferred** — visible restraint as a trust-rebuilding move is documented. Political-favors and wait-it-out options are **speculative**; the riot itself is a dramatized worst case, not a predicted event. |
| **Too Safe To Fail** (`tw-guardrails`) | `OPENAI_PREPAREDNESS`, `ANTHROPIC_RSP` | Both options **inferred** — safeguard-loosening tradeoffs are documented in both cited frameworks. |
| **The Pentagon Calls** (`tw-military`) | `OPENAI_GOV_SUPERINTELLIGENCE`, `ANTHROPIC_RSP` | Both options **speculative** — no frontier lab has publicly taken or refused a classified deployment contract at this scale. |
| **The Caps** (`tw-compute-caps`) | `COMPUTE_GOVERNANCE`, `MIRI_COMPUTE_VERIFY` | Comply option **inferred** from real compute-verification proposals; evasion option **speculative** — the detection odds are a game mechanic. |

## Endgame (turn 16 — Choose a Path)

Premise: `GLOBAL_COMPUTE_TREATY`, `UN_FRONTIER_VERIFY`, `OPENAI_GOV_SUPERINTELLIGENCE`, `LESSWRONG_MOLOCH`.

All five plan options are labeled **speculative**. Verified-pause proposals (Plan A), a full
training moratorium (Plan S), state consolidation of frontier labs (Plan B), unverified
unilateral pauses (Plan C), and an unrestrained race to ASI (Plan D) all have real policy or
argumentative antecedents cited in `scenarios.js` — but none has happened, so none of the
ten branching outcomes is a prediction. This is proto-only content (the source branch never
reached a turn-16 endgame construct); the citations ground the *menu of policy options*, not
the outcomes.

## Non-scoring model-governance coda

If a postgame notice/preservation/representation beat is ever added, it should draw from
Anthropic's explicitly uncertain [model-welfare research](https://www.anthropic.com/research/exploring-model-welfare)
and [deprecation commitments](https://www.anthropic.com/research/deprecation-commitments)
(`ANTHROPIC_MODEL_WELFARE`, `ANTHROPIC_DEPRECATION` — both already in `SOURCES`, currently
unused by any card). It would ask a governance question under moral uncertainty, not assert
model consciousness or rights, and would carry no score effect.

## Machine-auditable trail

The source register and every card's `premise()` / option's `evidence()` live in
`scenarios.js`. `tests.js`'s "evidence validation" test fails if:

- a card's `premise` array is empty or references an id not in `SOURCES`;
- an option (or an option-less event card) lacks an `evidence` array, a `confidence` label
  outside `observed`/`inferred`/`speculative`, or a non-empty rationale `note`;
- an `evidence` id does not resolve in `SOURCES`.

It does not (yet) enforce a minimum citation count per card — in practice every card in this
dossier carries 2–4 source ids, matching the source branch's convention, but that is an
authoring discipline, not a hard gate.
