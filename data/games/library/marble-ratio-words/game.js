// Marble Ratio Words. Skill 6.RP.A.1-1.
// Describing a ratio relationship in words. Treating a ratio as a fraction of the whole is the known slip.
Sidekick.game(Sidekick.play({
  title: "Marble Ratio Words",
  emoji: "🔴",
  premise: "A ratio compares two amounts. 3 red to 2 blue means for every 3 red marbles there are 2 blue ones.",
  outro: "A ratio compares one quantity with another, in a stated order.",
  scene: "candy",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Say it in order: the first thing named comes first in the ratio.",
  tag: "ratio_as_fraction_of_whole",
  rounds: [
    { say: "Describe each comparison.", pic: "🔴🔴🔴🔵🔵", rows: [["red to blue", "3 to 2"], ["blue to red", "2 to 3"]], extra: "3 to 5|", trap: [0, "3 to 5"], why: "5 is all the marbles. Red to blue compares 3 red with 2 blue.", win: "3 to 2, and 2 to 3." },
    { say: "Finish each sentence about the pets.", pic: "🐶🐶🐶🐶🐱🐱🐱", rows: [["For every 4 dogs there are", "3 cats"], ["The ratio of cats to dogs is", "3 to 4"]], extra: "4 to 7|7 cats", trap: [1, "4 to 7"], why: "7 is all the pets. Cats to dogs compares 3 with 4.", win: "3 cats for every 4 dogs." },
    { say: "Describe these by yourself.", pic: "🍎🍎🍎🍎🍎🍐🍐", rows: [["apples to pears", "5 to 2"], ["pears to apples", "2 to 5"], ["For every 2 pears there are", "5 apples"]], extra: "5 to 7|", trap: [0, "5 to 7"] },
  ],
}));
