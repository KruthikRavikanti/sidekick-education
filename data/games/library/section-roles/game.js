// Section Roles. Skill RI.7.5-1.
// Analyzing the structure an author uses to organize a text, including how the major sections contribute to the whole. Describing the sections only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Section Roles",
  emoji: "🗃️",
  premise: "An article is organized on purpose. Each section does a job for the whole: the problem, the causes, the solutions.",
  outro: "Explain how each major section contributes to the whole text.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What does this section do for the article’s main point?",
  tag: "describes_sections_only",
  rounds: [
    { say: "An article has three sections. What does each do?", rows: [["“Rivers Running Dry”", "presents the problem"], ["“Why the Water Is Vanishing”", "explains the causes"], ["“What Cities Can Do”", "offers solutions"]], trap: [1, "presents the problem"], why: "The word Why in the heading signals causes.", win: "Problem, causes, solutions." },
    { say: "What does each section do?", rows: [["“A Day in 1850”", "gives background"], ["“Then Came the Telegraph”", "introduces the change"], ["“A Smaller World”", "shows the effects"]], trap: [0, "shows the effects"], why: "A day in 1850 shows how things were before the change.", win: "Before, change, after." },
    { say: "Match these by yourself.", rows: [["“Two Kinds of Batteries”", "compares options"], ["“Which Should You Choose?”", "draws a conclusion"]], extra: "tells a story|gives background", trap: [0, "draws a conclusion"] },
  ],
}));
