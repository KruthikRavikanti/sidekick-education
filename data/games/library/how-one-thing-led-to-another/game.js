// How One Thing Led to Another. Skill RI.11-12.3-1.
// Analyzing a complex set of ideas or sequence of events and explaining how they interact and develop. Summarizing instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "How One Thing Led to Another",
  emoji: "🕸️",
  premise: "In complex texts, events and ideas act on each other. Trace the chain and you understand the argument.",
  outro: "Analyze how specific individuals, ideas or events interact and develop over the course of a text.",
  scene: "city",
  kind: "row",
  fs: 4.4,
  hint: "Which link makes the next one happen?",
  tag: "summarizes_instead",
  rounds: [
    { say: "Put the chain in order, cause before effect.", read: "A text explains how a canal reshaped a region.", seq: "A canal opens.|Shipping costs fall.|Farms sell to distant cities.|Towns grow along the route.", trap: "A canal opens.|Towns grow along the route.|Shipping costs fall.|Farms sell to distant cities.", why: "Towns grow because of the trade. Cheaper shipping comes first.", win: "Each link pulls the next." },
    { say: "How do these ideas from one text interact?", kind: "fill", fs: 4.4, cast: "", rows: [["cheap printing", "made pamphlets common"], ["common pamphlets", "spread arguments to ordinary readers"], ["informed readers", "began to demand a voice"]], trap: [0, "began to demand a voice"], why: "That is the end of the chain. Printing first made pamphlets cheap and common.", win: "Technology, ideas, action." },
    { say: "Put this chain in order by yourself.", read: "A text explains a financial panic.", seq: "A large bank collapses.|Depositors rush to withdraw.|Other banks run short of cash.|Lending freezes.", trap: "Lending freezes.|A large bank collapses.|Depositors rush to withdraw.|Other banks run short of cash." },
  ],
}));
