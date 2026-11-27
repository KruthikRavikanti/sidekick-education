// Fraction Hops. Skill 3.NF.A.2-2.
// Marking a/b on a number line by counting a lengths of 1/b from 0. Starting the count on the first mark instead of at zero lands one part short.
Sidekick.game(Sidekick.play({
  title: "Fraction Hops",
  emoji: "🦎",
  premise: "The lizard hops along the line one equal part at a time. Count the hops from zero to land on the fraction.",
  outro: "The top number tells how many hops. The bottom number tells how big each hop is.",
  scene: "sand",
  kind: "line",
  cast: "",
  labels: "ends",
  icon: "🦎",
  hint: "Start at 0. Each hop moves one part. Count the hops.",
  tag: "starts_counting_at_one",
  rounds: [
    { say: "The line is cut into fourths. Hop to {3/4}.", line: [0, 1, 0.25], fmt: "frac:4", ans: 0.75, trap: 0.5, why: "Three hops from 0: one fourth, two fourths, three fourths.", win: "Three hops of one fourth." },
    { say: "The line is cut into sixths. Hop to {5/6}.", line: [0, 1, 0.16666666666666666], fmt: "frac:6", ans: 0.8333333333333334, trap: 0.6666666666666666, why: "Count five hops, starting from 0.", win: "Five hops of one sixth." },
    { say: "Hop to the fraction by yourself.", alt: [{ say: "The line is cut into thirds. Hop to {2/3}.", line: [0, 1, 0.3333333333333333], fmt: "frac:3", ans: 0.6666666666666666, trap: 0.3333333333333333 }, { say: "The line is cut into eighths. Hop to {5/8}.", line: [0, 1, 0.125], fmt: "frac:8", ans: 0.625, trap: 0.5 }] },
  ],
}));
