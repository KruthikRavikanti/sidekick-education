// End to End. Skill 3.OA.A.3-3.
// Measurement word problems with multiplication and division. Choosing the operation from a keyword instead of the situation is the known slip.
Sidekick.game(Sidekick.play({
  title: "End to End",
  emoji: "🎗️",
  premise: "Lengths and amounts come in equal pieces. Decide whether to multiply or divide, then key in the answer.",
  outro: "Equal pieces put together multiply. A total cut into equal pieces divides.",
  scene: "desk",
  kind: "type",
  icon: "📏",
  hint: "Are equal pieces being joined, or is a total being cut up?",
  tag: "picks_opposite_operation",
  rounds: [
    { say: "Key in the answer.", q: "Each ribbon is 6 inches long. How many inches long are 9 ribbons end to end?", ans: 54, trap: 15, why: "Nine equal ribbons are joined. That is 9 groups of 6.", win: "9 × 6 = 54 inches." },
    { say: "Key in the answer.", q: "A 40 inch board is cut into pieces 8 inches long. How many pieces?", ans: 5, trap: 32, why: "The board is cut into equal pieces. How many 8s are in 40?", win: "40 ÷ 8 = 5 pieces." },
    { say: "Solve this one by yourself.", alt: [{ q: "Each jug holds 4 liters. How many liters do 7 jugs hold?", ans: 28, trap: 11 }, { q: "A 36 foot rope is cut into 4 equal pieces. How many feet long is each piece?", ans: 9, trap: 32 }] },
  ],
}));
