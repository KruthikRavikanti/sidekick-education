// Best Evidence Award. Skill RI.8.1-1.
// Citing the textual evidence that most strongly supports an analysis of what the text says. Choosing weak evidence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Best Evidence Award",
  emoji: "🥇",
  premise: "Not all evidence is equal. Measured results beat a single story, and a direct fact beats a loose connection.",
  outro: "Choose the evidence that most strongly and directly supports the claim.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "Which sentence gives the most direct, measurable proof?",
  tag: "weak_evidence",
  rounds: [
    { say: "Claim: the bike-lane program reduced injuries. Tap the ONE strongest piece of evidence.", mark: "The lanes are painted green.|One rider said she feels safer.|*Hospital records show cyclist injuries fell 40 percent after the lanes opened.|The program began in spring.", trap: "One rider said she feels safer.", why: "One rider’s feeling is weaker than records for the whole city.", win: "Measured results for everyone." },
    { say: "Claim: the wetland protects the town from floods. Tap the ONE strongest piece.", mark: "Herons nest in the wetland.|It is a pleasant place to walk.|*In the 2019 storm, streets beside the wetland stayed dry while others flooded.|The wetland is quite old.", trap: "Herons nest in the wetland.", why: "Herons are not about flooding. Which sentence shows protection?", win: "A direct comparison during a storm." },
    { say: "Claim: the reading program raised scores. Tap the ONE strongest piece by yourself.", mark: "The program uses colorful books.|Teachers like it.|*Average reading scores rose 12 points in schools using it and stayed flat elsewhere.|It started three years ago.|Students read in pairs.|Books are kept in bins.", trap: "Teachers like it." },
  ],
}));
