// How the Declaration Persuades. Skill RI.11-12.9-1.
// Analyzing foundational US documents for their themes, purposes and rhetorical features. Summarizing instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "How the Declaration Persuades",
  emoji: "📜",
  premise: "The founding documents were written to convince. Their structure and phrasing are as deliberate as their ideas.",
  outro: "Analyze foundational US documents for their themes, purposes and rhetorical features.",
  scene: "paper",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "What is this part of the document trying to do to its reader?",
  tag: "summarizes_instead",
  rounds: [
    { say: "The Declaration of Independence has three parts. Match each to its purpose.", rows: [["opening principles", "state the beliefs the case rests on"], ["list of grievances", "supply the evidence against the king"], ["final declaration", "draw the conclusion: independence"]], trap: [1, "draw the conclusion: independence"], why: "The grievances are the evidence. The conclusion comes last.", win: "Principles, proof, conclusion." },
    { say: "Match each rhetorical feature to its example from the Declaration.", rows: [["shared beliefs", "“We hold these truths to be self-evident”"], ["repetition", "grievances that each begin “He has”"], ["pledge", "“our Lives, our Fortunes and our sacred Honor”"]], trap: [0, "grievances that each begin “He has”"], why: "That repeated opening is repetition. The appeal is to truths all are meant to accept.", win: "Belief, pattern, commitment." },
    { say: "Match each document to its main purpose by yourself.", rows: [["Federalist Papers", "persuade states to ratify the Constitution"], ["Bill of Rights", "limit government power over individuals"], ["Lincoln, 1865", "urge healing after civil war"]], extra: "declare a new king|", trap: [0, "declare a new king"] },
  ],
}));
