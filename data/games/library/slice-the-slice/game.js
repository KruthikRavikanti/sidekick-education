// Slice the Slice. Skill 5.NF.B.7-1.
// Dividing a unit fraction by a whole number: 1/3 ÷ 4 = 1/12. Expecting the answer to be bigger is the known slip.
Sidekick.game(Sidekick.play({
  title: "Slice the Slice",
  emoji: "🍰",
  premise: "Share one third of a cake among 4 friends. Each piece is a slice of a slice, so it is smaller.",
  outro: "Dividing a unit fraction by a whole number makes smaller pieces: multiply the bottom number.",
  scene: "kitchen",
  kind: "type",
  icon: "🍰",
  hint: "Each piece is cut into more pieces. The pieces get smaller.",
  tag: "expects_a_bigger_answer",
  rounds: [
    { say: "The top bar shows {1/3}. Cut it into 4 equal pieces. Key in the size of one piece.", fig: { type: "frac", ref: [1, 3], den: 12, v: [1] }, q: "{1/3} ÷ 4", ans: "1/12", trap: "4/3", why: "Sharing makes each piece smaller than one third.", win: "Each piece is one twelfth." },
    { say: "Key in the size of one piece.", q: "{1/2} ÷ 5", ans: "1/10", trap: "5/2", why: "Half a cake shared by 5 gives small pieces, not more than a whole cake.", win: "Each piece is one tenth." },
    { say: "Key in the answer by yourself.", alt: [{ q: "{1/4} ÷ 3", ans: "1/12", trap: "3/4" }, { q: "{1/5} ÷ 2", ans: "1/10", trap: "2/5" }, { q: "{1/6} ÷ 3", ans: "1/18", trap: "3/6" }] },
  ],
}));
