// Linking Word Bridge. Skill W.3.2-3.
// Using linking words and phrases to connect ideas within categories of information. Using no transitions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Linking Word Bridge",
  emoji: "🌉",
  premise: "Linking words join your ideas. Also adds, another adds one more, but shows a difference.",
  outro: "Use linking words such as also, another, and, more, and but to connect ideas.",
  scene: "city",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Is the second idea one more of the same, or a difference?",
  tag: "no_transitions",
  rounds: [
    { say: "Drop in the linking word that fits.", rows: [["Owls hunt at night. ___, they have big eyes.", "Also"], ["Owls can fly, ___ penguins cannot.", "but"]], extra: "Because", trap: [1, "Also"], why: "This shows a difference between two birds. But fits.", win: "Also adds. But contrasts." },
    { say: "Drop in these linking words.", rows: [["Bees make honey. ___ thing they make is wax.", "Another"], ["Bees sting, ___ only when in danger.", "but"], ["Bees need pollen ___ nectar.", "and"]], trap: [0, "but"], why: "Wax is one more thing they make. Another fits.", win: "Another, but and and." },
    { say: "Drop these in by yourself.", rows: [["Frogs swim well. They can ___ jump far.", "also"], ["Frogs live near water, ___ toads live on land.", "but"], ["___ fact is that frogs breathe through skin.", "Another"]], extra: "so", trap: [1, "also"] },
  ],
}));
