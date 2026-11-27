// Same Amount, New Name. Skill 3.NF.A.3-1.
// Equivalent fractions are the same size: 2/4 covers exactly as much as 1/2. Judging by the bigger numbers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Amount, New Name",
  emoji: "🪞",
  premise: "Cut the same amount into smaller pieces and it gets a new name, but it is still the same amount.",
  outro: "Equivalent fractions name the same amount.",
  scene: "candy",
  kind: "sort",
  cast: "",
  hint: "Look at how much is shaded, not at how many pieces.",
  tag: "bigger_numbers_mean_more",
  rounds: [
    { say: "Is the shaded part the same amount as one half?", bins: "Same as {1/2}|Not the same", items: ["~bar:2/4 ~bar:3/6 ~pie:4/8", "~bar:1/4 ~bar:2/3 ~pie:3/4"], trap: ["~bar:2/4", 1], why: "Two fourths covers exactly half of the bar.", win: "Two fourths, three sixths and four eighths are all one half." },
    { say: "Is the shaded part the same amount as one third?", bins: "Same as {1/3}|Not the same", items: ["~bar:2/6 ~pie:2/6", "~bar:1/2 ~bar:2/4 ~pie:1/4"], trap: ["~bar:2/6", 1], why: "Two sixths covers exactly one third of the bar.", win: "Two sixths is one third." },
    { say: "Is the shaded part the same amount as one fourth?", bins: "Same as {1/4}|Not the same", items: ["~bar:2/8 ~pie:2/8 ~sq4:1/4", "~bar:2/4 ~pie:1/3 ~bar:1/8"], trap: ["~bar:2/8", 1] },
  ],
}));
