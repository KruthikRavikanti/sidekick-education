// American Voices, Shared Themes. Skill RL.11-12.9-1.
// Demonstrating knowledge of foundational works of American literature, including how two texts from the same period treat similar themes. Summarizing instead of comparing is the known slip.
Sidekick.game(Sidekick.play({
  title: "American Voices, Shared Themes",
  emoji: "🗽",
  premise: "Foundational American writers kept returning to the same questions: the self, freedom, nature. Each answered in a different key.",
  outro: "Compare how two foundational American works from the same period treat similar themes.",
  scene: "paper",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Same theme, different treatment. What does each writer stress?",
  tag: "summarizes_instead",
  rounds: [
    { say: "Both wrote on freedom from slavery in the 1800s. Match each work to its treatment.", rows: [["Douglass, Narrative", "literacy as the road to freedom"], ["Jacobs, Incidents", "a mother’s fight for her children"]], extra: "freedom as an easy gift|", trap: [0, "freedom as an easy gift"], why: "Neither treats freedom as easy. Douglass ties it to learning to read.", win: "One theme, two angles." },
    { say: "Both wrote on the individual in the 1840s and 1850s. Match each.", rows: [["Emerson, Self-Reliance", "trust your own mind over custom"], ["Thoreau, Walden", "test that idea by living simply in the woods"]], extra: "follow the crowd|", trap: [1, "follow the crowd"], why: "Both resist the crowd. Thoreau puts the idea into practice at the pond.", win: "Essay and experiment." },
    { say: "Both poets wrote in the 1800s about the self and death. Match by yourself.", rows: [["Whitman", "long, sweeping lines that embrace everyone"], ["Dickinson", "short, compressed lines that turn inward"]], extra: "strict rhymed couplets|", trap: [0, "strict rhymed couplets"] },
  ],
}));
