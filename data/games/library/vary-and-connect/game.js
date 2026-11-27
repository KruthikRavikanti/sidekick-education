// Vary and Connect. Skill W.11-12.1-3.
// Using words, phrases and clauses as well as varied syntax to link the major sections of the text. Writing choppy prose is the known slip.
Sidekick.game(Sidekick.play({
  title: "Vary and Connect",
  emoji: "🪢",
  premise: "Linking words are one tool. Sentence shape is another: a clause that leans on the next idea carries the reader forward.",
  outro: "Use transitions and varied syntax to link sections and show how claims, reasons and evidence relate.",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Are the ideas joined so you can see how one relates to the next?",
  tag: "choppy",
  rounds: [
    { say: "Linked and varied, or choppy?", bins: "Linked|Choppy", items: ["Because costs fell, enrollment rose.|Although the plan is costly, it pays for itself within a decade.", "Costs fell. Enrollment rose.|The plan is costly. It pays for itself."], trap: ["Costs fell. Enrollment rose.", 0], why: "Two facts sit side by side with nothing to show that one caused the other.", win: "Show the relationship." },
    { say: "Choose the link that shows the relationship.", kind: "fill", fs: 4.6, cast: "", rows: [["___ the data are early, the trend is clear.", "Although"], ["The trend is clear; ___, we should act.", "therefore"], ["We should act, ___ delay raises the cost.", "because"]], trap: [0, "because"], why: "Early data and a clear trend pull against each other. Use a word of concession.", win: "Concede, conclude, explain." },
    { say: "Sort these by yourself.", bins: "Linked|Choppy", items: ["Once the bridge opened, traffic downtown eased.|The tax is small; even so, it funds every park.", "The bridge opened. Traffic eased.|The tax is small. It funds every park."], trap: ["The tax is small. It funds every park.", 0] },
  ],
}));
