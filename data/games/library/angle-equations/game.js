// Angle Equations. Skill 7.G.B.5-2.
// Writing and solving simple equations for an unknown angle in a figure. Setting the angles equal when they should sum (or the reverse) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Angle Equations",
  emoji: "✏️",
  premise: "An angle fact turns into an equation. Equal angles go on two sides of the equals sign. Angles on a line add to 180.",
  outro: "Vertical angles: set them equal. Supplementary: sum to 180. Complementary: sum to 90.",
  scene: "paper",
  kind: "type",
  hint: "Are these angles equal, or do they add up to 180 or 90?",
  tag: "equal_instead_of_sum",
  rounds: [
    { say: "The two marked angles are straight across from each other. Key in x.", fig: { type: "angle", v: [75], cross: true, mark: ["3x", "75°"] }, ans: 25, trap: 35, why: "Vertical angles are equal, so 3x = 75. They do not add to 180.", win: "3x = 75, so x = 25." },
    { say: "These two angles make a straight line. Key in x.", fig: { type: "angle", v: [100], straight: true, mark: ["2x", "80°"] }, ans: 50, trap: 40, why: "They are not equal. Together they make 180: 2x + 80 = 180.", win: "2x = 100, so x = 50." },
    { say: "Find x by yourself.", alt: [{ q: "Vertical angles measure 4x and 100°.", ans: 25, trap: 20 }, { q: "Supplementary angles measure 5x and 30°.", ans: 30, trap: 6 }, { q: "Complementary angles measure 3x and 30°.", ans: 20, trap: 10 }] },
  ],
}));
