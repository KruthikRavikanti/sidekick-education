// Two Jobs for Randomness. Skill S-IC.B.3-2.
// Explaining how randomization relates to surveys, experiments and observational studies. Thinking random sampling allows cause-and-effect conclusions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Jobs for Randomness",
  emoji: "🎲",
  premise: "Randomly choosing who is in a study and randomly assigning treatments are different tools with different powers.",
  outro: "Random sampling lets you generalize to the population. Random assignment lets you conclude cause.",
  scene: "paper",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Who gets picked: sampling. Who gets which treatment: assignment.",
  tag: "sampling_gives_cause",
  rounds: [
    { say: "Match each kind of randomness to what it allows.", rows: [["random sampling", "generalize to the whole population"], ["random assignment", "conclude cause and effect"]], extra: "remove every error|", trap: [0, "conclude cause and effect"], why: "A random sample is fair to the population, but nobody was assigned a treatment.", win: "Sampling generalizes. Assignment shows cause." },
    { say: "Can each study claim that coffee causes longer life?", kind: "sort", fs: 4.6, bins: "Can claim cause|Cannot", items: ["People are randomly assigned to drink coffee or not for years.|", "A random sample is surveyed about coffee habits.|Coffee drinkers at one office are observed."], trap: ["A random sample is surveyed about coffee habits.", 0], why: "Coffee drinkers may differ in other ways, such as income or exercise.", win: "Only random assignment supports cause." },
    { say: "Match these by yourself.", rows: [["A poll randomly picks 1,000 adults.", "results describe all adults"], ["Volunteers are randomly split into two diets.", "the diet caused the difference"]], extra: "results prove a cause for all adults|", trap: [0, "the diet caused the difference"] },
  ],
}));
