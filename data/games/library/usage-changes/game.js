// Usage Changes. Skill L.11-12.1-1.
// Applying the understanding that usage is a matter of convention, can change over time and is sometimes contested. Treating all rules as fixed is the known slip.
Sidekick.game(Sidekick.play({
  title: "Usage Changes",
  emoji: "🕰️",
  premise: "English usage is a set of shared habits, not laws of nature. Habits shift, and what one century scolds the next accepts.",
  outro: "Usage is a matter of convention. It can change over time and is sometimes contested.",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Is it describing a fixed law, or a custom that speakers can change?",
  tag: "rules_are_fixed",
  rounds: [
    { say: "True or not true about English usage?", bins: "True|Not true", items: ["Conventions change over time.|Dictionaries record how words are actually used.", "Every grammar rule is permanent.|A word can never gain a new meaning."], trap: ["Every grammar rule is permanent.", 0], why: "Rules once taught as firm, such as never splitting an infinitive, have relaxed.", win: "Convention, not law." },
    { say: "Each usage was once criticized. What is its status in careful writing today?", bins: "Now widely accepted|Still avoided in formal writing", items: ["singular they for one person|ending a sentence with a preposition", "could of in place of could have|irregardless"], trap: ["singular they for one person", 1], why: "Major style guides now accept singular they.", win: "Some shifts are settled, some are not." },
    { say: "Sort these statements by yourself.", bins: "True|Not true", items: ["Experts sometimes disagree about usage.|Formal and casual settings follow different conventions.", "Usage has not changed since 1800.|Only one dialect of English has rules."], trap: ["Only one dialect of English has rules.", 0] },
  ],
}));
