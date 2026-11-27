// Roots That Reveal. Skill L.7.4-2.
// Using Greek or Latin affixes and roots as clues to the meaning of a word. Ignoring roots is the known slip.
Sidekick.game(Sidekick.play({
  title: "Roots That Reveal",
  emoji: "🌳",
  premise: "A Latin or Greek root is a clue hiding inside a long word. Bell means war, so a belligerent person is ready to fight.",
  outro: "Roots unlock meaning: bell (war), bene (good), mal (bad).",
  scene: "forest",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "What do the two example words share in meaning?",
  tag: "ignores_roots",
  rounds: [
    { say: "What does each root mean?", rows: [["bell (belligerent, rebellion)", "war"], ["bene (benefit, benevolent)", "good"], ["mal (malfunction, malice)", "bad"]], extra: "small", trap: [0, "good"], why: "A rebellion is a fight. Bell means war.", win: "War, good, bad." },
    { say: "Use the roots. What does each word probably mean?", rows: [["bellicose", "eager to fight"], ["beneficial", "helpful"], ["malnourished", "badly fed"]], trap: [0, "helpful"], why: "Bell means war. A bellicose person wants a fight.", win: "Roots point to the meaning." },
    { say: "Match these by yourself.", rows: [["chron (chronic, chronology)", "time"], ["dict (dictate, predict)", "say"], ["spect (inspect, spectator)", "look"]], extra: "run", trap: [1, "look"] },
  ],
}));
