// Past One. Skill 3.NF.A.2-3.
// Placing fractions greater than 1 on the number line: 5/4 is one fourth past 1. Believing fractions are always less than 1 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Past One",
  emoji: "🪂",
  premise: "Fractions do not stop at 1. Keep hopping the same size parts and you sail right past it.",
  outro: "A fraction can be more than 1 when the top number is bigger than the bottom.",
  scene: "sky",
  kind: "line",
  cast: "",
  icon: "🪂",
  hint: "Count hops of one part from 0. Keep going past 1 if you need to.",
  tag: "fractions_stay_under_one",
  rounds: [
    { say: "Each part is one fourth. Slide to {5/4}.", line: [0, 2, 0.25, 4], fmt: "frac:4", ans: 1.25, trap: 0.25, why: "Five fourths is more than one whole. Count 5 hops of one fourth.", win: "Five fourths is one fourth past 1." },
    { say: "Each part is one third. Slide to {4/3}.", line: [0, 2, 0.3333333333333333, 3], fmt: "frac:3", ans: 1.3333333333333333, trap: 0.3333333333333333, why: "Four thirds is more than one whole. Count 4 hops of one third.", win: "Four thirds is one third past 1." },
    { say: "Slide to the fraction by yourself.", alt: [{ say: "Each part is one half. Slide to {5/2}.", line: [0, 3, 0.5, 2], fmt: "frac:2", ans: 2.5, trap: 0.5 }, { say: "Each part is one fourth. Slide to {7/4}.", line: [0, 2, 0.25, 4], fmt: "frac:4", ans: 1.75, trap: 0.75 }] },
  ],
}));
