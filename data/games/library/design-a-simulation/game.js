// Design a Simulation. Skill 7.SP.C.8-3.
// Designing and using a simulation to generate frequencies for compound events. Running too few trials is the known slip.
Sidekick.game(Sidekick.play({
  title: "Design a Simulation",
  emoji: "🌧️",
  premise: "A simulation acts out a chance situation with coins, dice or spinners. Run it many times to estimate a probability.",
  outro: "Pick a tool with the right chances, define one trial, and repeat many times.",
  scene: "sky",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Does the tool have the same chance as the real thing? Did you repeat enough?",
  tag: "too_few_trials",
  rounds: [
    { say: "Rain has a 50% chance on each of 2 days. Plan the simulation.", rows: [["tool for one day", "flip a coin"], ["one trial", "flip twice"], ["how many trials", "many, like 100"]], extra: "just 2|", trap: [2, "just 2"], why: "A couple of trials can be flukes. Many trials show the pattern.", win: "Coin, two flips, many trials." },
    { say: "A player makes 1 of every 6 shots. Plan the simulation.", rows: [["tool for one shot", "roll a die"], ["a made shot", "rolling a 1"], ["to estimate, repeat", "many times"]], extra: "flip a coin|", trap: [0, "flip a coin"], why: "A coin gives 1 in 2. A die gives 1 in 6.", win: "The tool matches the chance." },
    { say: "Each cereal box has 1 of 4 toys, all equally likely. Plan it by yourself.", rows: [["tool for one box", "a 4-part spinner"], ["one trial", "spin until all 4 show"], ["how many trials", "dozens or more"]], extra: "a coin|only once", trap: [2, "only once"] },
  ],
}));
