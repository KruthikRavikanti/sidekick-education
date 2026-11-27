// Count the Decimal Places. Skill 6.NS.B.3-2.
// Multiplying multi-digit decimals with the standard algorithm. Placing the point by lining it up with the factors is the known slip.
Sidekick.game(Sidekick.play({
  title: "Count the Decimal Places",
  emoji: "✖️",
  premise: "When multiplying decimals, the answer has as many decimal places as both factors put together.",
  outro: "Multiply as whole numbers, then count the decimal places in both factors.",
  scene: "desk",
  kind: "type",
  icon: "✖️",
  hint: "Count the digits after the point in both numbers. The product gets that many.",
  tag: "lines_up_the_point",
  rounds: [
    { say: "Key in the product.", q: "3.6 × 0.25", ans: "0.9", trap: "9", why: "There are three decimal places in all: 36 × 25 = 900, so 0.900.", win: "3.6 × 0.25 = 0.9." },
    { say: "Key in this product.", q: "1.2 × 0.4", ans: "0.48", trap: "4.8", why: "Two decimal places in all: 12 × 4 = 48, so 0.48.", win: "1.2 × 0.4 = 0.48." },
    { say: "Key in the product by yourself.", alt: [{ q: "2.5 × 0.6", ans: "1.5", trap: "15" }, { q: "0.08 × 0.5", ans: "0.04", trap: "0.4" }, { q: "4.2 × 1.5", ans: "6.3", trap: "63" }] },
  ],
}));
