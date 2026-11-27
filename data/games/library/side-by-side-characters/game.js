// Side by Side Characters. Skill RL.5.3-1.
// Comparing and contrasting two characters drawing on specific details. Describing each separately is the known slip.
Sidekick.game(Sidekick.play({
  title: "Side by Side Characters",
  emoji: "⚖️",
  premise: "Comparing means looking at two characters together: where are they alike, and where do they differ?",
  outro: "Compare and contrast characters using specific details from the text.",
  scene: "forest",
  kind: "sort",
  hint: "Is that detail true of both, or of just one?",
  tag: "describes_separately",
  rounds: [
    { say: "Read the story. Sort the details.", read: "When the bridge washed out, Maya searched for another way across. Her brother Finn sat down and waited for help. Both of them wanted to reach the village by dark.", bins: "Both|Only Maya|Only Finn", items: ["wants to reach the village|", "looks for another way|", "waits for help|"], trap: ["wants to reach the village", 1], why: "The story says both of them wanted that.", win: "Same goal, different responses." },
    { say: "Read this story. Sort the details.", read: "Both captains faced the same storm. Captain Reed turned back to port. Captain Sol sailed straight through it.", bins: "Both|Only Reed|Only Sol", items: ["faces the storm|", "turns back|", "sails through|"], trap: ["sails through", 1], why: "Sol is the one who sailed through.", win: "Compared side by side." },
    { say: "Sort these by yourself.", read: "Ana and Ben both lost the election. Ana congratulated the winner. Ben refused to shake hands.", bins: "Both|Only Ana|Only Ben", items: ["loses the election|", "congratulates the winner|", "refuses to shake hands|"], trap: ["loses the election", 1] },
  ],
}));
