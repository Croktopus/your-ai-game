// scenarios.js — ALL game content lives here. See SCENARIO_GUIDE.md for how to write a card.
// Stat keys: money compute trust political human data (visible, 0-10)
//            perceivedAlignment trueAlignment (0-10) perceivedCapability trueCapability (0-20)
// Rivals: effects key `rivals: -1` slows BOTH rival labs by 1 (or speeds them up if positive).

const SETUPS = [
  { id: 'mission', name: 'Capped-Profit Mission Lab',
    blurb: 'Beloved, broke, and actually trying. The board answers to the mission — for now.',
    stats: { money: 4, compute: 4, trust: 8, political: 6, human: 7, data: 4,
             perceivedAlignment: 8, trueAlignment: 8, perceivedCapability: 4, trueCapability: 4 } },
  { id: 'venture', name: 'Venture Rocketship',
    blurb: 'Term sheets rain from the sky. The safety team reports to the growth team.',
    stats: { money: 9, compute: 8, trust: 5, political: 4, human: 6, data: 5,
             perceivedAlignment: 5, trueAlignment: 3, perceivedCapability: 6, trueCapability: 6 } },
  { id: 'bigtech', name: 'Big-Tech Partnership',
    blurb: 'Infinite data, deep pockets, and a parent company with opinions about everything.',
    stats: { money: 8, compute: 7, trust: 5, political: 2, human: 5, data: 8,
             perceivedAlignment: 5, trueAlignment: 5, perceivedCapability: 5, trueCapability: 5 } },
];

// ---- SCENARIO TEMPLATE — copy this object, fill it in, add it to SCENARIOS ----
// {
//   id: 'unique-kebab-id',
//   era: 1,                          // 1=early 2026, 2=late 2026, 3=early 2027, 4=late 2027
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
// { id: 'x', era: 3, title: '...', text: '...', results: [ ...same as above... ] }
// Single-option scenarios are also legal (forced choices).
// -------------------------------------------------------------------------------

const SCENARIOS = [
  { id: 'podcast', era: 1, title: 'The Podcast Circuit',
    text: 'Every mic in America wants Mario. Frances says pick one; the others will notice being snubbed.',
    options: [
      { label: 'Four hours of scaling-law talk with Dwarkesh',
        results: [
          { text: 'The clip of you saying "country of geniuses in a datacenter" does numbers. Investors love it. Helen winces.',
            effects: { perceivedCapability: 2, money: 1, trust: 1 } } ] },
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
  { id: 'cyberattack', era: 3, title: 'Breach',
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
            effects: { data: 2, rivals: -1 } } ] },
    ] },
];

const TRIPWIRES = [];   // filled in Task 7
const HEADLINES = [];   // filled in Task 7

if (typeof module !== 'undefined') module.exports = { SETUPS, SCENARIOS, TRIPWIRES, HEADLINES };
