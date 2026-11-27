// Analogy Bridge. Skill L.6.5-2.
// Using the relationship between particular words to better understand each. Missing the relationship is the known slip.
Sidekick.game(Sidekick.play({
  title: "Analogy Bridge",
  emoji: "🌉",
  premise: "An analogy matches two pairs of words that are related in the same way: part to whole, cause to effect, or tool to user.",
  outro: "Find the relationship in the first pair, then apply the same one to the second.",
  scene: "city",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "How are the first two words related? Make the second pair match.",
  tag: "misses_relationship",
  rounds: [
    { say: "Finish each analogy.", rows: [["finger is to hand as toe is to ___", "foot"], ["rain is to flood as spark is to ___", "fire"]], extra: "shoe|", trap: [0, "shoe"], why: "A finger is PART of a hand. A toe is part of a foot.", win: "Part to whole, cause to effect." },
    { say: "Finish each analogy.", rows: [["page is to book as petal is to ___", "flower"], ["brush is to painter as hammer is to ___", "carpenter"], ["tired is to sleep as hungry is to ___", "eat"]], trap: [1, "flower"], why: "A brush is the painter’s tool. Who uses a hammer?", win: "Part, tool and user, cause." },
    { say: "Finish these by yourself.", rows: [["wheel is to bike as wing is to ___", "bird"], ["practice is to skill as study is to ___", "knowledge"]], extra: "fly|homework", trap: [0, "fly"] },
  ],
}));
