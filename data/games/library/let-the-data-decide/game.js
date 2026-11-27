// Let the Data Decide. Skill 7.SP.C.7-2.
// Developing a probability model from observed frequencies. Ignoring the data and assuming equal chances is the known slip.
Sidekick.game(Sidekick.play({
  title: "Let the Data Decide",
  emoji: "🪙",
  premise: "Some things are not fair. For a bent coin or a lopsided spinner, build the probability model from what actually happened.",
  outro: "When outcomes are not equally likely, use observed frequencies as the probabilities.",
  scene: "desk",
  kind: "fill",
  fs: 6.4,
  cast: "",
  hint: "How many times out of 100 did it happen?",
  tag: "ignores_the_data",
  rounds: [
    { say: "A bent coin lands heads 60 times in 100 flips. Build the model.", rows: [["P(heads)", "0.6"], ["P(tails)", "0.4"]], extra: "0.5", trap: [0, "0.5"], why: "This coin is bent. The data says 60 out of 100.", win: "0.6 and 0.4. They add to 1." },
    { say: "In 100 spins: red 50, blue 30, green 20. Build the model.", rows: [["P(red)", "0.5"], ["P(blue)", "0.3"], ["P(green)", "0.2"]], extra: "0.33", trap: [1, "0.33"], why: "Three colors, but not equal chances. Blue came up 30 times in 100.", win: "0.5, 0.3 and 0.2." },
    { say: "A cone lands on its side 75 times and on its base 25 times. Build the model by yourself.", rows: [["P(side)", "0.75"], ["P(base)", "0.25"]], extra: "0.5 0.7", trap: [0, "0.5"] },
  ],
}));
