// Argument Connectors. Skill W.8.1-3.
// Using words, phrases and clauses to create cohesion among claims, counterclaims, reasons and evidence. Choppy writing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Argument Connectors",
  emoji: "🔀",
  premise: "Transitions show the reader whether you are giving a reason, offering proof, or turning to answer the other side.",
  outro: "Use words and phrases that clarify how claims, counterclaims, reasons and evidence relate.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Is the next sentence proof, a result, or an answer to the other side?",
  tag: "choppy",
  rounds: [
    { say: "Drop in the connector that fits.", rows: [["Some say phones help learning. ___, most classroom use is social.", "Even so"], ["Phones distract. ___, one study found lower test scores.", "For example"]], extra: "Therefore|", trap: [0, "For example"], why: "The second sentence pushes back against the first. It is not an example of it.", win: "One answers back. One gives proof." },
    { say: "Drop in the connector that fits.", rows: [["Recess improves focus. ___, schools should protect it.", "For this reason"], ["Critics call it wasted time. ___, the data says otherwise.", "However"]], extra: "For example|", trap: [1, "For example"], why: "The data disagrees with the critics. That needs a turning word.", win: "A result, then a rebuttal." },
    { say: "Fill these by yourself.", rows: [["Trees cool streets. ___, shaded blocks use less power.", "As a result"], ["Planting costs money. ___, the savings repay it.", "Nevertheless"]], extra: "For instance|Similarly", trap: [1, "Similarly"] },
  ],
}));
