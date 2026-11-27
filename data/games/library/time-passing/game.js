// Time Passing. Skill W.5.3-3.
// Using a variety of transitional words, phrases and clauses to manage the sequence of events. Choppy sequencing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Time Passing",
  emoji: "⌛",
  premise: "Transitions tell the reader how much time has passed or where the scene has moved.",
  outro: "Use transitional words, phrases and clauses to manage the sequence of events.",
  scene: "sand",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "How much time passes between these two moments?",
  tag: "choppy_sequence",
  rounds: [
    { say: "Drop in the transition that fits.", rows: [["We set out at dawn. ___, we reached the summit.", "Two hours later"], ["I knocked. ___, the door creaked open.", "A moment later"]], extra: "Last year|", trap: [0, "Last year"], why: "Last year jumps backward. The hike took hours, not a year.", win: "Each transition shows how long." },
    { say: "Drop in these transitions.", rows: [["___, the seed sat in the soil.", "All winter"], ["___, a green shoot appeared.", "When spring came"], ["___, it was taller than me.", "By midsummer"]], trap: [0, "By midsummer"], why: "The seed sits first, through winter.", win: "A season by season sequence." },
    { say: "Drop these in by yourself.", rows: [["___, the stadium was silent.", "Before the whistle"], ["___, the crowd roared.", "As the ball flew"], ["___, the field was empty.", "Long after the game"]], extra: "Next year|", trap: [2, "Next year"] },
  ],
}));
