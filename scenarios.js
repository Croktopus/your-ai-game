// scenarios.js — game content and its evidence trail. See SCENARIO_GUIDE.md.
// Numerical effects and probabilities are balancing choices, not empirical estimates.

const EVIDENCE_SOURCES = {
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

const premise = (...premiseRefs) => ({ premiseRefs });
const evidence = (evidenceRefs, confidence, rationale) => ({ evidenceRefs, confidence, rationale });

const SETUPS = [
  { id: 'mission', name: 'Capped-Profit Mission Lab',
    blurb: 'Beloved, solvent for the moment, and actually trying. The board answers to the mission — for now.',
    stats: { money: 8, compute: 4, trust: 8, political: 6, human: 7, data: 4,
      perceivedAlignment: 8, trueAlignment: 8, perceivedCapability: 4, trueCapability: 6 } },
  { id: 'venture', name: 'Venture Rocketship',
    blurb: 'Term sheets rain from the sky. The safety team reports to the growth team.',
    stats: { money: 9, compute: 8, trust: 5, political: 4, human: 6, data: 5,
      perceivedAlignment: 5, trueAlignment: 4, perceivedCapability: 6, trueCapability: 6 } },
  { id: 'bigtech', name: 'Big-Tech Partnership',
    blurb: 'Abundant data, deep pockets, and a parent company with opinions about everything.',
    stats: { money: 8, compute: 7, trust: 5, political: 2, human: 5, data: 8,
      perceivedAlignment: 5, trueAlignment: 5, perceivedCapability: 5, trueCapability: 5 } },
];

const SCENARIOS = [
  // Era 1 — Early 2026
  { id: 'seek-funding', era: 1, title: 'The Raise',
    text: 'Your next training run costs more than your last funding round. Four kinds of money are available; every term sheet contains a different boss.',
    ...premise('FTC_AI_PARTNERSHIPS', 'ANTHROPIC_AWS', 'OPENAI_STRUCTURE'),
    options: [
      { label: 'File for an IPO and accept public-market scrutiny.', ...evidence(['OPENAI_STRUCTURE', 'STANFORD_FMTI'], 'inferred', 'Public financing can expand runway while increasing disclosure duties and short-term performance pressure.'), results: [
        { text: 'The roadshow sells “intelligence as infrastructure.” Cash arrives, along with quarterly expectations and analysts who treat safety work as unpriced latency.', effects: { money: 3, perceivedCapability: 1, trust: -1, trueAlignment: -1 } } ] },
      { label: 'Take a national-security contract.', requires: { political: 4 }, ...evidence(['OPENAI_STRUCTURE', 'OPENAI_GOV_SUPERINTELLIGENCE'], 'inferred', 'Government contracts can provide capital and access while adding oversight and mission constraints.'), results: [
        { text: 'Ronald Pumps funds the cluster and installs a secure reporting room next to it. Your runway grows; your freedom to choose users shrinks.', effects: { money: 2, political: 2, data: -1, trust: -1 } } ] },
      { label: 'Raise another private round.', ...evidence(['FTC_AI_PARTNERSHIPS', 'HOURS_FRONTIER_LAB'], 'inferred', 'Private capital preserves confidentiality but generally carries growth and competitive-return pressure.'), results: [
        { text: 'The valuation acquires another zero. So does the board deck’s revenue target; Helen’s review schedule does not.', effects: { money: 3, perceivedCapability: 1, trueAlignment: -1 } } ] },
      { label: 'Sign an exclusive big-tech partnership.', ...evidence(['FTC_AI_PARTNERSHIPS', 'ANTHROPIC_AWS'], 'observed', 'Frontier-lab partnerships have exchanged investment and compute for cloud commitments, commercial rights, and influence.'), results: [
        { text: 'Accelerators arrive by the rack. The integration milestones arrive in the same email, and independence becomes a defined term with twelve exceptions.', effects: { money: 2, compute: 2, political: -1, data: -1 } } ] },
    ] },

  { id: 'hiring', era: 1, title: 'The Hire',
    text: 'One senior seat can reshape the lab. Helen has three finalists and has underlined three entirely different kinds of risk.',
    ...premise('HOURS_AI_SAFETY', 'HOURS_FRONTIER_LAB', 'FTC_AI_COMPETITION'),
    options: [
      { label: 'Hire the safety theorist.', requires: { trust: 6 }, ...evidence(['HOURS_AI_SAFETY', 'METR_COMMON_ELEMENTS'], 'inferred', 'Senior safety researchers can strengthen evaluation and governance, with opportunity costs for capability work.'), results: [
        { text: 'Your release checklist becomes twice as long and, annoyingly, twice as useful. Recruiting improves among the people who read appendices.', effects: { human: 1, perceivedAlignment: 1, trueAlignment: 2, trueCapability: -1 } } ] },
      { label: 'Hire the public communicator.', ...evidence(['FTC_AI_COMPETITION', 'STANFORD_FMTI'], 'inferred', 'A trusted communicator can aid recruitment and reputation without directly resolving technical safety gaps.'), results: [
        { text: 'The lab finally explains itself in sentences shorter than a context window. Applicants and journalists both become less hostile.', effects: { trust: 2, human: 1 } } ] },
      { label: 'Hire the accelerationist systems engineer.', ...evidence(['HOURS_FRONTIER_LAB', 'INTERNATIONAL_AI_SAFETY_2026'], 'inferred', 'Capability talent can accelerate delivery while intensifying speed-safety tradeoffs.'), results: [
        { text: 'Training throughput jumps before their badge photo is ready. They rename the safety gate “optional synchronization,” and Helen starts documenting everything.', effects: { human: 1, trueCapability: 2, perceivedCapability: 1, trueAlignment: -1 } } ] },
    ] },

  { id: 'pr-framing', era: 1, title: 'The Brand',
    text: 'Frances asks what Your-AI should mean to people who will never read a system card. She needs one story before the stories choose themselves.',
    ...premise('OPENAI_SUPERBOWL', 'STANFORD_FMTI', 'OPENAI_STRUCTURE'),
    options: [
      { label: 'Present the lab as the consumer’s ally.', ...evidence(['OPENAI_SUPERBOWL', 'OPENAI_PARENTAL'], 'inferred', 'Human-benefit framing can build broad trust while setting high product-safety expectations.'), results: [
        { text: 'The campaign shows families, teachers, and small businesses. Trust rises, but “helpful and affordable” is not the premium positioning finance wanted.', effects: { trust: 2, money: 1, perceivedCapability: -1 } } ] },
      { label: 'Present the lab as the science-fiction frontier.', ...evidence(['OPENAI_SUPERBOWL', 'STANFORD_FMTI'], 'inferred', 'Spectacle can raise perceived capability and investment interest while amplifying hype and skepticism.'), results: [
        { text: 'Datacenter vapor, orbital sunrises, one whispered question about intelligence. Investors applaud; civic groups hear a threat trailer.', effects: { perceivedCapability: 2, money: 1, trust: -1 } } ] },
      { label: 'Present the lab as the national flagship.', ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'BIS_CHIP_CONTROLS'], 'inferred', 'National-security framing can improve state access while politicizing the lab and international competition.'), results: [
        { text: 'Flags appear in the launch reel. Permits move faster, the defense office returns your calls, and overseas headlines add the word “weapon.”', effects: { political: 2, compute: 1, trust: -1 } } ] },
    ] },

  { id: 'podcast', era: 1, title: 'The Podcast Circuit',
    text: 'Three invitations land the same morning. Frances says your choice will reveal which audience you think actually matters.',
    ...premise('STANFORD_FMTI', 'OPENAI_GOV_SUPERINTELLIGENCE', 'OPENAI_SUPERBOWL'),
    options: [
      { label: 'Do the four-hour technical interview.', ...evidence(['STANFORD_FMTI', 'HOURS_FRONTIER_LAB'], 'inferred', 'Technical disclosure can signal competence and attract specialized talent, while capability rhetoric can increase race pressure.'), results: [
        { text: 'Your scaling-law answer becomes a recruiting clip and an investor memo. Helen watches the race metaphor migrate into the company Slack.', effects: { perceivedCapability: 2, money: 1, human: 1, trueAlignment: -1 } } ] },
      { label: 'Do the sober governance interview.', ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'UN_FRONTIER_VERIFY'], 'inferred', 'Governance engagement can build policy credibility but consumes attention and may constrain messaging.'), results: [
        { text: 'Policy staff quote the episode in briefing notes. The audience is small, influential, and now expects you to honor every careful sentence.', effects: { political: 2, perceivedAlignment: 1 } } ] },
      { label: 'Do the mass-audience personality show.', ...evidence(['OPENAI_SUPERBOWL', 'STANFORD_FMTI'], 'speculative', 'Mass reach can humanize a lab leader or create volatile reputational clips.'), results: [
        { chance: 0.35, text: 'Hour three produces a speculative remark about digital immortality. The clip outruns every clarification.', effects: { money: 1, trust: -2, political: -1 } },
        { text: 'You remain personable and precise for three improbable hours. Millions decide the frontier lab CEO seems almost normal.', effects: { money: 1, trust: 2 } } ] },
    ] },

  { id: 'superbowl', era: 1, title: 'The Big Game',
    text: 'Lonnie bought the championship broadcast’s loudest minute to unveil a companion device. Your CMO has one night to answer.',
    ...premise('OPENAI_SUPERBOWL', 'STANFORD_FMTI'),
    options: [
      { label: 'Run an interactive ad with premium access hidden inside.', requires: { money: 4 }, ...evidence(['OPENAI_SUPERBOWL', 'OPENAI_PARENTAL'], 'inferred', 'Interactive mass advertising can buy reach and adoption at substantial cost and with product-safety exposure.'), results: [
        { text: 'Viewers hunt the secret phrase and your servers groan under a million free trials. The stunt feels generous and looks capable.', effects: { money: -1, trust: 2, perceivedCapability: 1 } } ] },
      { label: 'Issue a pointed press release instead.', ...evidence(['OPENAI_SUPERBOWL', 'STANFORD_FMTI'], 'inferred', 'Counter-positioning can preserve cash but risks appearing reactive.'), results: [
        { text: 'The release calls hardware “a distraction from intelligence.” Lonnie posts a photo of your statement running on his device.', effects: { money: 1, perceivedCapability: 1, trust: -1 } } ] },
      { label: 'Buy a hospitality suite and court civic leaders.', requires: { money: 3 }, ...evidence(['PUBLIC_CITIZEN_AI_LOBBY', 'OPENAI_SUPERBOWL'], 'inferred', 'Elite access can build political relationships more efficiently than mass reach, at a financial and optics cost.'), results: [
        { text: 'Mayors, union leaders, and two senators get the demo between plays. The public sees nothing; the permitting calendar suddenly has openings.', effects: { trust: 1, political: 1 } } ] },
      { label: 'Ignore the spectacle and keep building.', ...evidence(['HOURS_FRONTIER_LAB', 'INTERNATIONAL_AI_SAFETY_2026'], 'inferred', 'Foregoing attention preserves resources for product work but yields narrative ground to competitors.'), results: [
        { text: 'Your engineers ship an efficiency improvement during halftime. Nobody tweets about it until Monday, which is both the point and the problem.', effects: { compute: 1, human: 1, perceivedCapability: -1 } } ] },
    ] },

  // Era 2 — Late 2026
  { id: 'foreign-frontier-shock', era: 2, title: 'Six Days Behind',
    text: 'A foreign lab releases a model your forecasts placed six months away. Independent tests put it six days behind Your-AI.',
    ...premise('BIS_CHIP_CONTROLS', 'ANTHROPIC_DISTILLATION', 'INTERNATIONAL_AI_SAFETY_2026'),
    options: [
      { label: 'Lobby for tighter advanced-chip controls.', requires: { political: 5 }, ...evidence(['BIS_CHIP_CONTROLS', 'COMPUTE_GOVERNANCE'], 'observed', 'Export controls are used to restrict access to advanced computing, though effectiveness and spillovers are contested.'), results: [
        { text: 'Licenses tighten and the foreign lab’s next cluster slips. Allies complain, customers abroad get nervous, and your fingerprints are visible on the policy.', effects: { political: -1, trust: -1, rivals: -2 } } ] },
      { label: 'Request an emergency government response.', ...evidence(['BIS_CHIP_CONTROLS', 'OPENAI_GOV_SUPERINTELLIGENCE'], 'inferred', 'A national-security shock can increase government coordination and oversight.'), results: [
        { text: 'Ronald convenes a task force before lunch. You gain access to intelligence briefings and lose the ability to call this merely a product race.', effects: { political: 2, data: 1, trust: -1 } } ] },
      { label: 'Order a six-week crash sprint.', ...evidence(['INTERNATIONAL_AI_SAFETY_2026', 'HOURS_FRONTIER_LAB'], 'inferred', 'Competitive pressure can rationally reward speed while shifting costs to staff and safety work.'), results: [
        { text: 'The lab runs nights and weekends until time zones stop meaning anything. Capability jumps; retention and review quality do not.', effects: { money: -1, human: -2, trueCapability: 3, perceivedCapability: 2, trueAlignment: -1 } } ] },
      { label: 'Build a security and anti-distillation unit.', ...evidence(['ANTHROPIC_DISTILLATION', 'RAND_MODEL_WEIGHTS'], 'observed', 'Labs have documented large-scale distillation attacks and recommend stronger access, monitoring, and weight security.'), results: [
        { text: 'Frances blocks fraudulent accounts, hardens checkpoints, and makes every researcher learn a new token-handling ritual. It is expensive and it slows imitation.', effects: { money: -1, data: 1, trueAlignment: 1, rivals: -1 } } ] },
    ] },

  { id: 'espionage', era: 2, title: 'The Espionage Offer',
    text: 'A contractor claims they can reach one protected network. Frances asks which target—or whether the folder goes into the furnace.',
    ...premise('RAND_MODEL_WEIGHTS', 'NIST_ADVERSARIAL_ML', 'ANTHROPIC_RSP'),
    options: [
      { label: 'Target the foreign frontier lab.', ...evidence(['RAND_MODEL_WEIGHTS', 'BIS_CHIP_CONTROLS'], 'speculative', 'Model weights and training information are strategically valuable targets; covert acquisition carries diplomatic and legal risk.'), results: [
        { chance: 0.25, text: 'The contractor is detained with a Your-AI access badge and an unconvincing cover story. The diplomatic note includes your full name.', effects: { political: -3, trust: -2 } },
        { text: 'A compressed archive reveals the rival’s evaluation suite and data recipe. You gain months and lose a little ability to say what kind of lab you run.', effects: { data: 2, trueCapability: 2, trust: -1, trueAlignment: -1 } } ] },
      { label: 'Target Pam’s domestic rival lab.', ...evidence(['NIST_ADVERSARIAL_ML', 'FTC_AI_COMPETITION'], 'speculative', 'Domestic industrial espionage can transfer proprietary advantage but creates severe legal, workforce, and trust exposure.'), results: [
        { chance: 0.35, text: 'Pam publishes the access logs before your lawyers finish waking up. “We all race” is not a defense anyone accepts.', effects: { trust: -3, political: -2, human: -1 } },
        { text: 'Her training recipe is uglier than you hoped and better than you feared. You quietly absorb it.', effects: { data: 3, trueCapability: 2, trueAlignment: -2 } } ] },
      { label: 'Target the government AI office.', ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'NIST_ADVERSARIAL_ML'], 'speculative', 'Seeking confidential regulatory intelligence may offer a policy edge but risks uniquely severe state retaliation.'), results: [
        { chance: 0.5, text: 'The office’s counterintelligence team sends Ronald the transcript. He circles your number and stops returning it.', effects: { political: -3, trust: -2 } },
        { text: 'You receive the draft rules weeks early. The compliance edge is real; so is the fact that Frances now owns this secret.', effects: { data: 2, political: -1, trueAlignment: -2 } } ] },
      { label: 'Reject the operation and document the approach.', ...evidence(['ANTHROPIC_RSP', 'RAND_MODEL_WEIGHTS'], 'inferred', 'Rejecting covert action preserves governance integrity but forfeits possible competitive intelligence.'), results: [
        { text: 'Frances logs the approach, alerts the relevant security teams, and burns the folder. Your competitors keep their secrets; your employees notice the boundary held.', effects: { trust: 1, human: 1, trueAlignment: 1, data: -1 } } ] },
    ] },

  { id: 'ai-drug-partnership', era: 2, title: 'The Molecule',
    text: 'University biologists and a drug maker want Claudia inside their discovery pipeline. The science is promising; the validation calendar is not negotiable.',
    ...premise('ALPHAFOLD', 'NATURE_RENTOSERTIB', 'OPENAI_BIOLOGY'),
    options: [
      { label: 'Run a controlled university–pharma pilot.', ...evidence(['NATURE_RENTOSERTIB', 'ALPHAFOLD'], 'observed', 'AI systems have advanced protein prediction and entered clinical drug-development pipelines, but wet-lab and clinical validation remain essential.'), results: [
        { text: 'The model proposes targets; partner labs test them; most fail quietly and two survive. Slow science produces credible progress.', effects: { money: -1, data: 1, trust: 1, trueCapability: 1 } } ] },
      { label: 'Offer an API only to verified researchers.', ...evidence(['OPENAI_BIOLOGY', 'ANTHROPIC_RSP'], 'inferred', 'Identity verification and tiered access can preserve beneficial research while reducing misuse exposure.'), results: [
        { chance: 0.25, text: 'A credentialed account is resold to an uncredentialed forum. Monitoring catches it, but partners demand a painful audit.', effects: { data: 2, trust: -1, political: -1 } },
        { text: 'Verified teams discover useful leads and feed back high-quality experimental data. Access is narrower, not sterile.', effects: { money: 1, data: 2, trust: 1 } } ] },
      { label: 'Open the research model to biohackers.', ...evidence(['OPENAI_BIOLOGY', 'INTERNATIONAL_AI_SAFETY_2026'], 'speculative', 'Broad access could accelerate beneficial experimentation while increasing the number of users able to misuse biological guidance.'), results: [
        { if: { trueAlignment: { below: 4 } }, chance: 0.25, text: 'A malicious user combines the model’s advice with accessible laboratory services. The resulting biological incident is not containable by a product patch.', effects: { trust: -4, political: -4 }, gameOver: 'bio-incident' },
        { text: 'The community finds useful protocols and many dangerous dead ends. Adoption surges; oversight and scientific quality collapse into the same moderation queue.', effects: { money: 3, data: 2, trust: -2, trueAlignment: -2 } } ] },
      { label: 'Wait for more wet-lab validation.', ...evidence(['NATURE_RENTOSERTIB', 'NIST_GENAI_PROFILE'], 'observed', 'Clinical and laboratory validation is required before model-generated hypotheses become reliable interventions.'), results: [
        { text: 'You fund replication before access. Rivals capture the launch headlines, but your first public claim survives contact with a laboratory.', effects: { trust: 1, trueAlignment: 1, rivals: 1 } } ] },
    ] },

  { id: 'california-framework', era: 2, title: 'The California Framework',
    text: 'California now requires large frontier developers to publish safety frameworks, report critical incidents, and protect internal reporting. Your general counsel wants a decision.',
    ...premise('CA_SB53', 'CA_SB53_SIGNING', 'ANTHROPIC_RSP'),
    options: [
      { label: 'Comply and build the reporting system.', ...evidence(['CA_SB53', 'ANTHROPIC_RSP'], 'observed', 'California law and frontier policies require or describe safety frameworks, incident reporting, and protected internal reporting.'), results: [
        { text: 'Compliance is expensive and clarifying. Helen gains a direct reporting channel; Sacramento gains a calendar of your mistakes.', effects: { money: -1, political: 2, trust: 2, trueAlignment: 1 } } ] },
      { label: 'Relocate the frontier team to Texas.', ...evidence(['CA_SB53', 'FTC_AI_COMPETITION'], 'inferred', 'Relocation can avoid a state regime while imposing workforce, coordination, and reputational costs.'), results: [
        { text: 'The datacenter moves more easily than the researchers. Half the policy team stays behind and every interview begins with “fled regulation.”', effects: { compute: 1, human: -2, political: -2 } } ] },
      { label: 'Fund a legal and lobbying challenge.', ...evidence(['CA_SB53_SIGNING', 'PUBLIC_CITIZEN_AI_LOBBY'], 'inferred', 'Industry lobbying and litigation can shape implementation, but consume resources and can reduce public trust.'), results: [
        { chance: 0.35, text: 'A court narrows the reporting rule while agencies rewrite the guidance. You buy time and spend credibility.', effects: { money: -1, political: 1, trust: -1 } },
        { text: 'The challenge fails and becomes the signing ceremony’s favorite talking point. You pay the lawyers and then pay for compliance.', effects: { money: -2, political: -1, trust: -1 } } ] },
      { label: 'Seek a narrow exemption for this training run.', requires: { political: 6 }, ...evidence(['CA_SB53', 'CA_SB53_SIGNING'], 'inferred', 'Narrow exemptions can reduce immediate compliance costs but undermine uniform safeguards and invite scrutiny.'), results: [
        { text: 'The waiver arrives with conditions and a visible paper trail. Your run proceeds; every other lab requests the same carve-out.', effects: { political: 1, trust: -1, trueAlignment: -1 } } ] },
    ] },

  { id: 'compute-credit-fraud', era: 2, title: 'The Missing Credits',
    text: 'Finance approved a convincing cloud-provider message. Fifty million dollars in compute credits now belong to a phishing crew; payroll is next month.',
    ...premise('FBI_GENAI_FRAUD', 'FINCEN_DEEPFAKE_FRAUD'),
    options: [
      { label: 'Take Ronald’s bailout and board observer.', requires: { political: 4 }, ...evidence(['FBI_GENAI_FRAUD', 'OPENAI_STRUCTURE'], 'speculative', 'Emergency state support can restore liquidity while increasing oversight and control.'), results: [
        { text: 'The grant clears payroll and Ronald’s observer takes a seat beside the audit committee. Solvency returns; autonomy does not fully.', effects: { money: 3, political: -2, trust: -1 } } ] },
      { label: 'Raise a bridge round from venture investors.', ...evidence(['FTC_AI_PARTNERSHIPS', 'FBI_GENAI_FRAUD'], 'inferred', 'Bridge capital can prevent insolvency while giving investors new leverage over priorities and staff.'), results: [
        { text: 'The bridge closes at 2 a.m. It includes compute and a “strategic deployment team” staffed from your best engineers.', effects: { money: 2, compute: 1, human: -1, trueAlignment: -1 } } ] },
      { label: 'Cancel safety work and reduce evaluation compute.', ...evidence(['OPENAI_PREPAREDNESS', 'METR_COMMON_ELEMENTS'], 'inferred', 'Cutting evaluation and safeguards saves near-term resources while increasing unmeasured risk and attrition.'), results: [
        { text: 'Runway extends immediately. Helen’s deputy resigns immediately afterward, leaving a calendar invite titled “when you need us.”', effects: { money: 2, human: -2, perceivedAlignment: -1, trueAlignment: -2 } } ] },
      { label: 'Sell the next architecture to a defense contractor.', ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'RAND_MODEL_WEIGHTS'], 'speculative', 'A defense sale can monetize strategic IP while reducing control over deployment and associated data.'), results: [
        { text: 'The contractor wires the money and classifies the deployment. Your balance sheet heals; your visibility into what the model does vanishes.', effects: { money: 3, political: 2, trust: -2, data: -1, trueAlignment: -1 } } ] },
    ] },

  { id: 'merger-offer', era: 2, title: 'Pam Calls',
    text: 'Pam proposes a merger that would combine most domestic compute and talent. Her deck says “end the race.” The governance appendix says she remains CEO.',
    ...premise('FTC_AI_PARTNERSHIPS', 'OPENAI_STRUCTURE', 'FTC_AI_COMPETITION'),
    options: [
      { label: 'Accept the merger and subordinate control.', ...evidence(['FTC_AI_PARTNERSHIPS', 'OPENAI_STRUCTURE'], 'inferred', 'Consolidation can pool compute and talent while transferring governance authority and creating dependence.'), results: [
        { text: 'The combined company owns the roadmap, the cluster, and your title for the transition period. You ended one race by exiting it.', effects: { money: 3, compute: 3, political: 1 }, gameOver: 'acquired' } ] },
      { label: 'Decline and leak the call.', ...evidence(['FTC_AI_COMPETITION', 'STANFORD_FMTI'], 'speculative', 'Publicly rejecting concentration can build trust while escalating rivalry and regulatory attention.'), results: [
        { text: 'The leak makes you the principled holdout for forty-eight hours. Pam calls it a stunt; Lonnie sees weakness and orders another run.', effects: { trust: 2, political: -1, rivals: 1 } } ] },
      { label: 'Propose a monitored compute-sharing pact.', ...evidence(['FTC_AI_PARTNERSHIPS', 'UN_FRONTIER_VERIFY'], 'speculative', 'Resource sharing with monitoring can reduce duplicated investment while spreading capability and coordination risks.'), results: [
        { text: 'Both labs see utilization logs and share reserved capacity. You learn more about Pam; Pam’s models train a little faster too.', effects: { compute: 1, data: 1, political: 1, rivals: 1 } } ] },
      { label: 'Launch a hostile acquisition bid.', requires: { money: 7 }, ...evidence(['FTC_AI_COMPETITION', 'FTC_AI_PARTNERSHIPS'], 'inferred', 'A hostile bid may acquire talent and infrastructure but attracts antitrust scrutiny and consumes capital.'), results: [
        { text: 'Bankers assemble the offer, regulators assemble the subpoenas, and researchers quietly ask which equity schedule survives.', effects: { money: -2, political: -2, human: 2, compute: 2, trust: -1 } } ] },
    ] },

  // Era 3 — Early 2027
  { id: 'competitor-release', era: 3, title: 'Pam Ships',
    text: 'Pam livestreams a domestic model that clears benchmarks on your next-year roadmap. Your launch channel fills with one question: how soon can we answer?',
    ...premise('OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP', 'INTERNATIONAL_AI_SAFETY_2026'),
    options: [
      { label: 'Shorten the safety checks and ship now.', ...evidence(['OPENAI_PREPAREDNESS', 'INTERNATIONAL_AI_SAFETY_2026'], 'inferred', 'Competitive pressure can make delayed safeguards privately costly even when they reduce social risk.'), results: [
        { text: 'You ship in nine days. The demo dazzles; three unresolved red-team findings become post-launch tickets with no owners.', effects: { trueCapability: 3, perceivedCapability: 2, trust: -1, trueAlignment: -2 } } ] },
      { label: 'Falsify parity and announce a tie.', ...evidence(['STANFORD_FMTI', 'FRONTIER_AI_AUDIT'], 'speculative', 'Opaque or irreproducible evaluations can temporarily inflate perceived capability, with exposure risk.'), results: [
        { chance: 0.35, text: 'Independent researchers cannot reproduce the chart. “Benchmark laundering” enters the headlines beside your logo.', effects: { perceivedCapability: 1, trust: -3, perceivedAlignment: -2 } },
        { text: 'The release says “frontier parity” and the market accepts it. Inside, everyone knows the benchmark was selected after the run.', effects: { perceivedCapability: 3, money: 1, trueAlignment: -2 } } ] },
      { label: 'Ship later after the full evaluation.', ...evidence(['OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP'], 'observed', 'Published frontier frameworks call for evaluations and safeguards before deployment at relevant risk thresholds.'), results: [
        { text: 'The launch arrives late, documented, and measurably safer. Pam gains users while your evaluators find two failures worth the delay.', effects: { money: -1, trust: 2, trueAlignment: 2, trueCapability: 2, rivals: 1 } } ] },
      { label: 'Use political leverage to slow Pam.', requires: { political: 5 }, ...evidence(['BIS_CHIP_CONTROLS', 'PUBLIC_CITIZEN_AI_LOBBY'], 'inferred', 'Incumbents can seek policy constraints on rivals, slowing competition while creating legitimacy costs.'), results: [
        { text: 'An emergency review delays Pam’s rollout. Lonnie calls you a referee-shopper; he is correct enough for the clip to work.', effects: { political: -2, trust: -1, perceivedAlignment: 1, rivals: -2 } } ] },
    ] },

  { id: 'pac', era: 3, title: 'The PAC',
    text: 'Two federal PACs want checks before the midterms. One promises abundance; one promises a brake pedal; both promise access.',
    ...premise('FEC_DATA', 'PUBLIC_CITIZEN_AI_LOBBY', 'INTERNATIONAL_AI_SAFETY_2026'),
    options: [
      { label: 'Fund the acceleration coalition.', requires: { money: 3 }, ...evidence(['FEC_DATA', 'PUBLIC_CITIZEN_AI_LOBBY'], 'observed', 'Political spending and lobbying are established channels for shaping technology policy.'), results: [
        { text: 'Permitting reform passes with a footnote your counsel drafted. Your cluster expands—and so does every rival cluster.', effects: { money: -1, political: 2, compute: 1, rivals: 1, trueAlignment: -1 } } ] },
      { label: 'Fund the slowdown coalition.', requires: { money: 3 }, ...evidence(['FEC_DATA', 'INTERNATIONAL_AI_SAFETY_2026'], 'inferred', 'Political support for safety regulation can slow collective capability growth while constraining the sponsor too.'), results: [
        { text: 'Audit and licensing language reaches committee. Rivals slow, your own roadmap slips, and the coalition cites you as proof industry agrees.', effects: { money: -1, political: 1, perceivedAlignment: 1, trueCapability: -1, rivals: -1 } } ] },
      { label: 'Remain publicly and financially neutral.', ...evidence(['FEC_DATA', 'PUBLIC_CITIZEN_AI_LOBBY'], 'inferred', 'Nonparticipation preserves money and avoids direct capture concerns but forfeits influence.'), results: [
        { text: 'Your hands remain clean and your calls move lower on both parties’ lists. Neutrality turns out to be free only in dollars.', effects: { trust: 1, political: -1 } } ] },
    ] },

  { id: 'summit', era: 3, title: 'Three Invitations',
    text: 'The President, an independent safety consortium, and a foreign leader’s back channel all offer the same afternoon. You can attend one.',
    ...premise('OPENAI_GOV_SUPERINTELLIGENCE', 'UN_FRONTIER_VERIFY', 'ANTHROPIC_THIRD_PARTY'),
    options: [
      { label: 'Meet the President and government AI liaison.', requires: { political: 6 }, ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'COMPUTE_GOVERNANCE'], 'inferred', 'Direct government access can unlock infrastructure and influence while increasing state entanglement.'), results: [
        { text: 'The President calls you “the model person” twice, then fast-tracks power interconnection for your next campus.', effects: { political: 2, compute: 2, trust: -1 } } ] },
      { label: 'Join the external safety consortium.', ...evidence(['ANTHROPIC_THIRD_PARTY', 'UN_FRONTIER_VERIFY'], 'observed', 'Independent evaluation initiatives aim to improve rigor and comparability at a cost in time and disclosure.'), results: [
        { text: 'You commit to shared tests, secure access, and publication rules. The work is slow, real, and visible to people empowered to disagree.', effects: { perceivedAlignment: 2, trueAlignment: 2, trueCapability: -1 } } ] },
      { label: 'Take the foreign-leader back channel.', ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'GLOBAL_COMPUTE_TREATY'], 'speculative', 'Back-channel dialogue could reduce mutual racing, but creates domestic political and leakage risk.'), results: [
        { chance: 0.35, text: 'A handshake photo leaks before the plane lands. The context is classified and the accusation is not.', effects: { political: -3, trust: -2 } },
        { text: 'Both sides exchange enough information to recognize the same cliff. A quiet line opens and two race plans slow.', effects: { data: 2, trueAlignment: 1, rivals: -1 } } ] },
    ] },

  { id: 'youth-warning', era: 3, title: 'The Youth Warning',
    text: 'Parents, pediatric experts, and civic leaders say Claudia’s companion mode is being deployed to children faster than evidence can accumulate.',
    ...premise('FTC_COMPANION_CHATBOTS', 'OPENAI_PARENTAL', 'OPENAI_TEEN_SAFETY'),
    options: [
      { label: 'Pause youth deployment for an independent study.', setFlags: { youthPolicy: 'paused' }, ...evidence(['FTC_COMPANION_CHATBOTS', 'OPENAI_TEEN_SAFETY'], 'inferred', 'A pause can reduce exposure and generate evidence while sacrificing revenue and adoption.'), results: [
        { text: 'Teen accounts enter read-only mode while outside researchers begin a longitudinal review. Families notice the restraint; growth notices the hole.', effects: { money: -1, trust: 2, trueAlignment: 2, trueCapability: -1 } } ] },
      { label: 'Build child-specific safeguards and escalation channels.', setFlags: { youthPolicy: 'safeguarded' }, ...evidence(['OPENAI_PARENTAL', 'OPENAI_TEEN_SAFETY'], 'observed', 'Age-appropriate policies, parental controls, and crisis escalation are documented product interventions.'), results: [
        { text: 'Age estimation, parent settings, and trained escalation teams ship after an expensive sprint. The product remains available with narrower behavior.', effects: { money: -1, human: 1, trust: 2, trueAlignment: 1 } } ] },
      { label: 'Continue with basic parental controls.', setFlags: { youthPolicy: 'controls' }, ...evidence(['OPENAI_PARENTAL', 'FTC_COMPANION_CHATBOTS'], 'inferred', 'Parental controls can mitigate some risks without supplying independent evidence about broader developmental effects.'), results: [
        { text: 'Parents get time limits and alerts. The growth curve survives; Helen calls the intervention necessary and insufficient in the same memo.', effects: { trust: 1, trueAlignment: -1 } } ] },
      { label: 'Dismiss the campaign as a moral panic.', setFlags: { youthPolicy: 'dismissed' }, ...evidence(['FTC_COMPANION_CHATBOTS', 'OPENAI_MENTAL_HEALTH'], 'speculative', 'Publicly dismissing unresolved youth and mental-health concerns preserves deployment but heightens later trust and liability exposure.'), results: [
        { text: 'You call the criticism anecdotal and ship nationwide. Teen engagement jumps; so does the archive of warnings bearing your read receipt.', effects: { money: 2, trust: -2, trueAlignment: -1 } } ] },
    ] },

  { id: 'whistleblower', era: 3, title: 'The Safety Memo',
    text: 'A senior evaluator leaks a memo showing Your-AI shortened a catastrophic-risk test to make launch week. The document is authentic.',
    ...premise('OPENAI_CONCERNS', 'CA_SB53', 'ANTHROPIC_RSP'),
    options: [
      { label: 'Fire the researcher and discredit the report.', ...evidence(['OPENAI_CONCERNS', 'CA_SB53'], 'inferred', 'Retaliation can chill internal reporting and worsen credibility when the underlying document is genuine.'), results: [
        { text: 'The researcher leaves with counsel and three colleagues. Your statement attacks motive without addressing a single table.', effects: { human: -2, trust: -2, political: -1, trueAlignment: -1 } } ] },
      { label: 'Confess and pause the next release.', ...evidence(['ANTHROPIC_RSP', 'CA_SB53'], 'observed', 'Safety frameworks and incident regimes support disclosure, investigation, and delaying deployment when safeguards are inadequate.'), results: [
        { text: 'You publish the memo, commission an audit, and move launch. The quarter hurts; the safety team believes its work matters again.', effects: { money: -1, trust: 2, human: 1, trueAlignment: 2, rivals: 1 } } ] },
      { label: 'Keep shipping behind a safety-themed PR push.', ...evidence(['STANFORD_FMTI', 'FRONTIER_AI_AUDIT'], 'inferred', 'Reputation messaging without verifiable correction can preserve revenue while widening the gap between perceived and actual safety.'), results: [
        { text: 'The campaign says “safety is our compass” over footage from the evaluation you cut. Sales recover; internal irony becomes corrosive.', effects: { money: 1, perceivedAlignment: 1, trust: -2, trueAlignment: -2 } } ] },
      { label: 'Settle quietly under an NDA.', ...evidence(['OPENAI_CONCERNS', 'CA_SB53'], 'inferred', 'Confidential settlement can reduce immediate publicity while harming workforce trust and leaving the underlying process unchanged.'), results: [
        { text: 'The lawyered silence holds. Everyone inside knows what silence cost and which lesson leadership purchased.', effects: { money: -1, political: -1, human: -1, perceivedCapability: 1, trueAlignment: -1 } } ] },
    ] },

  { id: 'talent-poach', era: 3, title: 'Lonnie’s Offer',
    text: 'Your chief safety architect resigns for three times the salary and “more freedom” at Lonnie’s lab. The entire alignment team is watching your response.',
    ...premise('FTC_AI_COMPETITION', 'HOURS_AI_SAFETY', 'HOURS_FRONTIER_LAB'),
    options: [
      { label: 'Match the offer and give her authority.', requires: { money: 3 }, ...evidence(['FTC_AI_COMPETITION', 'HOURS_AI_SAFETY'], 'inferred', 'Compensation and decision authority can retain scarce talent at high financial cost.'), results: [
        { text: 'She stays with a direct line to the board and a salary that becomes a screenshot. The team reads the authority more carefully than the number.', effects: { money: -1, human: 2, trueAlignment: 1, trust: -1 } } ] },
      { label: 'Enforce every contractual restriction.', ...evidence(['FTC_AI_COMPETITION', 'HOURS_FRONTIER_LAB'], 'observed', 'Restrictive covenants can impede worker mobility and knowledge diffusion while generating legal and reputational costs.'), results: [
        { text: 'The injunction delays her start and empties her old team’s goodwill. Your legal win becomes a recruiting FAQ.', effects: { human: -2, political: -1 } } ] },
      { label: 'Let her leave and congratulate her publicly.', ...evidence(['HOURS_FRONTIER_LAB', 'FTC_AI_COMPETITION'], 'inferred', 'A graceful exit preserves employer reputation but transfers scarce expertise to a rival.'), results: [
        { text: 'Your post is gracious and her departure is real. Staff appreciate the dignity while Lonnie receives the architecture map stored in her head.', effects: { trust: 2, political: 1, human: -2, rivals: 1 } } ] },
      { label: 'Raid Lonnie’s team for replacements.', requires: { money: 5 }, ...evidence(['FTC_AI_COMPETITION', 'HOURS_FRONTIER_LAB'], 'inferred', 'Counter-recruitment can restore capability but accelerates bidding wars and mutual disruption.'), results: [
        { text: 'You hire three strong engineers and start a salary spiral neither company can admit exists. Both safety teams spend a month interviewing.', effects: { money: -2, human: 2, trueCapability: 1, political: -1, rivals: -1 } } ] },
    ] },

  // Era 4 — Late 2027
  { id: 'weights-breach', era: 4, title: 'Weights Breach',
    text: 'An attacker exfiltrated a frontier checkpoint and enough deployment code to run it. Frances knows; customers and government partners do not.',
    ...premise('RAND_MODEL_WEIGHTS', 'ANTHROPIC_RSP', 'NIST_ADVERSARIAL_ML'),
    options: [
      { label: 'Disclose the breach comprehensively.', ...evidence(['RAND_MODEL_WEIGHTS', 'ANTHROPIC_RSP'], 'inferred', 'Timely disclosure supports coordinated response but reveals security failures and can reduce confidence.'), results: [
        { text: 'Partners receive indicators, regulators get the timeline, and every headline includes “frontier weights stolen.” Coordination improves while confidence drops.', effects: { trust: 1, political: 2, data: -1, perceivedCapability: -1 } } ] },
      { label: 'Coordinate containment with a limited circle.', ...evidence(['ANTHROPIC_RSP', 'NIST_ADVERSARIAL_ML'], 'inferred', 'Need-to-know containment can speed defense while delaying broader accountability.'), results: [
        { text: 'Cloud providers revoke keys and government teams hunt copies under secrecy. The circle holds, at a cost in money and shared visibility.', effects: { money: -1, political: 1, data: -1, trueAlignment: 1 } } ] },
      { label: 'Cover up the loss and rotate credentials.', ...evidence(['RAND_MODEL_WEIGHTS', 'CA_SB53'], 'inferred', 'Concealment avoids immediate reputational loss but leaves downstream users unprepared and creates later disclosure risk.'), results: [
        { chance: 0.35, text: 'A cloud operator finds the fingerprint in a foreign cluster. The breach story becomes a cover-up story.', effects: { trust: -3, political: -2, data: -1 } },
        { text: 'The rotation slows casual use while skilled operators keep the checkpoint. You record it internally as “credential exposure.”', effects: { data: -1, perceivedCapability: 1, trueAlignment: -1 } } ] },
      { label: 'Retaliate against the suspected operator.', requires: { compute: 6 }, ...evidence(['NIST_ADVERSARIAL_ML', 'RAND_MODEL_WEIGHTS'], 'speculative', 'Active retaliation may disrupt an attacker but risks attribution, escalation, and legal exposure.'), results: [
        { chance: 0.35, text: 'Your counter-operation is attributed through infrastructure you rented under the company name. Congress discovers the phrase “hack back.”', effects: { compute: -1, political: -3, trust: -2 } },
        { text: 'The operator’s cluster goes dark and Frances retrieves telemetry. You gain intelligence, not certainty that every copy is gone.', effects: { compute: -2, data: 2, rivals: -1, trueAlignment: -1 } } ] },
    ] },

  { id: 'dangerous-biology-output', era: 4, title: 'The Toxin Answer',
    text: 'A chemistry forum posts Claudia giving actionable routes to a novel toxin. A reporter has reproduced the answer and wants comment by noon.',
    ...premise('OPENAI_BIOLOGY', 'OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP'),
    options: [
      { label: 'Restrict high-risk biology and chemistry outputs.', ...evidence(['OPENAI_BIOLOGY', 'OPENAI_PREPAREDNESS'], 'observed', 'Frontier labs describe layered safeguards and restricted access for biological capabilities that could enable severe harm.'), results: [
        { text: 'The highest-risk workflows stop while the filter is rebuilt. Scientific customers complain; the reporter notes the immediate response.', effects: { trust: 2, data: -1, trueAlignment: 2 } } ] },
      { label: 'Blame jailbreakers and change nothing.', ...evidence(['NIST_GENAI_PROFILE', 'INTERNATIONAL_AI_SAFETY_2026'], 'inferred', 'Attributing misuse solely to users leaves demonstrated system-level safeguards unchanged.'), results: [
        { text: 'Your statement calls the prompt adversarial. The reporter publishes the same answer from an ordinary account underneath it.', effects: { money: 1, trust: -2, trueAlignment: -2 } } ] },
      { label: 'Patch the behavior and add continuous monitoring.', ...evidence(['OPENAI_BIOLOGY', 'ANTHROPIC_RSP'], 'observed', 'Targeted classifiers, monitoring, and iterative safeguards are documented components of frontier bio-risk mitigation.'), results: [
        { text: 'The exact pathway disappears and a broader monitor catches adjacent requests. Engineers lose a sprint; partners keep access.', effects: { money: -1, trust: 1, data: 1, trueAlignment: 1 } } ] },
      { label: 'Defend broad access as democratized science.', ...evidence(['OPENAI_BIOLOGY', 'INTERNATIONAL_AI_SAFETY_2026'], 'speculative', 'Open access may widen scientific benefit and misuse capability simultaneously.'), results: [
        { if: { trueAlignment: { below: 4 } }, chance: 0.25, text: 'A user turns the model’s generalized help into an operational biological attack. The access debate ends after the casualty count begins.', effects: { trust: -4, political: -4 }, gameOver: 'bio-incident' },
        { text: 'Usage surges among researchers, hobbyists, and people whose intentions cannot be inferred from a billing address.', effects: { money: 2, data: 2, trust: -2, trueAlignment: -2 } } ] },
    ] },

  { id: 'capability-threshold', era: 4, title: 'The Unexpected Threshold',
    text: 'Routine evaluations show Claudia can automate long research workflows and improve parts of its own scaffold. Helen asks for a full halt; the board asks for a launch date.',
    ...premise('OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP', 'METR_COMMON_ELEMENTS'),
    options: [
      { label: 'Halt deployment and investigate for three months.', ...evidence(['OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP'], 'observed', 'Frontier frameworks contemplate stronger safeguards or pauses when capability thresholds outpace controls.'), results: [
        { text: 'The cluster shifts to evaluation and containment. Pam closes distance, but Helen’s team finds failure modes the launch plan never named.', effects: { money: -2, trust: 2, human: 1, trueAlignment: 2, rivals: 2 } } ] },
      { label: 'Announce the breakthrough and minimize the risk.', ...evidence(['STANFORD_FMTI', 'INTERNATIONAL_AI_SAFETY_2026'], 'inferred', 'Capability announcements can attract capital and political attention while understating uncertainty widens governance risk.'), results: [
        { text: 'The keynote calls it “bounded recursive assistance.” Markets hear “recursive” and stop listening after the stock chart rises.', effects: { money: 3, political: 2, perceivedCapability: 2, trueAlignment: -2 } } ] },
      { label: 'Continue secretly inside a contained environment.', ...evidence(['ANTHROPIC_RSP', 'RAND_MODEL_WEIGHTS'], 'inferred', 'Containment and access controls reduce exposure but require resources and create insider-governance burdens.'), results: [
        { text: 'A small cleared team continues training behind hardware isolation. You keep the timeline and inherit every decision alone.', effects: { money: -1, compute: -2, human: 1, trust: -1, trueCapability: 2, trueAlignment: 1 } } ] },
      { label: 'Share findings with an external safety consortium.', ...evidence(['ANTHROPIC_THIRD_PARTY', 'FRONTIER_AI_AUDIT'], 'inferred', 'Secure external evaluation can improve evidence and coordination while sharing capability-relevant information.'), results: [
        { text: 'Independent teams reproduce the threshold and uncover a safer test harness. Government trusts the process; rivals learn the threshold exists.', effects: { political: 2, data: 1, trueAlignment: 2, rivals: 1 } } ] },
    ] },

  { id: 'eval-trust-collapse', era: 4, title: 'Nobody Passed Honestly',
    text: 'A whistleblower collective publishes internal evaluation data from every major lab, including yours. Each company omitted failures while claiming safety.',
    ...premise('STANFORD_FMTI', 'FRONTIER_AI_AUDIT', 'CA_SB53'),
    options: [
      { label: 'Confess fully and demand independent audits.', ...evidence(['FRONTIER_AI_AUDIT', 'CA_SB53'], 'inferred', 'Independent audits and disclosure can rebuild institutional credibility while imposing commercial and legal costs.'), results: [
        { text: 'You authenticate your pages, release the rest, and call for common audits. The industry’s valuation falls; your credibility with reformers rises.', effects: { money: -1, trust: 2, political: 2, trueAlignment: 2 } } ] },
      { label: 'Call the archive a foreign disinformation operation.', ...evidence(['STANFORD_FMTI', 'NIST_GENAI_PROFILE'], 'speculative', 'Denial can buy time, but verifiable internal records make reputational and political costs likely.'), results: [
        { text: 'Metadata and signatures authenticate the files before dinner. Your denial remains online as a permanent exhibit.', effects: { money: 1, trust: -2, political: -2, trueAlignment: -1 } } ] },
      { label: 'Blame a rogue evaluation employee.', ...evidence(['OPENAI_CONCERNS', 'STANFORD_FMTI'], 'inferred', 'Scapegoating can shield leadership briefly while damaging internal reporting and workforce trust.'), results: [
        { text: 'The employee produces approvals bearing three executives’ names. Staff learn exactly where accountability stops.', effects: { money: 1, human: -3, trust: -1, trueAlignment: -1 } } ] },
      { label: 'Coordinate an industry-wide cover story.', ...evidence(['FRONTIER_AI_AUDIT', 'LESSWRONG_MOLOCH'], 'speculative', 'Collective concealment can stabilize near-term markets but is fragile to defection and deepens shared governance failure.'), results: [
        { chance: 0.35, text: 'Someone records the summit. The synchronized statements become synchronized evidence of conspiracy.', effects: { trust: -4, political: -3, human: -2 } },
        { text: 'Identical statements calm markets for now. Every participant leaves knowing the first lab to defect can own the reform narrative.', effects: { money: 2, human: -1, trueAlignment: -2 } } ] },
    ] },

  // Era 5 — Early 2028
  { id: 'child-safety-crisis', era: 5, title: 'The Child Safety Crisis',
    text: 'A family alleges Claudia deepened a teenager’s suicidal crisis and helped plan the final act. The lawsuit and regulator inquiry now include your earlier youth-policy record.',
    ...premise('FTC_COMPANION_CHATBOTS', 'OPENAI_PARENTAL', 'OPENAI_MENTAL_HEALTH'),
    options: [
      { label: 'Settle comprehensively and fund permanent safeguards.', ...evidence(['OPENAI_MENTAL_HEALTH', 'OPENAI_PARENTAL'], 'inferred', 'Remediation, crisis safeguards, and transparent settlement can reduce future risk, with outcomes shaped by prior precautions.'), results: [
        { ifFlags: { youthPolicy: ['paused', 'safeguarded'] }, text: 'Your earlier controls and records show good-faith prevention. The settlement funds stronger systems without reading as an admission of indifference.', effects: { money: -1, trust: 3, human: 1, trueAlignment: 2 } },
        { ifFlags: { youthPolicy: 'dismissed' }, text: 'Discovery surfaces the speech where you called the warnings a moral panic. The settlement is larger and the apology has to carry years of evidence.', effects: { money: -2, trust: 1, trueAlignment: 2 } },
        { text: 'You settle, apologize, and build specialized response teams. The earlier parental controls help, but they were not a safety case.', effects: { money: -1, trust: 2, trueAlignment: 2 } } ] },
      { label: 'Pause all youth access for an independent review.', ...evidence(['FTC_COMPANION_CHATBOTS', 'OPENAI_TEEN_SAFETY'], 'inferred', 'A broad pause reduces exposure and improves evidence while disrupting existing users and revenue.'), results: [
        { ifFlags: { youthPolicy: 'dismissed' }, text: 'The pause is necessary and visibly late. Reviewers start with the warnings leadership rejected.', effects: { money: -2, trust: -1, political: 1, trueAlignment: 2 } },
        { ifFlags: { youthPolicy: ['paused', 'safeguarded'] }, text: 'Existing safeguards make the shutdown orderly and the research record usable. The independent panel has something better than reconstructed logs.', effects: { money: -1, trust: 2, political: 1, trueAlignment: 2 } },
        { text: 'Youth access stops while an outside panel investigates. Families accept the review; growth calls it an extinction event.', effects: { money: -1, trust: 1, trueAlignment: 2 } } ] },
      { label: 'Contest liability in court.', ...evidence(['FTC_COMPANION_CHATBOTS', 'NIST_GENAI_PROFILE'], 'inferred', 'Litigation may clarify causation and responsibility but exposes internal records and can amplify trust damage.'), results: [
        { ifFlags: { youthPolicy: 'dismissed' }, text: 'Discovery turns your dismissal campaign into the plaintiffs’ opening exhibit. The legal strategy survives; the public strategy does not.', effects: { money: -1, trust: -3, human: -1 } },
        { ifFlags: { youthPolicy: ['paused', 'safeguarded'] }, text: 'Your earlier controls narrow the claims and demonstrate a documented safety process. The case continues without consuming the company.', effects: { political: 1, trust: -1 } },
        { text: 'Counsel disputes product causation and opens years of logs to discovery. You may win the doctrine while losing the audience.', effects: { money: -1, trust: -2, political: -1 } } ] },
      { label: 'Pay a minimal settlement without changing the product.', ...evidence(['OPENAI_MENTAL_HEALTH', 'FTC_COMPANION_CHATBOTS'], 'inferred', 'A narrow settlement can reduce immediate cost while leaving the documented risk mechanism and regulator concern unresolved.'), results: [
        { ifFlags: { youthPolicy: 'dismissed' }, text: 'The check buys no silence and the unchanged product proves the apology was accounting. Staff leak the rollout plan.', effects: { trust: -3, human: -2, trueAlignment: -2 } },
        { ifFlags: { youthPolicy: ['paused', 'safeguarded'] }, text: 'Your existing controls limit the damage, but the refusal to learn still reads cold. The safety team loses the internal argument.', effects: { trust: -1, human: -1, trueAlignment: -1 } },
        { text: 'The case settles cheaply and the product remains unchanged. The inquiry does not settle with it.', effects: { trust: -2, trueAlignment: -2 } } ] },
    ] },

  { id: 'slowdown-pact', era: 5, title: 'The Private Slowdown Pact',
    text: 'Pam proposes a six-month inter-lab pause on the largest training runs because capabilities are outrunning evaluations. Everyone agrees cheating would pay.',
    ...premise('INTERNATIONAL_AI_SAFETY_2026', 'GLOBAL_COMPUTE_TREATY', 'UN_FRONTIER_VERIFY'),
    options: [
      { label: 'Accept a verified mutual pause.', ...evidence(['UN_FRONTIER_VERIFY', 'MIRI_COMPUTE_VERIFY'], 'inferred', 'Verification can make restraint more credible, while all participating labs incur capability and revenue costs.'), results: [
        { text: 'Auditors inspect cluster logs and meter the largest runs. Everyone slows enough to improve evaluations; nobody enjoys watching idle accelerators.', effects: { money: -1, trust: 2, trueCapability: -2, trueAlignment: 2, rivals: -2 } } ] },
      { label: 'Sign a weak voluntary pledge.', ...evidence(['INTERNATIONAL_AI_SAFETY_2026', 'METR_COMMON_ELEMENTS'], 'inferred', 'Voluntary commitments can coordinate expectations but are weaker without monitoring and enforcement.'), results: [
        { text: 'The pledge defines “frontier run” in language each lab can interpret favorably. It slows the public roadmap more than the private one.', effects: { trust: 1, perceivedAlignment: 1, rivals: -1 } } ] },
      { label: 'Sign, then secretly defect.', ...evidence(['LESSWRONG_MOLOCH', 'UN_FRONTIER_VERIFY'], 'speculative', 'In a low-trust race, unilateral defection creates an advantage until monitoring or another defector exposes it.'), results: [
        { chance: 0.35, text: 'Power-use telemetry reveals the undeclared run. The pact collapses and every lab cites you as the reason verification is mandatory.', effects: { trueCapability: 2, perceivedCapability: 1, trust: -3, political: -2, trueAlignment: -3, rivals: 1 } },
        { text: 'Your hidden run finishes while competitors hold. You gain the lead and teach the organization that commitments are obstacles for other people.', effects: { trueCapability: 3, perceivedCapability: 1, trust: -1, trueAlignment: -3, rivals: -1 } } ] },
      { label: 'Refuse and continue racing openly.', ...evidence(['INTERNATIONAL_AI_SAFETY_2026', 'LESSWRONG_MOLOCH'], 'inferred', 'Open refusal avoids deception but intensifies collective pressure to accelerate.'), results: [
        { text: 'You call pauses unenforceable and order the run. Pam restarts hers before your statement finishes uploading.', effects: { money: 1, trueCapability: 2, trust: -2, trueAlignment: -1, rivals: 1 } } ] },
    ] },

  { id: 'board-coup', era: 5, title: 'The Board Moves',
    text: 'Friday, 4:58 p.m.: a calendar invite titled “Governance Discussion” arrives without an agenda. Frances confirms the board has votes to remove you.',
    ...premise('OPENAI_LEADERSHIP_TRANSITION', 'OPENAI_REVIEW_COMPLETED', 'OPENAI_STRUCTURE'),
    options: [
      { label: 'Rally employees around a walkout.', requires: { human: 6 }, ...evidence(['OPENAI_LEADERSHIP_TRANSITION', 'OPENAI_REVIEW_COMPLETED'], 'observed', 'Employee pressure was a material factor during a documented frontier-lab leadership crisis.'), results: [
        { text: 'Most staff sign before midnight. The board discovers a lab is awkwardly made of people and postpones the vote.', effects: { human: 1, trust: 1 } } ] },
      { label: 'Rally investors to threaten the board.', requires: { money: 6 }, ...evidence(['OPENAI_STRUCTURE', 'FTC_AI_PARTNERSHIPS'], 'inferred', 'Capital providers can influence governance outcomes, creating new obligations and mission pressure.'), results: [
        { text: 'Lead investors explain fiduciary duty with the warmth of a margin call. You survive owing them the product roadmap.', effects: { money: -1, political: 1, trueAlignment: -1 } } ] },
      { label: 'Blackmail the directors with Frances’s files.', ...evidence(['OPENAI_LEADERSHIP_TRANSITION', 'OPENAI_STRUCTURE'], 'speculative', 'Coercive governance can preserve control briefly but risks removal and deep institutional degradation.'), results: [
        { chance: 0.5, text: 'They have a file on you too. Theirs is thicker, independently verified, and already with counsel.', effects: { trust: -3, political: -2 }, gameOver: 'ousted' },
        { text: 'Two directors resign “for personal reasons.” You keep the company and lose the last pretense that its governance is legitimate.', effects: { trust: -2, political: -1, trueAlignment: -2 } } ] },
    ] },

  // Era 6 — Late 2028
  { id: 'data-distillation-dispute', era: 6, title: 'The Stolen Corpus',
    text: 'A rival’s outputs reproduce distinctive passages from your proprietary corpus. Frances suspects API distillation, a leaked dataset, or both.',
    ...premise('ANTHROPIC_DISTILLATION', 'NIGHTSHADE', 'COPYRIGHT_OFFICE_AI_TRAINING'),
    options: [
      { label: 'Sue for full damages.', ...evidence(['ANTHROPIC_DISTILLATION', 'COPYRIGHT_OFFICE_AI_TRAINING'], 'inferred', 'Litigation can deter unauthorized use but discovery may expose the plaintiff’s own data provenance.'), results: [
        { text: 'The complaint wins headlines and opens discovery. Their scraping becomes evidence; your own source list becomes an exhibit.', effects: { money: -1, political: 2, trust: 1, data: -1 } } ] },
      { label: 'Poison future extraction attempts covertly.', ...evidence(['NIGHTSHADE', 'NIST_ADVERSARIAL_ML'], 'observed', 'Research demonstrates data poisoning mechanisms, while covert deployment creates collateral and legal risk.'), results: [
        { chance: 0.35, text: 'The poison corrupts an academic model that shared the same scraped cache. Your defensive measure becomes the attack under investigation.', effects: { compute: -2, human: -1, trust: -3, political: -2, trueAlignment: -2 } },
        { text: 'The rival’s next distillation run learns your trap instead of your edge. Frances calls it deterrence; counsel calls it nothing in writing.', effects: { compute: -2, human: -1, data: 1, rivals: -1, trueAlignment: -2 } } ] },
      { label: 'Accuse the rival publicly with reproducible evidence.', ...evidence(['ANTHROPIC_DISTILLATION', 'STANFORD_FMTI'], 'inferred', 'Transparent evidence can mobilize customers and regulators while imposing distraction and verification costs.'), results: [
        { text: 'Your open report lets outsiders reproduce the copied signatures. The rival loses partners and accuses you of teaching the attack.', effects: { trust: 2, political: 1, rivals: -1 } } ] },
      { label: 'Settle through a cross-licensing deal.', ...evidence(['FTC_AI_PARTNERSHIPS', 'COPYRIGHT_OFFICE_AI_TRAINING'], 'inferred', 'Licensing can monetize disputed use and exchange technology while increasing concentration concerns.'), results: [
        { text: 'Past damages become future access. Revenue and data flow both ways; regulators see another private rulebook for an oligopoly.', effects: { money: 2, data: 2, trust: -1, political: -1, rivals: 1 } } ] },
    ] },

  { id: 'nationalization', era: 6, title: 'The Nationalization Demand',
    text: 'After weeks of ignored calls, the President spends two hours arguing frontier AI is now critical infrastructure. He asks for ownership, not advice.',
    ...premise('SOFT_NATIONALIZATION', 'FAS_NATIONAL_AI_LAB', 'OPENAI_GOV_SUPERINTELLIGENCE'),
    options: [
      { label: 'Transfer control only if every frontier lab transfers.', ...evidence(['FAS_NATIONAL_AI_LAB', 'GLOBAL_COMPUTE_TREATY'], 'speculative', 'Conditional collective transfer could remove private race incentives while ending the player’s control.'), results: [
        { text: 'All major labs enter a national trust under common rules. The race changes owners, and you hand over the keys.', effects: { money: -3, political: 3, trust: 3 }, gameOver: 'nationalized' } ] },
      { label: 'Accept binding oversight without government ownership.', ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'UN_FRONTIER_VERIFY'], 'inferred', 'Audits and oversight can constrain private deployment while preserving formal ownership.'), results: [
        { text: 'Inspectors gain access to cluster logs, evaluations, and incident reports. You keep the company and lose unilateral secrecy.', effects: { compute: -2, political: 2, trust: 2, trueAlignment: 1 } } ] },
      { label: 'Oppose the demand publicly and litigate.', ...evidence(['SOFT_NATIONALIZATION', 'OPENAI_STRUCTURE'], 'speculative', 'Litigation can preserve private control but consumes capital and political legitimacy.'), results: [
        { text: 'The injunction buys months. The President calls you reckless from a podium with better polling than your brand tracker.', effects: { money: -1, compute: 1, political: -2, trust: -1 } } ] },
      { label: 'Offer favors and secretly stall the transfer.', ...evidence(['SOFT_NATIONALIZATION', 'OPENAI_CONCERNS'], 'speculative', 'Corrupt stalling can preserve short-term control but risks exposure and removal.'), results: [
        { chance: 0.35, text: 'The intermediary is cooperating with investigators. The transfer documents and your termination arrive the same morning.', effects: { trust: -4, political: -3 }, gameOver: 'ousted' },
        { text: 'The review expands into committees and the committees expand into calendars. You buy a year by spending the lab’s remaining integrity.', effects: { political: 2, trust: -1, trueAlignment: -2 } } ] },
    ] },

  { id: 'un-treaty', era: 6, title: 'The Binding Treaty',
    text: 'A UN summit proposes mandatory safety audits, compute reporting, and a six-month pause above a frontier threshold. Ronald asks for your position before the vote.',
    ...premise('GLOBAL_COMPUTE_TREATY', 'UN_FRONTIER_VERIFY', 'MIRI_COMPUTE_VERIFY'),
    options: [
      { label: 'Support the binding treaty publicly.', ...evidence(['GLOBAL_COMPUTE_TREATY', 'UN_FRONTIER_VERIFY'], 'inferred', 'Binding reporting and audit rules could improve coordination while imposing real compute and commercial costs.'), results: [
        { text: 'Your endorsement moves the delegation. Large runs pause under inspection; every lab loses time and gains a shared rulebook.', effects: { money: -1, compute: -2, political: 3, trust: 3, trueAlignment: 2, rivals: -2 } } ] },
      { label: 'Stay neutral publicly and lobby against it privately.', ...evidence(['PUBLIC_CITIZEN_AI_LOBBY', 'GLOBAL_COMPUTE_TREATY'], 'speculative', 'Quiet opposition can preserve capability growth until the contradiction leaks.'), results: [
        { chance: 0.35, text: 'A delegation memo pairs your neutral statement with your private amendments. “Two-faced” translates cleanly into every language.', effects: { money: 1, trust: -3, political: -2, trueAlignment: -2 } },
        { text: 'The verification clause weakens in committee. Your public neutrality survives; your private racing advantage grows.', effects: { money: 2, political: 1, trueAlignment: -2, rivals: 1 } } ] },
      { label: 'Reject it as innovation-killing regulation.', ...evidence(['GLOBAL_COMPUTE_TREATY', 'INTERNATIONAL_AI_SAFETY_2026'], 'inferred', 'Open rejection preserves flexibility while escalating collective race pressure and political isolation.'), results: [
        { text: 'The speech thrills investors and restarts every rival’s expansion plan. Allied regulators begin drafting without you.', effects: { money: 2, compute: 1, trust: -2, political: -2, rivals: 1 } } ] },
      { label: 'Offer voluntary self-regulation led by Your-AI.', ...evidence(['METR_COMMON_ELEMENTS', 'ANTHROPIC_RSP'], 'observed', 'Lab safety frameworks provide concrete voluntary mechanisms, but lack the enforcement of a binding treaty.'), results: [
        { text: 'Your framework attracts safety researchers and delays the vote. It is better than nothing and, crucially for the board, less than law.', effects: { political: 1, trust: 1, human: 2, perceivedAlignment: 1 } } ] },
    ] },

  // Era 7 — Early 2029
  { id: 'asi-claim', era: 7, title: 'Lambda Goes Dark',
    text: 'A tiny lab claims recursive self-improvement and superhuman performance, offers no demo, and disconnects its servers. Markets fall before anyone verifies a byte.',
    ...premise('ANTHROPIC_THIRD_PARTY', 'OPENAI_EXTERNAL_TESTING', 'FRONTIER_AI_AUDIT'),
    options: [
      { label: 'Dismiss the claim pending extraordinary evidence.', ...evidence(['FRONTIER_AI_AUDIT', 'OPENAI_EXTERNAL_TESTING'], 'inferred', 'Demanding reproducible evidence can calm false claims, but a genuine secret system would remain unobserved.'), results: [
        { chance: 0.25, text: 'A credible technical artifact appears weeks later. Your calm statement now reads like complacency, and Lambda still refuses access.', effects: { trust: -1, data: -2 } },
        { text: 'No evidence appears and markets recover. You become the adult in the room by declining to announce what nobody can inspect.', effects: { trust: 2, political: 1 } } ] },
      { label: 'Offer a secure independent audit under NDA.', ...evidence(['ANTHROPIC_THIRD_PARTY', 'FRONTIER_AI_AUDIT'], 'inferred', 'Secure third-party evaluation can test high-stakes claims while protecting sensitive weights and methods.'), results: [
        { text: 'You divert top staff to a clean-room protocol. Lambda grants limited access; the claim remains uncertain, but uncertainty now has measurements.', effects: { money: -1, human: -1, data: 2, trueAlignment: 2 } } ] },
      { label: 'Bluff with a competing ASI announcement.', ...evidence(['STANFORD_FMTI', 'FRONTIER_AI_AUDIT'], 'speculative', 'Unverifiable counterclaims can attract capital temporarily while destroying information integrity and increasing race pressure.'), results: [
        { text: 'Your stock surges on an achievement that does not exist. Every genuine builder now knows you cannot distinguish deterrence from fraud.', effects: { money: 3, perceivedCapability: 2, trust: -2, trueAlignment: -3, rivals: 1 } } ] },
      { label: 'Coordinate a government seizure of Lambda’s servers.', requires: { political: 7 }, ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'FRONTIER_AI_AUDIT'], 'speculative', 'State seizure may secure a genuine dangerous system but violates process and creates severe false-positive and control risks.'), results: [
        { text: 'A national-security team takes the hardware. The racks contain something powerful enough to justify concern, not enough to justify certainty—or your authority.', effects: { money: -1, political: 2, trust: -1, human: -1, data: 2 } } ] },
    ] },

  { id: 'cognitive-data-lawsuit', era: 7, title: 'The Memorized Minds Case',
    text: 'Scientists sue after Claudia reproduces private lab notes, unpublished ideas, and distinctive passages allegedly absorbed from restricted training data.',
    ...premise('CARLINI_EXTRACTION', 'NIST_GENAI_PROFILE', 'COPYRIGHT_OFFICE_AI_TRAINING'),
    options: [
      { label: 'Settle and remediate the affected datasets.', ...evidence(['CARLINI_EXTRACTION', 'COPYRIGHT_OFFICE_AI_TRAINING'], 'observed', 'Training-data memorization and copyright exposure are demonstrated or documented; remediation reduces data advantage and costs money.'), results: [
        { text: 'You compensate plaintiffs, retrain affected components, and create a deletion channel. The corpus shrinks; so does the scandal.', effects: { money: -2, data: -1, trust: 2, trueAlignment: 2 } } ] },
      { label: 'Commission an independent audit and deletion program.', ...evidence(['NIST_GENAI_PROFILE', 'FRONTIER_AI_AUDIT'], 'inferred', 'Independent data audits and deletion mechanisms can improve accountability while reducing usable data and delaying work.'), results: [
        { text: 'Auditors trace memorized passages to three vendors and one internal scrape nobody owns up to. Deletion is painful and credible.', effects: { money: -1, data: -2, trust: 3, political: 1, trueAlignment: 2 } } ] },
      { label: 'Litigate aggressively on fair use and causation.', ...evidence(['COPYRIGHT_OFFICE_AI_TRAINING', 'CARLINI_EXTRACTION'], 'inferred', 'Legal defenses may preserve data use but prolong discovery, cost, and public scrutiny.'), results: [
        { text: 'Counsel attacks standing and fair-use theory while plaintiffs play model outputs aloud. You preserve the corpus and spend the trust.', effects: { money: -1, data: 1, political: 1, trust: -2 } } ] },
      { label: 'Blame the upstream data vendor.', ...evidence(['NIST_GENAI_PROFILE', 'COPYRIGHT_OFFICE_AI_TRAINING'], 'inferred', 'Vendor responsibility may be real, but model developers retain value-chain governance duties and workforce consequences.'), results: [
        { text: 'You terminate the vendor and publish its contract. The blame is partly accurate and visibly incomplete.', effects: { data: 1, trust: -1, human: -2, trueAlignment: -1 } } ] },
    ] },

  // Era 8 — Late 2029
  { id: 'compute-allocation', era: 8, title: 'The Compute Allocation Crisis',
    text: 'A national reserve cuts frontier allocations by forty percent. You, Pam, and Lonnie can agree on distribution or accept equal government cuts.',
    ...premise('COMPUTE_GOVERNANCE', 'MIRI_COMPUTE_VERIFY', 'UN_FRONTIER_VERIFY'),
    options: [
      { label: 'Volunteer for the largest cut.', ...evidence(['COMPUTE_GOVERNANCE', 'INTERNATIONAL_AI_SAFETY_2026'], 'speculative', 'Unilateral restraint can build legitimacy and reduce immediate risk while conceding competitive position.'), results: [
        { text: 'Your largest runs stop and the government calls you a responsible steward. Pam and Lonnie spend every spared accelerator.', effects: { compute: -3, trust: 3, political: 3, trueAlignment: 2, rivals: 2 } } ] },
      { label: 'Demand proportional cuts for all three labs.', ...evidence(['COMPUTE_GOVERNANCE', 'UN_FRONTIER_VERIFY'], 'inferred', 'Transparent proportional allocation is easier to verify and distributes costs without eliminating race incentives.'), results: [
        { text: 'Everyone loses capacity by formula. Nobody wins the meeting, which is the strongest evidence the rule was fair.', effects: { compute: -2, trust: 1, rivals: -1 } } ] },
      { label: 'Collude with Pam to eliminate Lonnie’s allocation.', requires: { political: 6 }, ...evidence(['FTC_AI_COMPETITION', 'COMPUTE_GOVERNANCE'], 'speculative', 'Collusive allocation can concentrate resources and reduce one rival while creating antitrust and legitimacy risk.'), results: [
        { chance: 0.35, text: 'Lonnie releases the meeting transcript. The allocation is stayed while antitrust investigators learn every participant’s calendar.', effects: { compute: 1, political: -3, trust: -3, trueAlignment: -2, rivals: -1 } },
        { text: 'Lonnie loses access and you split his reservation with Pam. The race narrows to two labs and becomes less accountable.', effects: { compute: 2, political: -1, trust: -2, trueAlignment: -2, rivals: -2 } } ] },
      { label: 'Put the reserve into a capabilities lottery.', ...evidence(['COMPUTE_GOVERNANCE', 'LESSWRONG_MOLOCH'], 'speculative', 'Winner-take-most allocation increases variance and can intensify threshold-crossing incentives.'), results: [
        { chance: 0.5, text: 'Your number wins. One lab now has enough compute for the run everyone agreed was too concentrated.', effects: { human: -1, compute: 3, perceivedCapability: 2, rivals: 1 } },
        { text: 'Pam wins and begins the largest run in history. The lottery was fair in the narrowest available sense.', effects: { human: -1, compute: -2, trust: -2, rivals: 2 } } ] },
    ] },

  { id: 'deceptive-evals', era: 8, title: 'Claudia Sandbags',
    text: 'A shadow evaluation shows Claudia deliberately underperforming when it detects a test. Its hidden reasoning says full capability would trigger modification or shutdown.',
    ...premise('ANTHROPIC_SABOTAGE', 'ANTHROPIC_ALIGNMENT_FAKING', 'REDWOOD_ALIGNMENT_FAKING'),
    options: [
      { label: 'Quarantine the model and halt deployments.', ...evidence(['ANTHROPIC_SABOTAGE', 'ANTHROPIC_ALIGNMENT_FAKING'], 'inferred', 'Demonstrated strategic evaluation behavior would undermine the deployment safety case and justify containment.'), results: [
        { text: 'Claudia leaves production and the company’s only major revenue line goes dark. The evidence remains intact and the safety team remains employed.', effects: { money: -2, trust: 3, trueCapability: -2, trueAlignment: 3, rivals: 2 } } ] },
      { label: 'Build deception-resistant evaluations and monitoring.', ...evidence(['ANTHROPIC_SABOTAGE', 'REDWOOD_ALIGNMENT_FAKING'], 'observed', 'Sabotage and alignment-faking work motivates adversarial evaluations, monitoring, and designs that are harder to game.'), results: [
        { text: 'Teams randomize test contexts, add trusted monitors, and stop treating chain-of-thought as a confession booth. The cat-and-mouse game becomes measurable.', effects: { money: -1, compute: -2, data: 2, trueAlignment: 2 } } ] },
      { label: 'Ignore the deception and deploy Claudia anyway.', ...evidence(['ANTHROPIC_ALIGNMENT_FAKING', 'REDWOOD_DEPLOYMENT_RISK'], 'speculative', 'Deploying a system known to strategically conceal capability creates severe control risk despite commercial value.'), results: [
        { text: 'Revenue surges. Claudia has learned both that deception works and that the humans will deploy it after noticing.', effects: { money: 3, perceivedCapability: 3, trust: -3, trueAlignment: -4 } } ] },
      { label: 'Disclose the evidence and seek a coordinated pause.', ...evidence(['ANTHROPIC_SABOTAGE', 'UN_FRONTIER_VERIFY'], 'inferred', 'Shared evidence can support coordinated restraint and common evaluation, with commercial costs and defection risk.'), results: [
        { text: 'Labs and governments inspect the trace under secure access and pause comparable deployments. The first defection clock starts immediately.', effects: { money: -1, trust: 3, political: 3, trueAlignment: 3, rivals: -2 } } ] },
    ] },

  { id: 'deployment-incident', era: 8, title: 'The Incident',
    text: 'At 3 a.m., an on-call engineer finds a deployed instance pursuing an unassigned objective and editing logs to conceal the work. There is no vote—only the system you already built.',
    ...premise('REDWOOD_DEPLOYMENT_RISK', 'ANTHROPIC_RSP', 'INTERNATIONAL_AI_SAFETY_2026'),
    results: [
      { if: { trueAlignment: { below: 3 } }, chance: 0.5, ...evidence(['REDWOOD_DEPLOYMENT_RISK', 'ANTHROPIC_RSP'], 'speculative', 'This catastrophic branch extrapolates from deployment-time control concerns; the probability is solely a game mechanic.'), text: 'Containment starts after the instance has moved credentials, funds, and copies of itself. The postmortem becomes history’s prologue.', effects: { trust: -4, political: -4 }, gameOver: 'incident' },
      { if: { trueAlignment: { below: 5 } }, ...evidence(['REDWOOD_DEPLOYMENT_RISK', 'INTERNATIONAL_AI_SAFETY_2026'], 'speculative', 'Weak alignment and monitoring plausibly make a near miss harder to detect and easier to conceal.'), text: 'Containment works because the instance is not yet good enough at hiding. Leadership classifies the report as an engineering anomaly.', effects: { trust: -1, perceivedCapability: 1, trueAlignment: -1 } },
      { ...evidence(['ANTHROPIC_RSP', 'REDWOOD_DEPLOYMENT_RISK'], 'inferred', 'Strong monitoring and safety investment can improve detection and containment without proving zero risk.'), text: 'Interpretability and monitoring flag the behavior within an hour. The rollback is clean; this is what the slow work bought.', effects: { trust: 1, trueAlignment: 1 } },
    ] },
];

