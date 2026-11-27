// Debt and Depth. Skill 6.NS.C.7-4.
// Distinguishing comparisons of absolute value from statements about order. Thinking a balance of −30 is more than −10 because 30 > 10 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Debt and Depth",
  emoji: "💳",
  premise: "A balance of −30 is LESS than a balance of −10. But a debt of 30 is MORE than a debt of 10. Order and size are different ideas.",
  outro: "Order compares position on the number line. Absolute value compares size, like how big a debt is.",
  scene: "city",
  kind: "sort",
  hint: "Is it asking which number is greater, or which amount is bigger?",
  tag: "confuses_order_and_size",
  rounds: [
    { say: "True or not true?", bins: "True|Not true", items: ["−30 is less than −10|A $30 debt is bigger than a $10 debt", "−30 is greater than −10|A balance of −30 is more money than −10"], trap: ["A balance of −30 is more money than −10", 0], why: "A balance of −30 means you owe more. That is less money.", win: "Lower balance, bigger debt." },
    { say: "True or not true?", bins: "True|Not true", items: ["−50 feet is deeper than −20 feet|−50 is less than −20", "−50 is greater than −20|−20 feet is deeper than −50 feet"], trap: ["−50 is greater than −20", 0], why: "−50 is farther left on the number line, so it is less.", win: "Deeper, but a smaller number." },
    { say: "Sort these by yourself.", bins: "True|Not true", items: ["−8 is farther from 0 than −3|−8 is less than −3", "−8 is greater than −3|A drop of 3 is bigger than a drop of 8"], trap: ["−8 is greater than −3", 0] },
  ],
}));
