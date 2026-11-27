// Shrinking Times. Skill 5.NF.B.5-2.
// Multiplying a number by a fraction less than 1 gives a smaller product; by a fraction greater than 1, a larger one. Expecting every product to be bigger is the known slip.
Sidekick.game(Sidekick.play({
  title: "Shrinking Times",
  emoji: "🐜",
  premise: "Multiply by a fraction smaller than 1 and the number shrinks. Half of 8 is less than 8.",
  outro: "Multiplying by a fraction less than 1 gives a product smaller than the number you started with.",
  scene: "forest",
  kind: "fill",
  fs: 7,
  pSize: 6,
  cast: "",
  hint: "Is the fraction less than 1? Then you are taking only part of the number.",
  tag: "multiplying_always_makes_bigger",
  rounds: [
    { say: "Key in the product. Is it bigger or smaller than 8?", kind: "type", icon: "🐜", q: "{1/2} × 8", ans: 4, trap: 16, why: "That doubles 8. One half times 8 means half of 8.", win: "Half of 8 is 4, which is less than 8." },
    { say: "Drop the sign that makes each one true.", rows: [["{1/2} × 8 ___ 8", "<"], ["{3/2} × 8 ___ 8", ">"], ["{2/2} × 8 ___ 8", "="]], trap: [0, ">"], why: "One half of 8 is only part of 8. It is less.", win: "Less, more and equal." },
    { say: "Place the signs by yourself.", rows: [["{2/3} × 9 ___ 9", "<"], ["{4/4} × 9 ___ 9", "="], ["{5/3} × 9 ___ 9", ">"]], trap: [0, ">"] },
  ],
}));
