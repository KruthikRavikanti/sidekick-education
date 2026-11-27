// Analogy and Allusion Effects. Skill RL.8.4-1.
// Analyzing the impact of specific word choices on meaning and tone, including analogies and allusions. Naming the device only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Analogy and Allusion Effects",
  emoji: "🗝️",
  premise: "Authors compare things or point to famous stories to add meaning quickly. Ask what the comparison brings with it.",
  outro: "Analyze how an analogy or allusion shapes meaning and tone.",
  scene: "night",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "What feeling or idea comes along with that comparison?",
  tag: "names_device_only",
  rounds: [
    { say: "What does each comparison add?", rows: [["The office was a beehive at dawn.", "busy, organized energy"], ["He guarded the secret like a dragon on its gold.", "fierce, greedy protection"]], extra: "a sweet taste|", trap: [0, "a sweet taste"], why: "The comparison is to the bees’ activity, not to honey.", win: "Busy like bees. Fierce like a dragon." },
    { say: "What does each allusion add?", rows: [["She had the patience of a saint.", "calm, admirable endurance"], ["Their friendship was a house of cards.", "something fragile and unsteady"]], extra: "a fun game night|", trap: [1, "a fun game night"], why: "A house of cards falls at a touch. It suggests fragility.", win: "Admiring, then uneasy." },
    { say: "Match these by yourself.", rows: [["The new rule opened a can of worms.", "unexpected tangled problems"], ["His voice was velvet.", "smooth and pleasing"]], extra: "a fishing trip|rough and scratchy", trap: [1, "rough and scratchy"] },
  ],
}));
