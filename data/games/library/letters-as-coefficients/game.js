// Letters as Coefficients. Skill A-REI.B.3-1.
// Solving linear equations in one variable, including equations with coefficients represented by letters. Dividing by a letter that could be zero is the known slip.
Sidekick.game(Sidekick.play({
  title: "Letters as Coefficients",
  emoji: "🔡",
  premise: "An equation with letters for numbers is solved the same way. Just remember you can never divide by zero.",
  outro: "ax + b = c gives x = (c − b) ÷ a, as long as a is not 0.",
  scene: "desk",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Undo the adding first, then divide by the coefficient. Could that coefficient be 0?",
  tag: "divides_by_possible_zero",
  rounds: [
    { say: "Solve each equation for x.", rows: [["ax + b = c", "x = {c − b/a}"], ["ax = b", "x = {b/a}"]], extra: "x = {c + b/a}|", trap: [0, "x = {c + b/a}"], why: "b is added to ax, so subtract it from c.", win: "Subtract, then divide by a." },
    { say: "True or not true about x = (c − b) ÷ a?", kind: "sort", fs: 4.8, bins: "True|Not true", items: ["It works whenever a is not 0.|If a = 0, the x term disappears.", "You can always divide by a.|It works even when a = 0."], trap: ["You can always divide by a.", 0], why: "If a were 0 you would be dividing by zero.", win: "State the condition: a is not 0." },
    { say: "Solve these for x by yourself.", rows: [["mx − n = p", "x = {p + n/m}"], ["{x/a} = b", "x = ab"], ["ax + bx = c", "x = {c/a + b}"]], extra: "x = {p − n/m}|", trap: [0, "x = {p − n/m}"] },
  ],
}));
