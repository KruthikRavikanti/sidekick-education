// Open or Closed Circle. Skill 6.EE.B.8-3.
// Representing solutions of inequalities on number line diagrams. Using a closed circle for strict inequalities is the known slip.
Sidekick.game(Sidekick.play({
  title: "Open or Closed Circle",
  emoji: "⭕",
  premise: "An inequality is graphed with a circle and an arrow. The circle is open when the number itself is not included.",
  outro: "Use an open circle for > and <, a filled circle for ≥ and ≤. The arrow points to the solutions.",
  scene: "paper",
  kind: "fill",
  figW: 20,
  cast: "",
  hint: "Is the number itself a solution? If not, leave the circle open.",
  tag: "closed_circle_for_strict",
  rounds: [
    { say: "Match each inequality to its graph.", rows: [["x > 3", "~ineq:o:r:3"], ["x ≥ 3", "~ineq:c:r:3"]], extra: "~ineq:o:l:3", trap: [0, "~ineq:c:r:3"], why: "3 is not greater than 3, so 3 is not included. The circle stays open.", win: "Open for >, filled for ≥." },
    { say: "Match these.", rows: [["x < 3", "~ineq:o:l:3"], ["x ≤ 3", "~ineq:c:l:3"], ["x > 3", "~ineq:o:r:3"]], trap: [0, "~ineq:c:l:3"], why: "Less than 3 does not include 3. Open circle.", win: "Three graphs." },
    { say: "Match these by yourself.", rows: [["x ≥ −2", "~ineq:c:r:-2"], ["x < −2", "~ineq:o:l:-2"], ["x > −2", "~ineq:o:r:-2"]], extra: "~ineq:c:l:-2", trap: [2, "~ineq:c:r:-2"] },
  ],
}));
