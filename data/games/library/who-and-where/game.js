// Who and Where. Skill RL.K.3-1.
// Identifying characters and settings in a story. Confusing the setting with a character is the known slip.
Sidekick.game(Sidekick.play({
  title: "Who and Where",
  emoji: "🏰",
  premise: "Characters are who the story is about. The setting is where and when the story happens.",
  outro: "Characters are the people or animals. The setting is the place and time.",
  scene: "night",
  kind: "sort",
  fs: 5,
  hint: "Is it a someone, or is it a place?",
  tag: "confuses_setting_with_character",
  rounds: [
    { say: "Is it a character or a setting?", bins: "Character|Setting", items: ["🐻 a bear|👧 a girl", "🌲 a forest|🏫 a school"], trap: ["🌲 a forest", 0], why: "A forest is a place where the story happens. That makes it a setting.", win: "Who, and where." },
    { say: "Sort these.", bins: "Character|Setting", items: ["🐉 a dragon|👑 a king|🐭 a mouse", "🏰 a castle|🌙 at night"], trap: ["🌙 at night", 0], why: "Night is when the story happens. It is part of the setting.", win: "Characters and settings." },
    { say: "Sort these by yourself.", bins: "Character|Setting", items: ["🦊 a fox|👦 a boy|🐸 a frog", "🏖️ a beach|🌧️ a rainy day|🏠 a house"], trap: ["🌧️ a rainy day", 0] },
  ],
}));
