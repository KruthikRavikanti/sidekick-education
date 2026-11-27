// Link the Reasons. Skill W.6.1-3.
// Using words, phrases and clauses to clarify the relationships among claims and reasons. Leaving out transitions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Link the Reasons",
  emoji: "🔗",
  premise: "Transitions show how ideas connect: this causes that, this is an example, this is the other side.",
  outro: "Use transitions such as because, as a result, for example and however to link claims and reasons.",
  scene: "desk",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Is the second idea a result, an example, or an opposite view?",
  tag: "no_transitions",
  rounds: [
    { say: "Drop in the transition that fits.", rows: [["Phones distract students. ___, grades can drop.", "As a result"], ["Some say phones help research. ___, laptops do that better.", "However"]], extra: "For example|", trap: [0, "However"], why: "Lower grades follow from the distraction. It is a result, not an opposite.", win: "A result, then a contrast." },
    { say: "Drop in the transition that fits.", rows: [["Trees cool cities. ___, shaded streets can be ten degrees cooler.", "For example"], ["The park is popular ___ it has the only playground.", "because"]], extra: "However|", trap: [0, "However"], why: "The second sentence gives a case of the first. It does not disagree.", win: "An example, then a reason." },
    { say: "Fill these by yourself.", rows: [["Lunch is short. ___, many students throw food away.", "As a result"], ["A longer lunch costs time. ___, it would cut waste.", "However"]], extra: "For example|Because", trap: [1, "As a result"] },
  ],
}));
