// Marks Are Voice Signals. Skill RF.4.4-2.
// Reading aloud with accuracy, appropriate rate and expression. Ignoring punctuation when reading aloud is the known slip.
Sidekick.game(Sidekick.play({
  title: "Marks Are Voice Signals",
  emoji: "🚦",
  premise: "Punctuation tells a reader when to pause, stop, rise or add feeling. Skilled readers follow the signals.",
  outro: "Punctuation guides your voice: pause at commas, stop at periods, and change tone for questions and exclamations.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "What is each mark asking your voice to do?",
  tag: "ignores_punctuation",
  rounds: [
    { say: "What does each mark tell your voice to do?", rows: [["comma", "pause briefly"], ["period", "come to a full stop"], ["question mark", "lift at the end"], ["ellipsis ...", "trail off slowly"]], trap: [0, "come to a full stop"], why: "A comma is only a short pause. The sentence keeps going.", win: "Four signals for your voice." },
    { say: "How should each sentence be read?", rows: [["Wait... did you hear that?", "slowly, then with a rising voice"], ["Run! The dam is breaking!", "fast and urgent"], ["After lunch, we walked home.", "calm, with a pause after lunch"]], trap: [1, "calm, with a pause after lunch"], why: "Two exclamation points signal alarm. Read it with urgency.", win: "The marks set the pace and the feeling." },
    { say: "Match these by yourself.", rows: [["\"No,\" she said quietly.", "soft, with a pause after No"], ["Is this really the place?", "rising at the end"], ["We won, we won, we won!", "building with excitement"]], extra: "flat and even|", trap: [2, "flat and even"] },
  ],
}));
