// Jump in Time and Place. Skill W.7.3-3.
// Using transition words and phrases to signal shifts from one time frame or setting to another. Confusing jumps are the known slip.
Sidekick.game(Sidekick.play({
  title: "Jump in Time and Place",
  emoji: "⏭️",
  premise: "When a story skips ahead or moves somewhere new, a transition tells the reader where and when they have landed.",
  outro: "Signal shifts with transitions such as three days later, meanwhile and back at the camp.",
  scene: "night",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Did the time change, or the place? Which phrase says so?",
  tag: "confusing_jumps",
  rounds: [
    { say: "Drop in the transition that makes each jump clear.", rows: [["The storm hit at noon. ___, the roads were still closed.", "Three days later"], ["Jo searched the attic. ___, her brother dug in the yard.", "Meanwhile"]], extra: "Because|", trap: [1, "Three days later"], why: "Both searches happen at the same time. Meanwhile shows that.", win: "A jump ahead, and a jump across." },
    { say: "Drop in the transition that fits.", rows: [["They left the city at dawn. ___, the desert stretched to the sky.", "By afternoon"], ["The trial dragged on. ___, the missing dog slept under a bridge.", "Across town"]], extra: "However|", trap: [0, "However"], why: "Nothing is being contrasted. Time has passed.", win: "One shows time, one shows place." },
    { say: "Fill these by yourself.", rows: [["She mailed the letter in May. ___, a reply came.", "A month later"], ["The team warmed up. ___, the bus was stuck in traffic.", "Back on the highway"]], extra: "Therefore|For example", trap: [0, "Therefore"] },
  ],
}));
