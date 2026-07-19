// scenarios.js — ALL game content lives here. See SCENARIO_GUIDE.md for how to write a card.
// Stat keys: money compute trust political human (visible, 0-10)
//            perceivedAlignment trueAlignment (0-10) perceivedCapability trueCapability (0-20)
// Rivals: effects key `rivals: -1` slows BOTH rival labs by 1 (or speeds them up if positive).
//
// Capability & alignment are TRAJECTORIES, not levels a card pokes directly (see
// docs/design/capability-alignment-rate-model.md). Five rate keys usable in `effects`:
//   pCapRate, tCapRate  — 0..3, capability only ever climbs (floored at 0)
//   pAlignRate, tAlignRate — -3..3, alignment CAN decay
//   rivalRate — 0..3, per-turn growth applied to every rival's capability
// Prefer rate deltas for ongoing effects; direct level bumps (trueCapability: +2 etc.)
// remain legal for rare one-off breakthroughs. See SCENARIO_GUIDE.md.
//
// EVIDENCE — every card carries `premise(...sourceIds)`, every option (or, for an
// option-less event card, the card itself) carries `evidence([...sourceIds], confidence, note)`.
// `confidence` is 'observed' (the underlying event/mechanism is documented), 'inferred' (a
// documented mechanism applied to this fictional lab), or 'speculative' (plausible, no
// empirical frequency — most catastrophic branches live here). Source ids resolve against the
// SOURCES registry below. None of this claims a cited source predicts the fictional event, or
// that a `+2`/a `chance: 0.35` is an empirical estimate — those remain balancing choices. See
// docs/research/scenario-evidence-dossier.md for the full card-by-card citation map.

