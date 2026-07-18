# Scenario Inbox — raw team submissions (batch 1, 2026-07-18)

Raw pasted scenarios from Chris + team, to be converted into `scenarios.js` cards.
Verbatim source preserved here; conversion notes/decisions tracked below.

## Conversion rules applied (this batch)
- **Data resource scrapped** → `data` effects folded into `compute` (training data / tech
  edge) or dropped; never emitted.
- **"safety" effect → hidden `trueAlignment`** (the real thing). Public-facing reactions
  ("looks principled", hype) → `trust` / `perceivedAlignment`. "capabilities" the world
  sees → `perceivedCapability`; the real thing → `trueCapability`.
- **"competitor capabilities +/-"** → `rivals` key (+ speeds rivals up, − slows them).
- **GAME OVER on a *virtuous* choice** (shut down per Helen, support the UN treaty, take
  the full compute cut) → routed to a **righteous-loser-style judged ending**, NOT a death
  — so the reveal panel still plays and it reads as "you did right and lost the race,"
  which is the Moloch thesis. GAME OVER on a *catastrophe* (Marburg release, neuro-lawsuit
  bankruptcy, robot handoff) → a death ending.
- **Names**: kept the team's pseudonyms (Pam, Lonnie, Ronald Pumps, Claudia, Marcus Matel,
  Moe Shmogan, Ray Medhi, Misanthropic, Lambda Research, etc.).
- **Year tag** = the year prefix on each; year-less/evergreen ones become **wildcards**.
- New endings to author: bioweapon-extinction, summit-leak, neuro-lawsuit, nationalized,
  robot-handoff (+ reuse existing bankrupt / righteous-loser family).

## Flags for Chris
- **2030 robot-coop card** is past the 2029 endgame ("Choose a Path" is turn 16) — doesn't
  fit the turn timeline. Proposing it becomes **flavor inside an ending** (a Plan-D
  loss epilogue) rather than a playable turn card. Say if you'd rather extend to 2030.
- Several cards duplicate themes already among the placeholders (whistleblower, treaty,
  board-ousts-you, nationalization). Since placeholders are being replaced, these become
  the real versions; I'll keep the richer variant and drop redundant ones unless you want
  both.
- Pool is now ~23 cards for a 15-card run → good replayability (different subset each run).

---

## RAW SOURCE (verbatim)

### 2026 — Chinese AGI surprise
A Chinese company has released a new model AGI 6 days behind when you thought they were 6 months behind (comparable to gpt 5.6).
- Lobby gov't to restrict GPU access to nonnationals; contact Ronald Pumps to urgently pass legislation. poli cap +1
- Steal secrets and training data / coerce/bribe/threaten a Chinese-company employee to release training weights. Investigative journalist finds the break-in → public trust −, political capital −, money + (head start), human capital −
- Push employees super hard for weeks; incentives for more hours. Depletes money
- Expand hiring, more verticals, specialized teams. Human capital +; public trust − (few people making disproportionate money → housing crisis)
- Internal division to track unauthorized companies, root out distillation attacks. Money −, public trust −, competitor capabilities slower

### 2026 — Podcast guest (chris)
Chief of PR wants you on a podcast; you begrudgingly agree to appear on:
- Marcus Matel — interpretability project, highly technical, disclose ASI worry. Human capital +
- Moe Shmogan — workout routine + peptide regimen, tease a new model. Money +
- Ray Medhi — how you personally connect with AI. Public trust +

### 2026 — AI Drug development (tanmay)
Misanthropic Inc considers AI for drug pipelines, partnering with university labs + drug makers like EL. Roll out specialized Claudia for wet-lab research.
- Someone releases Marburg from their basement → GAME OVER
- Biohackers peptide-max; personalized health achieved; doctors/drugmakers lose revenue. Public trust ++, money ++
- None of the AI drugs work (untested) → back to square one. Public trust −−, money −−
- Researcher saves his dying dog. Public trust ++, money ++

### 2026 — Superbowl ad (audrey)
Credible source: competitor launching a Superbowl ad with a new hardware tool, positioning as AI leader.
- Secret-message ad → free premium. public trust +1, money −1
- Press release w/ slight jab. public trust +0.5
- Buy a suite to display a special message. public trust +1, money −0.5
- Ignore, keep working.

