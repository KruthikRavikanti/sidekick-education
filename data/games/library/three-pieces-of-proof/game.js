// Three Pieces of Proof. Skill RL.7.1-1.
// Citing several pieces of textual evidence to support analysis and inferences. Citing only one piece is the known slip.
Sidekick.game(Sidekick.play({
  title: "Three Pieces of Proof",
  emoji: "🧾",
  premise: "One clue is a hint. Several clues together make a case. Collect every line that supports the claim.",
  outro: "Strong analysis cites several pieces of evidence, not just one.",
  scene: "night",
  kind: "pick",
  fs: 4.4,
  hint: "Keep looking after the first clue. Which other lines show it too?",
  tag: "cites_one_piece",
  rounds: [
    { say: "Claim: Ines wants to prove herself to her father. Tap the three lines that support it.", mark: "*Ines stayed late to finish the boat he said she could not build.|The workshop smelled of pine.|*She sanded the hull until her hands blistered.|Gulls circled the dock.|*“Now he will see,” she whispered.", trap: "-“Now he will see,” she whispered.", why: "Her own words name who she is doing it for. That line counts too.", win: "Three lines build the case." },
    { say: "Claim: Marcus regrets the argument. Tap the three lines that support it.", mark: "*Marcus typed “sorry” and deleted it four times.|His room faced the street.|*He kept the friendship bracelet in his pocket all week.|*At lunch he saved the empty seat beside him.|The bell rang at noon.", trap: "-At lunch he saved the empty seat beside him.", why: "Saving a seat shows he hopes his friend comes back.", win: "A message, a keepsake and a saved seat." },
    { say: "Claim: the old dog trusts no one. Tap the three lines by yourself.", mark: "*It ate only after everyone left the room.|Its coat was gray at the muzzle.|*It flinched when a hand reached out.|*It slept facing the door.|The yard had a tall oak.", trap: "-It slept facing the door." },
  ],
}));
