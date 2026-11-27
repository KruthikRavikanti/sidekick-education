// Sound-Alike Words. Skill L.4.1-6.
// Correctly using frequently confused words. Swapping homophones is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sound-Alike Words",
  emoji: "🏠",
  premise: "To, too and two sound the same. So do there, their and they’re. Each one has its own meaning.",
  outro: "Their shows ownership, there is a place, they’re means they are. Too means also, two is the number.",
  scene: "city",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Try reading they are in the blank. Does it work? Is it a place? Does something belong to them?",
  tag: "swaps_homophones",
  rounds: [
    { say: "Drop each word where it fits.", rows: [["___ going to the store.", "They’re"], ["It is ___ house.", "their"], ["Put it over ___.", "there"]], trap: [0, "their"], why: "They are going to the store. That is they’re.", win: "They’re, their and there." },
    { say: "Drop each word where it fits.", rows: [["I have ___ cats.", "two"], ["I want to come ___.", "too"], ["We went ___ the park.", "to"]], trap: [1, "to"], why: "Too with two o’s means also.", win: "Two, too and to." },
    { say: "Drop these in by yourself.", rows: [["___ dog is barking.", "Your"], ["___ late for class.", "You’re"], ["The cat licked ___ paw.", "its"], ["___ time to go.", "It’s"]], trap: [0, "You’re"] },
  ],
}));