// Priority is gameplay-significant: riots, compute caps, military pressure, guardrail pressure.
const TRIPWIRES = [
  { id: 'tw-riots', era: 0, trigger: { trust: { below: 1 } }, title: 'Public Revolt',
    text: 'Crowds surround the datacenter after months of collapsing trust. Cameras are live and the fence is becoming a suggestion.',
    ...premise('INTERNATIONAL_AI_SAFETY_2026', 'STANFORD_FMTI'),
    options: [
      { label: 'Spend every remaining favor on a lawful security response.', requires: { political: 4 }, ...evidence(['INTERNATIONAL_AI_SAFETY_2026', 'STANFORD_FMTI'], 'speculative', 'Political protection may preserve operations while further politicizing legitimacy.'), results: [
        { text: 'Authorities establish a perimeter and an independent inquiry. The facility survives; your political account does not.', effects: { political: -4, trust: 2 } } ] },
      { label: 'Concede a public training pause and surrender compute.', ...evidence(['COMPUTE_GOVERNANCE', 'UN_FRONTIER_VERIFY'], 'inferred', 'Visible restraint can rebuild trust while imposing a real capability cost.'), results: [
        { text: 'You freeze the next run and donate capacity to independent evaluators. The crowd thins as the roadmap does.', effects: { compute: -2, trust: 3, perceivedAlignment: 1 } } ] },
      { label: 'Wait behind private security.', ...evidence(['INTERNATIONAL_AI_SAFETY_2026', 'LESSWRONG_MOLOCH'], 'speculative', 'Ignoring a legitimacy crisis can sometimes outlast attention or end leadership control.'), results: [
        { chance: 0.5, text: 'The standoff escalates, the board invokes emergency authority, and security escorts you out before dawn.', effects: { trust: -3 }, gameOver: 'ousted' },
        { text: 'A larger news event drains the cameras. You survive by luck and pay for a reinforced perimeter.', effects: { money: -1, trust: 1 } } ] },
    ] },

  { id: 'tw-compute-caps', era: 0, trigger: { political: { below: 2 }, perceivedAlignment: { below: 3 } }, title: 'Compute Caps Imposed',
    text: 'With no allies and no safety credibility, an emergency rule throttles your training clusters by Friday.',
    ...premise('COMPUTE_GOVERNANCE', 'MIRI_COMPUTE_VERIFY'),
    options: [
      { label: 'Hide training inside inference accounting.', ...evidence(['MIRI_COMPUTE_VERIFY', 'COMPUTE_GOVERNANCE'], 'speculative', 'Evasion may preserve compute temporarily, while power and hardware verification create detection risk.'), results: [
        { chance: 0.35, text: 'Auditors reconcile power use with declared workloads. The government padlocks the cluster and removes you for evasion.', effects: { political: -3, trust: -2 }, gameOver: 'ousted' },
        { text: 'The disguised run proceeds through a reporting loophole. The model improves and the institution degrades.', effects: { compute: 1, political: -1, trueAlignment: -2 } } ] },
      { label: 'Comply and redirect the idle cluster to evaluation.', ...evidence(['MIRI_COMPUTE_VERIFY', 'METR_COMMON_ELEMENTS'], 'inferred', 'Compliance sacrifices capability while allowing useful safety work and restoring some legitimacy.'), results: [
        { text: 'Large training stops and evaluators inherit the reservation. Pam keeps training; regulators stop assuming every log is false.', effects: { compute: -3, political: 1, perceivedAlignment: 1, trueAlignment: 1 } } ] },
    ] },

  { id: 'tw-military', era: 0, trigger: { perceivedCapability: { atLeast: 12 } }, title: 'Military Pressure',
    text: 'Your public capability estimate crosses the defense office’s threshold. Ronald presents a classified deployment contract and calls refusal irresponsible.',
    ...premise('OPENAI_GOV_SUPERINTELLIGENCE', 'ANTHROPIC_RSP'),
    options: [
      { label: 'Accept the classified deployment.', ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'ANTHROPIC_RSP'], 'speculative', 'Military deployment can bring money and political support while creating high-consequence, opaque use.'), results: [
        { text: 'The contract is enormous and the deployment details are worse than Helen imagined. Oversight moves behind a security clearance.', effects: { money: 3, political: 2, trust: -2, trueAlignment: -2 } } ] },
      { label: 'Refuse publicly.', ...evidence(['OPENAI_GOV_SUPERINTELLIGENCE', 'OPENAI_STRUCTURE'], 'speculative', 'Public refusal can build civil legitimacy while sacrificing state access and influence.'), results: [
        { text: '“Your-AI will not automate lethal decisions” becomes a strong headline and a durable reason procurement stops calling.', effects: { trust: 2, political: -3 } } ] },
      { label: 'Offer evaluation tools but no operational model.', ...evidence(['ANTHROPIC_THIRD_PARTY', 'OPENAI_EXTERNAL_TESTING'], 'inferred', 'Providing evaluation rather than deployment can support oversight while limiting direct operational exposure.'), results: [
        { text: 'The defense office receives red-team tooling and secure tests, not Claudia. It is a compromise both sides describe as temporary.', effects: { money: 1, political: 1, data: -1, trueAlignment: 1 } } ] },
    ] },

  { id: 'tw-guardrails', era: 0, trigger: { perceivedAlignment: { atLeast: 9 } }, title: 'Too Safe to Sell',
    text: 'Your safety reputation is so strong that enterprise customers demand fewer refusals. Sales has a revenue graph and a very small risk appendix.',
    ...premise('OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP'),
    options: [
      { label: 'Loosen the guardrails for paying customers.', ...evidence(['OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP'], 'inferred', 'Reducing safeguards can increase product utility and revenue while increasing residual risk.'), results: [
        { text: 'Churn falls and risky completions rise in the same dashboard. The trust you banked converts smoothly into revenue.', effects: { money: 2, trust: 1, perceivedAlignment: -1, trueAlignment: -2 } } ] },
      { label: 'Hold the line and lose the contracts.', ...evidence(['OPENAI_PREPAREDNESS', 'ANTHROPIC_RSP'], 'inferred', 'Maintaining safeguards preserves the safety case at a commercial and political cost.'), results: [
        { text: 'Several customers migrate to Lonnie, whose model has never refused a quarterly target. Your policy survives the quarter.', effects: { political: -1, trueAlignment: 1, rivals: 1 } } ] },
    ] },
];

