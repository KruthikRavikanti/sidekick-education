// Words Plus Picture. Skill RL.2.7-1.
// Using information gained from illustrations and words to understand characters, setting or plot. Using only one of the two sources is the known slip.
Sidekick.game(Sidekick.play({
  title: "Words Plus Picture",
  emoji: "🏕️",
  premise: "The words tell part of the story and the picture tells another part. Put them together.",
  outro: "Use the words and the pictures together to understand a story.",
  scene: "forest",
  kind: "fill",
  cast: "",
  hint: "What do the words say? What does the picture add?",
  tag: "uses_one_source",
  rounds: [
    { say: "Read the words and look at the picture. What do you learn from each?", read: "Kai zipped up the tent and listened.", pic: "🏕️ 🌙 🦉", rows: [["From the words", "Kai is in a tent"], ["From the picture", "it is night in the woods"]], extra: "Kai is at school|", trap: [1, "Kai is in a tent"], why: "The words told you that. What does the picture add?", win: "A tent, at night, in the woods." },
    { say: "What do you learn from each?", read: "Rosa held on tight to the rope.", pic: "⛵ 🌊 🌧️", rows: [["From the words", "Rosa holds a rope"], ["From the picture", "she is on a boat in a storm"]], extra: "Rosa is asleep|", trap: [1, "Rosa holds a rope"], why: "The words told you that. Look at the picture for where she is.", win: "Words and picture together." },
    { say: "What do you learn from each? Work it out by yourself.", read: "Sam put on his boots and grabbed a shovel.", pic: "🏠 ❄️ ⛄", rows: [["From the words", "Sam has boots and a shovel"], ["From the picture", "there is deep snow outside"]], extra: "Sam is at the beach|it is a hot day", trap: [1, "Sam has boots and a shovel"] },
  ],
}));
