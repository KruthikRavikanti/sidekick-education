// Adding Endings. Skill L.3.2-5.
// Using conventional spelling for adding suffixes to base words (sitting, smiled, cries). Forgetting to double the consonant is the known slip.
Sidekick.game(Sidekick.play({
  title: "Adding Endings",
  emoji: "🏃",
  premise: "Adding -ing or -ed can change the base word. Some double the last letter, some drop an e, some change y to i.",
  outro: "Double the consonant after a short vowel, drop a silent e, and change y to i before -ed.",
  scene: "field",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Does the base end in one vowel and one consonant? In silent e? In y?",
  tag: "forgets_to_double",
  rounds: [
    { say: "Add -ing to each word.", rows: [["sit", "sitting"], ["smile", "smiling"], ["jump", "jumping"]], extra: "siting smileing", trap: [0, "siting"], why: "Sit has a short vowel and one consonant. Double the t.", win: "Sitting, smiling, jumping." },
    { say: "Add -ed to each word.", rows: [["hop", "hopped"], ["hope", "hoped"], ["cry", "cried"]], extra: "cryed", trap: [2, "cryed"], why: "Change the y to i before adding -ed.", win: "Hopped, hoped, cried." },
    { say: "Add the endings by yourself.", rows: [["run + ing", "running"], ["bake + ing", "baking"], ["try + ed", "tried"], ["stop + ed", "stopped"]], extra: "runing stoped", trap: [0, "runing"] },
  ],
}));
