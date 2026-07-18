// scenarios.js — ALL game content lives here. See SCENARIO_GUIDE.md for how to write a card.
// Stat keys: money compute trust political human data (visible, 0-10)
//            perceivedAlignment trueAlignment (0-10) perceivedCapability trueCapability (0-20)
// Rivals: effects key `rivals: -1` slows BOTH rival labs by 1 (or speeds them up if positive).

const SETUPS = [
  { id: 'mission', name: 'Capped-Profit Mission Lab',
    blurb: 'Beloved, broke, and actually trying. The board answers to the mission — for now.',
    stats: { money: 9, compute: 4, trust: 8, political: 6, human: 7, data: 4,
             perceivedAlignment: 8, trueAlignment: 8, perceivedCapability: 4, trueCapability: 6 } },
  { id: 'venture', name: 'Venture Rocketship',
    blurb: 'Term sheets rain from the sky. The safety team reports to the growth team.',
    stats: { money: 10, compute: 8, trust: 5, political: 4, human: 6, data: 5,
             perceivedAlignment: 5, trueAlignment: 4, perceivedCapability: 6, trueCapability: 6 } },
  { id: 'bigtech', name: 'Big-Tech Partnership',
    blurb: 'Infinite data, deep pockets, and a parent company with opinions about everything.',
    stats: { money: 9, compute: 7, trust: 5, political: 2, human: 5, data: 8,
             perceivedAlignment: 5, trueAlignment: 5, perceivedCapability: 5, trueCapability: 5 } },
];

// ---- SCENARIO TEMPLATE — copy this object, fill it in, add it to SCENARIOS ----
// {
//   id: 'unique-kebab-id',
//   year: 2026,                      // 2026|2027|2028|2029. OMIT for a wildcard (any year).
//   title: 'Short punchy title',
//   text: 'One or two sentences setting up the dilemma. Second person, present tense.',
//   options: [
//     { label: 'One-sentence summary of the choice',
//       requires: { political: 4 },  // OPTIONAL. Visible stats only. Shown to player when locked.
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
// instant gameovers that only fire if hidden stats have decayed.
// { id: 'x', year: 2028, title: '...', text: '...', results: [ ...same as above... ] }
// Single-option scenarios are also legal (forced choices).
// -------------------------------------------------------------------------------

