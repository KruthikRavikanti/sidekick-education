// Who Is Reading?. Skill W.6.4-1.
// Producing writing in which development, organization and style suit the task, purpose and audience. Using the same style everywhere is the known slip.
Sidekick.game(Sidekick.play({
  title: "Who Is Reading?",
  emoji: "📱",
  premise: "The same message sounds different in an email to a teacher and a text to a friend. Match the style to the reader.",
  outro: "Style depends on task, purpose and audience: formal for a teacher, casual for a friend.",
  scene: "city",
  kind: "sort",
  fs: 4.6,
  hint: "Who will read it? Would you say it that way to them?",
  tag: "same_style_everywhere",
  rounds: [
    { say: "Where does each line belong?", bins: "Email to a teacher|Text to a friend", items: ["Dear Ms. Ortiz, may I have one more day for my project?|Thank you for your time.", "omg can u send the hw|lol same"], trap: ["omg can u send the hw", 0], why: "Shortcuts like omg and u are for friends, not a teacher.", win: "Formal for teachers, casual for friends." },
    { say: "Sort these.", bins: "Email to a teacher|Text to a friend", items: ["I was absent on Monday and would like the notes.|Sincerely, Dev Shah", "meet at the park at 4?|that test was wild"], trap: ["that test was wild", 0], why: "Wild is slang. An email to a teacher uses plain, polite words.", win: "Greeting, full sentences, sign-off." },
    { say: "Sort these by yourself.", bins: "Letter to the mayor|Note to a teammate", items: ["Our neighborhood would benefit from a crosswalk.|I respectfully ask the council to consider it.", "nice goal today!!|bring the extra ball ok"], trap: ["nice goal today!!", 0] },
  ],
}));
