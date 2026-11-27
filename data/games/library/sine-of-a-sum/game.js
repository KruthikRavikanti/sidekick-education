// Sine of a Sum. Skill F-TF.C.9-1.
// Proving and using the addition and subtraction formulas for sine, cosine and tangent. Thinking sin(a + b) = sin a + sin b is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sine of a Sum",
  emoji: "➕",
  premise: "The sine of a sum is not the sum of the sines. It mixes sines and cosines of both angles.",
  outro: "sin(a + b) = sin a cos b + cos a sin b. cos(a + b) = cos a cos b − sin a sin b.",
  scene: "paper",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Sine mixes: sin cos plus cos sin. Cosine keeps pairs: cos cos minus sin sin.",
  tag: "sine_distributes",
  rounds: [
    { say: "Match each formula.", rows: [["sin(a + b)", "sin a cos b + cos a sin b"], ["cos(a + b)", "cos a cos b − sin a sin b"]], extra: "sin a + sin b|", trap: [0, "sin a + sin b"], why: "Test it: sin 30° + sin 60° is about 1.37, but sin 90° is 1.", win: "Sine mixes. Cosine pairs up." },
    { say: "Key in sin(30° + 60°).", kind: "type", icon: "➕", q: "sin 30° = 0.5 · sin 60° ≈ 0.87 · sin 90° = 1", ans: "1", trap: "1.37", why: "That added the two sines. 30° + 60° is 90°, and sin 90° is 1.", win: "sin 90° = 1. Sines do not simply add." },
    { say: "Put the steps for sin 75° in order by yourself.", kind: "row", fs: 4.6, seq: "sin 75° = sin(45° + 30°)|= sin 45° cos 30° + cos 45° sin 30°|= {√2/2} · {√3/2} + {√2/2} · {1/2}|= {√6 + √2/4}", trap: "sin 75° = sin(45° + 30°)|= {√2/2} · {√3/2} + {√2/2} · {1/2}|= sin 45° cos 30° + cos 45° sin 30°|= {√6 + √2/4}" },
  ],
}));
