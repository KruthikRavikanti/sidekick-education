// Hold the Mood. Skill L.8.1-4.
// Recognizing and correcting inappropriate shifts in verb voice and mood. Shifting mid-sentence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Hold the Mood",
  emoji: "🧭",
  premise: "A sentence that starts as a command should finish as one. Switching voice or mood halfway feels like a swerve.",
  outro: "Keep verb voice and mood consistent within a sentence.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does the second half match the first: both commands, or both active?",
  tag: "shifts_mid_sentence",
  rounds: [
    { say: "Consistent, or does it shift?", bins: "Consistent|Shifts", items: ["Open the box, and then read the note.|We cooked dinner and washed the dishes.", "Open the box, and then you should read the note.|We cooked dinner, and the dishes were washed by us."], trap: ["Open the box, and then you should read the note.", 0], why: "It starts as a command and drifts into advice.", win: "Keep both halves the same." },
    { say: "Sort these.", bins: "Consistent|Shifts", items: ["Stir the sauce and taste it.|The team scored early and held the lead.", "Stir the sauce, and it should be tasted.|The team scored early, and the lead was held by them."], trap: ["Stir the sauce, and it should be tasted.", 0], why: "A command is followed by a passive statement.", win: "Same voice, same mood." },
    { say: "Sort these by yourself.", bins: "Consistent|Shifts", items: ["Fold the paper and cut along the line.|She opened the letter and read it twice.", "Fold the paper, and then you would cut it.|She opened the letter, and it was read twice."], trap: ["She opened the letter, and it was read twice.", 0] },
  ],
}));
