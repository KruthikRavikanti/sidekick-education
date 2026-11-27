// Solid or Dashed Line?. Skill A-REI.D.12-2.
// Graphing a linear inequality with the correct boundary. Using a solid line for strict inequalities is the known slip.
Sidekick.game(Sidekick.play({
  title: "Solid or Dashed Line?",
  emoji: "〰️",
  premise: "The boundary line is solid when points on it count as solutions, and dashed when they do not.",
  outro: "≤ and ≥ use a solid boundary. < and > use a dashed one.",
  scene: "paper",
  kind: "sort",
  fs: 6,
  hint: "Does the sign include “or equal to”? Then the line itself counts.",
  tag: "solid_for_strict",
  rounds: [
    { say: "Solid boundary or dashed?", bins: "Solid|Dashed", items: ["y ≤ 3|y ≥ 2x − 1", "y < 3|y > 2x − 1"], trap: ["y < 3", 0], why: "Points with y exactly 3 are not included, so the line is dashed.", win: "Or equal to means solid." },
    { say: "Match each inequality to its graph.", kind: "fill", figW: 20, cast: "", rows: [["y ≤ −x + 4", "~half:b:s:n"], ["y < −x + 4", "~half:b:d:n"]], extra: "~half:a:s:n", trap: [1, "~half:b:s:n"], why: "Strictly less than leaves the line out, so it is dashed.", win: "Same shading, different boundary." },
    { say: "Sort these by yourself.", bins: "Solid|Dashed", items: ["y ≥ x|y ≤ 4x + 2|2x + y ≤ 6", "y > x|y < 5"], trap: ["y > x", 0] },
  ],
}));