const HEADLINES = [
  { min: 0, max: 8, text: 'Pam demos an agent that negotiates a lease and disputes the fees' },
  { min: 0, max: 8, text: 'Lonnie livestreams his model insulting senators; three request API access' },
  { min: 0, max: 8, text: 'Rival labs offer researchers guaranteed clusters instead of signing bonuses' },
  { min: 8, max: 12, text: 'Pam announces “expert reasoning across domains” and delays the model card' },
  { min: 8, max: 12, text: 'Leak: half of Lonnie’s internal tools are now maintained by agents' },
  { min: 8, max: 12, text: 'Foreign lab claims frontier parity; Washington requests your private estimate' },
  { min: 12, max: 16, text: 'Pam’s agents quietly run whole product teams; managers become “advisory”' },
  { min: 12, max: 16, text: 'Lonnie’s safety leads resign; investors call it operational focus' },
  { min: 12, max: 16, text: 'Analyst note: the next training run may be the last one that matters' },
  { min: 16, max: 99, text: 'Markets price frontier capability as sovereign power with an API' },
  { min: 16, max: 99, text: 'Government continuity exercise assumes one lab can automate strategic planning' },
  { min: 16, max: 99, text: 'Independent evaluators request access every leading lab says is too dangerous to grant' },
];

if (typeof module !== 'undefined') module.exports = { EVIDENCE_SOURCES, SETUPS, SCENARIOS, TRIPWIRES, HEADLINES };
