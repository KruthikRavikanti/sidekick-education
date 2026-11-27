// Blend Builder. Skill RF.1.2-2.
// Blending sounds into words that include consonant blends. Dropping the second consonant of the blend (fog for frog) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Blend Builder",
  emoji: "🐸",
  premise: "Some words start with two consonants that slide together, like fr in frog. Say both sounds.",
  outro: "In a blend you hear both consonant sounds: f and r in frog.",
  scene: "meadow",
  kind: "fill",
  fs: 7,
  cast: "",
  hint: "Say the first two sounds slowly, one after the other.",
  tag: "drops_second_consonant",
  rounds: [
    { say: "Give each picture its word.", rows: [["🐸", "frog"], ["🌫️", "fog"]], extra: "fig", trap: [0, "fog"], why: "Frog has an r after the f. Say it: f-r-og.", win: "Frog has both sounds: f and r." },
    { say: "Match these.", rows: [["👏", "clap"], ["🧢", "cap"]], extra: "lap", trap: [0, "cap"], why: "Clap has an l after the c. Say it: c-l-ap.", win: "Clap and cap." },
    { say: "Match these by yourself.", rows: [["🐌", "snail"], ["⛵", "sail"], ["🥄", "spoon"]], extra: "soon nail", trap: [0, "sail"] },
  ],
}));