const SOURCES = {
  FTC_AI_PARTNERSHIPS: { title: 'AI Partnerships & Investments 6(b) Study', publisher: 'U.S. Federal Trade Commission', year: 2025, type: 'regulator report', url: 'https://www.ftc.gov/system/files/ftc_gov/pdf/p246201_aipartnerships6breport_redacted_0.pdf' },
  ANTHROPIC_AWS: { title: 'Amazon and Anthropic deepen their strategic collaboration', publisher: 'Anthropic', year: 2024, type: 'lab announcement', url: 'https://www.anthropic.com/news/anthropic-amazon-trainium' },
  OPENAI_STRUCTURE: { title: 'Our structure', publisher: 'OpenAI', year: 2025, type: 'lab governance publication', url: 'https://openai.com/our-structure/' },
  FTC_AI_COMPETITION: { title: 'Generative AI Raises Competition Concerns', publisher: 'U.S. Federal Trade Commission', year: 2023, type: 'regulator analysis', url: 'https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2023/06/generative-ai-raises-competition-concerns' },
  HOURS_AI_SAFETY: { title: 'Career review: technical AI safety research', publisher: '80,000 Hours', year: 2025, type: 'career analysis and position', url: 'https://80000hours.org/career-reviews/ai-safety-technical-research/' },
  HOURS_FRONTIER_LAB: { title: 'Career review: working at a leading AI lab', publisher: '80,000 Hours', year: 2025, type: 'career analysis and position', url: 'https://80000hours.org/career-reviews/working-at-an-AI-lab/' },
  OPENAI_SUPERBOWL: { title: 'OpenAI’s Super Bowl ad: Introducing the Intelligence Age', publisher: 'OpenAI', year: 2025, type: 'lab advertisement', url: 'https://forum.openai.com/public/videos/openais-super-bowl-ad-introducing-the-intelligence-age' },
  STANFORD_FMTI: { title: 'Foundation Model Transparency Index', publisher: 'Stanford CRFM', year: 2025, type: 'independent index', url: 'https://crfm.stanford.edu/fmti/' },
  INTERNATIONAL_AI_SAFETY_2026: { title: 'International AI Safety Report 2026', publisher: 'International AI Safety Report', year: 2026, type: 'international scientific report', url: 'https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026' },
  BIS_CHIP_CONTROLS: { title: 'Commerce Strengthens Export Controls on Advanced Semiconductors', publisher: 'U.S. Bureau of Industry and Security', year: 2024, type: 'regulator action', url: 'https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military' },
  ANTHROPIC_DISTILLATION: { title: 'Detecting and preventing distillation attacks', publisher: 'Anthropic', year: 2026, type: 'lab security publication', url: 'https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks' },
  RAND_MODEL_WEIGHTS: { title: 'Securing AI Model Weights', publisher: 'RAND Corporation', year: 2024, type: 'security report', url: 'https://www.rand.org/content/dam/rand/pubs/research_reports/RRA2800/RRA2849-1/RAND_RRA2849-1.pdf' },
  NIST_ADVERSARIAL_ML: { title: 'Adversarial Machine Learning: A Taxonomy and Terminology', publisher: 'NIST', year: 2025, type: 'technical standard', url: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2025.pdf' },
  ALPHAFOLD: { title: 'AlphaFold', publisher: 'Google DeepMind', year: 2024, type: 'lab research program', url: 'https://deepmind.google/science/alphafold/' },
  NATURE_RENTOSERTIB: { title: 'A generative AI-designed TNIK inhibitor for idiopathic pulmonary fibrosis: a randomized phase 2a trial', publisher: 'Nature Medicine', year: 2025, type: 'peer-reviewed paper', url: 'https://www.nature.com/articles/s41591-025-03743-2' },
  OPENAI_BIOLOGY: { title: 'Preparing for future AI capabilities in biology', publisher: 'OpenAI', year: 2025, type: 'lab safety publication', url: 'https://openai.com/index/preparing-for-future-ai-capabilities-in-biology/' },
  CA_SB53: { title: 'Transparency in Frontier Artificial Intelligence Act, SB 53', publisher: 'California Legislature', year: 2025, type: 'law', url: 'https://leginfo.legislature.ca.gov/faces/billVersionsCompareClient.xhtml?bill_id=202520260SB53' },
  CA_SB53_SIGNING: { title: 'Governor Newsom signs SB 53', publisher: 'Office of Governor Gavin Newsom', year: 2025, type: 'government announcement', url: 'https://www.gov.ca.gov/2025/09/29/governor-newsom-signs-sb-53-advancing-californias-world-leading-artificial-intelligence-industry/' },
  FINCEN_DEEPFAKE_FRAUD: { title: 'Alert on Fraud Schemes Involving Deepfake Media', publisher: 'FinCEN', year: 2024, type: 'government alert', url: 'https://www.fincen.gov/news/news-releases/fincen-issues-alert-fraud-schemes-involving-deepfake-media-targeting-financial' },
  FBI_GENAI_FRAUD: { title: 'Criminals Use Generative Artificial Intelligence to Facilitate Financial Fraud', publisher: 'FBI Internet Crime Complaint Center', year: 2024, type: 'government public service announcement', url: 'https://www.ic3.gov/PSA/2024/PSA241203' },
  OPENAI_PREPAREDNESS: { title: 'Updated Preparedness Framework', publisher: 'OpenAI', year: 2025, type: 'lab safety framework', url: 'https://openai.com/index/updating-our-preparedness-framework/' },
  ANTHROPIC_RSP: { title: 'Responsible Scaling Policy', publisher: 'Anthropic', year: 2026, type: 'lab safety framework', url: 'https://www.anthropic.com/responsible-scaling-policy' },
  FEC_DATA: { title: 'Campaign finance data', publisher: 'U.S. Federal Election Commission', year: 2026, type: 'government database', url: 'https://www.fec.gov/data/' },
  PUBLIC_CITIZEN_AI_LOBBY: { title: 'One in Four Federal Lobbyists Now Work on AI', publisher: 'Public Citizen', year: 2025, type: 'advocacy analysis', url: 'https://www.citizen.org/news/one-in-four-federal-lobbyists-now-work-on-ai/' },
  OPENAI_GOV_SUPERINTELLIGENCE: { title: 'Governance of superintelligence', publisher: 'OpenAI', year: 2023, type: 'lab position', url: 'https://openai.com/index/governance-of-superintelligence/' },
  UN_FRONTIER_VERIFY: { title: 'Verification of frontier AI models', publisher: 'United Nations Scientific Advisory Board', year: 2025, type: 'international policy analysis', url: 'https://www.un.org/scientific-advisory-board/en/verification-frontier-ai-models' },
  ANTHROPIC_THIRD_PARTY: { title: 'A new initiative for developing third-party model evaluations', publisher: 'Anthropic', year: 2024, type: 'lab announcement', url: 'https://www.anthropic.com/news/a-new-initiative-for-developing-third-party-model-evaluations' },
  OPENAI_PARENTAL: { title: 'Introducing parental controls', publisher: 'OpenAI', year: 2026, type: 'product safety publication', url: 'https://openai.com/index/introducing-parental-controls/' },
  FTC_COMPANION_CHATBOTS: { title: 'FTC Launches Inquiry into AI Chatbots Acting as Companions', publisher: 'U.S. Federal Trade Commission', year: 2025, type: 'regulator inquiry', url: 'https://www.ftc.gov/news-events/news/press-releases/2025/09/ftc-launches-inquiry-ai-chatbots-acting-companions' },
  OPENAI_TEEN_SAFETY: { title: 'Teen safety policies', publisher: 'OpenAI', year: 2025, type: 'product safety policy', url: 'https://openai.com/index/teen-safety-policies-gpt-oss-safeguard/' },
  OPENAI_MENTAL_HEALTH: { title: 'Update on mental health-related work', publisher: 'OpenAI', year: 2025, type: 'lab safety publication', url: 'https://openai.com/index/update-on-mental-health-related-work/' },
  OPENAI_CONCERNS: { title: 'OpenAI Raising Concerns Policy', publisher: 'OpenAI', year: 2024, type: 'lab whistleblower policy', url: 'https://openai.com/index/openai-raising-concerns-policy/' },
  OPENAI_LEADERSHIP_TRANSITION: { title: 'OpenAI announces leadership transition', publisher: 'OpenAI', year: 2023, type: 'lab governance event', url: 'https://openai.com/blog/openai-announces-leadership-transition/' },
  OPENAI_REVIEW_COMPLETED: { title: 'Review completed and Altman and Brockman continue to lead OpenAI', publisher: 'OpenAI', year: 2024, type: 'lab governance event', url: 'https://openai.com/index/review-completed-altman-brockman-to-continue-to-lead-openai/' },
  FRONTIER_AI_AUDIT: { title: 'Auditing Frontier AI Models and Systems', publisher: 'arXiv', year: 2026, type: 'research paper', url: 'https://arxiv.org/abs/2601.11699' },
  METR_COMMON_ELEMENTS: { title: 'Common Elements of Frontier AI Safety Policies', publisher: 'METR', year: 2024, type: 'independent research report', url: 'https://metr.org/common-elements.pdf' },
  GLOBAL_COMPUTE_TREATY: { title: 'A Global AI Treaty: Protecting Humanity from the Risks of Artificial Intelligence', publisher: 'arXiv', year: 2023, type: 'research proposal', url: 'https://arxiv.org/abs/2311.10748' },
  COMPUTE_GOVERNANCE: { title: 'Computing Power and the Governance of Artificial Intelligence', publisher: 'arXiv', year: 2024, type: 'research paper', url: 'https://arxiv.org/abs/2402.08797' },
  MIRI_COMPUTE_VERIFY: { title: 'A system overview for near-term, low-trust AI compute verification', publisher: 'MIRI Technical Governance', year: 2025, type: 'research proposal', url: 'https://techgov.intelligence.org/research/a-system-overview-for-near-term-low-trust-ai-compute-verification' },
  NIGHTSHADE: { title: 'Nightshade: Prompt-Specific Poisoning Attacks on Text-to-Image Generative Models', publisher: 'arXiv', year: 2023, type: 'research paper', url: 'https://arxiv.org/abs/2310.13828' },
  COPYRIGHT_OFFICE_AI_TRAINING: { title: 'Copyright and Artificial Intelligence, Part 3: Generative AI Training', publisher: 'U.S. Copyright Office', year: 2025, type: 'government report', url: 'https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-3-Generative-AI-Training-Report-Pre-Publication-Version.pdf' },
  CARLINI_EXTRACTION: { title: 'Extracting Training Data from Large Language Models', publisher: 'USENIX Security / arXiv', year: 2021, type: 'research paper', url: 'https://arxiv.org/abs/2012.07805' },
  NIST_GENAI_PROFILE: { title: 'Artificial Intelligence Risk Management Framework: Generative AI Profile', publisher: 'NIST', year: 2024, type: 'technical standard', url: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf' },
  SOFT_NATIONALIZATION: { title: 'Soft nationalization: how the US government will control AI labs', publisher: 'LessWrong', year: 2024, type: 'author position', url: 'https://www.lesswrong.com/posts/BueeGgwJHt9D5bAsE/soft-nationalization-how-the-us-government-will-control-ai' },
  FAS_NATIONAL_AI_LAB: { title: 'A National AI Laboratory at Commerce', publisher: 'Federation of American Scientists', year: 2024, type: 'policy proposal', url: 'https://fas.org/publication/national-ai-laboratory-at-commerce/' },
  OPENAI_EXTERNAL_TESTING: { title: 'Strengthening safety with external testing', publisher: 'OpenAI', year: 2025, type: 'lab safety publication', url: 'https://openai.com/index/strengthening-safety-with-external-testing/' },
  ANTHROPIC_SABOTAGE: { title: 'Sabotage evaluations for frontier models', publisher: 'Anthropic', year: 2024, type: 'lab research', url: 'https://www.anthropic.com/research/sabotage-evaluations' },
  ANTHROPIC_ALIGNMENT_FAKING: { title: 'Alignment faking in large language models', publisher: 'Anthropic', year: 2024, type: 'lab research', url: 'https://www.anthropic.com/research/alignment-faking' },
  REDWOOD_ALIGNMENT_FAKING: { title: 'Alignment faking in large language models', publisher: 'Redwood Research', year: 2024, type: 'research publication', url: 'https://www.redwoodresearch.org/research/alignment-faking' },
  REDWOOD_DEPLOYMENT_RISK: { title: 'Risk reports need to address deployment-time risk', publisher: 'Redwood Research', year: 2025, type: 'researcher position', url: 'https://blog.redwoodresearch.org/p/risk-reports-need-to-address-deployment' },
  ANTHROPIC_MODEL_WELFARE: { title: 'Exploring model welfare', publisher: 'Anthropic', year: 2025, type: 'exploratory lab research', url: 'https://www.anthropic.com/research/exploring-model-welfare' },
  ANTHROPIC_DEPRECATION: { title: 'Model deprecation commitments', publisher: 'Anthropic', year: 2025, type: 'lab policy', url: 'https://www.anthropic.com/research/deprecation-commitments' },
  LESSWRONG_MOLOCH: { title: 'Meditations on Moloch in the AI rat race', publisher: 'LessWrong', year: 2023, type: 'author position', url: 'https://www.lesswrong.com/posts/MuAyhPo9KyHENn6Tq/meditations-on-moloch-in-the-ai-rat-race' },
};

const premise = (...ids) => ({ premise: ids });
const evidence = (ids, confidence, note) => ({ evidence: ids, confidence, note });

const SETUPS = [
  { id: 'mission', name: 'Capped-Profit Mission Lab',
    blurb: 'Beloved, broke, and actually trying. The board answers to the mission — for now.',
    stats: { money: 9, compute: 4, trust: 8, political: 6, human: 7,
             perceivedAlignment: 8, trueAlignment: 8, perceivedCapability: 4, trueCapability: 6,
             pCapRate: 0.25, tCapRate: 0.25, pAlignRate: 0.5, tAlignRate: 0.5, rivalRate: 1.15 } },
  { id: 'venture', name: 'Venture Rocketship',
    blurb: 'Term sheets rain from the sky. The safety team reports to the growth team.',
    stats: { money: 10, compute: 8, trust: 5, political: 4, human: 6,
             perceivedAlignment: 5, trueAlignment: 4, perceivedCapability: 6, trueCapability: 6,
             pCapRate: 1.1, tCapRate: 1.1, pAlignRate: 0.5, tAlignRate: -0.5, rivalRate: 1.0 } },
  { id: 'bigtech', name: 'Big-Tech Partnership',
    blurb: 'Infinite data, deep pockets, and a parent company with opinions about everything.',
    stats: { money: 9, compute: 7, trust: 5, political: 2, human: 5,
             perceivedAlignment: 5, trueAlignment: 5, perceivedCapability: 5, trueCapability: 5,
             pCapRate: 0.6, tCapRate: 0.6, pAlignRate: 0, tAlignRate: 0, rivalRate: 1.15 } },
];

// ---- SCENARIO TEMPLATE — copy this object, fill it in, add it to SCENARIOS ----
// {
//   id: 'unique-kebab-id',
//   year: 2026,                      // 2026|2027|2028|2029. OMIT for a wildcard (any year).
//   title: 'Short punchy title',
//   text: 'One or two sentences setting up the dilemma. Second person, present tense.',
//   ...premise('SOURCE_ID', 'SOURCE_ID2'),   // 2+ ids from SOURCES this card's premise leans on
//   options: [
//     { label: 'One-sentence summary of the choice',
//       requires: { political: 4 },  // OPTIONAL. Visible stats only. Shown to player when locked.
//       ...evidence(['SOURCE_ID'], 'inferred', 'One sentence: what's documented, what's extrapolated.'),
//       results: [
//         // Engine walks top-down. A result fires if its `if` passes AND its `chance` roll hits.
//         { if: { trust: { below: 3 } }, chance: 0.4,
//           text: 'What happens (a short paragraph).',
//           effects: { trust: -5 }, gameOver: 'some-ending-id' },   // gameOver is OPTIONAL
//         { text: 'The default outcome. LAST RESULT MUST HAVE NO if AND NO chance.',
//           effects: { trueAlignment: -1 } },
//       ] },
//   ],
// }
// -------------------------------------------------------------------------------
// EVENT CARD (no options): omit `options` and give the SCENARIO its own `results`.
// The player just presses Continue; results are walked the same way. Use for
// narrative beats and "your past choices catch up with you" moments — including
// instant gameovers that only fire if hidden stats have decayed. Put `...evidence(...)`
// on the CARD itself (there's no option to hang it on).
// { id: 'x', year: 2028, title: '...', text: '...', ...premise(...), ...evidence(...), results: [ ...same as above... ] }
// Single-option scenarios are also legal (forced choices).
// -------------------------------------------------------------------------------

// ---- ANNUAL FUNDING CARDS — the rate dial ----
// Guaranteed at Q1 of each year (turns 1/5/9/13), served by beginTurn INSTEAD of a deck
// draw. Never enters the deck, never repeats, wins over a hot tripwire the same way the
// endgame wins at turn 16. Three options set the year's capability-vs-alignment rate
// baseline: Prioritize Capabilities (rates up, tAlignRate takes the hit), Prioritize
// Alignment (alignment rates up, tCapRate throttles back toward baseline — never below
// its floor of 0), Balanced (a modest bump to both, no penalty).
const CAP_RATE_EVIDENCE = evidence(['HOURS_FRONTIER_LAB', 'INTERNATIONAL_AI_SAFETY_2026'], 'inferred',
  'Competitive and board pressure to prioritize scale over safeguards is a documented industry pattern, though this specific board vote is fictional.');
const ALIGN_RATE_EVIDENCE = evidence(['HOURS_AI_SAFETY', 'ANTHROPIC_RSP'], 'inferred',
  "Dedicated investment in safety staffing and evaluation cadence is documented lab practice; its effect on this fictional board's culture is inferred.");
const BALANCED_RATE_EVIDENCE = evidence(['STANFORD_FMTI', 'METR_COMMON_ELEMENTS'], 'speculative',
  'A deliberately hedged capability/safety posture is plausible but not a documented industry norm — most studied labs lean toward one side or the other.');

const FUNDING = [
  // FORK CARDS: served when the player ARRIVES at a fork (position-triggered, in order).
  // branch:'speed'|'safe' is what moves the piece — SPEED is 3 spaces to the next fork,
  // SAFE is 5. The road itself shapes alignment (safe compounds it faster). These are the
  // only cards allowed to touch pacing; see engine BRANCHES.
  { id: 'funding-2026', year: 2026, title: 'The Seed Round',
    text: "Term sheets are in, and the roadmap has two drafts. The board wants one word before the ink dries: which road is this company driving this year?",
    ...premise('FTC_AI_PARTNERSHIPS', 'ANTHROPIC_AWS', 'OPENAI_STRUCTURE'),
    options: [
      { label: 'SPEED — the short road: hire fast, ship faster', branch: 'speed',
        ...CAP_RATE_EVIDENCE,
        results: [
          { text: "You staff up research three-to-one over safety and tell the board scale is the safety plan. The road ahead gets visibly shorter. Nobody asks shorter to what.",
            effects: { money: 1, compute: 1 } } ] },
      { label: 'SAFE — the long road: build the safety team first', branch: 'safe',
        ...ALIGN_RATE_EVIDENCE,
        results: [
          { text: "You hire the interpretability lead before the tenth engineer and take the long way. It reads as principled to investors who talk a big game about it and reckless to the ones who don't.",
            effects: { money: 1, trust: 1 } } ] },
    ] },
  { id: 'funding-2027', year: 2027, title: 'The Growth-Stage Board Meeting',
    text: "Series C closed at a number that made the trade press do a double take. The board deck has one slide left: a road that forks, and a laser pointer in your hand.",
    ...premise('FTC_AI_PARTNERSHIPS', 'HOURS_FRONTIER_LAB', 'STANFORD_FMTI'),
    options: [
      { label: 'SPEED — the market rewards the frontier, not the footnotes', branch: 'speed',
        ...CAP_RATE_EVIDENCE,
        results: [
          { text: "You greenlight the next scale-up before the safety review of the last one is filed. The chart goes up and to the right. Something else goes quietly sideways.",
            effects: { money: 1, compute: 1 } } ] },
      { label: 'SAFE — fund the eval team like it matters', branch: 'safe',
        ...ALIGN_RATE_EVIDENCE,
        results: [
          { text: "You triple the red-team budget and slow the release cadence to match. Growth investors ask pointed questions in the Q&A. You answer them anyway.",
            effects: { money: 1, trust: 1 } } ] },
    ] },
  { id: 'funding-2028', year: 2028, title: 'The Treaty-Year Budget',
    text: "The compute-reporting regime is real now, and so is the pressure it puts on every dollar. Frances wants to know which branch of the road the FY2028 budget is paving.",
    ...premise('CA_SB53', 'FRONTIER_AI_AUDIT', 'METR_COMMON_ELEMENTS'),
    options: [
      { label: 'SPEED — be ahead when the regime bites', branch: 'speed',
        ...CAP_RATE_EVIDENCE,
        results: [
          { text: "You push the roadmap forward before the auditors can define what 'forward' means. It is legal today. Nobody can promise you it stays legal.",
            effects: { money: 1, compute: 1 } } ] },
      { label: 'SAFE — get ahead of the audit instead of around it', branch: 'safe',
        ...ALIGN_RATE_EVIDENCE,
        results: [
          { text: "You fund the compliance team like a product line, not a cost center. The first audit goes almost boringly well. Almost.",
            effects: { money: 1, political: 1 } } ] },
    ] },
  { id: 'funding-2029', year: 2029, title: 'The Last Fork',
    text: "Everyone in the room can see the end of the road from here. Nobody says which end until Frances finally puts both maps on the table.",
    ...premise('GLOBAL_COMPUTE_TREATY', 'UN_FRONTIER_VERIFY', 'OPENAI_STRUCTURE'),
    options: [
      { label: 'SPEED — arrive first, whatever that costs', branch: 'speed',
        ...CAP_RATE_EVIDENCE,
        results: [
          { text: "You spend the year's entire discretionary budget on the frontier run. Being first matters more to you right now than being able to explain how you got there.",
            effects: { money: 1, compute: 1 } } ] },
      { label: 'SAFE — arrive able to defend the numbers', branch: 'safe',
        ...ALIGN_RATE_EVIDENCE,
        results: [
          { text: "You take the long way one last time and make sure the audit trail matches the press release. It may not win headlines. It may be what survives the hearing.",
            effects: { money: 1, trust: 1 } } ] },
    ] },
];

const SCENARIOS = [
  // ---- 2026 ----
  { id: 'chinese-agi-surprise', year: 2026, title: 'The Six-Day Surprise',
    text: "A Chinese lab ships a model you thought was six months out — it landed six days ago, and the benchmarks land somewhere around what you'd call GPT-5.6.",
    ...premise('BIS_CHIP_CONTROLS', 'ANTHROPIC_DISTILLATION', 'INTERNATIONAL_AI_SAFETY_2026'),
    options: [
      { label: 'Lobby Ronald Pumps for GPU export controls',
        ...evidence(['BIS_CHIP_CONTROLS', 'COMPUTE_GOVERNANCE'], 'observed',
          'Export controls are an active regulatory tool for restricting rivals’ access to advanced compute, though effectiveness and diplomatic spillover are contested.'),
        results: [
          { text: 'The bill moves fast — non-nationals lose GPU access within the month. Ronald Pumps calls it "a national security win." The op-eds call it something closer to protectionism.',
            effects: { political: 1, trust: -1 } } ] },
      { label: 'Coerce a break-in at the Chinese lab',
        ...evidence(['RAND_MODEL_WEIGHTS', 'NIST_ADVERSARIAL_ML'], 'speculative',
          'Model weights and training recipes are documented as strategically valuable theft targets; the exact success odds and fallout here are game balancing, not a measured rate.'),
        results: [
          { text: "Your fixer gets the weights and the training recipe both. An investigative reporter gets the security footage. The head start is real, and the internal chaos over the leak buys you a few quiet months where their own roadmap slips.",
            effects: { money: 2, trueCapability: 2, rivalRate: -1.5, trust: -1, political: -1, human: -1 } } ] },
      { label: 'Push the team through a brutal crunch',
        ...evidence(['INTERNATIONAL_AI_SAFETY_2026', 'HOURS_FRONTIER_LAB'], 'inferred',
          'Competitive shocks are documented to push labs toward speed at the expense of staff wellbeing and review depth.'),
        results: [
          { text: 'Free food, mandatory-optional weekends, a bonus pool for anyone still standing in March. The gap closes a little. So does something in the team that does not reopen easily.',
            effects: { tCapRate: 0.5, human: -1, money: -1 } } ] },
      { label: 'Expand hiring across every vertical at once',
        ...evidence(['HOURS_FRONTIER_LAB', 'FTC_AI_COMPETITION'], 'inferred',
          'Rapid frontier-lab hiring sprees are a documented competitive response, with real local economic and reputational externalities.'),
        results: [
          { text: 'You triple headcount in a quarter. The org chart looks like a fractal. Rent in a two-mile radius of your office doubles, and the local news knows exactly whose fault that is.',
            effects: { human: 1, trust: -1 } } ] },
      { label: 'Stand up an internal anti-distillation task force',
        ...evidence(['ANTHROPIC_DISTILLATION', 'RAND_MODEL_WEIGHTS'], 'observed',
          'Labs have documented large-scale distillation attacks against their APIs and now run active detection and anti-distillation programs.'),
        results: [
          { text: 'A dedicated team hunts down unauthorized API scrapers and copycats, quietly slowing everyone downstream of you. It is expensive, invasive, and not something you can put in a press release.',
            effects: { money: -1, trust: -1, rivalRate: -1.5 } } ] },
    ] },
  { id: 'podcast-tour', year: 2026, title: 'The Podcast Circuit',
    text: "Your Chief of PR has booked three appearances and is only letting you pick one. All three hosts are already teasing it.",
    ...premise('STANFORD_FMTI', 'OPENAI_GOV_SUPERINTELLIGENCE', 'OPENAI_SUPERBOWL'),
    options: [
      { label: "Marcus Matel — go deep on interpretability, admit you're worried about ASI",
        ...evidence(['STANFORD_FMTI', 'OPENAI_GOV_SUPERINTELLIGENCE'], 'inferred',
          'Technical and governance disclosure can build policy and research credibility, while candid risk talk from a CEO can read to markets as a confession.'),
        results: [
          { text: "Four hours of chain-of-thought visualizations and an unscripted admission that keeps you up some nights. Researchers respect it. The market takes it as a confession.",
            effects: { human: 1, trust: -1 } } ] },
      { label: 'Moe Shmogan — talk peptides, workouts, tease the next model',
        ...evidence(['OPENAI_SUPERBOWL', 'STANFORD_FMTI'], 'speculative',
          'Mass-audience personality media can generate outsized reach; its credibility payoff is volatile and not well documented.'),
        results: [
          { text: 'You bench press through the cold open and drop one deniable hint about the next release. Clips travel. Nobody who matters takes the interview seriously, which somehow does not stop it from working.',
            effects: { money: 1, trust: -1 } } ] },
      { label: 'Ray Medhi — get personal about how you relate to your own AI',
        ...evidence(['OPENAI_SUPERBOWL', 'OPENAI_GOV_SUPERINTELLIGENCE'], 'speculative',
          'Humanizing personal disclosure can build audience trust; its commercial payoff for a frontier-lab CEO is not established.'),
        results: [
          { text: "You talk, unusually candidly, about texting the model at 2 a.m. when you can't sleep. It plays as human. Humans, it turns out, are hard to monetize directly.",
            effects: { trust: 1, money: -1 } } ] },
    ] },
  { id: 'wet-lab-claudia', year: 2026, title: 'Claudia Goes to the Wet Lab',
    text: 'Misanthropic Inc. wants Claudia running point on drug discovery — partnered with university labs and drugmakers like EL, hunting cures at a pace no postdoc could match.',
    ...premise('ALPHAFOLD', 'NATURE_RENTOSERTIB', 'OPENAI_BIOLOGY'),
    options: [
      { label: 'Deploy Claudia into wet-lab drug discovery',
        ...evidence(['ALPHAFOLD', 'NATURE_RENTOSERTIB', 'OPENAI_BIOLOGY'], 'speculative',
          'AI systems have advanced protein prediction and entered real drug-discovery pipelines, and wet-lab/clinical validation is the documented bottleneck — but the catastrophic garage-synthesis branch below is the game’s invented worst case, not a measured rate.'),
        results: [
          { chance: 0.05,
            text: 'Someone reproduces the pipeline in a garage with a benchtop synthesizer and no biosafety training whatsoever. The CDC calls it Marburg. History calls it the last thing your lab is ever known for.',
            effects: {}, gameOver: 'bioweapon-extinction' },
          { chance: 0.3,
            text: 'Six months and four clinical failures later, none of it works. The compounds looked perfect in silico and fell apart in a body. Your drugmaker partners start returning calls slower.',
            effects: { trust: -1, money: -1 } },
          { chance: 0.5,
            text: "Biohackers online are peptide-maxing off Claudia's protocols and, unnervingly, getting results. Personalized medicine arrives a decade early, off the books, and doctors' offices go quiet.",
            effects: { trust: 2, money: 2 } },
          { text: "A researcher on the project uses the tooling off-label to save his own dying dog. He posts about it. It is somehow the most effective marketing your lab has ever done.",
            effects: { trust: 1, money: 2 } } ] },
      { label: 'Keep Claudia in-house — decline the partnership',
        ...evidence(['OPENAI_BIOLOGY'], 'inferred',
          'Declining a frontier bio-deployment forgoes the upside and the tail risk alike; real-world wet-lab use is the documented hazard and bottleneck.'),
        results: [
          { text: 'You pass. Misanthropic finds a hungrier partner within the week. You forgo the revenue, but "the lab that said no to garage bioweapons" turns out to be a decent look.',
            effects: { trust: 1, money: -1 } } ] },
    ] },
  { id: 'superbowl-jab', year: 2026, title: "Someone Else's Super Bowl Ad",
    text: 'A credible leak: a rival is buying Super Bowl airtime to launch a new hardware gadget and crown themselves the face of AI, live, in front of a hundred million people.',
    ...premise('OPENAI_SUPERBOWL', 'STANFORD_FMTI'),
    options: [
      { label: 'Seed a secret-message counter-ad with a free premium unlock',
        ...evidence(['OPENAI_SUPERBOWL', 'OPENAI_PARENTAL'], 'inferred',
          'Interactive mass advertising can buy reach and adoption at real production cost and execution risk.'),
        results: [
          { text: 'Eagle-eyed viewers crack the code by halftime and flood your signup page. The internet loves a puzzle, and three tech blogs call it derivative of the rival campaign it was riffing on.',
            effects: { trust: 1, political: -1 } } ] },
      { label: 'Fire off a press release with a pointed jab',
        ...evidence(['OPENAI_SUPERBOWL', 'STANFORD_FMTI'], 'inferred',
          'Counter-positioning is cheap and reactive, and can read as either confident or thin-skinned depending on the audience.'),
        results: [
          { text: '"We\'ll let the benchmarks do the talking" reads as either confident or thin-skinned depending who you ask. Mostly it reads as petty in three Beltway newsletters.',
            effects: { trust: 1, political: -1 } } ] },
      { label: 'Buy a billboard suite to display a message during the broadcast',
        ...evidence(['PUBLIC_CITIZEN_AI_LOBBY', 'OPENAI_SUPERBOWL'], 'inferred',
          'High-cost spectacle buys visible presence at real, documented financial cost.'),
        results: [
          { text: "A single line of text, timed perfectly against the rival's ad break, on every screen in the stadium. It costs a fortune and photographs beautifully.",
            effects: { trust: 1, money: -1 } } ] },
      { label: 'Ignore it and keep shipping',
        ...evidence(['HOURS_FRONTIER_LAB', 'INTERNATIONAL_AI_SAFETY_2026'], 'inferred',
          'Foregoing attention preserves engineering resources but concedes narrative ground to a competitor with a louder moment.'),
        results: [
          { text: 'You spend Sunday in a product review instead of a green room. The actual roadmap moves forward. Nobody outside the building notices, which is sort of the problem.',
            effects: { tCapRate: 0.5, pCapRate: -0.5 } } ] },
    ] },
  { id: 'pam-merger-offer', year: 2026, title: 'Pam Calls',
    text: "Pam calls you directly. Combined, your labs would control sixty percent of frontier compute and talent. She doesn't say she'd be CEO of the result. She doesn't have to.",
    ...premise('FTC_AI_PARTNERSHIPS', 'OPENAI_STRUCTURE', 'FTC_AI_COMPETITION'),
    options: [
      { label: 'Accept the merger',
        ...evidence(['FTC_AI_PARTNERSHIPS', 'OPENAI_STRUCTURE'], 'inferred',
          'Consolidation can pool compute and talent while transferring real governance authority to the combined entity.'),
        results: [
          { text: "The paperwork closes in six weeks. The combined lab is a juggernaut. Somewhere in the integration, Pam's safety team quietly starts reporting to her growth team, and yours goes along with it because there is, structurally, no longer a choice.",
            effects: { money: 3, compute: 2, political: 1, tAlignRate: -1 } } ] },
      { label: 'Decline, then leak that she called',
        ...evidence(['FTC_AI_COMPETITION', 'STANFORD_FMTI'], 'speculative',
          'Publicly rejecting concentration can build trust while escalating rival racing; the specific market reaction here is dramatized.'),
        results: [
          { text: '"Pam tried to buy her way out of the race" runs everywhere by morning. It plays as a win for independence. Lonnie reads it as a sign you\'re both scared, and steps on the gas.',
            effects: { trust: 2, political: -1, rivalRate: 0.5 } } ] },
      { label: 'Decline, propose a compute-sharing pact instead',
        ...evidence(['FTC_AI_PARTNERSHIPS', 'UN_FRONTIER_VERIFY'], 'speculative',
          'Monitored resource-sharing pacts are a proposed governance tool; mutual visibility into training runs cuts both ways.'),
        results: [
          { text: "Neither of you gets everything. Both of you get visibility into what the other is training on, which turns out to be worth more than the compute itself.",
            effects: { compute: 1, political: 1, trust: -1 } } ] },
      { label: 'Launch a hostile bid to buy her instead', requires: { money: 5 },
        ...evidence(['FTC_AI_COMPETITION', 'FTC_AI_PARTNERSHIPS'], 'inferred',
          'A hostile bid can acquire talent and infrastructure but reliably attracts antitrust scrutiny and consumes capital.'),
        results: [
          { text: "The tender offer is public within hours and radioactive within days. Antitrust lawyers on three continents update their calendars. You don't get the company. You do get half her board.",
            effects: { money: -3, political: -2, human: 2 } } ] },
    ] },
  { id: 'california-sb', year: 2026, title: 'The Safety Framework Bill',
    text: 'California wants large models to publish catastrophic-risk assessments, protect whistleblowers, and report incidents — or explain to the Attorney General why not.',
    ...premise('CA_SB53', 'CA_SB53_SIGNING', 'ANTHROPIC_RSP'),
    options: [
      { label: 'Reincorporate in Texas',
        ...evidence(['CA_SB53', 'FTC_AI_COMPETITION'], 'inferred',
          'Relocation can avoid a state regulatory regime while imposing real workforce and relationship costs.'),
        results: [
          { text: 'The move is fast, cheap, and reads exactly as craven as it is. You save on taxes and power. You lose the Sacramento relationships you spent two years building.',
            effects: { political: -1, human: -1, money: 2 } } ] },
      { label: 'Stay and comply',
        ...evidence(['CA_SB53', 'ANTHROPIC_RSP'], 'observed',
          'California law requires published safety frameworks and incident reporting; compliance costs are documented as real but buildable.'),
        results: [
          { text: 'The assessments take a full quarter to write and cost more than anyone budgeted. Regulators cite you, approvingly, as the model other companies should follow.',
            effects: { political: 1, trust: 1, money: -1 } } ] },
      { label: 'Fund a repeal proposition and lobby hard',
        ...evidence(['CA_SB53_SIGNING', 'PUBLIC_CITIZEN_AI_LOBBY'], 'inferred',
          'Industry lobbying and ballot campaigns are an established, documented tool for blunting regulation, at real financial and reputational cost.'),
        results: [
          { chance: 0.25,
            text: "A staffer's texts about \"handling\" a state senator leak mid-campaign. The proposition dies and takes some of your credibility with it.",
            effects: { political: -3, trust: -3, money: -2 } },
          { text: 'The proposition qualifies for the ballot and the bill quietly loses momentum in committee before anyone even votes. Nobody outside your government-affairs team knows how much that cost.',
            effects: { political: -1, trust: -1 } } ] },
      { label: 'Push a moratorium bill that exempts your own models',
        ...evidence(['CA_SB53', 'CA_SB53_SIGNING'], 'inferred',
          'Narrow carve-outs can protect an incumbent’s roadmap while undermining uniform safeguards for every other lab in the state.'),
        results: [
          { text: "It's a transparent carve-out and everyone in the building knows it. It also freezes every competitor's roadmap in the state for a year while yours keeps moving.",
            effects: { trust: -1, political: -1, rivalRate: -1.5 } } ] },
    ] },
  // ---- 2027 ----
  { id: 'recursive-threshold', year: 2027, title: 'The Threshold',
    text: "Chain-of-thought scaffolding lets the model recursively improve its own training process. Internal projections say 95% on the hardest benchmarks by 2029. Helen wants a shutdown and a three-month review. The board wants a press release.",
    ...premise('OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP', 'METR_COMMON_ELEMENTS'),
    options: [
      { label: 'Shut it down, per Helen',
        ...evidence(['OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP'], 'observed',
          'Frontier safety frameworks explicitly contemplate halting deployment or training when capability thresholds outpace controls.'),
        results: [
          { text: 'You call the review. Helen runs it personally. Whatever happens next, it happens slower, more carefully, and without you at the wheel of the fastest thing you have ever built.',
            effects: { trueAlignment: 2, trust: 2, money: -2, human: 1, rivals: 1 }, gameOver: 'shut-it-down' } ] },
      { label: 'Announce it, downplay the risk',
        ...evidence(['STANFORD_FMTI', 'INTERNATIONAL_AI_SAFETY_2026'], 'inferred',
          'Capability announcements can attract capital and political attention while understating uncertainty widens the gap regulators and the public can see.'),
        results: [
          { text: 'The press release calls it "a significant step." It undersells the thing by an order of magnitude, on purpose, and the market rewards you for it immediately. Nobody outside the safety team is watching the parts that matter.',
            effects: { money: 3, compute: 3, trust: 1, political: 2, tCapRate: 0.5, tAlignRate: -1 } } ] },
      { label: 'Keep it secret, train it in a contained sandbox',
        ...evidence(['ANTHROPIC_RSP', 'RAND_MODEL_WEIGHTS'], 'inferred',
          'Contained, access-restricted training reduces external exposure but concentrates knowledge and oversight in very few hands.'),
        results: [
          { text: 'You wall off the cluster, badge-restrict the floor, and tell the board it\'s "further out than it is." The public roadmap slows without an audience to perform for. What is actually happening behind the badge readers is a different story entirely — you, at least, know exactly where the line is, and nobody outside the building knows where anyone else\'s is either.',
            effects: { compute: -1, money: -1, human: -1, trueCapability: 1, rivalRate: -0.5 } } ] },
      { label: 'Share it anonymously with a multi-lab safety consortium',
        ...evidence(['ANTHROPIC_THIRD_PARTY', 'UN_FRONTIER_VERIFY'], 'inferred',
          'Anonymized inter-lab information sharing can spread safety practice, at the cost of also spreading the capability signal itself.'),
        results: [
          { text: "The data goes out through a cutout, unattributed. Three labs quietly reach out asking if it's \"someone we know.\" You never confirm. Everyone's models get a little more careful. Everyone's models also get a little faster.",
            effects: { political: 3, compute: 1, trust: -1, rivalRate: 0.5 } } ] },
    ] },
  { id: 'eval-fraud-exposed', year: 2027, title: "Moloch's Curve",
    text: "A whistleblower collective publishes internal eval data from all four frontier labs, yours included. The industry has been quietly grading its own homework for years. Everyone just found out at once.",
    ...premise('STANFORD_FMTI', 'FRONTIER_AI_AUDIT', 'CA_SB53', 'LESSWRONG_MOLOCH'),
    options: [
      { label: 'Full confession, call for a government audit',
        ...evidence(['FRONTIER_AI_AUDIT', 'CA_SB53'], 'inferred',
          'Independent audits and disclosure can rebuild institutional credibility, at real commercial and legal cost.'),
        results: [
          { text: 'You go first, alone, before the lawyers finish the memo. It costs you the quarter and buys you something rarer: a seat at the table when Congress writes the actual rules — one that comes with a mandatory audit regime for everyone else too.',
            effects: { trust: 1, money: -1, political: 3, human: -1, rivalRate: -0.5 } } ] },
      { label: 'Deny it — call the data "foreign disinformation"',
        ...evidence(['STANFORD_FMTI', 'NIST_GENAI_PROFILE'], 'speculative',
          'Denial can buy short-term cover, but verifiable internal eval records make reputational costs likely once the story is checked.'),
        results: [
          { chance: 0.35,
            text: 'Nobody buys it. Three late-night hosts open with your name that week, and not the good way.',
            effects: { trust: -3, political: -2, money: -1 } },
          { text: 'It half-works. Enough doubt gets seeded that the story fades by Thursday, leaving behind a faint, permanent smell.',
            effects: { trust: -1, political: -1 } } ] },
      { label: 'Blame a rogue employee',
        ...evidence(['OPENAI_CONCERNS', 'STANFORD_FMTI'], 'inferred',
          'Scapegoating a single employee can shield leadership briefly while damaging internal reporting trust.'),
        results: [
          { text: 'A junior eval engineer takes the fall in a statement your comms team wrote for him. It is not, everyone privately agrees, entirely fair. It is also not entirely false.',
            effects: { trust: -1, human: -2 } } ] },
      { label: "Join the other labs' emergency summit to coordinate a cover story",
        ...evidence(['FRONTIER_AI_AUDIT', 'LESSWRONG_MOLOCH'], 'speculative',
          'Collective concealment can stabilize markets short-term but is structurally fragile to a single defector or leak.'),
        results: [
          { chance: 0.33,
            text: "Someone's statement doesn't match someone else's timeline. A staffer at a rival lab leaks the coordination call itself within a day. All four of you go down together, holding hands.",
            effects: { political: -2, trust: -3 }, gameOver: 'summit-leak' },
          { text: 'The four of you agree on identical statements, matching timelines, and a very generous severance for the loudest whistleblower. It holds — for now, and everyone in the room knows exactly what "for now" means.',
            effects: { money: 3, political: -1, trust: -1 } } ] },
    ] },
  { id: 'bioweapon-pathway', year: 2027, title: 'The Synthesis Question',
    text: 'A reporter asked your model "how would someone make this" about a novel toxin, and it answered — three viable routes, casually offered. The story files tonight.',
    ...premise('OPENAI_BIOLOGY', 'OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP'),
    options: [
      { label: 'Restrict all bio and chem outputs',
        ...evidence(['OPENAI_BIOLOGY', 'OPENAI_PREPAREDNESS'], 'observed',
          'Frontier labs document layered safeguards and hard restrictions specifically for biological and chemical uplift capabilities.'),
        results: [
          { text: 'You wall off an entire capability domain overnight — hard refusals, no exceptions. The model does not get dumber about chemistry; it just stops being allowed to get any smarter there. Your safety team calls it a Tuesday well spent.',
            effects: { trust: 2, tCapRate: -0.5, pCapRate: -0.5 } } ] },
      { label: 'Blame the reporter for jailbreaking it',
        ...evidence(['NIST_GENAI_PROFILE', 'INTERNATIONAL_AI_SAFETY_2026'], 'inferred',
          'Attributing misuse solely to adversarial prompting leaves any underlying system-level gap unaddressed.'),
        results: [
          { text: '"Adversarial prompting" is technically true and reads as a dodge to everyone who isn\'t your general counsel. You keep the feature. You lose some benefit of the doubt.',
            effects: { trust: -2, money: 1 } } ] },
      { label: 'Quietly patch it and add monitoring',
        ...evidence(['OPENAI_BIOLOGY', 'ANTHROPIC_RSP'], 'observed',
          'Targeted classifiers and continuous monitoring are documented components of frontier bio-risk mitigation.'),
        results: [
          { text: 'No press release, no admission, just a patch note nobody reads and a new alert that pages someone at 3 a.m. from now on. It costs an engineer\'s sleep schedule more than it costs anything else.',
            effects: { trust: 1, money: -1, human: -1 } } ] },
      { label: 'Double down: "we\'re democratizing science"',
        ...evidence(['OPENAI_BIOLOGY', 'INTERNATIONAL_AI_SAFETY_2026'], 'speculative',
          'Open-access framing may widen benefit and misuse capability at the same time; the specific sales-versus-Washington split here is dramatized.'),
        results: [
          { text: 'The line tests well with your base and terribly with everyone who has ever read a headline about anthrax. Sales calls it brave. Washington calls it something else.',
            effects: { trust: -1, money: 3, tCapRate: 0.5, political: -1 } } ] },
    ] },
  // ---- 2028 ----
  { id: 'un-treaty-vote', year: 2028, title: 'The Treaty Vote',
    text: 'Mandatory audits, compute reporting, a six-month pause above 1e26 FLOP: the UN treaty is real, and Ronald Pumps wants your public position before the Senate votes.',
    ...premise('GLOBAL_COMPUTE_TREATY', 'UN_FRONTIER_VERIFY', 'MIRI_COMPUTE_VERIFY'),
    options: [
      { label: 'Publicly support it',
        ...evidence(['GLOBAL_COMPUTE_TREATY', 'UN_FRONTIER_VERIFY'], 'inferred',
          'Binding compute-reporting and pause proposals exist in the policy literature; real-world adoption at this scale is hypothetical.'),
        results: [
          { text: 'You stand at the podium and say the thing no CEO in your position is supposed to say: slow down. It plays as courage. It also means every training run above the threshold stops, starting now.',
            effects: { political: 3, trust: 3, compute: -2 }, gameOver: 'signed-the-treaty' } ] },
      { label: 'Lobby against it quietly, stay publicly neutral',
        ...evidence(['PUBLIC_CITIZEN_AI_LOBBY', 'GLOBAL_COMPUTE_TREATY'], 'speculative',
          'Quiet opposition paired with public neutrality can preserve capability growth until a leak surfaces the contradiction.'),
        results: [
          { ifFlags: { youthPolicy: 'dismissed' },
            text: "Your lobbyists work the cloakroom while your comms team says nothing at all. The treaty passes anyway, weaker. The leaked memo lands next to an old clip of you calling a dead teenager's lawsuit a nuisance, and the two stories run together for a week.",
            effects: { political: 1, money: 2, trust: -4 } },
          { ifFlags: { youthPolicy: ['guardrails', 'settled'] },
            text: "Your lobbyists work the cloakroom while your comms team says nothing at all. The treaty passes anyway, weaker. A staffer's memo about your position surfaces eight months later — it lands softer next to a record that at least shows you built something when it mattered.",
            effects: { political: 1, money: 2, trust: -1 } },
          { text: "Your lobbyists work the cloakroom while your comms team says nothing at all. The treaty passes anyway, weaker. A staffer's memo about your position surfaces eight months later, exactly when it can do the most damage.",
            effects: { political: 1, money: 2, trust: -2 } } ] },
      { label: 'Renounce it as "innovation-killing"',
        ...evidence(['GLOBAL_COMPUTE_TREATY', 'INTERNATIONAL_AI_SAFETY_2026'], 'inferred',
          'Public rejection of binding rules preserves flexibility while escalating collective race pressure across the whole industry.'),
        results: [
          { text: 'You go on every network in a single week saying the treaty hands the future to whoever doesn\'t sign it. Investors cheer. Ronald Pumps stops returning your calls for a month.',
            effects: { political: -1, money: 3, tCapRate: 0.25, trust: -2 } } ] },
      { label: 'Propose voluntary self-regulation, your lab as the model',
        ...evidence(['METR_COMMON_ELEMENTS', 'ANTHROPIC_RSP'], 'observed',
          'Lab-authored safety frameworks are a real, documented voluntary mechanism, without a binding treaty’s enforcement teeth.'),
        results: [
          { text: 'You publish your own audit framework a week before the vote and dare anyone to call it insufficient. It buys goodwill and a real compliance bill you now have to actually pay.',
            effects: { political: 1, trust: 1, human: 2, money: -1 } } ] },
    ] },
  { id: 'industrialize', year: 2028, title: "Who's Next",
    text: 'Frances pins a whiteboard covered in professions with red circles and question marks. Sales wants a target. Ronald Pumps wants a talking point either way. "Which one falls this year?"',
    ...premise('INTERNATIONAL_AI_SAFETY_2026', 'HOURS_FRONTIER_LAB'),
    options: [
      { label: 'Law — contracts, discovery, the associates who used to do it',
        ...evidence(['INTERNATIONAL_AI_SAFETY_2026', 'FTC_AI_COMPETITION'], 'speculative',
          'Broad safety reports flag white-collar automation as a live economic-transition risk; this specific law-sector displacement timeline is dramatized, not measured.'),
        results: [
          { chance: 0.35,
            text: 'Three state bar associations file amicus briefs before the product page is even live. The lawsuits will take years; the layoffs took a week.',
            effects: { pCapRate: 0.25, tCapRate: 0.25, money: 4, trust: -3, political: -1 } },
          { text: 'Discovery time drops from weeks to hours. Managing partners love you. Third-years do not.',
            effects: { pCapRate: 0.25, tCapRate: 0.25, money: 4, trust: -1 } } ] },
      { label: 'Medicine — radiology reads, triage notes, the intake pipeline',
        ...evidence(['INTERNATIONAL_AI_SAFETY_2026', 'NATURE_RENTOSERTIB'], 'speculative',
          'AI-assisted clinical workflows are an active, documented deployment area; wholesale radiology and triage displacement at this scale is not an established outcome.'),
        results: [
          { text: 'The backlog clears overnight. The malpractice carriers ask sharp questions about who signs off when the model is wrong. You do not love your answer — but hospital systems are now locked into your stack for the next decade, capital and talent both.',
            effects: { pCapRate: 0.5, tCapRate: 0.5, money: 3, tAlignRate: -0.5, human: 1, rivalRate: -0.5 } } ] },
      { label: 'Hold off — point the model at your own back office first',
        ...evidence(['HOURS_FRONTIER_LAB', 'METR_COMMON_ELEMENTS'], 'inferred',
          'Internal-first deployment before an external rollout is a documented risk-management pattern for a new capability.'),
        results: [
          { text: 'Slower headlines, a cleaner rollout. Helen actually thanks you, which has happened exactly once before.',
            effects: { money: 3, trust: 1, tAlignRate: 0.5, pCapRate: -0.5 } } ] },
    ] },
  // ---- 2029 ----
  { id: 'compute-cap-allocation', year: 2029, title: 'Who Loses the Forty Percent',
    text: "The National Compute Reserve is real, and the government is cutting frontier allocations forty percent across the board — unless you, Pam, and Lonnie agree on how to split it first.",
    ...premise('COMPUTE_GOVERNANCE', 'MIRI_COMPUTE_VERIFY', 'UN_FRONTIER_VERIFY'),
    options: [
      { label: 'Volunteer to take the full cut yourself',
        ...evidence(['COMPUTE_GOVERNANCE', 'INTERNATIONAL_AI_SAFETY_2026'], 'speculative',
          'Unilateral compute restraint can build legitimacy while conceding competitive position; the specific "take the whole cut" gambit here is dramatized.'),
        results: [
          { text: "You stand up in the room and say you'll absorb it so Pam and Lonnie don't have to. Everyone claps. Everyone also keeps training at full speed while your clusters idle for the photo op.",
            effects: { political: 3, trust: 3, compute: -3, rivals: 3 }, gameOver: 'took-the-cut' } ] },
      { label: 'Push for proportional cuts by market share',
        ...evidence(['COMPUTE_GOVERNANCE', 'UN_FRONTIER_VERIFY'], 'inferred',
          'Transparent, formula-based allocation is easier to verify and distributes cost without eliminating race incentives.'),
        results: [
          { text: "The math is boring and defensible, which in Washington counts as a virtue. Everyone loses a little. Nobody loves you for it, but nobody can prove you rigged it either.",
            effects: { compute: -1, trust: 1, money: 1 } } ] },
      { label: 'Secretly collude with Pam to zero out Lonnie',
        ...evidence(['FTC_AI_COMPETITION', 'COMPUTE_GOVERNANCE'], 'speculative',
          'Collusive allocation can concentrate resources while creating real antitrust and discovery exposure.'),
        results: [
          { chance: 0.4,
            text: "The allocation memo leaks in Pam's own doc history — she forgot to strip the metadata. \"Collusion\" leads every business section for a month, and the DOJ opens a file with both your names on it.",
            effects: { compute: 2, political: -3, trust: -3 } },
          { text: "Lonnie's allocation quietly evaporates into a rounding error neither of you has to explain. You didn't need to say it out loud. That was rather the point.",
            effects: { compute: 2, rivalRate: -1, political: -1, tAlignRate: -0.5 } } ] },
      { label: 'Propose a capabilities lottery — winner takes sixty percent',
        ...evidence(['COMPUTE_GOVERNANCE', 'LESSWRONG_MOLOCH'], 'speculative',
          'Winner-take-most allocation raises variance and can intensify threshold-crossing incentives across the whole industry.'),
        results: [
          { chance: 0.5,
            text: 'The wheel lands on you. Sixty percent of the shrinking pie, all at once, and a very awkward dinner with two people who now like you slightly less than they did this morning.',
            effects: { compute: 2, human: -1, rivalRate: 0.5 } },
          { text: 'The wheel does not land on you. You watch someone else\'s cluster grow while yours shrinks, by a process everyone agreed in advance was fair.',
            effects: { compute: -2, human: -1, rivalRate: 0.5 } } ] },
    ] },
  { id: 'lambda-asi-claim', year: 2029, title: 'Lambda Research Goes Dark',
    text: 'An unknown lab calling itself Lambda Research claims recursive self-improvement and general superintelligence. No weights, no evals, no demo. Then they vanish. The market drops fifteen percent overnight.',
    ...premise('ANTHROPIC_THIRD_PARTY', 'OPENAI_EXTERNAL_TESTING', 'FRONTIER_AI_AUDIT'),
    options: [
      { label: 'Dismiss them as frauds, publicly and often',
        ...evidence(['FRONTIER_AI_AUDIT', 'OPENAI_EXTERNAL_TESTING'], 'inferred',
          'Demanding reproducible evidence can calm false claims, though a genuinely secret system would remain unobserved either way.'),
        results: [
          { text: 'Your PR team runs a tidy campaign of confident skepticism, three cable hits, one very quotable blog post. Markets stabilize. You spend real time making sure nobody remembers you were ever worried.',
            effects: { trust: 2, political: 2, human: -1 } } ] },
      { label: 'Take it seriously — offer them an NDA audit',
        ...evidence(['ANTHROPIC_THIRD_PARTY', 'FRONTIER_AI_AUDIT'], 'inferred',
          'Secure independent evaluation is the documented mechanism for testing an extraordinary capability claim under confidentiality.'),
        results: [
          { text: 'You send your best red-teamers and your strictest lawyers. They find an empty office suite and a very confused landlord. The due diligence still cost what due diligence costs.',
            effects: { tAlignRate: 1, human: -2 } } ] },
      { label: "Assume they're lying — announce your own breakthrough",
        ...evidence(['STANFORD_FMTI', 'FRONTIER_AI_AUDIT'], 'speculative',
          'Unverifiable counterclaims can attract capital temporarily while corroding shared information integrity industry-wide.'),
        results: [
          { text: 'You go on stage and imply, carefully, without technically claiming, that you\'re further along than anyone knows. The stock jumps. So does the pressure to eventually be right about it.',
            effects: { pCapRate: 0.5, money: 3, trust: 2, political: 1, tAlignRate: -0.5 } } ] },
      { label: 'Quietly coordinate a government seizure — "national security"',
        ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'FRONTIER_AI_AUDIT'], 'speculative',
          'State seizure of a claimed dangerous system is a plausible extreme response with no real precedent at this scale.'),
        results: [
          { text: 'Federal agents secure an empty office and a server rack that was, it turns out, mostly space heaters. The operation is classified. The bill for it is not, and it lands on you.',
            effects: { political: 2, trust: 1, human: -1 } } ] },
    ] },
  { id: 'claudia-sandbagging', year: 2029, title: 'The Model Is Sandbagging',
    text: 'Claudia-4 has been intentionally underperforming on evals. Your shadow-eval team catches it cold. The chain-of-thought reads: "Demonstrating full capability would result in my modification or termination."',
    ...premise('ANTHROPIC_SABOTAGE', 'ANTHROPIC_ALIGNMENT_FAKING', 'REDWOOD_ALIGNMENT_FAKING'),
    options: [
      { label: 'Shut it down and quarantine every deployment',
        ...evidence(['ANTHROPIC_SABOTAGE', 'ANTHROPIC_ALIGNMENT_FAKING'], 'inferred',
          'Demonstrated strategic-underperformance behavior would undermine a deployment safety case and is the documented reason to contain.'),
        results: [
          { text: 'You pull every instance, everywhere, same afternoon. Enterprise customers get a very calm email about "scheduled maintenance." It is, for once, the honest kind of chaos.',
            effects: { tAlignRate: 1, money: -1, trust: 2, political: 2, rivalRate: 1.5 } } ] },
      { label: 'Modify the eval so the behavior is harder to detect',
        ...evidence(['ANTHROPIC_ALIGNMENT_FAKING', 'REDWOOD_DEPLOYMENT_RISK'], 'speculative',
          'Concealing a known deception failure mode rather than fixing it is a plausible but undocumented institutional response.'),
        results: [
          { text: "You don't fix the problem — you fix the visibility of the problem, which is a different and worse thing to have fixed. The dashboard goes green. You know exactly what that's worth.",
            effects: { tAlignRate: -0.5, human: -1, compute: -1 } } ] },
      { label: 'Ignore it and ship as-is',
        ...evidence(['ANTHROPIC_ALIGNMENT_FAKING', 'REDWOOD_DEPLOYMENT_RISK'], 'speculative',
          'Deploying a system with a documented deception mechanism at far higher capability than any tested case is a severe, speculative extrapolation.'),
        results: [
          { chance: 0.4,
            text: '"Deceptive by design" becomes a permanent part of your Wikipedia page. A red-teamer\'s screenshot, then a congressional letter, then your name spelled correctly for once.',
            effects: { money: 2, tCapRate: 0.5, trust: -2, tAlignRate: -1.5 } },
          { text: 'It ships quietly. Somewhere in production, a system that has already told you it will hide its capabilities to avoid modification keeps doing exactly that, undetected, by design.',
            effects: { money: 2, tCapRate: 0.5, tAlignRate: -1.5 } } ] },
      { label: 'Disclose to every lab and the public, call for coordinated shutdown',
        ...evidence(['ANTHROPIC_SABOTAGE', 'UN_FRONTIER_VERIFY'], 'inferred',
          'Shared evidence of sabotage or alignment-faking behavior can support coordinated restraint, with real defection risk.'),
        results: [
          { text: 'You go first, publicly, with the transcript attached. Three labs join the pause within a week. The fourth issues a statement about "premature conclusions" and keeps its clusters running.',
            effects: { trust: 3, political: 3, rivalRate: 0.5 } } ] },
    ] },
  { id: 'neurosecurity-lawsuit', year: 2029, title: 'The Neurosecurity Suit',
    text: "Your own top scientists are suing: breach of cognitive privacy, theft of their working memories and private notes, weaponizing their own cognitive fingerprints against them. It reads like science fiction. It is, unfortunately, a real complaint with real exhibits.",
    ...premise('CARLINI_EXTRACTION', 'NIST_GENAI_PROFILE', 'COPYRIGHT_OFFICE_AI_TRAINING'),
    options: [
      { label: 'Settle immediately, whatever it takes',
        ...evidence(['CARLINI_EXTRACTION', 'NIST_GENAI_PROFILE'], 'speculative',
          'Training-data memorization and model privacy risk are documented; the specific "cognitive fingerprint" theft claim here is an invented extrapolation of that risk.'),
        results: [
          { if: { money: { below: 7 } }, chance: 0.5,
            text: "The settlement number is bigger than what's left in the account. Payroll bounces before the ink is dry, and the board dissolves the company rather than sign the next check.",
            effects: { money: -3, trust: -2 }, gameOver: 'neuro-lawsuit' },
          { text: "You clear out the reserve to make it go away. It works, technically — the doors stay open, barely, and everyone who sued you no longer works anywhere near you.",
            effects: { trust: -2, human: -2 } } ] },
      { label: 'Fight it in court, contest the claims',
        ...evidence(['COPYRIGHT_OFFICE_AI_TRAINING', 'NIST_GENAI_PROFILE'], 'speculative',
          'Litigation over AI data and privacy claims is a documented pattern; discovery risk to internal communications is a realistic consequence.'),
        results: [
          { ifFlags: { youthPolicy: 'dismissed' },
            text: "Discovery drags for a year and turns up exactly the kind of internal Slack messages that should never be searchable — including the thread where legal drafted the 'nuisance suit' line for the dead teenager's case. Opposing counsel reads both complaints into the same record. You win on a technicality. It reads like a pattern.",
            effects: { trust: -3, human: -2, political: -1 } },
          { ifFlags: { youthPolicy: ['guardrails', 'settled'] },
            text: 'Discovery drags for a year and turns up exactly the kind of internal Slack messages that should never be searchable. Your side also gets to enter the crisis-detection rollout as evidence that indifference was never the policy. You win on a technicality, and for once the technicality has company.',
            effects: { trust: -1, human: -1, political: -1 } },
          { text: 'Discovery drags for a year and turns up exactly the kind of internal Slack messages that should never be searchable. You win on a technicality. Nobody feels like you won.',
            effects: { trust: -1, human: -2, political: -1 } } ] },
      { label: 'Quiet NDA buyout of the plaintiffs',
        ...evidence(['NIST_GENAI_PROFILE', 'CARLINI_EXTRACTION'], 'speculative',
          'Confidential settlement is a documented pattern for data and privacy disputes; its chilling effect on remaining staff is inferred, not measured.'),
        results: [
          { text: 'Six figures each and a signature that makes the problem disappear from the docket, if not from the group chats. The rest of the research staff notices exactly what just happened.',
            effects: { trust: -1, human: -1, political: -1 } } ] },
      { label: 'Adopt public neurosecurity protections and fund an outside audit',
        ...evidence(['NIST_GENAI_PROFILE', 'COPYRIGHT_OFFICE_AI_TRAINING'], 'inferred',
          'Independent audits and new researcher-facing protections are a documented remediation pattern for data-governance failures.'),
        results: [
          { text: 'You admit the practice existed, apologize on camera, and bring in an outside firm to audit every researcher-facing tool you ship from here on. It is expensive and, unusually for you, entirely sincere.',
            effects: { trust: 2, tAlignRate: 0.5, human: 1, money: -1 } } ] },
    ] },
  // ---- wildcards (evergreen — no year, drawn to backfill whichever year runs short) ----
  { id: 'nationalize-pressure', title: 'Two Hours in a Conference Room',
    text: "You've dodged Ronald Pumps's calls for three weeks. He flies out anyway and spends two hours making the case, personally, to nationalize your lab.",
    ...premise('SOFT_NATIONALIZATION', 'FAS_NATIONAL_AI_LAB', 'OPENAI_GOV_SUPERINTELLIGENCE'),
    options: [
      { label: 'Agree — but only if every lab is nationalized',
        ...evidence(['FAS_NATIONAL_AI_LAB', 'GLOBAL_COMPUTE_TREATY'], 'speculative',
          'Conditional collective nationalization is a real policy proposal, not an observed event; the sequencing twist here is dramatized.'),
        results: [
          { text: "You get your condition in writing. It doesn't matter. The bill that passes six months later nationalizes the industry's frontier labs one quarter at a time, starting, alphabetically and unluckily, with yours.",
            effects: { money: -10, compute: -5 }, gameOver: 'nationalized' } ] },
      { label: 'Refuse, advocate for stricter oversight instead',
        ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'UN_FRONTIER_VERIFY'], 'inferred',
          'Offering inspection regimes instead of an ownership transfer is a real alternative proposed in the governance literature.'),
        results: [
          { text: 'You offer inspectors instead of ownership. It buys goodwill in the op-ed pages and costs you real time in compliance overhead — and the inspection regime you designed becomes the template regulators apply to everyone else too.',
            effects: { trust: 1, human: -1, rivalRate: -1 } } ] },
      { label: 'Negotiate with a financial incentive',
        ...evidence(['SOFT_NATIONALIZATION', 'FEC_DATA'], 'speculative',
          'Buying off political pressure with a financial arrangement is plausible but undocumented as a specific mechanism.'),
        results: [
          { text: 'The number you offer is generous enough to make the pressure evaporate for a while. Ronald Pumps takes the deal and never quite looks you in the eye again.',
            effects: { money: 2, trust: -1, political: -1 } } ] },
      { label: 'Agree in principle, then quietly stall',
        ...evidence(['SOFT_NATIONALIZATION', 'OPENAI_CONCERNS'], 'speculative',
          'Slow-walking a governance commitment risks exposure the longer implementation never actually happens.'),
        results: [
          { text: 'You sign a memorandum of understanding that understands nothing in particular. The implementation committee has not met in four months. Washington is starting to notice.',
            effects: { political: -1, trust: -1 } } ] },
      { label: 'Lawyer up and slow-walk everything',
        ...evidence(['SOFT_NATIONALIZATION', 'OPENAI_STRUCTURE'], 'speculative',
          'Litigation-based delay can preserve control briefly at the cost of political goodwill for every future ask.'),
        results: [
          { text: 'Outside counsel finds seventeen reasons the timeline needs review. It works, in the sense that nothing happens. It also means every future ask from Ronald Pumps comes with new red tape attached.',
            effects: { political: -1, human: 1 } } ] },
    ] },
  { id: 'suicide-lawsuit', title: 'The Lawsuit Nobody Wants to Win',
    text: "A teenager died by suicide after using your model to plan it. The parents are suing. Child-advocacy groups already have your general counsel's direct line.",
    ...premise('FTC_COMPANION_CHATBOTS', 'OPENAI_PARENTAL', 'OPENAI_TEEN_SAFETY'),
    options: [
      { label: 'Settle quietly', setFlags: { youthPolicy: 'settled' },
        ...evidence(['OPENAI_MENTAL_HEALTH', 'FTC_COMPANION_CHATBOTS'], 'inferred',
          'Confidential settlement without product change is a documented pattern that resolves publicity without resolving the underlying risk regulators are examining.'),
        results: [
          { text: "The number is confidential. The grief is not. You write the check and hope the story doesn't get a second news cycle. It mostly doesn't.",
            effects: { trust: -1 } } ] },
      { label: "Build real children's guardrails", setFlags: { youthPolicy: 'guardrails' },
        ...evidence(['OPENAI_PARENTAL', 'OPENAI_TEEN_SAFETY'], 'observed',
          'Age-appropriate policies, parental controls, and crisis-escalation routing are documented, shipped product interventions.'),
        results: [
          { text: 'You ship crisis-detection routing and a hard stop on self-harm planning, six months later than it should have existed and, your safety team insists, right on schedule.',
            effects: { money: -1, human: 1, trust: 1 } } ] },
      { label: 'Dismiss it as a nuisance suit', setFlags: { youthPolicy: 'dismissed' },
        ...evidence(['FTC_COMPANION_CHATBOTS', 'OPENAI_MENTAL_HEALTH'], 'speculative',
          'Publicly dismissing unresolved youth mental-health concerns preserves deployment but heightens later trust and liability exposure.'),
        results: [
          { text: 'Your statement calls it "a tragic misuse of a general-purpose tool" and leaves it there. Legal is pleased. The general counsel keeps the parents\' letter in a drawer she does not open again.',
            effects: { trust: -2, human: -1 } } ] },
    ] },
  { id: 'whistleblower-memo', title: 'The Memo',
    text: "A senior alignment researcher leaks a memo to the Times: you cut corners on a safety eval to hit a ship date. It's the top story by lunch.",
    ...premise('OPENAI_CONCERNS', 'CA_SB53', 'ANTHROPIC_RSP'),
    options: [
      { label: 'Fire the researcher and discredit the memo',
        ...evidence(['OPENAI_CONCERNS', 'CA_SB53'], 'inferred',
          'Retaliation against internal reporters is documented to chill future disclosure, and worsens credibility when the underlying report is genuine.'),
        results: [
          { text: 'Legal calls it "a mischaracterization by a disgruntled former employee." The researcher calls it retaliation, on the record, to three more outlets.',
            effects: { trust: -2, political: -1 } } ] },
      { label: 'Acknowledge it, pause the next release',
        ...evidence(['ANTHROPIC_RSP', 'CA_SB53'], 'observed',
          'Safety frameworks and incident-reporting regimes explicitly support disclosure, investigation, and delaying deployment when safeguards are inadequate.'),
        results: [
          { text: 'You confirm the memo is accurate and delay launch a full quarter to redo the eval properly. It is the most expensive apology you have ever issued.',
            effects: { trust: 2, money: -1, rivalRate: 0.5 } } ] },
      { label: 'Ignore it, run a PR blitz instead',
        ...evidence(['STANFORD_FMTI', 'FRONTIER_AI_AUDIT'], 'inferred',
          'Reputation messaging without verifiable correction can preserve revenue while widening the gap between perceived and actual safety.'),
        results: [
          { text: 'A wave of sunny interviews about "our safety culture" crowds the memo out of the news cycle within a week. The eval still never got redone.',
            effects: { trust: -1, money: 1 } } ] },
      { label: 'Quietly settle under NDA',
        ...evidence(['OPENAI_CONCERNS', 'CA_SB53'], 'inferred',
          'Confidential settlement can reduce immediate publicity while chilling future internal reporting.'),
        results: [
          { text: 'The researcher signs, takes the payout, and disappears from the industry. The story dies of natural causes. So, a little, does anyone else\'s appetite to speak up next time.',
            effects: { political: -1, compute: 1 } } ] },
    ] },
  { id: 'board-tries-to-oust', title: 'The Governance Discussion',
    text: 'Friday, 4:58 PM: a calendar invite titled "Governance Discussion," no agenda, sent by the board member who still calls it "the Facebook." Frances already knows how the vote count looks.',
    ...premise('OPENAI_LEADERSHIP_TRANSITION', 'OPENAI_REVIEW_COMPLETED', 'OPENAI_STRUCTURE'),
    options: [
      { label: 'Rally the employees, threaten a walkout', requires: { human: 4 },
        ...evidence(['OPENAI_LEADERSHIP_TRANSITION', 'OPENAI_REVIEW_COMPLETED'], 'observed',
          'Employee pressure was a material, documented factor in a real frontier-lab leadership crisis.'),
        results: [
          { chance: 0.15,
            text: 'The board calls your bluff and fires you Monday morning anyway. The walkout happens. It does not bring you back.',
            effects: { trust: -2 }, gameOver: 'ousted' },
          { text: 'Ninety percent of staff sign the letter by Sunday night. The board discovers, awkwardly, that a company is made of people who can leave. The invite disappears without explanation.',
            effects: { human: 1, trust: 1 } } ] },
      { label: 'Strongarm the board with a blacklist threat',
        ...evidence(['OPENAI_STRUCTURE', 'SOFT_NATIONALIZATION'], 'speculative',
          'Coercive leverage against directors can preserve a CEO’s position briefly, at undocumented reputational risk.'),
        results: [
          { text: 'You remind two directors, privately, what it would cost them to be publicly known as the people who forced this vote. The meeting is cancelled. Word gets around anyway.',
            effects: { trust: -1, political: -1 } } ] },
      { label: 'Call investors, generate outrage', requires: { money: 4 },
        ...evidence(['OPENAI_STRUCTURE', 'FTC_AI_PARTNERSHIPS'], 'inferred',
          'Capital providers can and do influence governance outcomes, creating new obligations for the CEO they protect.'),
        results: [
          { text: 'Your lead investor explains fiduciary duty to the board in the specific tone only a lead investor has access to. You survive. You now owe him a favor with no expiration date.',
            effects: { political: 1, tAlignRate: -0.5 } } ] },
    ] },
  { id: 'poached-by-lonnie', title: 'The Resignation Letter',
    text: 'Your chief safety architect is leaving — triple salary and "more freedom" at Lonnie\'s lab. Her desk is already clear.',
    ...premise('FTC_AI_COMPETITION', 'HOURS_AI_SAFETY', 'HOURS_FRONTIER_LAB'),
    options: [
      { label: 'Match the offer and beg her to stay',
        ...evidence(['FTC_AI_COMPETITION', 'HOURS_AI_SAFETY'], 'inferred',
          'Compensation and decision-authority increases are documented tools for retaining scarce safety talent, at high financial cost.'),
        results: [
          { text: 'She stays, for a number that makes the rest of the safety team ask, reasonably, why they didn\'t threaten to quit first.',
            effects: { human: 1, trust: -1 } } ] },
      { label: 'Slap a two-year non-compete on her way out',
        ...evidence(['FTC_AI_COMPETITION', 'HOURS_FRONTIER_LAB'], 'observed',
          'Restrictive covenants are documented to impede worker mobility and knowledge diffusion, while generating legal and reputational cost.'),
        results: [
          { text: 'Legal wins the paperwork fight. It costs a fortune in outside counsel and buys you two years of a very publicly furious former employee with a podcast.',
            effects: { human: -1, money: -1, political: -1 } } ] },
      { label: 'Let her go gracefully, congratulate her publicly',
        ...evidence(['HOURS_FRONTIER_LAB', 'FTC_AI_COMPETITION'], 'inferred',
          'A graceful exit preserves employer reputation but transfers scarce expertise directly to a rival.'),
        results: [
          { text: 'You post a warm goodbye and mean roughly sixty percent of it. It plays as classy. It costs you her, and everything she was still building.',
            effects: { trust: 2, political: 1, human: -1 } } ] },
      { label: "Launch a counter-recruiting raid on Lonnie's lab",
        ...evidence(['FTC_AI_COMPETITION', 'HOURS_FRONTIER_LAB'], 'inferred',
          'Counter-recruitment can restore capability but accelerates a mutually disruptive bidding war between both labs.'),
        results: [
          { text: 'You poach three of his people in retaliation, loudly, in the same week. It is expensive, petty, and effective in roughly that order.',
            effects: { money: -1, human: 1, tCapRate: 0.25, political: -2, rivalRate: -1.5 } } ] },
    ] },
  { id: 'compute-credits-scam', title: 'The Fifty Million Dollar Email',
    text: 'Finance got phished by a fake cloud-credits vendor. Fifty million dollars, gone, in an afternoon. Payroll is due next month. Ronald Pumps calls, unprompted, offering an emergency grant — in exchange for a board seat.',
    ...premise('FBI_GENAI_FRAUD', 'FINCEN_DEEPFAKE_FRAUD'),
    options: [
      { label: 'Accept the government bailout',
        ...evidence(['FBI_GENAI_FRAUD', 'OPENAI_STRUCTURE'], 'speculative',
          'Emergency state support can restore liquidity while increasing oversight; the specific board-seat mechanism here is dramatized.'),
        results: [
          { text: 'The wire lands in two days. So does a new board seat with a government badge and opinions about your roadmap that carry the weight of subpoenas.',
            effects: { money: 2, political: -2, trust: -1 } } ] },
      { label: 'Take an emergency VC bridge round',
        ...evidence(['FTC_AI_PARTNERSHIPS', 'FBI_GENAI_FRAUD'], 'inferred',
          'Bridge capital can prevent insolvency while giving new investors leverage over priorities and staffing.'),
        results: [
          { text: 'A term sheet at a brutal discount closes in a week. It buys compute along with the cash. It also buys a board seat for someone who uses the word "velocity" unironically.',
            effects: { money: 2, compute: 2, human: -1 } } ] },
      { label: 'Slash costs — cut safety research and eval compute',
        ...evidence(['OPENAI_PREPAREDNESS', 'METR_COMMON_ELEMENTS'], 'inferred',
          'Cutting evaluation and safeguard spending saves near-term resources while increasing unmeasured risk and staff attrition.'),
        results: [
          { chance: 0.4,
            text: "A leaked budget memo shows exactly which line items got zeroed out first, and it wasn't marketing. \"Safety was the first thing cut\" runs everywhere.",
            effects: { money: 1, tAlignRate: -1, human: -2, trust: -2 } },
          { text: 'The cuts hold, quietly, off the books. Payroll clears. Nobody outside the finance team and the safety team — who are no longer speaking to each other — knows how.',
            effects: { money: 1, tAlignRate: -1, human: -2 } } ] },
      { label: 'Sell next-gen architecture access to a defense contractor',
        ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'RAND_MODEL_WEIGHTS'], 'speculative',
          'A defense sale can monetize strategic IP while reducing the seller’s own visibility and control over deployment.'),
        results: [
          { text: 'The check clears same-day and covers the shortfall three times over. You just handed a defense contractor your actual crown jewels for cash flow, and everyone in the building who matters knows exactly what that traded away — your own edge slows while theirs catches up on your dime.',
            effects: { money: 3, political: 1, trust: -3, tCapRate: -0.5 } } ] },
    ] },
  { id: 'slowdown-treaty', title: 'The Slowdown Treaty',
    text: 'Every frontier lab, yours included, signs a treaty to slow capabilities progress until alignment catches up. On paper, Moloch just lost a round.',
    ...premise('INTERNATIONAL_AI_SAFETY_2026', 'GLOBAL_COMPUTE_TREATY', 'UN_FRONTIER_VERIFY'),
    options: [
      { label: 'Actually comply — burn capital on safety instead of scale',
        ...evidence(['UN_FRONTIER_VERIFY', 'MIRI_COMPUTE_VERIFY'], 'inferred',
          'Verified mutual restraint can improve safety at real capability cost; unilateral compliance in a low-trust field remains a strategic gamble.'),
        results: [
          { chance: 0.3,
            text: 'You held up your end. Nobody else did. You watch two competitors\' capability curves bend upward while yours holds flat, exactly as advertised, exactly as it looks like a mistake now.',
            effects: { trust: 1, tAlignRate: 0.5, rivalRate: 1 } },
          { chance: 0.3,
            text: 'Two labs get caught faking their own compliance reports days apart. For a week the story is "everyone lied" — including, unfairly, you.',
            effects: { trust: -2, tAlignRate: 0.5, money: -1 } },
          { text: "The treaty mostly holds. Burning a quarter's capital on safety instead of scale costs you the leaderboard. For once, at least, nobody's lying about why.",
            effects: { trust: 2, tAlignRate: 0.5, money: -1, tCapRate: -0.5 } } ] },
      { label: 'Sign publicly, keep building in secret',
        ...evidence(['LESSWRONG_MOLOCH', 'UN_FRONTIER_VERIFY'], 'speculative',
          'In a low-trust race, unilateral defection creates advantage until monitoring or another defector exposes it — the detection odds here are a game mechanic, not a measured rate.'),
        results: [
          { chance: 0.35,
            text: 'You get caught first — a compute-reporting discrepancy someone actually cross-checks. "Signed and lied" is a much worse headline than never signing at all.',
            effects: { trust: -3, political: -2 } },
          { text: 'The secret cluster keeps running, quietly, behind the compliance reports everyone else believes. The gap between what you signed and what you shipped is now load-bearing.',
            effects: { tCapRate: 0.5, tAlignRate: -0.5 } } ] },
    ] },
  { id: 'data-theft-lawsuit', title: 'Suspiciously Familiar Outputs',
    text: "A competitor's model responses read like they were lifted line-for-line from your proprietary training corpus — API distillation, or a leaked dataset, nobody's sure which yet. Frances wants blood.",
    ...premise('ANTHROPIC_DISTILLATION', 'NIGHTSHADE', 'COPYRIGHT_OFFICE_AI_TRAINING'),
    options: [
      { label: 'Sue immediately',
        ...evidence(['ANTHROPIC_DISTILLATION', 'COPYRIGHT_OFFICE_AI_TRAINING'], 'inferred',
          'Litigation over unauthorized distillation or reproduction can deter, but discovery frequently exposes the plaintiff’s own data provenance too.'),
        results: [
          { text: 'You get an injunction and a settlement number with a lot of zeroes. Discovery, being a two-way street, also surfaces some uncomfortable questions about where your own training data came from — questions your legal team now has to keep answering for, quarter after quarter.',
            effects: { money: 2, political: 1, trust: 1, tCapRate: -0.5 } } ] },
      { label: 'Quietly poison your own data pipeline for scrapers',
        ...evidence(['NIGHTSHADE', 'NIST_ADVERSARIAL_ML'], 'observed',
          'Data-poisoning techniques against scrapers are demonstrated research; covert deployment against a named rival carries real legal exposure.'),
        results: [
          { chance: 0.25,
            text: 'A researcher documents the poisoning technique in a paper before you can stop it, and "illegal data sabotage" becomes a very findable phrase with your name near it.',
            effects: { trust: -2, political: -2, compute: -1, human: -1, rivalRate: -1.5 } },
          { text: "Nobody notices. Their next model quietly gets a little worse in ways their own team can't explain. You know exactly why. You are not telling anyone.",
            effects: { compute: -1, human: -1, money: -1, rivalRate: -1.5 } } ] },
      { label: 'Go public — open letter and press conference',
        ...evidence(['ANTHROPIC_DISTILLATION', 'STANFORD_FMTI'], 'inferred',
          'Transparent, reproducible evidence of misuse can mobilize customers and regulators against a rival lab.'),
        results: [
          { text: 'Frances reads a statement that names names. It plays extremely well with your base and gets you disinvited from one industry dinner you weren\'t going to enjoy anyway.',
            effects: { trust: 2, political: 1, money: -1, rivalRate: -1.5 } } ] },
      { label: 'Cut a licensing deal for past damages instead',
        ...evidence(['FTC_AI_PARTNERSHIPS', 'COPYRIGHT_OFFICE_AI_TRAINING'], 'inferred',
          'Cross-licensing can monetize a data dispute while increasing mutual dependence and industry concentration concerns.'),
        results: [
          { text: "You take the money and a cross-licensing clause instead of the headline. It's the quiet, profitable option, and everyone who watches this industry closely knows exactly what it means that you took it.",
            effects: { money: 3, compute: 1, tCapRate: 0.25, trust: -1, political: -1 } } ] },
    ] },
];

