// Undo the Function. Skill F-BF.B.4-1.
// Solving an equation of the form f(x) = c for a simple function that has an inverse, and writing the inverse. Thinking the inverse is 1 ÷ f(x) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Undo the Function",
  emoji: "↩️",
  premise: "An inverse function undoes the original. To find it, swap x and y, then solve for y.",
  outro: "To find an inverse: write y = f(x), swap x and y, solve for y.",
  scene: "paper",
  kind: "row",
  fs: 5.2,
  hint: "Undo the steps in reverse order: the last thing done is the first thing undone.",
  tag: "inverse_as_reciprocal",
  rounds: [
    { say: "Put the steps for finding the inverse of f(x) = 2x + 3 in order.", seq: "y = 2x + 3|x = 2y + 3|x − 3 = 2y|y = {x − 3/2}", trap: "y = 2x + 3|x − 3 = 2y|x = 2y + 3|y = {x − 3/2}", why: "Swap x and y first. Then solve for y.", win: "Swap, subtract 3, divide by 2." },
    { say: "Match each function to its inverse.", kind: "fill", fs: 5.6, cast: "", rows: [["f(x) = x + 5", "x − 5"], ["f(x) = 3x", "{x/3}"], ["f(x) = 2x + 3", "{x − 3/2}"]], extra: "{1/2x + 3}|", trap: [2, "{1/2x + 3}"], why: "That is the reciprocal, 1 ÷ f(x). An inverse undoes the steps instead.", win: "Each inverse undoes its function." },
    { say: "Match each function to its inverse by yourself.", kind: "fill", fs: 5.6, cast: "", rows: [["f(x) = x − 4", "x + 4"], ["f(x) = 5x", "{x/5}"], ["f(x) = 4x − 1", "{x + 1/4}"]], extra: "{1/5x}|{1/4x − 1}", trap: [1, "{1/5x}"] },
  ],
}));