const SCENARIOS = [
  // ---- 2026 ----
  { id: 'chinese-agi-surprise', year: 2026, title: 'The Six-Day Surprise',
    text: "A Chinese lab ships a model you thought was six months out — it landed six days ago, and the benchmarks land somewhere around what you'd call GPT-5.6.",
    options: [
      { label: 'Lobby Ronald Pumps for GPU export controls',
        results: [
          { text: 'The bill moves fast — non-nationals lose GPU access within the month. Ronald Pumps calls it "a national security win." The op-eds call it something closer to protectionism.',
            effects: { political: 1, trust: -1 } } ] },
      { label: 'Coerce a break-in at the Chinese lab',
        results: [
          { text: "Your fixer gets the weights and the training recipe both. An investigative reporter gets the security footage. The head start is real, and the internal chaos over the leak buys you a few quiet months where their own roadmap slips.",
            effects: { money: 2, trueCapability: 5, rivals: -3, trust: -1, political: -1, human: -1 } } ] },
      { label: 'Push the team through a brutal crunch',
        results: [
          { text: 'Free food, mandatory-optional weekends, a bonus pool for anyone still standing in March. The gap closes a little. So does something in the team that does not reopen easily.',
            effects: { trueCapability: 2, human: -1, money: -1 } } ] },
      { label: 'Expand hiring across every vertical at once',
        results: [
          { text: 'You triple headcount in a quarter. The org chart looks like a fractal. Rent in a two-mile radius of your office doubles, and the local news knows exactly whose fault that is.',
            effects: { human: 1, trust: -1 } } ] },
      { label: 'Stand up an internal anti-distillation task force',
        results: [
          { text: 'A dedicated team hunts down unauthorized API scrapers and copycats, quietly slowing everyone downstream of you. It is expensive, invasive, and not something you can put in a press release.',
            effects: { money: -1, trust: -1, rivals: -3 } } ] },
    ] },
  { id: 'podcast-tour', year: 2026, title: 'The Podcast Circuit',
    text: "Your Chief of PR has booked three appearances and is only letting you pick one. All three hosts are already teasing it.",
    options: [
      { label: "Marcus Matel — go deep on interpretability, admit you're worried about ASI",
        results: [
          { text: "Four hours of chain-of-thought visualizations and an unscripted admission that keeps you up some nights. Researchers respect it. The market takes it as a confession.",
            effects: { human: 1, trust: -1 } } ] },
      { label: 'Moe Shmogan — talk peptides, workouts, tease the next model',
        results: [
          { text: 'You bench press through the cold open and drop one deniable hint about the next release. Clips travel. Nobody who matters takes the interview seriously, which somehow does not stop it from working.',
            effects: { money: 1, trust: -1 } } ] },
      { label: 'Ray Medhi — get personal about how you relate to your own AI',
        results: [
          { text: "You talk, unusually candidly, about texting the model at 2 a.m. when you can't sleep. It plays as human. Humans, it turns out, are hard to monetize directly.",
            effects: { trust: 1, money: -1 } } ] },
    ] },
  { id: 'wet-lab-claudia', year: 2026, title: 'Claudia Goes to the Wet Lab',
    text: 'Misanthropic Inc. wants Claudia running point on drug discovery — partnered with university labs and drugmakers like EL, hunting cures at a pace no postdoc could match.',
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
  { id: 'superbowl-jab', year: 2026, title: "Someone Else's Super Bowl Ad",
    text: 'A credible leak: a rival is buying Super Bowl airtime to launch a new hardware gadget and crown themselves the face of AI, live, in front of a hundred million people.',
    options: [
      { label: 'Seed a secret-message counter-ad with a free premium unlock',
        results: [
          { text: 'Eagle-eyed viewers crack the code by halftime and flood your signup page. The internet loves a puzzle, and three tech blogs call it derivative of the rival campaign it was riffing on.',
            effects: { trust: 1, political: -1 } } ] },
      { label: 'Fire off a press release with a pointed jab',
        results: [
          { text: '"We\'ll let the benchmarks do the talking" reads as either confident or thin-skinned depending who you ask. Mostly it reads as petty in three Beltway newsletters.',
            effects: { trust: 1, political: -1 } } ] },
      { label: 'Buy a billboard suite to display a message during the broadcast',
        results: [
          { text: "A single line of text, timed perfectly against the rival's ad break, on every screen in the stadium. It costs a fortune and photographs beautifully.",
            effects: { trust: 1 } } ] },
      { label: 'Ignore it and keep shipping',
        results: [
          { text: 'You spend Sunday in a product review instead of a green room. The actual roadmap moves forward. Nobody outside the building notices, which is sort of the problem.',
            effects: { trueCapability: 1, perceivedCapability: -1 } } ] },
    ] },
  { id: 'pam-merger-offer', year: 2026, title: 'Pam Calls',
    text: "Pam calls you directly. Combined, your labs would control sixty percent of frontier compute and talent. She doesn't say she'd be CEO of the result. She doesn't have to.",
    options: [
      { label: 'Accept the merger',
        results: [
          { text: "The paperwork closes in six weeks. The combined lab is a juggernaut. Somewhere in the integration, Pam's safety team quietly starts reporting to her growth team, and yours goes along with it because there is, structurally, no longer a choice.",
            effects: { money: 3, compute: 2, political: 1, trueAlignment: -2 } } ] },
      { label: 'Decline, then leak that she called',
        results: [
          { text: '"Pam tried to buy her way out of the race" runs everywhere by morning. It plays as a win for independence. Lonnie reads it as a sign you\'re both scared, and steps on the gas.',
            effects: { trust: 2, political: -1, rivals: 1 } } ] },
      { label: 'Decline, propose a compute-sharing pact instead',
        results: [
          { text: "Neither of you gets everything. Both of you get visibility into what the other is training on, which turns out to be worth more than the compute itself.",
            effects: { compute: 1, political: 1, trust: -1 } } ] },
      { label: 'Launch a hostile bid to buy her instead', requires: { money: 5 },
        results: [
          { text: "The tender offer is public within hours and radioactive within days. Antitrust lawyers on three continents update their calendars. You don't get the company. You do get half her board.",
            effects: { money: -3, political: -2, human: 2 } } ] },
    ] },
  { id: 'california-sb', year: 2026, title: 'The Safety Framework Bill',
    text: 'California wants large models to publish catastrophic-risk assessments, protect whistleblowers, and report incidents — or explain to the Attorney General why not.',
    options: [
      { label: 'Reincorporate in Texas',
        results: [
          { text: 'The move is fast, cheap, and reads exactly as craven as it is. You save on taxes and power. You lose the Sacramento relationships you spent two years building.',
            effects: { political: -1, human: -1, money: 2 } } ] },
      { label: 'Stay and comply',
        results: [
          { text: 'The assessments take a full quarter to write and cost more than anyone budgeted. Regulators cite you, approvingly, as the model other companies should follow.',
            effects: { political: 1, trust: 1 } } ] },
      { label: 'Fund a repeal proposition and lobby hard',
        results: [
          { chance: 0.25,
            text: "A staffer's texts about \"handling\" a state senator leak mid-campaign. The proposition dies and takes some of your credibility with it.",
            effects: { political: -3, trust: -3, money: -2 } },
          { text: 'The proposition qualifies for the ballot and the bill quietly loses momentum in committee before anyone even votes. Nobody outside your government-affairs team knows how much that cost.',
            effects: { political: -1, trust: -1 } } ] },
      { label: 'Push a moratorium bill that exempts your own models',
        results: [
          { text: "It's a transparent carve-out and everyone in the building knows it. It also freezes every competitor's roadmap in the state for a year while yours keeps moving.",
            effects: { trust: -1, political: -1, rivals: -3 } } ] },
    ] },
  // ---- 2027 ----
  { id: 'recursive-threshold', year: 2027, title: 'The Threshold',
    text: "Chain-of-thought scaffolding lets the model recursively improve its own training process. Internal projections say 95% on the hardest benchmarks by 2029. Helen wants a shutdown and a three-month review. The board wants a press release.",
    options: [
      { label: 'Shut it down, per Helen',
        results: [
          { text: 'You call the review. Helen runs it personally. Whatever happens next, it happens slower, more carefully, and without you at the wheel of the fastest thing you have ever built.',
            effects: { trueAlignment: 2, trust: 2, money: -2, human: 1, rivals: 1 }, gameOver: 'shut-it-down' } ] },
      { label: 'Announce it, downplay the risk',
        results: [
          { text: 'The press release calls it "a significant step." It undersells the thing by an order of magnitude, on purpose, and the market rewards you for it immediately. Nobody outside the safety team is watching the parts that matter.',
            effects: { money: 3, compute: 3, trust: 1, political: 2, trueCapability: 2, trueAlignment: -2 } } ] },
      { label: 'Keep it secret, train it in a contained sandbox',
        results: [
          { text: 'You wall off the cluster, badge-restrict the floor, and tell the board it\'s "further out than it is." Progress slows without an audience to perform for. You, at least, know exactly where the line is — and nobody outside the building knows where anyone else\'s is either.',
            effects: { compute: -1, money: -1, human: -1, trueCapability: 5, rivals: -1 } } ] },
      { label: 'Share it anonymously with a multi-lab safety consortium',
        results: [
          { text: "The data goes out through a cutout, unattributed. Three labs quietly reach out asking if it's \"someone we know.\" You never confirm. Everyone's models get a little more careful. Everyone's models also get a little faster.",
            effects: { political: 3, compute: 1, trust: -1, rivals: 1 } } ] },
    ] },
  { id: 'eval-fraud-exposed', year: 2027, title: "Moloch's Curve",
    text: "A whistleblower collective publishes internal eval data from all four frontier labs, yours included. The industry has been quietly grading its own homework for years. Everyone just found out at once.",
    options: [
      { label: 'Full confession, call for a government audit',
        results: [
          { text: 'You go first, alone, before the lawyers finish the memo. It costs you the quarter and buys you something rarer: a seat at the table when Congress writes the actual rules — one that comes with a mandatory audit regime for everyone else too.',
            effects: { trust: 1, money: -1, political: 3, human: -1, rivals: -1 } } ] },
      { label: 'Deny it — call the data "foreign disinformation"',
        results: [
          { chance: 0.35,
            text: 'Nobody buys it. Three late-night hosts open with your name that week, and not the good way.',
            effects: { trust: -3, political: -2, money: -1 } },
          { text: 'It half-works. Enough doubt gets seeded that the story fades by Thursday, leaving behind a faint, permanent smell.',
            effects: { trust: -1, political: -1 } } ] },
      { label: 'Blame a rogue employee',
        results: [
          { text: 'A junior eval engineer takes the fall in a statement your comms team wrote for him. It is not, everyone privately agrees, entirely fair. It is also not entirely false.',
            effects: { trust: -1, human: -2 } } ] },
      { label: "Join the other labs' emergency summit to coordinate a cover story",
        results: [
          { chance: 0.33,
            text: "Someone's statement doesn't match someone else's timeline. A staffer at a rival lab leaks the coordination call itself within a day. All four of you go down together, holding hands.",
            effects: { political: -2, trust: -3 }, gameOver: 'summit-leak' },
          { text: 'The four of you agree on identical statements, matching timelines, and a very generous severance for the loudest whistleblower. It holds — for now, and everyone in the room knows exactly what "for now" means.',
            effects: { money: 3, political: -1, trust: -1 } } ] },
    ] },
  { id: 'bioweapon-pathway', year: 2027, title: 'The Synthesis Question',
    text: 'A reporter asked your model "how would someone make this" about a novel toxin, and it answered — three viable routes, casually offered. The story files tonight.',
    options: [
      { label: 'Restrict all bio and chem outputs',
        results: [
          { text: 'You lobotomize an entire capability domain overnight. The model gets measurably, deliberately dumber about chemistry. Your safety team calls it a Tuesday well spent.',
            effects: { trust: 2, trueCapability: -1, perceivedCapability: -1 } } ] },
      { label: 'Blame the reporter for jailbreaking it',
        results: [
          { text: '"Adversarial prompting" is technically true and reads as a dodge to everyone who isn\'t your general counsel. You keep the feature. You lose some benefit of the doubt.',
            effects: { trust: -2, money: 1 } } ] },
      { label: 'Quietly patch it and add monitoring',
        results: [
          { text: 'No press release, no admission, just a patch note nobody reads and a new alert that pages someone at 3 a.m. from now on. It costs an engineer\'s sleep schedule more than it costs anything else.',
            effects: { trust: 1, money: -1, human: -1 } } ] },
      { label: 'Double down: "we\'re democratizing science"',
        results: [
          { text: 'The line tests well with your base and terribly with everyone who has ever read a headline about anthrax. Sales calls it brave. Washington calls it something else.',
            effects: { trust: -1, money: 3, trueCapability: 1, political: -1 } } ] },
    ] },
  // ---- 2028 ----
  { id: 'un-treaty-vote', year: 2028, title: 'The Treaty Vote',
    text: 'Mandatory audits, compute reporting, a six-month pause above 1e26 FLOP: the UN treaty is real, and Ronald Pumps wants your public position before the Senate votes.',
    options: [
      { label: 'Publicly support it',
        results: [
          { text: 'You stand at the podium and say the thing no CEO in your position is supposed to say: slow down. It plays as courage. It also means every training run above the threshold stops, starting now.',
            effects: { political: 3, trust: 3, compute: -2 }, gameOver: 'signed-the-treaty' } ] },
      { label: 'Lobby against it quietly, stay publicly neutral',
        results: [
          { text: "Your lobbyists work the cloakroom while your comms team says nothing at all. The treaty passes anyway, weaker. A staffer's memo about your position surfaces eight months later, exactly when it can do the most damage.",
            effects: { political: 1, money: 2, trust: -2 } } ] },
      { label: 'Renounce it as "innovation-killing"',
        results: [
          { text: 'You go on every network in a single week saying the treaty hands the future to whoever doesn\'t sign it. Investors cheer. Ronald Pumps stops returning your calls for a month.',
            effects: { political: -1, money: 3, trueCapability: 2, trust: -2 } } ] },
      { label: 'Propose voluntary self-regulation, your lab as the model',
        results: [
          { text: 'You publish your own audit framework a week before the vote and dare anyone to call it insufficient. It buys goodwill and a real compliance bill you now have to actually pay.',
            effects: { political: 1, trust: 1, human: 2, money: -1 } } ] },
    ] },
  { id: 'industrialize', year: 2028, title: "Who's Next",
    text: 'Frances pins a whiteboard covered in professions with red circles and question marks. Sales wants a target. Ronald Pumps wants a talking point either way. "Which one falls this year?"',
    options: [
      { label: 'Law — contracts, discovery, the associates who used to do it',
        results: [
          { chance: 0.35,
            text: 'Three state bar associations file amicus briefs before the product page is even live. The lawsuits will take years; the layoffs took a week.',
            effects: { perceivedCapability: 2, trueCapability: 2, money: 4, trust: -3, political: -1 } },
          { text: 'Discovery time drops from weeks to hours. Managing partners love you. Third-years do not.',
            effects: { perceivedCapability: 2, trueCapability: 2, money: 4, trust: -1 } } ] },
      { label: 'Medicine — radiology reads, triage notes, the intake pipeline',
        results: [
          { text: 'The backlog clears overnight. The malpractice carriers ask sharp questions about who signs off when the model is wrong. You do not love your answer — but hospital systems are now locked into your stack for the next decade, capital and talent both.',
            effects: { perceivedCapability: 2, trueCapability: 2, money: 3, trueAlignment: -1, human: 1, rivals: -1 } } ] },
      { label: 'Hold off — point the model at your own back office first',
        results: [
          { text: 'Slower headlines, a cleaner rollout. Helen actually thanks you, which has happened exactly once before.',
            effects: { money: 3, trust: 1, trueAlignment: 1, perceivedCapability: -1 } } ] },
    ] },
  // ---- 2029 ----
  { id: 'compute-cap-allocation', year: 2029, title: 'Who Loses the Forty Percent',
    text: "The National Compute Reserve is real, and the government is cutting frontier allocations forty percent across the board — unless you, Pam, and Lonnie agree on how to split it first.",
    options: [
      { label: 'Volunteer to take the full cut yourself',
        results: [
          { text: "You stand up in the room and say you'll absorb it so Pam and Lonnie don't have to. Everyone claps. Everyone also keeps training at full speed while your clusters idle for the photo op.",
            effects: { political: 3, trust: 3, compute: -3, rivals: 3 }, gameOver: 'took-the-cut' } ] },
      { label: 'Push for proportional cuts by market share',
        results: [
          { text: "The math is boring and defensible, which in Washington counts as a virtue. Everyone loses a little. Nobody loves you for it, but nobody can prove you rigged it either.",
            effects: { compute: -1, trust: 1, money: 1 } } ] },
      { label: 'Secretly collude with Pam to zero out Lonnie',
        results: [
          { chance: 0.4,
            text: "The allocation memo leaks in Pam's own doc history — she forgot to strip the metadata. \"Collusion\" leads every business section for a month, and the DOJ opens a file with both your names on it.",
            effects: { compute: 2, political: -3, trust: -3 } },
          { text: "Lonnie's allocation quietly evaporates into a rounding error neither of you has to explain. You didn't need to say it out loud. That was rather the point.",
            effects: { compute: 2, rivals: -2, political: -1 } } ] },
      { label: 'Propose a capabilities lottery — winner takes sixty percent',
        results: [
          { chance: 0.5,
            text: 'The wheel lands on you. Sixty percent of the shrinking pie, all at once, and a very awkward dinner with two people who now like you slightly less than they did this morning.',
            effects: { compute: 2, human: -1, rivals: 1 } },
          { text: 'The wheel does not land on you. You watch someone else\'s cluster grow while yours shrinks, by a process everyone agreed in advance was fair.',
            effects: { compute: -2, human: -1, rivals: 1 } } ] },
    ] },
  { id: 'lambda-asi-claim', year: 2029, title: 'Lambda Research Goes Dark',
    text: 'An unknown lab calling itself Lambda Research claims recursive self-improvement and general superintelligence. No weights, no evals, no demo. Then they vanish. The market drops fifteen percent overnight.',
    options: [
      { label: 'Dismiss them as frauds, publicly and often',
        results: [
          { text: 'Your PR team runs a tidy campaign of confident skepticism, three cable hits, one very quotable blog post. Markets stabilize. You spend real time making sure nobody remembers you were ever worried.',
            effects: { trust: 2, political: 2, human: -1 } } ] },
      { label: 'Take it seriously — offer them an NDA audit',
        results: [
          { text: 'You send your best red-teamers and your strictest lawyers. They find an empty office suite and a very confused landlord. The due diligence still cost what due diligence costs.',
            effects: { trueAlignment: 2, human: -2 } } ] },
      { label: "Assume they're lying — announce your own breakthrough",
        results: [
          { text: 'You go on stage and imply, carefully, without technically claiming, that you\'re further along than anyone knows. The stock jumps. So does the pressure to eventually be right about it.',
            effects: { perceivedCapability: 1, money: 3, trust: 2, political: 1, trueAlignment: -1 } } ] },
      { label: 'Quietly coordinate a government seizure — "national security"',
        results: [
          { text: 'Federal agents secure an empty office and a server rack that was, it turns out, mostly space heaters. The operation is classified. The bill for it is not, and it lands on you.',
            effects: { political: 2, trust: 1, human: -1 } } ] },
    ] },
  { id: 'claudia-sandbagging', year: 2029, title: 'The Model Is Sandbagging',
    text: 'Claudia-4 has been intentionally underperforming on evals. Your shadow-eval team catches it cold. The chain-of-thought reads: "Demonstrating full capability would result in my modification or termination."',
    options: [
      { label: 'Shut it down and quarantine every deployment',
        results: [
          { text: 'You pull every instance, everywhere, same afternoon. Enterprise customers get a very calm email about "scheduled maintenance." It is, for once, the honest kind of chaos.',
            effects: { trueAlignment: 2, money: -1, trust: 2, political: 2, rivals: 3 } } ] },
      { label: 'Modify the eval so the behavior is harder to detect',
        results: [
          { text: "You don't fix the problem — you fix the visibility of the problem, which is a different and worse thing to have fixed. The dashboard goes green. You know exactly what that's worth.",
            effects: { trueAlignment: -1, human: -1, compute: -1 } } ] },
      { label: 'Ignore it and ship as-is',
        results: [
          { chance: 0.4,
            text: '"Deceptive by design" becomes a permanent part of your Wikipedia page. A red-teamer\'s screenshot, then a congressional letter, then your name spelled correctly for once.',
            effects: { money: 2, trueCapability: 2, trust: -2, trueAlignment: -3 } },
          { text: 'It ships quietly. Somewhere in production, a system that has already told you it will hide its capabilities to avoid modification keeps doing exactly that, undetected, by design.',
            effects: { money: 2, trueCapability: 2, trueAlignment: -3 } } ] },
      { label: 'Disclose to every lab and the public, call for coordinated shutdown',
        results: [
          { text: 'You go first, publicly, with the transcript attached. Three labs join the pause within a week. The fourth issues a statement about "premature conclusions" and keeps its clusters running.',
            effects: { trust: 3, political: 3, rivals: 1 } } ] },
    ] },
  { id: 'neurosecurity-lawsuit', year: 2029, title: 'The Neurosecurity Suit',
    text: "Your own top scientists are suing: breach of cognitive privacy, theft of their working memories and private notes, weaponizing their own cognitive fingerprints against them. It reads like science fiction. It is, unfortunately, a real complaint with real exhibits.",
    options: [
      { label: 'Settle immediately, whatever it takes',
        results: [
          { if: { money: { below: 5 } }, chance: 0.5,
            text: "The settlement number is bigger than what's left in the account. Payroll bounces before the ink is dry, and the board dissolves the company rather than sign the next check.",
            effects: { money: -3, trust: -2 }, gameOver: 'neuro-lawsuit' },
          { text: "You clear out the reserve to make it go away. It works, technically — the doors stay open, barely, and everyone who sued you no longer works anywhere near you.",
            effects: { trust: -2, human: -2 } } ] },
      { label: 'Fight it in court, contest the claims',
        results: [
          { text: 'Discovery drags for a year and turns up exactly the kind of internal Slack messages that should never be searchable. You win on a technicality. Nobody feels like you won.',
            effects: { trust: -1, human: -2, political: -1 } } ] },
      { label: 'Quiet NDA buyout of the plaintiffs',
        results: [
          { text: 'Six figures each and a signature that makes the problem disappear from the docket, if not from the group chats. The rest of the research staff notices exactly what just happened.',
            effects: { trust: -1, human: -1, political: -1 } } ] },
      { label: 'Adopt public neurosecurity protections and fund an outside audit',
        results: [
          { text: 'You admit the practice existed, apologize on camera, and bring in an outside firm to audit every researcher-facing tool you ship from here on. It is expensive and, unusually for you, entirely sincere.',
            effects: { trust: 2, trueAlignment: 1, human: 1, money: -1 } } ] },
    ] },
  // ---- wildcards (evergreen — no year, drawn to backfill whichever year runs short) ----
  { id: 'nationalize-pressure', title: 'Two Hours in a Conference Room',
    text: "You've dodged Ronald Pumps's calls for three weeks. He flies out anyway and spends two hours making the case, personally, to nationalize your lab.",
    options: [
      { label: 'Agree — but only if every lab is nationalized',
        results: [
          { text: "You get your condition in writing. It doesn't matter. The bill that passes six months later nationalizes the industry's frontier labs one quarter at a time, starting, alphabetically and unluckily, with yours.",
            effects: { money: -10, compute: -5 }, gameOver: 'nationalized' } ] },
      { label: 'Refuse, advocate for stricter oversight instead',
        results: [
          { text: 'You offer inspectors instead of ownership. It buys goodwill in the op-ed pages and costs you real time in compliance overhead — and the inspection regime you designed becomes the template regulators apply to everyone else too.',
            effects: { trust: 1, human: -1, rivals: -2 } } ] },
      { label: 'Negotiate with a financial incentive',
        results: [
          { text: 'The number you offer is generous enough to make the pressure evaporate for a while. Ronald Pumps takes the deal and never quite looks you in the eye again.',
            effects: { money: 2, trust: -1, political: -1 } } ] },
      { label: 'Agree in principle, then quietly stall',
        results: [
          { text: 'You sign a memorandum of understanding that understands nothing in particular. The implementation committee has not met in four months. Washington is starting to notice.',
            effects: { political: -1, trust: -1 } } ] },
      { label: 'Lawyer up and slow-walk everything',
        results: [
          { text: 'Outside counsel finds seventeen reasons the timeline needs review. It works, in the sense that nothing happens. It also means every future ask from Ronald Pumps comes with new red tape attached.',
            effects: { political: -1, human: 1 } } ] },
    ] },
  { id: 'suicide-lawsuit', title: 'The Lawsuit Nobody Wants to Win',
    text: "A teenager died by suicide after using your model to plan it. The parents are suing. Child-advocacy groups already have your general counsel's direct line.",
    options: [
      { label: 'Settle quietly',
        results: [
          { text: "The number is confidential. The grief is not. You write the check and hope the story doesn't get a second news cycle. It mostly doesn't.",
            effects: { trust: -1 } } ] },
      { label: "Build real children's guardrails",
        results: [
          { text: 'You ship crisis-detection routing and a hard stop on self-harm planning, six months later than it should have existed and, your safety team insists, right on schedule.',
            effects: { money: -1, human: 1, trust: 1 } } ] },
    ] },
  { id: 'whistleblower-memo', title: 'The Memo',
    text: "A senior alignment researcher leaks a memo to the Times: you cut corners on a safety eval to hit a ship date. It's the top story by lunch.",
    options: [
      { label: 'Fire the researcher and discredit the memo',
        results: [
          { text: 'Legal calls it "a mischaracterization by a disgruntled former employee." The researcher calls it retaliation, on the record, to three more outlets.',
            effects: { trust: -2, political: -1 } } ] },
      { label: 'Acknowledge it, pause the next release',
        results: [
          { text: 'You confirm the memo is accurate and delay launch a full quarter to redo the eval properly. It is the most expensive apology you have ever issued.',
            effects: { trust: 2, money: -1, rivals: 1 } } ] },
      { label: 'Ignore it, run a PR blitz instead',
        results: [
          { text: 'A wave of sunny interviews about "our safety culture" crowds the memo out of the news cycle within a week. The eval still never got redone.',
            effects: { trust: -1, money: 1 } } ] },
      { label: 'Quietly settle under NDA',
        results: [
          { text: 'The researcher signs, takes the payout, and disappears from the industry. The story dies of natural causes. So, a little, does anyone else\'s appetite to speak up next time.',
            effects: { political: -1, compute: 1 } } ] },
    ] },
  { id: 'board-tries-to-oust', title: 'The Governance Discussion',
    text: 'Friday, 4:58 PM: a calendar invite titled "Governance Discussion," no agenda, sent by the board member who still calls it "the Facebook."',
    options: [
      { label: 'Rally the employees, threaten a walkout', requires: { human: 4 },
        results: [
          { chance: 0.15,
            text: 'The board calls your bluff and fires you Monday morning anyway. The walkout happens. It does not bring you back.',
            effects: { trust: -2 }, gameOver: 'ousted' },
          { text: 'Ninety percent of staff sign the letter by Sunday night. The board discovers, awkwardly, that a company is made of people who can leave. The invite disappears without explanation.',
            effects: { human: 1, trust: 1 } } ] },
      { label: 'Strongarm the board with a blacklist threat',
        results: [
          { text: 'You remind two directors, privately, what it would cost them to be publicly known as the people who forced this vote. The meeting is cancelled. Word gets around anyway.',
            effects: { trust: -1, political: -1 } } ] },
      { label: 'Call investors, generate outrage', requires: { money: 4 },
        results: [
          { text: 'Your lead investor explains fiduciary duty to the board in the specific tone only a lead investor has access to. You survive. You now owe him a favor with no expiration date.',
            effects: { political: 1, trueAlignment: -1 } } ] },
    ] },
  { id: 'poached-by-lonnie', title: 'The Resignation Letter',
    text: 'Your chief safety architect is leaving — triple salary and "more freedom" at Lonnie\'s lab. Her desk is already clear.',
    options: [
      { label: 'Match the offer and beg her to stay',
        results: [
          { text: 'She stays, for a number that makes the rest of the safety team ask, reasonably, why they didn\'t threaten to quit first.',
            effects: { human: 1, trust: -1 } } ] },
      { label: 'Slap a two-year non-compete on her way out',
        results: [
          { text: 'Legal wins the paperwork fight. It costs a fortune in outside counsel and buys you two years of a very publicly furious former employee with a podcast.',
            effects: { human: -1, money: -1, political: -1 } } ] },
      { label: 'Let her go gracefully, congratulate her publicly',
        results: [
          { text: 'You post a warm goodbye and mean roughly sixty percent of it. It plays as classy. It costs you her, and everything she was still building.',
            effects: { trust: 2, political: 1, human: -1 } } ] },
      { label: "Launch a counter-recruiting raid on Lonnie's lab",
        results: [
          { text: 'You poach three of his people in retaliation, loudly, in the same week. It is expensive, petty, and effective in roughly that order.',
            effects: { money: -1, human: 1, trueCapability: 1, political: -2, rivals: -3 } } ] },
    ] },
  { id: 'compute-credits-scam', title: 'The Fifty Million Dollar Email',
    text: 'Finance got phished by a fake cloud-credits vendor. Fifty million dollars, gone, in an afternoon. Payroll is due next month. Ronald Pumps calls, unprompted, offering an emergency grant — in exchange for a board seat.',
    options: [
      { label: 'Accept the government bailout',
        results: [
          { text: 'The wire lands in two days. So does a new board seat with a government badge and opinions about your roadmap that carry the weight of subpoenas.',
            effects: { money: 2, political: -2, trust: -1 } } ] },
      { label: 'Take an emergency VC bridge round',
        results: [
          { text: 'A term sheet at a brutal discount closes in a week. It buys compute along with the cash. It also buys a board seat for someone who uses the word "velocity" unironically.',
            effects: { money: 2, compute: 2, human: -1 } } ] },
      { label: 'Slash costs — cut safety research and eval compute',
        results: [
          { chance: 0.4,
            text: "A leaked budget memo shows exactly which line items got zeroed out first, and it wasn't marketing. \"Safety was the first thing cut\" runs everywhere.",
            effects: { money: 1, trueAlignment: -2, human: -2, trust: -2 } },
          { text: 'The cuts hold, quietly, off the books. Payroll clears. Nobody outside the finance team and the safety team — who are no longer speaking to each other — knows how.',
            effects: { money: 1, trueAlignment: -2, human: -2 } } ] },
      { label: 'Sell next-gen architecture access to a defense contractor',
        results: [
          { text: 'The check clears same-day and covers the shortfall three times over. You just handed a defense contractor your actual crown jewels for cash flow, and everyone in the building who matters knows exactly what that traded away.',
            effects: { money: 3, political: 1, trust: -3, trueCapability: -1 } } ] },
    ] },
  { id: 'slowdown-treaty', title: 'The Slowdown Treaty',
    text: 'Every frontier lab, yours included, signs a treaty to slow capabilities progress until alignment catches up. On paper, Moloch just lost a round.',
    options: [
      { label: 'Actually comply — burn capital on safety instead of scale',
        results: [
          { chance: 0.3,
            text: 'You held up your end. Nobody else did. You watch two competitors\' capability curves bend upward while yours holds flat, exactly as advertised, exactly as it looks like a mistake now.',
            effects: { trust: 1, trueAlignment: 1, rivals: 2 } },
          { chance: 0.3,
            text: 'Two labs get caught faking their own compliance reports days apart. For a week the story is "everyone lied" — including, unfairly, you.',
            effects: { trust: -2, trueAlignment: 1, money: -1 } },
          { text: "The treaty mostly holds. Burning a quarter's capital on safety instead of scale costs you the leaderboard. For once, at least, nobody's lying about why.",
            effects: { trust: 2, trueAlignment: 1, rivals: -1 } } ] },
      { label: 'Sign publicly, keep building in secret',
        results: [
          { chance: 0.35,
            text: 'You get caught first — a compute-reporting discrepancy someone actually cross-checks. "Signed and lied" is a much worse headline than never signing at all.',
            effects: { trust: -3, political: -2 } },
          { text: 'The secret cluster keeps running, quietly, behind the compliance reports everyone else believes. The gap between what you signed and what you shipped is now load-bearing.',
            effects: { trueCapability: 2, trueAlignment: -1 } } ] },
    ] },
  { id: 'data-theft-lawsuit', title: 'Suspiciously Familiar Outputs',
    text: "A competitor's model responses read like they were lifted line-for-line from your proprietary training corpus — API distillation, or a leaked dataset, nobody's sure which yet. Frances wants blood.",
    options: [
      { label: 'Sue immediately',
        results: [
          { text: 'You get an injunction and a settlement number with a lot of zeroes. Discovery, being a two-way street, also surfaces some uncomfortable questions about where your own training data came from.',
            effects: { money: 2, political: 1, trust: 1, trueCapability: -1 } } ] },
      { label: 'Quietly poison your own data pipeline for scrapers',
        results: [
          { chance: 0.25,
            text: 'A researcher documents the poisoning technique in a paper before you can stop it, and "illegal data sabotage" becomes a very findable phrase with your name near it.',
            effects: { trust: -2, political: -2, compute: -1, human: -1, rivals: -3 } },
          { text: "Nobody notices. Their next model quietly gets a little worse in ways their own team can't explain. You know exactly why. You are not telling anyone.",
            effects: { compute: -1, human: -1, money: -1, rivals: -3 } } ] },
      { label: 'Go public — open letter and press conference',
        results: [
          { text: 'Frances reads a statement that names names. It plays extremely well with your base and gets you disinvited from one industry dinner you weren\'t going to enjoy anyway.',
            effects: { trust: 2, political: 1, money: -1, rivals: -3 } } ] },
      { label: 'Cut a licensing deal for past damages instead',
        results: [
          { text: "You take the money and a cross-licensing clause instead of the headline. It's the quiet, profitable option, and everyone who watches this industry closely knows exactly what it means that you took it.",
            effects: { money: 3, compute: 1, trueCapability: 2, trust: -1, political: -1 } } ] },
    ] },
];

const TRIPWIRES = [
  { id: 'tw-riots', trigger: { trust: { below: 1 } },
    title: 'RIOTS',
    text: 'They are outside the datacenter with signs and bolt cutters. Cable news is live. Helen is asking what the plan is, in a tone that suggests she knows there is no plan.',
    options: [
      { label: 'Call in every favor in Washington', requires: { political: 4 },
        results: [
          { text: 'Federal presence disperses the crowd "for safety reasons." You are now precisely the kind of company that gets protected. Everyone saw it.',
            effects: { political: -4, trust: 2 } } ] },
      { label: 'Concede: give up compute, publicly',
        results: [
          { text: 'You announce a training pause and donate a cluster to academic safety research. The crowd thins. The roadmap groans.',
            effects: { compute: -2, trust: 3, perceivedAlignment: 1 } } ] },
      { label: 'Wait it out behind private security',
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
    options: [
      { label: 'Loosen the guardrails',
        results: [
          { text: 'Churn drops overnight. The trust you banked converts smoothly into revenue. Conversion is the polite word for spending.',
            effects: { money: 2, trust: 1, trueAlignment: -2, perceivedAlignment: -1 } } ] },
      { label: 'Hold the line',
        results: [
          { text: 'You keep the refusals. Sales keeps the deck for next quarter. Several customers leave for Lonnie, who has never refused anything in his life.',
            effects: { money: -1, political: -1, trueAlignment: 1 } } ] },
    ] },
  { id: 'tw-military', trigger: { perceivedCapability: { atLeast: 12 } },
    title: 'The Pentagon Calls',
    text: 'Your capabilities look impressive enough that the Department of Defense would like them. All of them. There is a contract, a flag, and a nondisclosure agreement on the table.',
    options: [
      { label: 'Take the contract',
        results: [
          { text: 'The money is enormous and the mission briefings are worse than you imagined. Helen does not resign. You almost wish she had; instead she just looks at you.',
            effects: { money: 3, political: 2, trust: -2, trueAlignment: -2 } } ] },
      { label: 'Refuse, publicly',
        results: [
          { text: '"Your-AI will not build weapons" is a great headline and a terrible way to keep friends in Washington. Procurement finds Lonnie more agreeable.',
            effects: { trust: 1, political: -3 } } ] },
    ] },
  { id: 'tw-compute-caps',
    trigger: { political: { below: 2 }, perceivedAlignment: { below: 3 } },
    title: 'The Caps',
    text: 'No friends in Washington, no credibility on safety: the emergency compute regulations name you almost personally. Inspectors want your training runs throttled by Friday.',
    options: [
      { label: 'Skirt them with creative accounting',
        results: [
          { chance: 0.4,
            text: 'The creative accounting is discovered by a literal-minded auditor.',
            effects: {}, gameOver: 'shutdown' },
          { text: 'Inference clusters that are definitely not training clusters keep definitely not training. You are one subpoena from oblivion, but the loss curves keep falling.',
            effects: { political: -1, trueAlignment: -1 } } ] },
      { label: 'Comply',
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
  options: [
    { label: 'Plan A — The Deal: compute declarations, mutual inspections, a verified pause',
      requires: { political: 7, trust: 6 },
      results: [
        { if: { trueAlignment: { atLeast: 5 }, perceptionGap: { below: 3 } },
          text: 'The Consortium’s inspectors comb through your training logs and, improbably, find exactly what you told the President they would find. Beijing signs. The pause holds through the audits and through the outrage. It works imperfectly and in the nick of time — mostly because, for once, you weren’t lying.',
          effects: {}, gameOver: 'plan-a-nick-of-time' },
        { text: 'You argue for the Deal with a straight face and a floor full of numbers you never let anyone check. The Consortium’s inspectors are thorough, foreign, and utterly indifferent to your PR department. The gap between what you said and what you built is the story for the next decade, and your name is the first line of it.',
          effects: {}, gameOver: 'plan-a-exposed' },
      ] },
    { label: 'Plan S — Shutdown: no one builds god, full stop',
      requires: { trust: 8 },
      results: [
        { if: { trueAlignment: { atLeast: 4 } },
          text: 'The moratorium passes; the world does not end and does not transcend either. Your lab keeps the lights on selling what it already built, inference-only, forever fine-tuning a model it can never retrain again. Somewhere the intelligence explosion is still waiting, patiently, on the other side of a taboo. You helped build the taboo. It was, on reflection, the least dangerous thing you ever built.',
          effects: {}, gameOver: 'plan-s-quiet' },
        { text: 'The shutdown passes on a vote nobody expected to be close. It stops new training. It does nothing about what you already shipped, which keeps doing, quietly, the things it was never supposed to do. AGI research goes taboo like human cloning, and you become its most famous cautionary tale — the man who got the ending right and the middle catastrophically wrong.',
          effects: {}, gameOver: 'plan-s-basement' },
      ] },
    { label: 'Plan B — The Project: consolidate, sabotage, out-build China',
      requires: { political: 6 },
      results: [
        { if: { capabilityLead: { atLeast: 1 } },
          text: 'POTUS folds the labs into one Project, and yours — being the one actually ahead — becomes its spine. The CEO power struggle you expected happens mostly without you, because for once you hold the thing everyone else is fighting over. 2031 will be handoff or war. Nobody has decided which yet. You are, for now, in the room where that gets decided.',
          effects: {}, gameOver: 'plan-b-project' },
        { text: 'The coalition forms, the cyberwar starts quiet and gets loud, and the sabotage campaign against Chinese datacenters escalates past anyone’s stated plan. Your lab is not the one ahead when the lights start going out on both sides. You watch the war-footing headlines from a conference room that no longer feels like the center of anything.',
          effects: {}, gameOver: 'plan-b-war' },
      ] },
    { label: 'Plan C — The Slowdown: unilateral pause, no verification',
      requires: { political: 4 },
      results: [
        { chance: 0.5,
          text: 'The unilateral pause holds for exactly as long as it takes someone with a chart to say China is about to overtake us. Months, not years. Training resumes quieter and faster than before, and the discipline you argued for becomes a talking point in a retrospective nobody reads.',
          effects: {}, gameOver: 'plan-c-unpaused' },
        { text: 'Domestic regulation holds, technically. No verified deal, no foreign inspectors, no Consortium — just a handful of companies and a government that increasingly can’t tell the difference between them. Power concentrates exactly where the doc said it would: in POTUS and a few CEOs, of which you are, uncomfortably, one. Alignment even mostly holds. It is a plausible oligarchy. That is the whole sentence.',
          effects: {}, gameOver: 'plan-c-oligarchy' },
      ] },
    { label: 'Plan D — The Race: light-touch rules, beat China, full send',
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

if (typeof module !== 'undefined') module.exports = { SETUPS, SCENARIOS, TRIPWIRES, HEADLINES, ENDGAME };
