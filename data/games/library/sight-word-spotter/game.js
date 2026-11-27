// Sight Word Spotter. Skill RF.K.3-3.
// Reading common high-frequency words by sight: the child finds every copy of a target word among look-alikes. Sounding out irregular words letter by letter is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sight Word Spotter",
  emoji: "🕶️",
  premise: "Some little words show up all the time. Spot them fast, just by how they look.",
  outro: "Sight words are read whole, in a snap.",
  scene: "city",
  kind: "pick",
  fs: 7,
  hint: "Look at the whole word, from the first letter to the last.",
  tag: "not_read_by_sight",
  rounds: [
    { say: "Tap every card that says the.", mark: "*the he then *the they *the", trap: "then", why: "That word has one more letter. It says then.", win: "You spotted the every time." },
    { say: "Tap every card that says you.", mark: "*you yes *you your yo *you", trap: "your", why: "That word has an r on the end. It says your.", win: "You spotted you every time." },
    { say: "Find the word by yourself.", alt: [{ say: "Tap every card that says she.", mark: "*she he *she the see *she", trap: "he" }, { say: "Tap every card that says my.", mark: "*my me *my by am *my", trap: "me" }] },
  ],
}));
