// Factor It Out. Skill 6.NS.B.4-3.
// Using the distributive property to express a sum with a common factor as a multiple of a sum. Factoring from only one term is the known slip.
Sidekick.game(Sidekick.play({
  title: "Factor It Out",
  emoji: "📦",
  premise: "A sum of two numbers can be rewritten as their common factor times a smaller sum. Both numbers get divided.",
  outro: "Factor out the GCF from both terms: 36 + 8 = 4(9 + 2).",
  scene: "desk",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Divide BOTH numbers by the common factor.",
  tag: "factors_one_term",
  rounds: [
    { say: "Rewrite each sum with its GCF outside.", rows: [["36 + 8 =", "4(9 + 2)"], ["12 + 18 =", "6(2 + 3)"]], extra: "4(9 + 8)|", trap: [0, "4(9 + 8)"], why: "The 8 must be divided by 4 as well: 8 ÷ 4 = 2.", win: "Both terms were divided." },
    { say: "Rewrite these sums.", rows: [["20 + 35 =", "5(4 + 7)"], ["24 + 16 =", "8(3 + 2)"], ["27 + 9 =", "9(3 + 1)"]], extra: "9(3 + 9)|", trap: [2, "9(3 + 9)"], why: "9 ÷ 9 is 1, so the second number inside is 1.", win: "Three sums factored." },
    { say: "Rewrite these by yourself.", rows: [["42 + 14 =", "14(3 + 1)"], ["30 + 45 =", "15(2 + 3)"], ["48 + 60 =", "12(4 + 5)"]], extra: "15(2 + 45)|", trap: [1, "15(2 + 45)"] },
  ],
}));
