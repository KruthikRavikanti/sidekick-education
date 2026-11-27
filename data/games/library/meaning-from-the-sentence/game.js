// Meaning From the Sentence. Skill L.11-12.4-1.
// Using context as a clue to the meaning of a word or phrase. Ignoring context is the known slip.
Sidekick.game(Sidekick.play({
  title: "Meaning From the Sentence",
  emoji: "🔦",
  premise: "Advanced texts are full of words you may not know. The sentence usually explains them, if you look at what surrounds them.",
  outro: "Use the overall meaning of a sentence or the word’s position as a clue to its meaning.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "What happens right after the hard word? That result explains it.",
  tag: "ignores_context",
  rounds: [
    { say: "Use the clues in each sentence.", read: "Her explanation was lucid; everyone understood. His reply was so equivocal that no one knew where he stood.", rows: [["lucid", "clear"], ["equivocal", "deliberately unclear"]], extra: "confusing|", trap: [0, "confusing"], why: "Everyone understood. So lucid must mean clear.", win: "The result reveals the word." },
    { say: "Use the clues.", read: "The ephemeral bloom lasted one morning. A ubiquitous weed, by contrast, grew in every yard on the street.", rows: [["ephemeral", "short-lived"], ["ubiquitous", "found everywhere"]], extra: "very rare|", trap: [1, "very rare"], why: "It grew in every yard. That is the opposite of rare.", win: "Example and contrast." },
    { say: "Use the clues by yourself.", read: "The laconic guide answered in single words. Her gregarious brother chatted with every stranger on the trail.", rows: [["laconic", "using few words"], ["gregarious", "sociable"]], extra: "talkative|shy", trap: [0, "talkative"] },
  ],
}));
