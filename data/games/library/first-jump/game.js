// First Jump. Skill 3.NF.A.2-1.
// Locating 1/b on a number line: the interval from 0 to 1 is split into b equal parts and 1/b is the end of the first part. Counting the tick at zero lands one part too far.
Sidekick.game(Sidekick.play({
  title: "First Jump",
  emoji: "🐞",
  premise: "The line from 0 to 1 is cut into equal parts. The ladybug takes one jump from zero to land on a unit fraction.",
  outro: "One jump of one equal part from 0 lands on the unit fraction.",
  scene: "meadow",
  kind: "line",
  cast: "",
  labels: "ends",
  icon: "🐞",
  hint: "Zero is the start. One jump takes you to the end of the first part.",
  tag: "counts_the_first_tick",
  rounds: [
    { say: "The line is cut into 4 equal parts. Slide the ladybug to {1/4}.", line: [0, 1, 0.25], fmt: "frac:4", ans: 0.25, trap: 0.5, why: "One fourth is the end of the first part, one jump from 0.", win: "One jump of four lands on one fourth." },
    { say: "The line is cut into 6 equal parts. Slide the ladybug to {1/6}.", line: [0, 1, 0.16666666666666666], fmt: "frac:6", ans: 0.16666666666666666, trap: 0.3333333333333333, why: "One sixth is the end of the first part, one jump from 0.", win: "One jump of six lands on one sixth." },
    { say: "Find the unit fraction by yourself.", alt: [{ say: "The line is cut into 3 equal parts. Slide the ladybug to {1/3}.", line: [0, 1, 0.3333333333333333], fmt: "frac:3", ans: 0.3333333333333333, trap: 0.6666666666666666 }, { say: "The line is cut into 8 equal parts. Slide the ladybug to {1/8}.", line: [0, 1, 0.125], fmt: "frac:8", ans: 0.125, trap: 0.25 }] },
  ],
}));
