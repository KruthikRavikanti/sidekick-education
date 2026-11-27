// Left Is Less. Skill 6.NS.C.7-1.
// Interpreting statements of inequality as statements about relative position on a number line. Thinking −7 > −3 because 7 > 3 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Left Is Less",
  emoji: "⬅️",
  premise: "On a number line, whatever is farther left is less. That is true for negative numbers too.",
  outro: "A number to the left is less: −7 < −3 because −7 is farther left.",
  scene: "snow",
  kind: "fill",
  fs: 7,
  pSize: 6,
  cast: "",
  hint: "Find both numbers on the line. Which is farther left?",
  tag: "compares_without_sign",
  rounds: [
    { say: "Drop the sign that makes each one true.", fig: { type: "numline", line: [-8, 2, 1], pts: [[-7, "−7"], [-3, "−3"]], v: [] }, rows: [["−7 ___ −3", "<"], ["−3 ___ −7", ">"]], extra: "=", trap: [0, ">"], why: "−7 is farther left on the line, so it is less.", win: "Farther left means less." },
    { say: "Compare these.", rows: [["2 ___ −5", ">"], ["−6 ___ −1", "<"], ["0 ___ −4", ">"]], trap: [1, ">"], why: "−6 is farther left than −1.", win: "Any positive number beats any negative one." },
    { say: "Compare these by yourself.", rows: [["−9 ___ −2", "<"], ["−1 ___ −8", ">"], ["−3 ___ 3", "<"], ["−5 ___ −5", "="]], trap: [0, ">"] },
  ],
}));
