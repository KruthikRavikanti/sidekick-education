// Quiet E Changes It. Skill RF.1.3-3.
// Knowing final -e conventions for representing long vowel sounds. Reading cape as cap is the known slip.
Sidekick.game(Sidekick.play({
  title: "Quiet E Changes It",
  emoji: "🦸",
  premise: "An e at the end of a word stays quiet, but it makes the vowel say its name. Cap becomes cape.",
  outro: "A final e is silent and makes the vowel long: cap, cape.",
  scene: "city",
  kind: "fill",
  fs: 6.4,
  cast: "",
  hint: "Is there an e at the end? Then the vowel says its name.",
  tag: "ignores_final_e",
  rounds: [
    { say: "Give each picture its word.", rows: [["🧢", "cap"], ["🦸", "cape"]], extra: "cop", trap: [1, "cap"], why: "A hero wears a cape. The e at the end makes the a say its name.", win: "Cap and cape." },
    { say: "Match these.", rows: [["🪁", "kite"], ["🧰", "kit"], ["🌲", "pine"], ["📌", "pin"]], trap: [0, "kit"], why: "Kite has a long i. It needs the e at the end.", win: "Kit and kite, pin and pine." },
    { say: "Finish each sentence by yourself.", rows: [["A bunny can ___.", "hop"], ["I ___ you can come.", "hope"], ["I ___ my bed.", "made"], ["The dog is ___ at the cat.", "mad"]], trap: [0, "hope"] },
  ],
}));
