// Letter Partners. Skill RF.K.1-4.
// Naming upper- and lowercase letters by matching each uppercase letter to its lowercase form. Confusing b with d and p with q is the known slip.
Sidekick.game(Sidekick.play({
  title: "Letter Partners",
  emoji: "🔤",
  premise: "Every big letter has a small partner. Some small letters look alike, so check which way they face.",
  outro: "Each uppercase letter has a lowercase partner. Watch b, d, p and q.",
  scene: "candy",
  kind: "fill",
  fs: 8,
  pSize: 8,
  cast: "",
  hint: "Look at which side the round part is on.",
  tag: "confuses_b_d_p_q",
  rounds: [
    { say: "Give each big letter its small partner.", rows: [["B", "b"], ["D", "d"], ["P", "p"]], extra: "q", trap: [0, "d"], why: "Small b has its round part on the right, like big B.", win: "B with b, D with d, P with p." },
    { say: "Match these letters.", rows: [["Q", "q"], ["M", "m"], ["W", "w"]], extra: "p n", trap: [0, "p"], why: "Small q has its round part on the left.", win: "Q with q, M with m, W with w." },
    { say: "Match these by yourself.", rows: [["D", "d"], ["B", "b"], ["Q", "q"], ["P", "p"]], trap: [0, "b"] },
  ],
}));
