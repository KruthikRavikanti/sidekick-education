// Connect the Experiences. Skill W.8.3-3.
// Using transition words to convey sequence, signal shifts in time or setting, and show relationships among experiences. Confusing jumps are the known slip.
Sidekick.game(Sidekick.play({
  title: "Connect the Experiences",
  emoji: "🧷",
  premise: "Stories jump between times and places. A transition shows the jump and how the two moments connect.",
  outro: "Use transitions to signal shifts and to show the relationships among experiences.",
  scene: "night",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Is this moment earlier, later, somewhere else, or caused by the other?",
  tag: "confusing_jumps",
  rounds: [
    { say: "Drop in the transition that fits.", rows: [["I froze at the diving board. ___, I had nearly drowned in that same pool.", "Years earlier"], ["I jumped anyway. ___, deep water never scared me again.", "From that day on"]], extra: "Meanwhile|", trap: [0, "Meanwhile"], why: "The near drowning happened long before, not at the same time.", win: "A look back, then a lasting change." },
    { say: "Drop in the transition that fits.", rows: [["Mom packed the car in silence. ___, my brother was still asleep upstairs.", "Meanwhile"], ["We lost the house. ___, we learned what we could carry.", "Because of that"]], extra: "Years earlier|", trap: [1, "Years earlier"], why: "The lesson came from losing the house. One caused the other.", win: "Same time, then cause and effect." },
    { say: "Fill these by yourself.", rows: [["The match began at noon. ___, the stands were empty.", "By dusk"], ["My grandfather kept bees. ___, I keep them now.", "In the same way"]], extra: "However|For example", trap: [1, "However"] },
  ],
}));
