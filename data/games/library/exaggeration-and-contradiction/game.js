// Exaggeration and Contradiction. Skill L.11-12.5-1.
// Interpreting figures of speech such as hyperbole and paradox in context and analyzing their role. Missing them is the known slip.
Sidekick.game(Sidekick.play({
  title: "Exaggeration and Contradiction",
  emoji: "🎪",
  premise: "Hyperbole stretches the truth for effect. A paradox seems to contradict itself yet points at something true.",
  outro: "Hyperbole: deliberate exaggeration. Paradox: an apparent contradiction that reveals a truth.",
  scene: "night",
  kind: "sort",
  fs: 4.6,
  hint: "Is it an impossible amount, or two ideas that seem to cancel out?",
  tag: "misses_figure",
  rounds: [
    { say: "Hyperbole or paradox?", bins: "Hyperbole|Paradox", items: ["I have told you a million times.|This bag weighs a ton.", "Less is more.|The only constant is change."], trap: ["Less is more.", 0], why: "Less and more seem to contradict, yet together they say simplicity works.", win: "Stretch, or seeming contradiction." },
    { say: "What truth does each one point to?", kind: "fill", fs: 4.4, cast: "", rows: [["Less is more.", "simplicity can be stronger"], ["I must be cruel to be kind.", "harsh help can be caring"], ["I waited forever.", "the wait felt very long"]], extra: "time stopped|", trap: [2, "time stopped"], why: "Forever is exaggeration. It means the wait felt long.", win: "Read for the truth underneath." },
    { say: "Sort these by yourself.", bins: "Hyperbole|Paradox", items: ["My feet are killing me.|He has a heart the size of Texas.", "The more you know, the less you understand.|You must lose yourself to find yourself."], trap: ["You must lose yourself to find yourself.", 0] },
  ],
}));