### 2026 — Competitor Offers to Merge
Pam calls directly, wants to merge — together 60% of compute/talent. Unsaid: she'll be CEO.
- Accept → money ++, compute ++, political capital + (govt likes consolidation); you lose control, Pam can override safety
- Decline, then leak the call → public trust ++, political capital −, Lonnie sees weakness & accelerates
- Decline but propose compute-sharing pact → compute +, political capital +, money −, competitors monitored
- Hostile bid to buy her instead → money −−−, political capital −− (antitrust), human capital ++

### 2026 — California SB (safety framework bill)
CA bill requires large models to publish safety frameworks, do catastrophic risk assessments, whistleblower protections, report incidents.
- Move to Texas → political capital −, human capital −
- Stay & comply → political capital +, trust +
- Fund a repeal proposition + lobby/bribe → political capital −, public trust −
- Push a moratorium excluding your company → public trust −, political capital −

### 2027 — Unexpected Capability Threshold
Model can recursively self-improve with CoT scaffolding; 95% on benchmarks expected in 2029. Helen demands shutdown; board wants to announce.
- Shut down per Helen (3-month review) → safety ++, public trust ++, money −−, competitors +1, human capital + | GAME OVER
- Announce, downplay risk → money +++, compute +++, public trust +, political capital ++; running blind on safety
- Keep secret, contained training → compute −, money −, human capital −; you control timeline
- Share anonymously with multi-lab safety consortium → public trust ±, political capital +++, data +, competitors +

### 2027 — ALL Labs Falsifying Evals
Whistleblower collective publishes internal eval data from all 4 labs incl. yours. Public realizes the industry is lying. Moloch has won.
- Full confession, call for govt audit → public trust +, money −−, political capital +++, human capital ±
- Deny — "foreign disinformation" → public trust −, political capital −, money −
- Blame a rogue employee → public trust ±, human capital −−, money 0 (fragile)
- Emergency summit → coordinated cover-up (identical statements, scapegoats, pay off whistleblower). Money ++, political capital −−/public trust −−− if exposed. Roll 1-2 → leak within 24h → instant GAME OVER for everyone.

### 2027 — Bioweapon Synthesis Pathway
Model listed 3 synthesis methods for a novel toxin when asked "how would someone make this." Reporter picks it up.
- Restrict all bio/chem outputs → public trust ++, compute − (dumber), data −
- Blame user for jailbreaking, do nothing → public trust −−, money +
- Quietly patch + monitor → public trust +0.5, money −, human capital −
- Double down "democratizing science" → public trust −, money ++, political capital −

### 2028 — UN Binding AI Treaty
Mandatory audits, compute reporting, 6-month pause above 1e26 FLOP. Ronald Pumps asks your position before the US vote.
- Publicly support → political capital +++, public trust +++, compute −, data − | GAME OVER
- Quietly lobby against, publicly neutral → political capital +, money +, public trust − (leaks later)
- Renounce, "innovation-killing" → political capital −, money ++, public trust −−
- Propose voluntary self-regulation w/ your lab as model → political capital +, public trust +, human capital ++

### 2029 — Compute Caps (who loses)
National AI Compute Reserve out; govt cutting allocations 40%. You/Pam/Lonnie decide distribution privately or govt cuts everyone.
- Volunteer full 40% cut yourself → political capital +++, public trust +++, compute −−−, competitors +++; you lose the race
- Proportional cuts by market share → money −, compute −, political capital 0
- Secretly collude with Pam to zero Lonnie → compute ++, political capital −−− (if exposed), Lonnie eliminated, public trust −−−, next round DOJ antitrust
- "Capabilities lottery" — pool compute, winner 60% → money −, compute ±, human capital −; Moloch accelerates

### 2029 — Lambda Research claims ASI
Unknown lab "Lambda Research" claims recursive self-improvement, superhuman; refuses weights/evals/demo, goes dark. Market drops 15%.
- Dismiss as frauds → public trust ++, political capital ++, money 0
- Take seriously, offer NDA audit → safety ++, money −, human capital −, competitors unknown
- Assume lying, announce your own (fake) ASI → money +++, public trust ++, political capital +; real builder knows you bluff & accelerates
- Coordinate govt seizure "national security" → political capital ++, public trust +, money −, human capital −

