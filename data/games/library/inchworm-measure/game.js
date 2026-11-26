// Inchworm Measure. Skill 1.MD.A.2-2.
// Counting units to give a length: the units are already laid end to end and the child counts them. Counting the marks at the ends as well gives one too many.
Sidekick.game(Sidekick.play({
  title: "Inchworm Measure",
  emoji: "🐛",
  premise: "The inchworms have lined up under each thing. Count the worms to say how long it is.",
  outro: "The length is the number of units, not the number of lines between them.",
  scene: "meadow",
  kind: "type",
  icon: "🐛",
  hint: "Count each block once. Each block is one unit.",
  tag: "counts_the_marks",
  rounds: [
    { say: "How many units long is the crayon? Key it in.", fig: { type: "units", len: 5, icon: "🖍️", v: [5] }, ans: 5, trap: 6, why: "Count the blocks, not the lines at their edges.", win: "5 units long." },
    { say: "How many units long is the comb?", fig: { type: "units", len: 7, icon: "🪮", v: [7] }, ans: 7, trap: 8, why: "Count the blocks, not the lines at their edges.", win: "7 units long." },
    { say: "Count the units by yourself.", alt: [{ fig: { type: "units", len: 6, icon: "📕", v: [6] }, ans: 6, trap: 7 }, { fig: { type: "units", len: 8, icon: "🥖", v: [8] }, ans: 8, trap: 9 }, { fig: { type: "units", len: 4, icon: "🧦", v: [4] }, ans: 4, trap: 5 }] },
  ],
}));
