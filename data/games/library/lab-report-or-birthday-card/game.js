// Lab Report or Birthday Card. Skill W.5.4-1.
// Producing clear and coherent writing appropriate to task, purpose and audience. Using the same style for every task is the known slip.
Sidekick.game(Sidekick.play({
  title: "Lab Report or Birthday Card",
  emoji: "🎂",
  premise: "A lab report and a birthday card should not sound alike. Task, purpose and audience shape how you write.",
  outro: "Match development, organization and style to the task, purpose and audience.",
  scene: "candy",
  kind: "sort",
  hint: "What is the writing for, and who will read it?",
  tag: "same_style_for_everything",
  rounds: [
    { say: "Which piece of writing does each sentence belong in?", bins: "Lab report|Birthday card", items: ["The water boiled at 100 degrees.|We repeated the test three times.", "Hope your day is full of cake!|You are the best cousin ever."], trap: ["You are the best cousin ever.", 0], why: "That warm, personal tone belongs in a card.", win: "Different tasks, different styles." },
    { say: "Which piece does each sentence belong in?", bins: "News article|Diary entry", items: ["The council voted 5 to 2 on Tuesday.|Officials expect work to begin in May.", "I cannot believe what happened today.|I felt so nervous my hands shook."], trap: ["I felt so nervous my hands shook.", 0], why: "A diary is where private feelings go.", win: "Purpose shapes the style." },
    { say: "Sort these by yourself.", bins: "Instructions|Persuasive letter", items: ["First, attach the legs to the base.|Tighten each screw a quarter turn.", "I urge you to reconsider this plan.|Our community deserves better."], trap: ["I urge you to reconsider this plan.", 0] },
  ],
}));
