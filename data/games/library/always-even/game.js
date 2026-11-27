// Always Even?. Skill 3.OA.D.9-2.
// Explaining arithmetic patterns with properties: a multiple of an even number is always even because it contains a factor of 2.
Sidekick.game(Sidekick.play({
  title: "Always Even?",
  emoji: "🎭",
  premise: "Some products come out even every single time. Find out which ones, and why.",
  outro: "A product is even whenever one of its factors is even, because it can be split into two equal groups.",
  scene: "candy",
  kind: "sort",
  hint: "If one factor is even, the product can be split into two equal groups.",
  tag: "cannot_say_why",
  rounds: [
    { say: "Will the product always be even?", bins: "Always even|Not always even", items: ["4 × a number|2 × a number|6 × a number", "3 × a number|5 × a number"], trap: ["6 × a number", 1], why: "6 is 2 × 3. Anything times 6 can be split into two equal groups.", win: "An even factor makes an even product." },
    { say: "Finish the reason.", kind: "fill", rows: [["4 × 7 = 2 × 2 × 7 = 2 × ___", "14"], ["2 times a whole number is always ___", "even"]], extra: "28 odd", trap: [1, "odd"], why: "Two equal groups always make an even number.", win: "4 × 7 is 2 × 14, so it is even." },
    { say: "Sort these by yourself.", bins: "Always even|Not always even", items: ["8 × a number|10 × a number|an even number × 3", "7 × a number|9 × a number"], trap: ["an even number × 3", 1] },
  ],
}));
