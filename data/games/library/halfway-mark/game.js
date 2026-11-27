// Halfway Mark. Skill 4.NF.A.2-2.
// Comparing fractions with the benchmark one half: the numerator is compared with half the denominator.
Sidekick.game(Sidekick.play({
  title: "Halfway Mark",
  emoji: "🚩",
  premise: "One half is a handy landmark. Decide whether each fraction falls short of it or goes past it.",
  outro: "Compare the top number with half of the bottom number to see which side of one half a fraction is on.",
  scene: "field",
  kind: "sort",
  fs: 6,
  cast: "",
  hint: "Half of the bottom number is the halfway point. Is the top number more or less than that?",
  tag: "no_sense_of_fraction_size",
  rounds: [
    { say: "Is each fraction less than or more than one half?", bins: "Less than {1/2}|More than {1/2}", items: ["{3/8} {2/5} {1/3}", "{4/7} {5/8} {3/4}"], trap: ["{4/7}", 0], why: "Half of 7 is 3 and a half. Four is more than that.", win: "You used one half as a landmark." },
    { say: "Sort these.", bins: "Less than {1/2}|More than {1/2}", items: ["{2/6} {4/10} {3/7}", "{5/9} {7/12} {2/3}"], trap: ["{5/9}", 0], why: "Half of 9 is 4 and a half. Five is more than that.", win: "Sorted around one half." },
    { say: "Sort these by yourself.", bins: "Less than {1/2}|More than {1/2}", items: ["{5/12} {3/10} {4/9}", "{6/11} {5/8} {7/10}"], trap: ["{6/11}", 0] },
  ],
}));
