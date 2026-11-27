// Describe in Depth. Skill RL.4.3-1.
// Describing a character in depth, drawing on specific details such as thoughts, words or actions. Giving general descriptions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Describe in Depth",
  emoji: "🎨",
  premise: "A deep description uses what a character thinks, says and does. A shallow one just says nice or mean.",
  outro: "Describe characters with specific details: their thoughts, words and actions.",
  scene: "night",
  kind: "sort",
  hint: "Does it point to something exact in the story, or is it a general label?",
  tag: "general_description",
  rounds: [
    { say: "Which descriptions are specific and which are general?", bins: "Specific detail|General label", items: ["She gave her coat to a shivering stranger.|She said, \"Take mine, I have another.\"", "She is nice.|She is a good person."], trap: ["She is nice.", 0], why: "Nice is a label. What did she DO that shows it?", win: "Specific details show the character." },
    { say: "Sort these descriptions.", bins: "Specific detail|General label", items: ["He checked the lock three times.|He thought, \"What if they find out?\"", "He is nervous.|He is kind of weird."], trap: ["He is nervous.", 0], why: "That is a label. The details that show it are more powerful.", win: "Thoughts and actions go deeper." },
    { say: "Sort these by yourself.", bins: "Specific detail|General label", items: ["She practiced until her fingers bled.|She told herself, \"One more time.\"", "She works hard.|She is great."], trap: ["She works hard.", 0] },
  ],
}));
