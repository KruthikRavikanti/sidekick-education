// Punctuation Voice. Skill RF.3.4-2.
// Reading prose and poetry with accuracy, appropriate rate and expression. Reading in a monotone with no phrasing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Punctuation Voice",
  emoji: "🎙️",
  premise: "Punctuation is a set of signals for your voice. Commas mean a short pause. Dashes and marks change the feeling.",
  outro: "Read with expression by following the punctuation and the meaning.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "What is the mark telling your voice to do?",
  tag: "monotone_reading",
  rounds: [
    { say: "How should your voice handle each signal?", rows: [["a comma ,", "pause for a moment"], ["a question mark ?", "lift at the end"], ["an exclamation point !", "show strong feeling"]], trap: [0, "show strong feeling"], why: "A comma is a small rest, not a shout.", win: "Pause, lift and feeling." },
    { say: "How should you read each sentence?", rows: [["\"Stop!\" yelled the guard.", "sharp and loud"], ["\"Is anyone there?\" she whispered.", "soft and unsure"], ["The sun set slowly over the hills.", "calm and smooth"]], trap: [1, "sharp and loud"], why: "She whispered a question. Keep it soft.", win: "The words tell your voice what to do." },
    { say: "Match these by yourself.", rows: [["\"We did it!\" they cheered.", "excited and bright"], ["\"I am so sorry,\" he said quietly.", "soft and sad"]], extra: "flat with no change|fast with no pauses", trap: [0, "flat with no change"] },
  ],
}));
