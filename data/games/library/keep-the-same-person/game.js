// Keep the Same Person. Skill L.6.1-3.
// Recognizing and correcting inappropriate shifts in pronoun number and person. Shifting from you to they is the known slip.
Sidekick.game(Sidekick.play({
  title: "Keep the Same Person",
  emoji: "🔁",
  premise: "If a sentence starts with you, it should stay with you. Jumping to they halfway through confuses the reader.",
  outro: "Keep pronouns consistent in number and person within a sentence.",
  scene: "desk",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Who is the sentence about at the start? Keep that same pronoun.",
  tag: "shifts_pronoun",
  rounds: [
    { say: "Finish each sentence without changing the person.", rows: [["When you study hard, ___ get good grades.", "you"], ["When we practice, ___ improve.", "we"]], extra: "they", trap: [0, "they"], why: "The sentence began with you. Stay with you.", win: "You stays you. We stays we." },
    { say: "Finish each sentence.", rows: [["If I rush, ___ make errors.", "I"], ["When students listen, ___ learn more.", "they"], ["If you leave early, ___ will miss the ending.", "you"]], trap: [2, "they"], why: "It started with you. Do not switch to they.", win: "Each one matches its start." },
    { say: "Finish these by yourself.", rows: [["When we hike, ___ carry water.", "we"], ["If you forget a coat, ___ will be cold.", "you"], ["When a dog is hungry, ___ barks.", "it"]], extra: "they", trap: [0, "they"] },
  ],
}));
