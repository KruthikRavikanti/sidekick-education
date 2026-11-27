// Why and How Questions. Skill RL.1.1-2.
// Asking questions about key details in a text. Asking only yes-or-no questions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Why and How Questions",
  emoji: "🦊",
  premise: "Some questions only get a yes or a no. Why and how questions make you think more about the story.",
  outro: "Ask why and how questions to understand a story more deeply.",
  scene: "forest",
  kind: "sort",
  hint: "Could you answer it with just yes or no?",
  tag: "asks_only_yes_no",
  rounds: [
    { say: "Read the story. Sort the questions.", read: "The fox hid in a log until the dogs went away.", bins: "Why or how|Yes or no", items: ["Why did the fox hide?|How did he know they left?", "Is the fox red?|Did he run?"], trap: ["Did he run?", 0], why: "You can answer that with yes or no.", win: "Why and how questions dig deeper." },
    { say: "Read this story. Sort the questions.", read: "Mia gave her last cookie to a new girl at lunch.", bins: "Why or how|Yes or no", items: ["Why did Mia share?|How did the new girl feel?", "Was it lunch time?|Did Mia have a cookie?"], trap: ["Was it lunch time?", 0], why: "That one only needs a yes or a no.", win: "You found the thinking questions." },
    { say: "Sort these by yourself.", read: "The little bird fell from the nest, but it did not give up.", bins: "Why or how|Yes or no", items: ["How did the bird get back?|Why did it not give up?", "Did the bird fall?|Is it a little bird?"], trap: ["Did the bird fall?", 0] },
  ],
}));
