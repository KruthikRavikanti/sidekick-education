// Read and Find. Skill RF.K.4-1.
// Reading emergent-reader texts with purpose and understanding: a short decodable text is followed by a question answered from the words. Guessing without reading is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read and Find",
  emoji: "🔎",
  premise: "Read the little story, then find the answer. The words on the page tell you everything you need.",
  outro: "Read the words to find out what happened.",
  scene: "meadow",
  kind: "pick",
  fs: 5.2,
  hint: "Read the story again, one word at a time.",
  tag: "guesses_without_reading",
  rounds: [
    { say: "Read the story. Tap what the dog got.", read: "A dog ran to the park. It got a ball.", yes: "⚽ ball|", no: "🦴 bone|🧢 cap|🍎 apple", trap: "🦴 bone", why: "Read it again. The story says it got a ball.", win: "The dog got a ball." },
    { say: "Read the story. Tap the hat Sam has.", read: "Sam has a red hat. Pam has a tan hat.", yes: "🔴 red hat|", no: "🟤 tan hat|🟢 green hat|🟡 yellow hat", trap: "🟤 tan hat", why: "Pam has the tan hat. Read what Sam has.", win: "Sam has a red hat." },
    { say: "Read the story by yourself. Tap where the hen is.", read: "The pig is in the mud. The hen is on the box.", yes: "📦 on the box|", no: "🟤 in the mud|🛏️ on the bed|🌳 in the tree|🪣 in the pail|🚗 in the car", trap: "🟤 in the mud" },
  ],
}));
