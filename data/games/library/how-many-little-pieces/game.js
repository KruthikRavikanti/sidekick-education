// How Many Little Pieces?. Skill 5.NF.B.7-2.
// Dividing a whole number by a unit fraction: 4 ÷ 1/5 = 20. Dividing 4 by 5 instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Many Little Pieces?",
  emoji: "🧩",
  premise: "4 ÷ one fifth asks: how many fifths are in 4 wholes? Every whole holds 5 of them.",
  outro: "Dividing by a unit fraction counts the pieces: multiply by the bottom number.",
  scene: "desk",
  kind: "type",
  icon: "🧩",
  hint: "How many of that small piece fit in ONE whole? Then count all the wholes.",
  tag: "divides_by_the_denominator",
  rounds: [
    { say: "Each whole is cut into fifths. Key in how many fifths are in 4 wholes.", fig: { type: "frac", den: 5, v: [20], wholes: 4 }, q: "4 ÷ {1/5}", ans: "20", trap: "4/5", why: "Fifths are small. Five of them fit in every whole.", win: "4 × 5 = 20 fifths." },
    { say: "Key in how many fourths are in 3 wholes.", q: "3 ÷ {1/4}", ans: "12", trap: "3/4", why: "Four fourths fit in each whole, and there are 3 wholes.", win: "3 × 4 = 12 fourths." },
    { say: "Key in the answer by yourself.", alt: [{ q: "5 ÷ {1/3}", ans: "15", trap: "5/3" }, { q: "2 ÷ {1/8}", ans: "16", trap: "2/8" }, { q: "6 ÷ {1/2}", ans: "12", trap: "3" }] },
  ],
}));
