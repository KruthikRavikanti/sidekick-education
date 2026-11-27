// How the Author Builds It. Skill RI.6.3-1.
// Analyzing how a key individual, event or idea is introduced, illustrated and elaborated. Listing the facts only is the known slip.
Sidekick.game(Sidekick.play({
  title: "How the Author Builds It",
  emoji: "🧰",
  premise: "Authors introduce and develop a person or idea with tools: an anecdote, an example, a statistic, a comparison.",
  outro: "Name the method: anecdote (a short story), example, statistic or comparison.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Is it a little story, a sample case, a number, or a likeness to something else?",
  tag: "lists_facts_only",
  rounds: [
    { say: "Which method does each sentence use?", rows: [["As a girl, Ada took apart the family clock to see how it worked.", "anecdote"], ["She filed 40 patents in ten years.", "statistic"]], extra: "comparison|", trap: [0, "statistic"], why: "There is no number here. It is a short story from her life.", win: "A story, then a number." },
    { say: "Which method does each sentence use?", rows: [["Her engine was like a loom that wove numbers.", "comparison"], ["For instance, one design sorted mail by size.", "example"]], extra: "statistic|", trap: [0, "example"], why: "The word like signals a comparison.", win: "A comparison and an example." },
    { say: "Match these by yourself.", rows: [["Nine out of ten seabirds have eaten plastic.", "statistic"], ["One morning a diver freed a seal from a net.", "anecdote"]], extra: "comparison|definition", trap: [1, "statistic"] },
  ],
}));