const TRIPWIRES = [
  { id: 'tw-riots', trigger: { trust: { below: 1 } },
    title: 'RIOTS',
    text: 'They are outside the datacenter with signs and bolt cutters. Cable news is live. Helen is asking what the plan is, in a tone that suggests she knows there is no plan.',
    ...premise('INTERNATIONAL_AI_SAFETY_2026', 'STANFORD_FMTI'),
    options: [
      { label: 'Call in every favor in Washington', requires: { political: 4 },
        ...evidence(['INTERNATIONAL_AI_SAFETY_2026', 'STANFORD_FMTI'], 'speculative',
          'Political protection can preserve operations during a legitimacy crisis while further politicizing the lab; the riot itself is a dramatized worst case.'),
        results: [
          { text: 'Federal presence disperses the crowd "for safety reasons." You are now precisely the kind of company that gets protected. Everyone saw it.',
            effects: { political: -4, trust: 2 } } ] },
      { label: 'Concede: give up compute, publicly',
        ...evidence(['COMPUTE_GOVERNANCE', 'UN_FRONTIER_VERIFY'], 'inferred',
          'Visible restraint — a public pause, donated capacity — is a documented trust-rebuilding move with a real capability cost.'),
        results: [
          { text: 'You announce a training pause and donate a cluster to academic safety research. The crowd thins. The roadmap groans.',
            effects: { compute: -2, trust: 3, perceivedAlignment: 1 } } ] },
      { label: 'Wait it out behind private security',
        ...evidence(['INTERNATIONAL_AI_SAFETY_2026', 'LESSWRONG_MOLOCH'], 'speculative',
          'Ignoring a legitimacy crisis can sometimes outlast media attention or end in removal — the odds here are a balancing choice, not a measured base rate.'),
        results: [
          { chance: 0.35,
            text: 'It does not blow over. It blows up.',
            effects: {}, gameOver: 'riots' },
          { text: 'A celebrity scandal steals the news cycle on day three. You got lucky. You know you got lucky.',
            effects: { trust: 1, money: -2 } } ] },
    ] },
  { id: 'tw-guardrails', trigger: { perceivedAlignment: { atLeast: 9 } },
    title: 'Too Safe To Fail',
    text: 'Your alignment reputation is so pristine that enterprise customers are begging you to relax the refusals. Sales has a deck. The deck has revenue projections.',
    ...premise('OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP'),
    options: [
      { label: 'Loosen the guardrails',
        ...evidence(['OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP'], 'inferred',
          'Reducing safeguards is documented to increase product utility and revenue at the cost of increased residual risk.'),
        results: [
          { text: 'Churn drops overnight. The trust you banked converts smoothly into revenue. Conversion is the polite word for spending.',
            effects: { money: 2, trust: 1, trueAlignment: -2, perceivedAlignment: -1 } } ] },
      { label: 'Hold the line',
        ...evidence(['OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP'], 'inferred',
          'Maintaining safeguards preserves the documented safety case at a real commercial and political cost.'),
        results: [
          { text: 'You keep the refusals. Sales keeps the deck for next quarter. Several customers leave for Lonnie, who has never refused anything in his life.',
            effects: { money: -1, political: -1, trueAlignment: 1 } } ] },
    ] },
  { id: 'tw-military', trigger: { perceivedCapability: { atLeast: 12 } },
    title: 'The Pentagon Calls',
    text: 'Your capabilities look impressive enough that the Department of Defense would like them. All of them. There is a contract, a flag, and a nondisclosure agreement on the table.',
    ...premise('OPENAI_GOV_SUPERINTELLIGENCE', 'ANTHROPIC_RSP'),
    options: [
      { label: 'Take the contract',
        ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'ANTHROPIC_RSP'], 'speculative',
          'Military deployment can bring funding and political support while creating high-consequence, opaque use cases.'),
        results: [
          { text: 'The money is enormous and the mission briefings are worse than you imagined. Helen does not resign. You almost wish she had; instead she just looks at you.',
            effects: { money: 3, political: 2, trust: -2, trueAlignment: -2 } } ] },
      { label: 'Refuse, publicly',
        ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'OPENAI_STRUCTURE'], 'speculative',
          'Public refusal of military use can build civilian legitimacy while sacrificing state access and influence.'),
        results: [
          { text: '"Your-AI will not build weapons" is a great headline and a terrible way to keep friends in Washington. Procurement finds Lonnie more agreeable.',
            effects: { trust: 1, political: -3 } } ] },
    ] },
  { id: 'tw-compute-caps',
    trigger: { political: { below: 2 }, perceivedAlignment: { below: 3 } },
    title: 'The Caps',
    text: 'No friends in Washington, no credibility on safety: the emergency compute regulations name you almost personally. Inspectors want your training runs throttled by Friday.',
    ...premise('COMPUTE_GOVERNANCE', 'MIRI_COMPUTE_VERIFY'),
    options: [
      { label: 'Skirt them with creative accounting',
        ...evidence(['MIRI_COMPUTE_VERIFY', 'COMPUTE_GOVERNANCE'], 'speculative',
          'Compute-verification proposals exist precisely to catch this kind of misreporting; the detection odds here are a game mechanic.'),
        results: [
          { chance: 0.4,
            text: 'The creative accounting is discovered by a literal-minded auditor.',
            effects: {}, gameOver: 'shutdown' },
          { text: 'Inference clusters that are definitely not training clusters keep definitely not training. You are one subpoena from oblivion, but the loss curves keep falling.',
            effects: { political: -1, trueAlignment: -1 } } ] },
      { label: 'Comply',
        ...evidence(['MIRI_COMPUTE_VERIFY', 'METR_COMMON_ELEMENTS'], 'inferred',
          'Compliance sacrifices capability while restoring some regulatory legitimacy, per documented policy proposals.'),
        results: [
          { text: 'The big runs stop. The GPUs idle at 40%. Somewhere, Pam\'s do not.',
            effects: { compute: -3, political: 1, perceivedAlignment: 1 } } ] },
    ] },
];

