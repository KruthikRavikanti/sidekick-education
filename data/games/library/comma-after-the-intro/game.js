// Comma After the Intro. Skill L.5.2-2.
// Using a comma to separate an introductory element from the rest of the sentence. Leaving it out is the known slip.
Sidekick.game(Sidekick.play({
  title: "Comma After the Intro",
  emoji: "🍕",
  premise: "When a sentence opens with a phrase that sets the scene, a comma separates it from the main part.",
  outro: "Put a comma after an introductory word, phrase or clause.",
  scene: "kitchen",
  kind: "pick",
  fs: 5.4,
  hint: "Where does the opening phrase end and the main sentence begin?",
  tag: "leaves_out_comma",
  rounds: [
    { say: "Tap the spot where the comma belongs.", mark: ["After", ",", "the game", "*,", "we ate", ",", "pizza."], trap: ",", why: "The opening phrase is After the game. The comma goes at its end.", win: "After the game, we ate pizza." },
    { say: "Tap the spot where the comma belongs.", mark: ["When the", ",", "bell rang", "*,", "everyone", ",", "lined up."], trap: ",", why: "The opening clause is When the bell rang. The comma follows it.", win: "When the bell rang, everyone lined up." },
    { say: "Tap the comma spot by yourself.", alt: [{ mark: ["In the", ",", "morning", "*,", "the fog", ",", "lifted."], trap: "," }, { mark: ["Before", ",", "you leave", "*,", "lock", ",", "the door."], trap: "," }] },
  ],
}));
