// Tricky Word Spotter. Skill RF.1.3-7.
// Recognizing and reading grade-appropriate irregularly spelled words. Trying to sound out irregular words is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tricky Word Spotter",
  emoji: "🦉",
  premise: "Some words do not follow the rules. You cannot sound them out, so learn how they look.",
  outro: "Tricky words like said and was are read whole, by sight.",
  scene: "night",
  kind: "pick",
  fs: 7,
  hint: "Look at every letter, in order.",
  tag: "sounds_out_irregular_words",
  rounds: [
    { say: "Tap every card that says said.", mark: "*said sad *said side sand *said", trap: "sad", why: "That word has only three letters. It says sad.", win: "You spotted said every time." },
    { say: "Tap every card that says was.", mark: "*was saw *was wash as *was", trap: "saw", why: "Those are the same letters turned around. That one says saw.", win: "You spotted was every time." },
    { say: "Find the word by yourself.", alt: [{ say: "Tap every card that says they.", mark: "*they them *they then the *they", trap: "them" }, { say: "Tap every card that says come.", mark: "*come cone *come came comb *come", trap: "came" }, { say: "Tap every card that says what.", mark: "*what want *what that when *what", trap: "want" }] },
  ],
}));
