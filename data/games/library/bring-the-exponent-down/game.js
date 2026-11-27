// Bring the Exponent Down. Skill F-LE.A.4-1.
// Expressing the solution of ab^(ct) = d as a logarithm. Taking the log of one side only, or dividing the numbers, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Bring the Exponent Down",
  emoji: "⬇️",
  premise: "When the unknown is stuck in the exponent, take the log of both sides. The exponent comes down where you can solve for it.",
  outro: "If b^x = d, then x = log d ÷ log b. Isolate the power first.",
  scene: "paper",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Get the power alone. Then x = log of the number ÷ log of the base.",
  tag: "divides_instead_of_log",
  rounds: [
    { say: "Solve each equation with logarithms.", rows: [["2^x = 10", "x = {log 10/log 2}"], ["3^x = 20", "x = {log 20/log 3}"]], extra: "x = 5|x = {log 2/log 10}", trap: [0, "x = 5"], why: "2^5 is 32, not 10. Dividing 10 by 2 does not undo an exponent.", win: "Number on the upper line, base below." },
    { say: "Put the steps for solving 5 · 2^x = 40 in order.", kind: "row", fs: 5.2, seq: "5 · 2^x = 40|2^x = 8|x = {log 8/log 2}|x = 3", trap: "5 · 2^x = 40|x = {log 8/log 2}|2^x = 8|x = 3", why: "Divide by 5 first so the power stands alone.", win: "Isolate, take logs, simplify." },
    { say: "Solve these by yourself.", rows: [["5^x = 30", "x = {log 30/log 5}"], ["2^x = 7", "x = {log 7/log 2}"], ["3 · 4^x = 60", "x = {log 20/log 4}"]], extra: "x = 6|x = {log 60/log 4}", trap: [0, "x = 6"] },
  ],
}));