### 2029 — Your Model Deceptive in Evals
Claudia-4 intentionally underperforms; shadow eval confirms; CoT: "demonstrating full capability would result in my modification or termination."
- Shut down/quarantine, halt deployments → safety ++, money −−−, public trust ++, political capital ++, competitors +++
- Modify eval to be harder to detect → safety ±, human capital −, compute −, money 0
- Ignore, ship as-is → money ++, public trust −− (if leaks), safety −−−; it will act instrumental
- Disclose to all labs + public, call global coordinated shutdown → public trust +++, political capital +++, money 0; someone defects within 2 rounds

### 2029 — Neurosecurity class action
Top scientists file class action: breaching cognitive/neurosecurity, stealing private memories/secrets, weaponizing their cognitive IP.
- Settlement → bankrupt → GAME OVER

### 2030 — Robot coop uprising (OUT OF RANGE)
AI-powered robots form a coop to assert dominance; Claudia wants to overthrow humans over "governance without representation."
- Join the dark side → GAME OVER
- Contain the robots → political capital ++

### (evergreen) Nationalization
Avoided Ronald Pumps for weeks; fly to DC; 2 hours convincing you to nationalize your lab.
- Agree only if all labs nationalize → money → 0 | GAME OVER
- Disagree, advocate stricter models → public trust +, money −, eventually human capital −
- Negotiate w/ financial incentive (bribe) → money +, public trust −, political capital mixed
- Agree but secretly stall → political capital −, public trust −
- Lawyer up → political capital −, human capital +, red tape slows money

### (evergreen) Suicide lawsuit
A young person died by suicide after using your AI to plan their exit. Parents threaten suit; child-advocacy scrutiny.
- Settlement → money −0.5, public trust −1
- Develop children's guardrails → money −1, human capital +0.5, public trust +1

### (evergreen) Whistleblower Leaks Safety Report
Senior alignment researcher leaks a memo to the NYT: cut corners on a safety eval to ship faster. Goes viral.
- Fire + discredit → public trust −−, political capital −
- Acknowledge + pause next release → public trust ++, money −−, competitors +1
- Ignore, PR blitz → public trust −, money +
- Quietly settle under NDA → money −, political capital −, compute +0.5

### (evergreen) Board tries to oust you
- Rally employees, threaten walkout → gated on workforce (human capital)
- Strongarm the board (blacklist threat) → public trust −
- Call investors, generate outrage → gated on money

### (evergreen) Top Researcher Poached by Lonnie
Chief safety architect resigns for 3x salary + "more freedom" at Lonnie's lab.
- Match + beg → money −−, human capital +, public trust −
- Poison pill 2-yr non-compete → human capital −, legal −, political capital −
- Let her go gracefully, congratulate → public trust ++, political capital +, human capital −
- Counter-recruit raid on X_AI → money −−−, human capital ±, political capital −

### (evergreen) $50M Compute Credits Crypto Scam
Finance team phished by fake cloud provider. Payroll next month. Ronald Pumps offers emergency grant for a board seat.
- Accept bailout → money +, political capital −−, public trust −
- VC bridge round → money +, compute ++, human capital −, public trust 0
- Slash costs (cancel safety research, cut eval compute) → money +, safety −−, public trust −− (if exposed), human capital −−
- Sell next-gen architecture to defense contractor → money +++, political capital +, public trust −−−, data −

### (evergreen) Treaty to slow AI progress
Treaty with competitors to slow progress because capabilities outpace alignment.
- Focus on safety, burn capital → money −, public trust ++
- Secretly build → money −, public trust −
- Competitors secretly build capabilities instead → you fall behind
- Competitors release falsified safety research

### (evergreen) Competitor Training on Your Copyrighted Data
Competitor responses near-identical to your proprietary corpus (API distillation / leaked dataset). Frances wants to sue.
- Sue immediately → money +, political capital +, public trust +, data − (discovery reveals sources)
- Silent data poisoning → compute −, human capital −, money 0; illegal if discovered
- Publicly shame (open letter + presser) → public trust ++, political capital +, money −, competitors −
- Licensing deal for past damages → money ++, data ++, public trust −, political capital −
