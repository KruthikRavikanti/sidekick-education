// Six Question Words. Skill RL.2.1-1.
// Answering who, what, where, when, why and how questions to show understanding of key details. Answering why with what happened is the known slip.
Sidekick.game(Sidekick.play({
  title: "Six Question Words",
  emoji: "🗝️",
  premise: "Who, what, where, when, why and how each ask for a different kind of answer. A why question needs a reason.",
  outro: "Match your answer to the question word. Why asks for a reason.",
  scene: "night",
  kind: "fill",
  cast: "",
  hint: "Why asks for a reason. Look for the because.",
  tag: "answers_why_with_what",
  rounds: [
    { say: "Read the story. Answer each question.", read: "Tia stayed up late to finish her card. She wanted it ready for her grandpa’s birthday.", rows: [["What did Tia do?", "finished a card"], ["Why did she do it?", "it was for a birthday"]], extra: "she went to bed|", trap: [1, "finished a card"], why: "That tells what she did. Why asks for her reason.", win: "What she did, and why." },
    { say: "Read this story. Answer each question.", read: "On Saturday, Omar found a lost dog in the park. He read its tag and called the owner.", rows: [["When did it happen?", "on Saturday"], ["How did he help?", "he called the owner"]], extra: "in the park|", trap: [0, "in the park"], why: "In the park tells where. When asks for a time.", win: "When, and how." },
    { say: "Read and answer by yourself.", read: "At night, Nell put a bowl of milk by the door. She hoped the stray cat would come back.", rows: [["Where was the milk?", "by the door"], ["Why did she put it there?", "so the cat would return"]], extra: "at night|a bowl of milk", trap: [1, "a bowl of milk"] },
  ],
}));
