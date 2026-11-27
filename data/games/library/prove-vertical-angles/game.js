// Prove Vertical Angles. Skill G-CO.C.9-1.
// Proving that vertical angles are congruent. Assuming what is being proved is the known slip.
Sidekick.game(Sidekick.play({
  title: "Prove Vertical Angles",
  emoji: "✖️",
  premise: "A proof gives a reason for each step. “They look equal” is not a reason, and neither is the thing you are trying to prove.",
  outro: "Vertical angles are congruent because each is supplementary to the same angle between them.",
  scene: "paper",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Both angles sit on a straight line with the same neighbor.",
  tag: "assumes_the_conclusion",
  rounds: [
    { say: "Two lines cross, making angles 1, 2, 3 in order. Give the reason for each step.", fig: { type: "angle", cross: true, mark: ["1", "3", "2"], h: 28, v: [60] }, rows: [["angle 1 + angle 2 = 180°", "they form a straight line"], ["angle 1 = angle 3", "both equal 180° minus angle 2"]], extra: "they look equal|", trap: [1, "they look equal"], why: "Looks are not proof. Both angles are what is left after taking angle 2 from 180°.", win: "Same neighbor, same supplement." },
    { say: "Put the proof in order.", kind: "row", fs: 4.4, seq: "Angles 1 and 2 make a straight line.|Angles 2 and 3 make a straight line.|So angle 1 and angle 3 both equal 180° minus angle 2.|So angle 1 equals angle 3.", trap: "So angle 1 equals angle 3.|Angles 1 and 2 make a straight line.|Angles 2 and 3 make a straight line.|So angle 1 and angle 3 both equal 180° minus angle 2.", why: "That starts with the thing to be proved. The conclusion comes last.", win: "Facts first, conclusion last." },
    { say: "Use the theorem by yourself. Key in x.", kind: "type", icon: "✖️", alt: [{ q: "Vertical angles measure 2x and 84°.", ans: 42, trap: 48 }, { q: "Vertical angles measure 5x and 100°.", ans: 20, trap: 16 }, { q: "Vertical angles measure 4x and 120°.", ans: 30, trap: 15 }] },
  ],
}));