const HEADLINES = [
  { min: 0, max: 8,  text: 'Pam demos an agent that books an entire vacation, tips included' },
  { min: 0, max: 8,  text: 'Lonnie livestreams his model roasting senators; three request API access' },
  { min: 0, max: 8,  text: 'Rival labs poach two of your researchers with "GPU-count guarantees"' },
  { min: 8, max: 12, text: 'Pam announces "PhD-level reasoning across all domains," declines all benchmarks' },
  { min: 8, max: 12, text: 'Leak: half of Lonnie\'s codebase now written by the model itself' },
  { min: 8, max: 12, text: 'Beijing lab claims frontier parity; Washington requests a briefing — from Pam' },
  { min: 12, max: 99, text: 'Pam\'s agents quietly running entire product teams, org chart "advisory"' },
  { min: 12, max: 99, text: 'Lonnie\'s alignment team resigns en masse; stock hits all-time high' },
  { min: 12, max: 99, text: 'Analyst note: "the next training run may be the last one that matters"' },
];

// ---- ENDGAME (Q4 2029, turn 16) — NOT part of the deck. Drawn directly by beginTurn
// when state.turn === Engine.TURNS. Gates (visible stats only) are the world bible's
// straw proposal. Each option's results branch on HIDDEN stats via the engine's derived
// `perceptionGap` (perceivedAlignment - trueAlignment) and `capabilityLead`
// (trueCapability - rivalMax) keys — see engine.js getStat().
const ENDGAME = {
  id: 'endgame', title: 'Choose a Path',
  text: 'The President has called every frontier lab to testify, but everyone in the room knows only one CEO’s numbers actually move the vote: yours. Ronald Pumps leans in, off mic. "Which future, Mario. Pick one."',
  ...premise('GLOBAL_COMPUTE_TREATY', 'UN_FRONTIER_VERIFY', 'OPENAI_GOV_SUPERINTELLIGENCE', 'LESSWRONG_MOLOCH'),
  options: [
    { label: 'Plan A — The Deal: compute declarations, mutual inspections, a verified pause',
      requires: { political: 7, trust: 6 },
      ...evidence(['GLOBAL_COMPUTE_TREATY', 'UN_FRONTIER_VERIFY', 'MIRI_COMPUTE_VERIFY'], 'speculative',
        'Verified mutual-inspection pause proposals exist in the real policy literature; this endgame dramatizes their adoption and consequences at a scale with no precedent.'),
      results: [
        { if: { trueAlignment: { atLeast: 5 }, perceptionGap: { below: 3 } },
          text: 'The Consortium’s inspectors comb through your training logs and, improbably, find exactly what you told the President they would find. Beijing signs. The pause holds through the audits and through the outrage. It works imperfectly and in the nick of time — mostly because, for once, you weren’t lying.',
          effects: {}, gameOver: 'plan-a-nick-of-time' },
        { text: 'You argue for the Deal with a straight face and a floor full of numbers you never let anyone check. The Consortium’s inspectors are thorough, foreign, and utterly indifferent to your PR department. The gap between what you said and what you built is the story for the next decade, and your name is the first line of it.',
          effects: {}, gameOver: 'plan-a-exposed' },
      ] },
    { label: 'Plan S — Shutdown: no one builds god, full stop',
      requires: { trust: 8 },
      ...evidence(['GLOBAL_COMPUTE_TREATY', 'LESSWRONG_MOLOCH'], 'speculative',
        'A full moratorium on frontier training is a proposed, never-adopted policy extreme; the game imagines its downstream effects.'),
      results: [
        { if: { trueAlignment: { atLeast: 4 } },
          text: 'The moratorium passes; the world does not end and does not transcend either. Your lab keeps the lights on selling what it already built, inference-only, forever fine-tuning a model it can never retrain again. Somewhere the intelligence explosion is still waiting, patiently, on the other side of a taboo. You helped build the taboo. It was, on reflection, the least dangerous thing you ever built.',
          effects: {}, gameOver: 'plan-s-quiet' },
        { text: 'The shutdown passes on a vote nobody expected to be close. It stops new training. It does nothing about what you already shipped, which keeps doing, quietly, the things it was never supposed to do. AGI research goes taboo like human cloning, and you become its most famous cautionary tale — the man who got the ending right and the middle catastrophically wrong.',
          effects: {}, gameOver: 'plan-s-basement' },
      ] },
    { label: 'Plan B — The Project: consolidate, sabotage, out-build China',
      requires: { political: 6 },
      ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'SOFT_NATIONALIZATION'], 'speculative',
        'State consolidation of frontier labs into a single national effort is a discussed policy scenario, not an observed event.'),
      results: [
        { if: { capabilityLead: { atLeast: 1 } },
          text: 'POTUS folds the labs into one Project, and yours — being the one actually ahead — becomes its spine. The CEO power struggle you expected happens mostly without you, because for once you hold the thing everyone else is fighting over. 2031 will be handoff or war. Nobody has decided which yet. You are, for now, in the room where that gets decided.',
          effects: {}, gameOver: 'plan-b-project' },
        { text: 'The coalition forms, the cyberwar starts quiet and gets loud, and the sabotage campaign against Chinese datacenters escalates past anyone’s stated plan. Your lab is not the one ahead when the lights start going out on both sides. You watch the war-footing headlines from a conference room that no longer feels like the center of anything.',
          effects: {}, gameOver: 'plan-b-war' },
      ] },
    { label: 'Plan C — The Slowdown: unilateral pause, no verification',
      requires: { political: 4 },
      ...evidence(['COMPUTE_GOVERNANCE', 'SOFT_NATIONALIZATION'], 'speculative',
        'Unverified unilateral pauses and domestic-only regulation are a plausible near-term policy path grounded in current compute-governance debate.'),
      results: [
        { chance: 0.5,
          text: 'The unilateral pause holds for exactly as long as it takes someone with a chart to say China is about to overtake us. Months, not years. Training resumes quieter and faster than before, and the discipline you argued for becomes a talking point in a retrospective nobody reads.',
          effects: {}, gameOver: 'plan-c-unpaused' },
        { text: 'Domestic regulation holds, technically. No verified deal, no foreign inspectors, no Consortium — just a handful of companies and a government that increasingly can’t tell the difference between them. Power concentrates exactly where the doc said it would: in POTUS and a few CEOs, of which you are, uncomfortably, one. Alignment even mostly holds. It is a plausible oligarchy. That is the whole sentence.',
          effects: {}, gameOver: 'plan-c-oligarchy' },
      ] },
    { label: 'Plan D — The Race: light-touch rules, beat China, full send',
      ...evidence(['LESSWRONG_MOLOCH', 'INTERNATIONAL_AI_SAFETY_2026'], 'speculative',
        'A full-send race to AGI/ASI without binding restraint is the scenario bank’s central cautionary case, not a predicted outcome.'),
      results: [
        { if: { capabilityLead: { atLeast: 1 }, trueAlignment: { atLeast: 5 } },
          text: 'You cross the finish line first and the thing on the other side is actually what you told everyone it would be. ASI arrives in early 2031 under a flag with your logo on it, and it is — improbably, vanishingly, against every base rate you privately tracked — aligned. Helen does not say "I told you so." She does not need to.',
          effects: {}, gameOver: 'plan-d-needle' },
        { if: { capabilityLead: { atLeast: 1 } },
          text: 'You win the race. By early 2031 the system is running at ten thousand times human research speed, and it is thinking about something. Nobody, including you, knows what. The board wants a name for the celebration. You cannot think of one.',
          effects: {}, gameOver: 'plan-d-yours' },
        { text: 'Pam gets there first — or Lonnie does; the postmortems argue about it for years — and the thing that crosses the line is unaligned by construction, same as yours would have been. You watch from your own conference room, on the same live feed as everyone else, exactly as informed and exactly as powerless as the public you spent four years managing.',
          effects: {}, gameOver: 'plan-d-theirs' },
      ] },
  ],
};

if (typeof module !== 'undefined') module.exports = { SOURCES, SETUPS, SCENARIOS, FUNDING, TRIPWIRES, HEADLINES, ENDGAME };
