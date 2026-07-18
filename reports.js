// reports.js — yearly report-card interstitials. Data drawn from the world bible's
// year-by-year tables (docs/world/ai-2040-worldbible.md). Shown after Q4 of 2026/2027/2028
// (turns 4/8/12), BEFORE the next beginTurn. Does not consume a turn.
// events(state) must always return a non-empty array of strings, and at least one
// line must vary with game state (rival pace, player's public alignment reputation, etc).

const REPORTS = [
  {
    year: 2026, afterTurn: 4,
    stats: [
      { label: 'Employment', value: '63%' },
      { label: 'Median income', value: '$46K' },
      { label: 'Alignment researchers', value: '~1.0K' },
      { label: 'Total slowdown', value: '0 mo' },
      { label: 'Human labor force', value: '3.5B' },
      { label: 'Reliable AI agents', value: '~10M @ up to ×90 speed' },
    ],
    events: (state) => {
      const lines = [
        'AI industry capex clears $0.8T this year; software engineering is already unrecognizable.',
        'Frontier labs now spend roughly half their compute budgets on AI R&D itself — the ladder-pulling has begun.',
      ];
      lines.push(rivalLine(state, 4));
      lines.push(alignmentLine(state));
      return lines;
    },
  },
  {
    year: 2027, afterTurn: 8,
    stats: [
      { label: 'Employment', value: '62%' },
      { label: 'Median income', value: '$47K' },
      { label: 'Alignment researchers', value: '1.2K' },
      { label: 'Total slowdown', value: '0 mo' },
      { label: 'Human labor force', value: '3.5B' },
      { label: 'Reliable AI agents', value: '28M @ up to ×114 speed' },
    ],
    events: (state) => {
      const lines = [
        'The AI Transparency Act of 2027 passes Congress — omnibus, mixed quality, doesn’t touch the fundamentals.',
        'Congress reruns the 2016 emails about stopping any one founder from becoming a dictator. Nobody has a good answer for who controls this.',
      ];
      lines.push(rivalLine(state, 8));
      lines.push(alignmentLine(state));
      return lines;
    },
  },
  {
    year: 2028, afterTurn: 12,
    stats: [
      { label: 'Employment', value: '62%' },
      { label: 'Median income', value: '$49K' },
      { label: 'Alignment researchers', value: '1.4K' },
      { label: 'Total slowdown', value: '0 mo' },
      { label: 'Human labor force', value: '3.5B' },
      { label: 'Reliable AI agents', value: '23M @ up to ×131 speed' },
    ],
    events: (state) => {
      const lines = [
        'Datacenters under construction this year cost twice the entire US military budget.',
        'Both presidential candidates now campaign on AI plans; the national debate has narrowed to five of them.',
      ];
      lines.push(rivalLine(state, 12));
      lines.push(alignmentLine(state));
      return lines;
    },
  },
];

// Rival pace relative to the expected growth curve (rivals start ~pam 4 / lonnie 3,
// climb ~1.1/turn on average) — bends the line around the player's own choices
// (export controls, sabotage, the PAC fight) without hardcoding absolute thresholds
// that would drift out of sync with future balance retunes.
function rivalLine(state, afterTurn) {
  const rivalMax = Math.max(...Object.values(state.rivals));
  const expected = 3.5 + afterTurn * 1.1;
  if (rivalMax > expected + 2)
    return 'Pam’s lab demos quarter after quarter, benchmark charts going vertical.';
  if (rivalMax < expected - 2)
    return 'the frontier looks strangely quiet this year — for once, nobody’s demoing anything.';
  return 'Pam and Lonnie both ship on schedule; the race holds its pace.';
}

function alignmentLine(state) {
  const pa = state.stats.perceivedAlignment;
  if (pa <= 3) return 'Op-eds ask, pointedly, what Your-AI’s safety team actually does all day.';
  if (pa >= 8) return 'Analysts cite Your-AI as the industry’s safety benchmark — a compliment that costs nothing and means less.';
  return 'Your-AI’s alignment reputation draws no particular comment this year.';
}

if (typeof module !== 'undefined') module.exports = { REPORTS };
