// Bigger or Smaller Than 20?. Skill 5.NF.B.5-1.
// Comparing the size of a product to one factor without multiplying, based on the size of the other factor. Thinking multiplication always makes bigger is the known slip.
Sidekick.game(Sidekick.play({
  title: "Bigger or Smaller Than 20?",
  emoji: "🎚️",
  premise: "Multiplying does not always make a number bigger. Look at the fraction: is it more than 1, less than 1, or exactly 1?",
  outro: "Multiplying by more than 1 makes it bigger. By less than 1 makes it smaller. By exactly 1 keeps it the same.",
  scene: "desk",
  kind: "sort",
  fs: 6,
  hint: "Compare the fraction with 1. Is its top bigger or smaller than its bottom?",
  tag: "multiplying_always_makes_bigger",
  rounds: [
    { say: "Do not multiply. Is each product less than, equal to, or more than 20?", bins: "Less than 20|Equal to 20|More than 20", items: ["{3/4} × 20|{1/2} × 20", "{4/4} × 20", "{5/4} × 20|{7/3} × 20"], trap: ["{3/4} × 20", 2], why: "Three fourths is less than 1, so you get only part of 20.", win: "The size of the fraction told you." },
    { say: "Now compare with 12.", bins: "Less than 12|Equal to 12|More than 12", items: ["{2/3} × 12|{9/10} × 12", "{6/6} × 12", "{3/2} × 12|{11/8} × 12"], trap: ["{9/10} × 12", 2], why: "Nine tenths is a little less than 1, so the product is a little less than 12.", win: "Less than 1 shrinks. More than 1 grows." },
    { say: "Sort these by yourself. Compare with 30.", bins: "Less than 30|Equal to 30|More than 30", items: ["{5/6} × 30|{1/3} × 30", "{8/8} × 30", "{6/5} × 30|{9/4} × 30"], trap: ["{5/6} × 30", 2] },
  ],
}));
