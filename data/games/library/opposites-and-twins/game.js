// Opposites and Twins. Skill L.7.5-2.
// Using the relationship between particular words (synonym, antonym, analogy) to better understand each. Weak analogies are the known slip.
Sidekick.game(Sidekick.play({
  title: "Opposites and Twins",
  emoji: "⚖️",
  premise: "In an analogy, the second pair must match the first. If the first pair are opposites, so are the second.",
  outro: "Identify the relationship (synonym, antonym or another link) and apply it to the second pair.",
  scene: "desk",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Are the first two words opposites or near twins? Keep the same link.",
  tag: "weak_analogies",
  rounds: [
    { say: "Finish each analogy.", rows: [["hot is to cold as generous is to ___", "stingy"], ["big is to large as quick is to ___", "fast"]], extra: "kind|", trap: [0, "kind"], why: "Hot and cold are opposites. The opposite of generous is stingy.", win: "Opposites, then twins." },
    { say: "Finish each analogy.", rows: [["ancient is to modern as rough is to ___", "smooth"], ["happy is to joyful as scared is to ___", "afraid"], ["arrive is to depart as accept is to ___", "reject"]], trap: [1, "smooth"], why: "Happy and joyful mean the same. Find the twin of scared.", win: "Check the link first." },
    { say: "Finish these by yourself.", rows: [["brave is to cowardly as calm is to ___", "frantic"], ["begin is to start as finish is to ___", "end"]], extra: "peaceful|open", trap: [0, "peaceful"] },
  ],
}));
