// This Leads to That. Skill RI.1.3-1.
// Describing the connection between two events, ideas or pieces of information in a text. Listing the facts without connecting them is the known slip.
Sidekick.game(Sidekick.play({
  title: "This Leads to That",
  emoji: "🔗",
  premise: "In a fact book, one thing often leads to another. Connect each fact to what it makes happen.",
  outro: "Facts in a text are connected: one thing can cause another.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "What happens BECAUSE of it?",
  tag: "lists_without_connecting",
  rounds: [
    { say: "Connect each fact to what it leads to.", rows: [["Ants work together, so", "they can build a big nest"], ["Rain falls, so", "the plants can grow"]], extra: "ants are black|", trap: [0, "ants are black"], why: "That is a fact, but working together does not cause it.", win: "Teamwork builds the nest. Rain helps plants grow." },
    { say: "Connect these.", rows: [["The sun goes down, so", "it gets dark"], ["Bears eat a lot in fall, so", "they can sleep all winter"]], extra: "bears are brown|", trap: [1, "bears are brown"], why: "Eating a lot does not make bears brown. What does it get them ready for?", win: "Sunset brings dark. Fall food gets bears ready for winter." },
    { say: "Connect these by yourself.", rows: [["Birds have wings, so", "they can fly"], ["Ice gets warm, so", "it melts"], ["A seed gets water, so", "it starts to grow"]], extra: "it is cold|", trap: [1, "it is cold"] },
  ],
}));
