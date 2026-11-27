// Cozy Spots. Skill L.1.5-3.
// Identifying real-life connections between words and their use: places at home that are cozy. Not being able to give examples is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cozy Spots",
  emoji: "🛋️",
  premise: "A word means more when you link it to real places and things you know.",
  outro: "Connect a word to real things in your life to understand it.",
  scene: "night",
  kind: "pick",
  fs: 5,
  hint: "Picture being there. Is it warm, soft and snug?",
  tag: "cannot_give_examples",
  rounds: [
    { say: "Tap the places that are cozy.", yes: "🛏️ my bed|🛋️ the sofa|🔥 by the fire", no: "🧊 an ice rink|🚿 a cold shower|🌧️ out in the rain", trap: "🧊 an ice rink", why: "Cozy means warm and snug. An ice rink is cold.", win: "Warm, soft and snug." },
    { say: "Tap the things that are noisy.", yes: "🚂 a train|🎺 a trumpet|🐕 a barking dog", no: "🐟 a fish|📖 a book|🧸 a teddy bear", trap: "📖 a book", why: "A book sits quietly. Noisy things are loud.", win: "Noisy things are loud." },
    { say: "Tap the things that are slippery, by yourself.", yes: "🧼 wet soap|🧊 ice|🍌 a banana peel", no: "🧱 a brick|🪵 a log|🧶 wool", trap: "🧶 wool" },
  ],
}));
