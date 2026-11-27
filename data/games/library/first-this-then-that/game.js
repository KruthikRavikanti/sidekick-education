// First This, Then That. Skill L.5.1-3.
// Using verb tense to convey various times, sequences, states and conditions. Confusing the time order is the known slip.
Sidekick.game(Sidekick.play({
  title: "First This, Then That",
  emoji: "⏱️",
  premise: "Verb tense tells the reader what happened first. Had finished comes before went.",
  outro: "Use verb tense to show the order of events and conditions.",
  scene: "desk",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Which action happened first? That one takes had.",
  tag: "confuses_time_order",
  rounds: [
    { say: "Show the order of events.", rows: [["After I ___ my homework,", "had finished"], ["I ___ outside.", "went"]], extra: "go", trap: [0, "went"], why: "Finishing homework happened first. The earlier action takes had finished.", win: "Had finished, then went." },
    { say: "Show the order of events.", rows: [["The train ___ before we reached the station.", "had left"], ["So we ___ for the next one.", "waited"], ["Tomorrow we ___ earlier.", "will leave"]], trap: [0, "waited"], why: "The train left first, before we arrived. Use had left.", win: "Earlier past, past, future." },
    { say: "Show the order by yourself.", rows: [["Once the rain ___,", "had stopped"], ["we ___ the picnic.", "continued"], ["If it rains again, we ___ inside.", "will move"]], extra: "stops", trap: [1, "had stopped"] },
  ],
}));
