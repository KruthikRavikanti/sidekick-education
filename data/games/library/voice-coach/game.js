// Voice Coach. Skill RF.1.4-2.
// Reading with expression: each sentence is matched to the way the voice should sound. Reading word by word in a flat voice is the known slip.
Sidekick.game(Sidekick.play({
  title: "Voice Coach",
  emoji: "🎭",
  premise: "Good readers make their voice match the words. End marks tell your voice what to do.",
  outro: "Let the end mark guide your voice: calm for a period, up for a question, strong for an exclamation.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Look at the end mark. What is it asking your voice to do?",
  tag: "flat_voice",
  rounds: [
    { say: "How should your voice sound for each sentence?", rows: [["Watch out!", "loud and excited"], ["Is it time to go?", "goes up at the end"], ["The cat sat down.", "calm and steady"]], trap: [1, "calm and steady"], why: "It is a question. Your voice goes up at the end.", win: "Three end marks, three voices." },
    { say: "Match these.", rows: [["We won the game!", "loud and excited"], ["Where is my shoe?", "goes up at the end"], ["I have a red hat.", "calm and steady"]], trap: [0, "calm and steady"], why: "The exclamation point means strong feeling.", win: "Your voice matches the marks." },
    { say: "Match these by yourself.", rows: [["Can I have a turn?", "goes up at the end"], ["It is my birthday!", "loud and excited"], ["The bus is late.", "calm and steady"]], extra: "very sleepy|", trap: [0, "calm and steady"] },
  ],
}));
