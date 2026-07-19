// portraits.js — character portrait registry + card→character mapping.
// Drop art in portraits/ as 64x64 transparent PNGs named by character id.
// A missing image file makes the slot hide itself (see index.html render) — safe to add art one at a time.
//
// NOTE: fill in / verify CARD_PORTRAITS after the evidence-consolidation pass settles final card ids.

const CHARACTERS = {
  mario:          { name: 'Mario',        role: 'CEO, Misanthropic',        img: 'portraits/mario.png' },          // player / CEO
  pam:            { name: 'Pam',          role: 'Leader of ClosedAI',  img: 'portraits/pam.png' },            // OpenAI-alike
  lonnie:         { name: 'Lonnie',       role: 'Leader of C_AI',      img: 'portraits/lonnie.png' },         // X-AI-alike
  helen:          { name: 'Helen',        role: 'Head of Safety',      img: 'portraits/helen.png' },          // head of safety
  frances:        { name: 'Frances',      role: 'Chief Science Officer', img: 'portraits/frances.png' },      // CSO
  'ronald-pumps': { name: 'Ronald Pumps', role: 'AI Czar',             img: 'portraits/ronald-pumps.png' },   // gov AI office
};

// card id -> character id. Finalized against scenarios.js card ids (evidence-consolidation
// pass is settled). Unmapped cards show no portrait — that's fine, most flavor/tripwire
// cards don't hinge on a named character.
const CARD_PORTRAITS = {
  // Pam — merger/rival-lab cards
  'pam-merger-offer':      'pam',
  // Lonnie — poaching / rival-spotlight cards
  'poached-by-lonnie':     'lonnie',
  'superbowl-jab':         'lonnie',
  // Ronald Pumps — government / nationalization / compute-cap cards
  'nationalize-pressure':  'ronald-pumps',
  'compute-credits-scam':  'ronald-pumps',
  'un-treaty-vote':        'ronald-pumps',
  'compute-cap-allocation':'ronald-pumps',
  'tw-compute-caps':       'ronald-pumps',
  'endgame':               'ronald-pumps',
  // Helen — safety / eval / whistleblower / deceptive-model cards
  'recursive-threshold':   'helen',
  'eval-fraud-exposed':    'helen',
  'whistleblower-memo':    'helen',
  'claudia-sandbagging':   'helen',
  'bioweapon-pathway':     'helen',
  'tw-riots':              'helen',
  'tw-guardrails':         'helen',
  // Frances — espionage / security / breach cards
  'chinese-agi-surprise':  'frances',
  'data-theft-lawsuit':    'frances',
  'neurosecurity-lawsuit': 'frances',
  'industrialize':         'frances',
  'board-tries-to-oust':   'frances',
  // Mario — founder / funding / PR cards
  'podcast-tour':          'mario',
  'funding-2026':          'mario',
  'funding-2027':          'mario',
  'funding-2028':          'mario',
  'funding-2029':          'mario',
};

// Resolve the portrait (character record) for a card, or null. Used by the UI.
function portraitForCard(card) {
  if (!card) return null;
  const id = (card.portrait) || CARD_PORTRAITS[card.id];   // card.portrait field wins if present
  return id ? (CHARACTERS[id] || null) : null;
}

if (typeof module !== 'undefined') module.exports = { CHARACTERS, CARD_PORTRAITS, portraitForCard };
