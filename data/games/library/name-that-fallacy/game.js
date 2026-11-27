// Name That Fallacy. Skill RI.9-10.8-1.
// Evaluating an argument, assessing its reasoning and evidence, and identifying false statements and fallacious reasoning. Accepting fallacies is the known slip.
Sidekick.game(Sidekick.play({
  title: "Name That Fallacy",
  emoji: "🕳️",
  premise: "A fallacy is reasoning that sounds persuasive but does not hold. Learn their names and they lose their power.",
  outro: "Evaluate an argument by checking its reasoning and evidence, and name any fallacy you find.",
  scene: "city",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Does it attack a person, follow the crowd, or offer only two choices?",
  tag: "accepts_fallacies",
  rounds: [
    { say: "Match each argument to its flaw.", rows: [["Do not trust her study. She dresses oddly.", "attacks the person"], ["Everyone is buying it, so it must be good.", "bandwagon"], ["Either ban all cars or accept dirty air.", "false choice"]], extra: "sound reasoning|", trap: [1, "sound reasoning"], why: "Popularity is not proof. Many people can be mistaken together.", win: "Person, crowd, false choice." },
    { say: "Match each flaw to an argument that has it.", fs: 4.4, rows: [["false cause", "I wore lucky socks and we won, so the socks did it."], ["slippery slope", "Allow one late pass and soon nobody will come."], ["hasty generalization", "One cousin got sick, so everyone will."]], trap: [0, "One cousin got sick, so everyone will."], why: "That one jumps from a single case to everyone. The socks claim mistakes timing for cause.", win: "Cause, slope, one-case rule." },
    { say: "Match these by yourself.", fs: 4.4, rows: [["You are too young to have an opinion.", "attacks the person"], ["Nine of ten players wear them, so they are best.", "bandwagon"], ["It rained after the parade was planned, so parades bring rain.", "false cause"]], extra: "sound reasoning|", trap: [2, "sound reasoning"] },
  ],
}));
