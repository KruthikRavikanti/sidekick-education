// Weigh the Reasoning. Skill RI.11-12.8-1.
// Delineating and evaluating the reasoning in seminal US texts, including the application of constitutional principles and legal reasoning. Summarizing instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Weigh the Reasoning",
  emoji: "⚖️",
  premise: "Founding texts and court opinions argue from principles. Reading them well means testing whether the reasoning holds.",
  outro: "Evaluate reasoning in seminal US texts by naming the principle and checking how the conclusion follows.",
  scene: "paper",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Which principle is being applied? Does the conclusion follow from it?",
  tag: "summarizes_instead",
  rounds: [
    { say: "Match each constitutional principle to its meaning.", rows: [["separation of powers", "three branches with different jobs"], ["checks and balances", "each branch can limit the others"], ["judicial review", "courts can strike down laws"]], trap: [0, "each branch can limit the others"], why: "That is checks and balances. Separation is about dividing the jobs.", win: "Divide, limit, review." },
    { say: "Is each argument reasoning from principle, or a bare assertion?", kind: "sort", fs: 4.2, bins: "Reasoned|Bare assertion", items: ["This law limits speech, which the First Amendment forbids.|An earlier case settled this question, so it applies.", "The law is bad because I say so.|Everyone knows it is unconstitutional."], trap: ["Everyone knows it is unconstitutional.", 0], why: "No principle or precedent is given. It is only a claim.", win: "Principle, then conclusion." },
    { say: "Match each legal idea by yourself.", rows: [["precedent", "an earlier ruling guides later ones"], ["majority opinion", "the court’s official reasoning"], ["dissent", "a judge’s reasons for disagreeing"]], extra: "a new law|", trap: [2, "a new law"] },
  ],
}));
