// One Answer From Arcsin. Skill F-TF.B.6-1.
// Understanding that restricting a trigonometric function to a domain on which it is one-to-one allows its inverse to be constructed. Giving many outputs for arcsin is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Answer From Arcsin",
  emoji: "🎚️",
  premise: "Many angles share the same sine. For arcsin to be a function it must pick just one, so its outputs are limited to a set range.",
  outro: "arcsin gives angles from −90° to 90°. arccos gives 0° to 180°. arctan gives between −90° and 90°.",
  scene: "night",
  kind: "type",
  icon: "🎚️",
  unit: "°",
  hint: "Pick the angle that lies inside the allowed range.",
  tag: "many_outputs",
  rounds: [
    { say: "Match each inverse function to its range of outputs.", kind: "fill", fs: 5.4, cast: "", unit: "", rows: [["arcsin", "−90° to 90°"], ["arccos", "0° to 180°"]], extra: "0° to 360°|", trap: [0, "0° to 360°"], why: "In a full turn most sines appear twice. The range must hold each value only once.", win: "Each output appears exactly once." },
    { say: "sin 30° and sin 150° are both 0.5. Key in arcsin(0.5).", ans: 30, trap: 150, why: "150° is outside the range of arcsin, which stops at 90°.", win: "Only 30° lies between −90° and 90°." },
    { say: "Find the value by yourself. Use ± if you need it.", alt: [{ q: "arccos(0), where cos 90° = 0 and cos 270° = 0", ans: 90, trap: 270 }, { q: "arctan(1), where tan 45° = 1 and tan 225° = 1", ans: 45, trap: 225 }, { q: "arcsin(−1), where sin 270° = −1 and sin(−90°) = −1", ans: -90, trap: 270 }] },
  ],
}));
