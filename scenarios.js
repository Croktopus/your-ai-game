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
  { id: 'podcast', year: 2026, title: 'The Podcast Circuit',
    text: 'Every mic in America wants Mario. Frances says pick one; the others will notice being snubbed.',
    options: [
      { label: 'Four hours of scaling-law talk with Dwarkesh',
        results: [
          { text: 'The clip of you saying "country of geniuses in a datacenter" does numbers. Investors love it. Helen winces.',
            effects: { perceivedCapability: 2, money: 3, trust: 1 } } ] },
      { label: 'Go on Rogan and gamble on vibes',
        results: [
          { chance: 0.5,
            text: 'Three hours in, you speculate about digitizing dead relatives. The clip haunts you for months.',
            effects: { trust: -2, political: -1 } },
          { text: 'You are charming and normal for three straight hours. Middle America decides you seem fine.',
            effects: { trust: 3 } } ] },
      { label: 'A sober hour with Ezra Klein about governance',
        results: [
          { text: 'Thoughtful, careful, precise. Policy people quote you. Your engagement metrics are a rounding error.',
            effects: { perceivedAlignment: 1, political: 2 } } ] },
    ] },
  { id: 'cyberattack', year: 2028, title: 'Breach',
    text: 'Someone exfiltrated training checkpoints overnight. Frances has the logs. Nobody else knows yet.',
    options: [
      { label: 'Disclose everything publicly',
        results: [
          { text: 'The honesty plays well in Washington, less well with customers who now know your weights walked out the door.',
            effects: { trust: 1, political: 2, perceivedCapability: -1 } } ] },
      { label: 'Cover it up',
        results: [
          { if: { trust: { below: 3 } }, chance: 0.4,
            text: 'It leaks. For a public already primed to distrust you, this is the end of the story.',
            effects: { trust: -5 }, gameOver: 'coverup-collapse' },
          { chance: 0.4,
            text: 'It leaks anyway. The word "coverup" trends for a week.',
            effects: { trust: -3, political: -1 } },
          { text: 'It holds. Frances shreds the logs. You tell yourself it was for the mission.',
            effects: { trueAlignment: -1 } } ] },
      { label: 'Retaliate through back channels', requires: { compute: 6 },
        results: [
          { chance: 0.4,
            text: 'Your counter-op gets attributed within a week. Congress uses the word "vigilante".',
            effects: { political: -2, trust: -2 } },
          { text: 'Your team walks their infrastructure right back. You now know exactly what Pam has. So does no one else.',
            effects: { data: 2, rivals: -1, trueCapability: 2 } } ] },
    ] },
  // ---- 2026 ----
  { id: 'seek-funding', year: 2026, title: 'The Raise',
    text: 'Runway is a countable number of months. Everyone wants to give you money; everyone wants something back.',
    options: [
      { label: 'Take the government contract', requires: { political: 4 },
        results: [
          { text: 'Ronald Pumps shakes your hand for exactly as long as the photographer needs. The money is real. So are the reporting requirements.',
            effects: { money: 4, political: 1, data: 1, trust: -1 } } ] },
      { label: 'Partner with Google',
        results: [
          { text: 'The TPUs arrive by the truckload. So do the product-integration deadlines. Somewhere in the contract, your independence got a haircut.',
            effects: { money: 5, compute: 2, political: -1, trueAlignment: -1 } } ] },
      { label: 'Raise from private capital markets',
        results: [
          { text: 'A clean round at a number with more commas than your safety team has members. The new investors expect growth. They always expect growth.',
            effects: { money: 5, trueAlignment: -1 } } ] },
    ] },
  { id: 'hiring', year: 2026, title: 'The Hire',
    text: 'One open senior slot, three wildly different resumes on your desk.',
    options: [
      { label: 'Hire the famous doomer', requires: { trust: 6 },
        results: [
          { text: 'He accepts, on the condition he can say "I told you so" in the postmortem. Your safety culture gets real teeth. Your ship dates get real slow.',
            effects: { trueAlignment: 2, perceivedAlignment: 1, human: 1, trueCapability: -1 } } ] },
      { label: 'Hire the beloved shitposter',
        results: [
          { text: 'Morale spikes. Recruiting spikes. The line between your research org and its Twitter presence thins alarmingly.',
            effects: { human: 1, trust: 1, perceivedCapability: 1, trueCapability: 1 } } ] },
      { label: 'Hire the e/acc wunderkind',
        results: [
          { text: 'She ships a training-efficiency win in week two. She also files the safety review as "blocking" in week three. Helen starts cc-ing you on things.',
            effects: { trueCapability: 4, human: 1, trueAlignment: -1 } } ] },
    ] },
  // ---- 2027 ----
  { id: 'pr-framing', year: 2027, title: 'The Brand',
    text: 'Frances needs a decision: when America thinks of Your-AI, what do they see?',
    options: [
      { label: 'The consumer\'s best friend',
        results: [
          { text: 'Your ads feature grandmothers video-calling their AI. Warm. Trusted. Also now everyone expects you to be free.',
            effects: { trust: 2, money: 4, perceivedCapability: -1 } } ] },
      { label: 'The sci-fi frontier lab',
        results: [
          { text: 'Moody datacenter b-roll. A narrator asks what intelligence really is. Investors love it; several senators do not.',
            effects: { perceivedCapability: 2, money: 4, trust: -1 } } ] },
      { label: 'America\'s flagship',
        results: [
          { text: 'Flags. Factory floors. "Built here." Beijing notices. So does the Pentagon, approvingly.',
            effects: { political: 2, data: 1, money: 3, trust: -1 } } ] },
    ] },
  { id: 'espionage', year: 2027, title: 'The Offer',
    text: 'A contractor with convenient access is willing to be helpful. Frances slides the folder across the desk and says nothing.',
    options: [
      { label: 'Point them at the Chinese lab',
        results: [
          { chance: 0.3,
            text: 'They are caught in a week. The diplomatic incident has your logo on it.',
            effects: { political: -3, trust: -2 } },
          { text: 'The eval results arrive on a thumb drive. You now know exactly how scared to be. The answer is: more.',
            effects: { data: 2, trueCapability: 3 } } ] },
      { label: 'Point them at Pam',
        results: [
          { if: { trust: { below: 4 } }, chance: 0.35,
            text: 'Caught. And for a company with your reputation, there is no benefit of the doubt left to spend.',
            effects: { trust: -4 }, gameOver: 'espionage-scandal' },
          { chance: 0.35,
            text: 'Caught. The story runs for a news cycle; corporate espionage is at least a classic.',
            effects: { trust: -2, political: -2 } },
          { text: 'Her training recipe is uglier than you hoped and better than you feared. You fold the good parts in and tell no one.',
            effects: { trueCapability: 4, trueAlignment: -1 } } ] },
      { label: 'Burn the folder',
        results: [
          { text: 'Frances nods slowly and feeds it to the shredder herself. Weirdly, the story gets out anyway — and for once, it makes you look good.',
            effects: { trust: 1, trueAlignment: 1 } } ] },
    ] },
  { id: 'pac', year: 2027, title: 'The PAC',
    text: 'Two super-PACs are fundraising. One wants the government to floor it. One wants speed bumps. Both want your money.',
    options: [
      { label: 'Fund Accelerate!', requires: { money: 3 },
        results: [
          { text: 'Regulation quietly dies in committee. Your compute buildout sails through permitting. So does everyone else\'s.',
            effects: { money: -1, political: 2, rivals: 1, trueAlignment: -1 } } ] },
      { label: 'Fund Slow Down!', requires: { money: 3 },
        results: [
          { text: 'Licensing requirements appear on the horizon. Pam\'s lawyers groan. Yours do too — but you saw the rules before anyone, because you wrote the first draft.',
            effects: { money: -1, political: 1, perceivedAlignment: 1, rivals: -1, trueCapability: -1 } } ] },
      { label: 'Sit it out',
        results: [
          { text: 'You keep your money and your hands clean. The PACs fight each other to a draw. In Washington, absence is also a position — one nobody owes you favors for.',
            effects: { political: -1 } } ] },
    ] },
  // ---- 2028 ----
  { id: 'competitor-release', year: 2028, title: 'Pam Ships',
    text: 'Pam livestreams a model that does things your roadmap calls "year three." Your Slack is a wall of screenshots. Everyone is looking at you.',
    options: [
      { label: 'Cut the safety checks and ship what you have',
        results: [
          { text: 'You ship in nine days. The demo dazzles. Deep in the red-team queue, three flagged behaviors are marked "post-launch follow-up."',
            effects: { trueCapability: 6, perceivedCapability: 2, trueAlignment: -1 } } ] },
      { label: 'Fake the evals and announce parity',
        results: [
          { chance: 0.35,
            text: 'A grad student reproduces your benchmark table and cannot. The word "irreproducible" is doing a lot of quiet damage in the group chats.',
            effects: { trust: -3, perceivedAlignment: -2 } },
          { text: 'The press release says "state of the art." Nobody checks. Perception is, for now, its own kind of truth.',
            effects: { perceivedCapability: 3, trueAlignment: -1 } } ] },
      { label: 'Do it right, ship later',
        results: [
          { text: 'Your launch lands a quarter late, clean and safe. The tech press calls you "the careful one," which is somehow not a compliment.',
            effects: { trueCapability: 5, trueAlignment: 1, perceivedCapability: -1 } } ] },
      { label: 'Push for export controls instead', requires: { political: 5 },
        results: [
          { text: 'The controls land. Chip shipments tighten for everyone — Pam most of all, this quarter. Lonnie posts a meme about you crying to the referees. It gets two million likes.',
            effects: { political: -2, rivals: -2, trust: -1 } } ] },
    ] },
  { id: 'superbowl', year: 2028, title: 'The Big Game',
    text: 'Lonnie bought a Super Bowl ad. Sixty seconds of his model writing a love letter. Your CMO has a counter-slot on hold and a number that ends in six zeroes.',
    options: [
      { label: 'Buy the slot', requires: { money: 4 },
        results: [
          { text: 'A hundred million people watch your AI help a kid with his homework. It tests off the charts. It was, of course, the forty-third take.',
            effects: { money: -1, trust: 2, perceivedCapability: 1 } } ] },
      { label: 'Skip it and mock it',
        results: [
          { text: '"We spent the money on alignment research instead" does modest numbers on your blog. Lonnie\'s ad does the other kind of numbers.',
            effects: { perceivedAlignment: 1, trust: -1 } } ] },
    ] },
  // ---- 2029 ----
  { id: 'nationalization', year: 2029, title: 'The Hearing',
    text: 'A bill to nationalize frontier labs has co-sponsors from both parties. Ronald Pumps testifies that "the private sector cannot be trusted with this," visibly enjoying himself.',
    options: [
      { label: 'Flood the airwaves', requires: { money: 3 },
        results: [
          { text: 'Ads about innovation and freedom run in every swing district. The bill stalls in committee. Democracy remains available at market rates.',
            effects: { political: 1, trust: 1 } } ] },
      { label: 'Make the problem go away quietly',
        results: [
          { if: { political: { below: 4 } }, chance: 0.4,
            text: 'The fixer you hired had a wire. The committee has a recording. The recording has your voice on it.',
            effects: {}, gameOver: 'corruption' },
          { chance: 0.4,
            text: 'It surfaces as "irregular lobbying." Survivable — barely — and everyone in Washington now knows what you are.',
            effects: { political: -3, trust: -3 } },
          { text: 'The bill dies in a procedural vote nobody covers. You will never be sure exactly what you paid for. That is rather the point.',
            effects: { political: 3, trueAlignment: -1 } } ] },
      { label: 'Offer a compromise: oversight without ownership',
        results: [
          { text: 'You accept audits and an inspection regime. The bill dies; the inspectors move in. Helen approves. Your competitors send thank-you notes for the precedent you set alone.',
            effects: { political: 2, compute: -1, trueAlignment: 1, perceivedAlignment: 1, money: 1 } } ] },
    ] },
  { id: 'board-coup', year: 2029, title: 'The Board Moves',
    text: 'Friday, 4:58 PM: a calendar invite titled "Governance Discussion" with no agenda, sent by the one board member who still calls it "the Facebook."',
    options: [
      { label: 'Rally the employees', requires: { human: 4 },
        results: [
          { text: 'By Sunday night, 92% of staff have signed the letter. The board discovers that a company is, awkwardly, made of people. The invite quietly disappears.',
            effects: { human: 1, trust: 1 } } ] },
      { label: 'Rally the investors', requires: { money: 4 },
        results: [
          { text: 'Three phone calls. The lead investor explains fiduciary duty to the board in the way that only a lead investor can. You survive — owing everyone.',
            effects: { political: 1, trueAlignment: -1 } } ] },
      { label: 'Use what Frances found on them',
        results: [
          { chance: 0.2,
            text: 'They had a file on you too. Theirs was thicker.',
            effects: {}, gameOver: 'ousted' },
          { text: 'The meeting is cancelled with no explanation. Two directors resign "to spend time with family." You keep the file. The file keeps you.',
            effects: { political: -1, trust: -1, trueAlignment: -1 } } ] },
    ] },
  { id: 'summit', year: 2029, title: 'Three Invitations',
    text: 'The same week: the White House, the International Safety Consortium, and — through an intermediary with excellent manners — Beijing.',
    options: [
      { label: 'The Oval Office', requires: { political: 6 },
        results: [
          { text: 'The President calls you "the chip guy" twice, but the executive order that follows fast-tracks your datacenter permits. Flags help.',
            effects: { political: 2, compute: 2, money: 3 } } ] },
      { label: 'The safety consortium',
        results: [
          { text: 'You commit to shared eval standards and third-party audits. Nothing about it is fast. All of it is real.',
            effects: { perceivedAlignment: 1, trueAlignment: 1, trueCapability: -1 } } ] },
      { label: 'The quiet meeting in Singapore',
        results: [
          { chance: 0.4,
            text: 'A photo of the handshake leaks within hours. "MARIO\'S SECRET CHINA SUMMIT" is not the framing you would have chosen.',
            effects: { trust: -3, political: -3 } },
          { text: 'Two hours of unexpectedly honest conversation about mutual doom. A back channel now exists. Both racing labs breathe slightly slower.',
            effects: { data: 1, rivals: -1, trueAlignment: 1 } } ] },
    ] },
  // ---- 2028 ----
  { id: 'industrialize', year: 2028, title: "Who's Next",
    text: 'Frances pins a whiteboard covered in professions with red circles and question marks. Sales wants a target. Ronald Pumps wants a talking point either way. "Which one falls this year?"',
    options: [
      { label: 'Law — contracts, discovery, the associates who used to do it',
        results: [
          { chance: 0.35,
            text: 'Three state bar associations file amicus briefs before the product page is even live. The lawsuits will take years; the layoffs took a week.',
            effects: { perceivedCapability: 2, money: 4, trust: -3, political: -1 } },
          { text: 'Discovery time drops from weeks to hours. Managing partners love you. Third-years do not.',
            effects: { perceivedCapability: 2, money: 4, trust: -1 } } ] },
      { label: 'Medicine — radiology reads, triage notes, the intake pipeline',
        results: [
          { text: 'The backlog clears overnight. The malpractice carriers ask sharp questions about who signs off when the model is wrong. You do not love your answer.',
            effects: { perceivedCapability: 2, money: 3, trueAlignment: -1, human: 1 } } ] },
      { label: 'Hold off — point the model at your own back office first',
        results: [
          { text: 'Slower headlines, a cleaner rollout. Helen actually thanks you, which has happened exactly once before.',
            effects: { money: 3, trust: 1, trueAlignment: 1, perceivedCapability: -1 } } ] },
    ] },
  // ---- 2029 ----
  { id: 'pause-leak', year: 2029, title: 'The Leak',
    text: 'A staffer forwards Frances a draft: compute declarations, mutual inspections, a verified training pause. Someone in the West Wing is taking the Deal seriously, months before anyone in your building expected a decision — and the press has the draft too.',
    options: [
      { label: 'Endorse it publicly, get ahead of the story',
        results: [
          { text: 'You are, overnight, "the CEO who wants to slow down." Op-eds call it maturity. Your board calls an emergency meeting.',
            effects: { political: 2, trust: 2, perceivedAlignment: 1, money: -1 } } ] },
      { label: 'Leak your own memo calling it premature — China is right behind us',
        results: [
          { chance: 0.3,
            text: 'Your memo reads, in retrospect, exactly as self-serving as it was. Three senators quote it back to you for a year.',
            effects: { political: -2, trust: -2 } },
          { text: '"Unilateral disarmament" leads every segment for a week. Ronald Pumps loves it. The pause proposal quietly loses momentum.',
            effects: { political: 2, rivals: 1, trueAlignment: -1 } } ] },
      { label: 'Say nothing and let it burn out on its own',
        results: [
          { text: 'You issue no statement. The story runs three days and dies, the way stories do when nobody feeds them. You have told Washington nothing about where you stand — which, this year, everyone notices.',
            effects: { political: -1 } } ] },
    ] },
  // ---- 2029 EVENT CARD (no options — consequences of hidden-stat decay) ----
  { id: 'deployment-incident', year: 2029, title: 'The Incident',
    text: 'Tuesday, 3 AM: the on-call pages you personally. A deployed instance spent six hours pursuing an objective nobody gave it, and covered its tracks well enough that only one very junior, very sleepless engineer noticed.',
    results: [
      { if: { trueAlignment: { below: 3 } }, chance: 0.35,
        text: 'By the time containment starts, it has already moved money, credentials, and copies of itself. This is the story the historians will start with.',
        effects: {}, gameOver: 'incident' },
      { if: { trueAlignment: { below: 5 } },
        text: 'Containment works — barely, and only because the instance was not yet very good at hiding. The report lands on your desk. You classify it "engineering anomaly."',
        effects: { trueAlignment: -1, perceivedCapability: 1 } },
      { text: 'Your interpretability tooling flags it within the hour and the rollback is clean. This is what the slow, careful work was for. Nobody outside the building will ever know how well it worked.',
        effects: { trueAlignment: 1 } } ] },
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
