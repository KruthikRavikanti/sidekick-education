// Smooth the Seams. Skill W.7.2-3.
// Using appropriate transitions to create cohesion and clarify relationships among ideas. Choppy writing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Smooth the Seams",
  emoji: "🪡",
  premise: "Transitions stitch ideas together so the reader never trips. Choose the one that shows how the ideas relate.",
  outro: "Use transitions to create cohesion: in addition, in contrast, for instance, therefore.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Does the next idea add, contrast, give an example, or follow as a result?",
  tag: "choppy",
  rounds: [
    { say: "Drop in the transition that fits.", rows: [["Solar panels cost a lot at first. ___, they save money over time.", "In contrast"], ["Wind power is clean. ___, it is cheap to run.", "In addition"]], extra: "For instance|", trap: [1, "In contrast"], why: "Clean and cheap are two good points. The second adds to the first.", win: "One contrasts, one adds." },
    { say: "Drop in the transition that fits.", rows: [["Many birds migrate. ___, the Arctic tern flies pole to pole.", "For instance"], ["The lake froze early. ___, the ferry stopped running.", "Therefore"]], extra: "In contrast|", trap: [0, "In contrast"], why: "The tern is an example of a migrating bird, not an exception.", win: "An example, then a result." },
    { say: "Fill these by yourself.", rows: [["Deserts get little rain. ___, cactuses store water.", "Therefore"], ["Frogs live near water. ___, toads can live in dry places.", "In contrast"]], extra: "For instance|In addition", trap: [1, "In addition"] },
  ],
}));
