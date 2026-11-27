// Distance From Zero. Skill 6.NS.C.7-3.
// Understanding the absolute value of a rational number as its distance from 0 on the number line. Treating absolute value as a rule with no meaning is the known slip.
Sidekick.game(Sidekick.play({
  title: "Distance From Zero",
  emoji: "📏",
  premise: "Absolute value asks one thing: how far is this number from zero? A distance is never negative.",
  outro: "The absolute value of a number is its distance from 0, so it is never negative.",
  scene: "paper",
  kind: "type",
  icon: "📏",
  hint: "Count the steps from 0 to the number.",
  tag: "absolute_value_without_meaning",
  rounds: [
    { say: "How far is −8 from 0? Key in the absolute value.", fig: { type: "numline", line: [-10, 2, 1], pts: [[-8, "−8"], [0, "0"]], v: [] }, q: "|−8|", ans: 8, trap: -8, why: "Distance cannot be negative. Count the steps from 0 to −8.", win: "−8 is 8 steps from 0." },
    { say: "Key in the absolute value.", q: "|5|", ans: 5, trap: -5, why: "5 is already 5 steps from 0. Distance stays positive.", win: "|5| = 5." },
    { say: "Key in the absolute value by yourself.", alt: [{ q: "|−12|", ans: "12", trap: "-12" }, { q: "|−3.5|", ans: "3.5", trap: "-3.5" }, { q: "|−40|", ans: "40", trap: "-40" }] },
  ],
}));
