# World Bible — based on AI 2040 (ai-2040.com, AI Futures Project)

Source: "AI 2040: Plan A — The Deal" (read in full 2026-07-18). The game's world follows
the document's **default trajectory (Plan D, the race)** unless player choices bend it.
The doc's own framing: without intervention, full AI R&D automation hits in 2030 and
superintelligence by early 2031; 2029 is the year leadership picks a path. Perfect spine
for a game that spans early 2026 → late 2029.

This is an **inspiration document**, not part of the evidence dossier. AI 2040 is a
scenario forecast with positions and assumptions of its own; it must not be cited as
empirical support for a card effect.

## Year-by-year world state (report-card data)

The PDF prints per-year stat boxes; use these directly on the yearly report card:

| Year | Employment | Median income | Alignment researchers | Total slowdown | Human labor | Reliable AI agents |
|------|-----------|---------------|----------------------|----------------|-------------|--------------------|
| 2026 (synthesized from doc refs) | ~63% | $46K | ~1.0K | 0 mo | 3.5B | ~10M @ ×90 speed |
| 2027 | 62% | $47K | 1.2K | 0 mo | 3.5B | 28M @ up to ×114 |
| 2028 | 62% | $49K | 1.4K | 0 mo | 3.5B | 23M @ up to ×131 |
| 2029 | 62% | $50K | 1.7K | 0 mo | 3.4B | 29M @ up to ×150 |

("Total slowdown" = months of accumulated safety slowdown vs. the racing default — a
natural line for the player to move: safety-forward play could show 1–3 mo by 2029.)

### 2026 — the water's edge (game start; doc treats this as "now")
- AI industry capex ~$0.8T/yr; software engineering already disrupted; agents can in
  principle do anything a computer worker can, but most output is slop.
- Frontier labs spend ~half their compute budget on AI R&D. Leading coding AIs are
  being withheld from competitors' R&D (ladder-pulling).

### 2027 — The Writing on the Wall
- America has "two workforces": 165M people + millions of ephemeral AI agents.
  ~$10B/month spent on agents. No recursive self-improvement yet, but the skeptics'
  dismissals ring hollow.
- Congress wakes up: hearings, the 2016 "prevent Demis from becoming dictator" OpenAI
  emails, the question "who will control these AIs? — probably not us."
- **AI Transparency Act of 2027** passes (omnibus; mixed quality; doesn't change the
  fundamentals). Datacenter water/power complaints, chatbot scandals, a lab caught in
  an NSA hacking story.

### 2028 — AI on the Ballot
- Election year; AI is the #1 issue. Datacenters under construction cost 2× the entire
  US military budget ($2.4T capex, 3× 2026). Biggest lab at ~$360B ARR growing 150%/yr.
- Most white-collar professions now disrupted the way SWE was in 2026; labs
  industrialize profession-by-profession automation ("let's move into law this year").
- Other nations scared and angry: a handful of US/Chinese companies on track to
  automate all white-collar work. Power concentrating in POTUS + a few CEOs.
- Experts warn the intelligence explosion is near. Both presidential candidates
  trial increasingly dramatic AI plans; the discourse spans exactly the five plans.

### 2029 — Choose a Path
- The new administration must pick. In the doc, the President chooses Plan A and
  China proves receptive (they fear US-first superintelligence more than they crave
  their own). Crude first step: compute declaration + verified training pause
  (inference-only retrofits), then worldwide buy-in → "the Consortium."
- Default (no deal): full AI R&D automation 2030 → ASI early 2031.

### Takeoff milestones under Plan D (racing curve, for capability flavor)
Automated coder (early 2030, ×5 R&D speedup) → superhuman AI researcher (mid-2030,
×25) → top-expert-dominating AI (late 2030, ×250) → superintelligent AI researcher
(late 2030, ×2000) → **ASI early 2031 (×10,000)**.

## The five plans (game endings, gated by performance)

Doc positions: A > S > B ≈ C > D. All quotes paraphrased for game use.

- **Plan A — The Deal.** International verified slowdown: total research transparency,
  compute declaration, mutual inspections, mutually-assured compute destruction.
  Works "imperfectly and in the nick of time" → scale slowly in human range, pause at
  top-expert level 2035, unpause to ASI in 2040 with alignment as a real science.
  Trajectory: 2030 Consortium principles → 2032 controlled explosive growth → 2033
  citizen's dividend → 2035 pause → 2037 epistemic upheaval → 2040 unpause.
- **Plan B — Sabotage.** US-led coalition, "join us or lose"; no foreign verification of
  US datacenters; escalating cyberwar then physical sabotage of Chinese AI; national
  Project consolidating the labs under POTUS (vicious CEO power struggle behind the
  scenes). By 2031 the choice collapses to **handoff or war**. Easy to botch into
  Plan D plus a war.
- **Plan C — The Slowdown.** Domestic-only strong regulation; grudging unilateral pause
  at the cusp; no verified deal (China insists on inspections, US refuses); within
  months "China's about to overtake us" + company pressure unpauses it. Doc's verdict:
  AI 2027's Slowdown ending — plausible oligarchy even if alignment holds.
- **Plan D — The Race.** Light-touch regulation, "responsible scaling," model cards as
  transparency theater, beat China. Intelligence explosion 2030, ASI early 2031, likely
  loss of control or history's most insane concentration of power; WW3 risk climbing.
  **The game's default background trajectory.**
- **Plan S — Shutdown.** "We do not need to build god… what we need is for nobody to
  build god." Global moratorium on training AND AI research; chips tracked; existing
  models keep running (inference-only, usage doubles); valuations crash but not to
  zero; AGI research becomes taboo like human cloning; ~10× slower progress. Stable
  for years-to-decades but probably not forever.

## Current prototype mapping

- **16 decisions across eight half-year eras, early 2026 → late 2029.** Each era has
  two turns. The old quarterly/year-era sketch below was superseded so the engine,
  UI, tests, and scenario metadata share one date model.
- **No yearly report-card interstitials in this prototype.** Headlines provide the
  moving-world texture without consuming an additional turn.
- **No forced five-plan final card.** The run ends after turn 16 and is judged by
  true capability versus rivals, true alignment, and the perception gap. Treaty,
  nationalization, slowdown, compute-allocation, and deceptive-evaluation decisions
  appear as seeded cards instead.
- **The late-game incident is optionless** and branches on hidden alignment. A separate
  model-governance coda asks a non-scoring question after scored survival endings.
- Immediate endings are limited to bankruptcy, loss of control, removal as CEO, or an
  actual catastrophic branch.

The five AI 2040 plans remain useful inspiration for a longer campaign or post-2029
expansion. They are not current prototype gates or endings.
