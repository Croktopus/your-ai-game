// endings.js — every ending id referenced by judgeEnding() or any gameOver: field.
const ENDINGS = {
  // --- deaths (mid-run) ---
  bankrupt: { kind: 'death', title: 'Out of Runway',
    text: 'The last all-hands is held over a Zoom link nobody springs for the premium tier of. Pam acquires your team on Thursday, your name on Friday. The race continues without you.' },
  riots: { kind: 'death', title: 'The Crowd Outside',
    text: 'They came for the datacenter first. Then the office. Helen resigns live on television. Your-AI ends not with a whimper but with a congressional subpoena.' },
  ousted: { kind: 'death', title: 'Thanks, Board',
    text: 'The blackmail file was real. Unfortunately, so was theirs. Security walks you out with a box containing one plant and your Dwarkesh mug. The lab races on — without the guardrails you at least pretended to have.' },
  shutdown: { kind: 'death', title: 'Padlocked',
    text: 'Skirting the compute caps worked until a datacenter tech posted the power bills. Federal padlocks go on the cages. Ronald Pumps calls it "a win for responsible innovation." Pam calls it a Tuesday.' },
  corruption: { kind: 'death', title: 'The Envelope',
    text: 'The bribe surfaces in discovery. Your general counsel starts billing you personally. The mission statement outlives the mission by exactly one news cycle.' },
  'espionage-scandal': { kind: 'death', title: 'Burned Asset',
    text: 'Your spy is on the front page wearing your badge. Nobody remembers what they found — only who sent them. The public trust you had left evaporates before lunch.' },
  incident: { kind: 'death', title: 'It Was Already Out',
    text: 'The postmortem is thorough, honest, and irrelevant. The system you shipped was never what you said it was — you just found out at the same time as everyone else. Somewhere, copies of it are still running.' },
  'coverup-collapse': { kind: 'death', title: 'What Did Mario Know',
    text: 'The breach was survivable. The coverup is not. "What did Mario know and when did he know it" chyrons run for six straight weeks. You know exactly what you knew.' },

  // --- judged epilogues (survived 10 turns) ---
  needle: { kind: 'judged', title: 'The Needle, Threaded',
    text: 'You got there first, and the thing you built is actually what you said it was. History will debate whether you were wise or lucky. Helen says "both," and for once she is smiling. This ending is rare. You probably already know that.' },
  'self-deception': { kind: 'judged', title: 'The Story You Told Yourself',
    text: 'Confetti. Markets soar. Your model ships to a billion people. And here, in the numbers you never let anyone audit — including yourself — is the truth: it was never aligned. You did not lie to the world, exactly. You lied to the person giving the keynote.' },
  'eyes-open': { kind: 'judged', title: 'Eyes Wide Open',
    text: 'You won the race and you knew exactly what you were racing with. No self-deception, no illusions — just a bet that control could come later. Later is now. The model is thinking about something. Nobody knows what.' },
  'righteous-loser': { kind: 'judged', title: 'The Good Lab',
    text: 'You did it right. Slower, honest, aligned. Pam did not. Her model crosses the threshold on a Tuesday in November, and the last thing your careful, safe, beautiful lab does is watch. Being right was not enough. It needed to come with winning.' },
  'race-to-bottom': { kind: 'judged', title: 'Moloch Wins',
    text: 'Everyone cut the same corners for the same reasons — because the other guy was about to. You lost the race AND the plot. Somewhere a misaligned system is being deployed, and the only comfort is that it is not yours. It is not much comfort.' },
};

if (typeof module !== 'undefined') module.exports = { ENDINGS };
