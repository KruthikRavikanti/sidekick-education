// Find the Constant. Skill 7.RP.A.2-2.
// Identifying the constant of proportionality. Dividing in the opposite order (x ÷ y) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Find the Constant",
  emoji: "🔑",
  premise: "In a proportional relationship, y is always the same number times x. That number is k, and k = y ÷ x.",
  outro: "The constant of proportionality is k = y ÷ x.",
  scene: "desk",
  kind: "type",
  icon: "🔑",
  hint: "Divide y by x. Check: does k times x give y?",
  tag: "divides_x_by_y",
  rounds: [
    { say: "Key in the constant of proportionality.", q: "y is proportional to x. y = 15 when x = 6.", ans: "2.5", trap: "0.4", why: "That is x ÷ y. Check: 0.4 × 6 is not 15.", win: "15 ÷ 6 = 2.5." },
    { say: "Key in k for this table.", fig: { type: "table", rows: [["x", 2, 4, 6], ["y", 10, 20, 30]] }, ans: "5", trap: "0.2", why: "That is x ÷ y. Each y is 5 times its x.", win: "10 ÷ 2 = 5, and every column agrees." },
    { say: "Find k by yourself.", alt: [{ q: "y is proportional to x. y = 24 when x = 3.", ans: "8", trap: "0.125" }, { q: "y is proportional to x. y = 20 when x = 5.", ans: "4", trap: "0.25" }, { q: "y is proportional to x. y = 35 when x = 14.", ans: "2.5", trap: "0.4" }] },
  ],
}));
