// Word in the World. Skill L.K.5-3.
// Identifying real-life connections between words and their use: things that are soft, loud or cold. Not being able to use the word in context is the known slip.
Sidekick.game(Sidekick.play({
  title: "Word in the World",
  emoji: "🧸",
  premise: "A describing word fits lots of real things. Find the things around you that it fits.",
  outro: "A word comes alive when you connect it to real things you know.",
  scene: "candy",
  kind: "pick",
  fs: 5,
  hint: "Think about touching it, or hearing it.",
  tag: "cannot_connect_word",
  rounds: [
    { say: "Tap the things that are soft.", yes: "🧸 teddy bear|🛏️ pillow|🐱 kitten", no: "🪨 rock|🔨 hammer|🧱 brick", trap: "🪨 rock", why: "A rock is hard when you touch it.", win: "Soft things feel nice to hug." },
    { say: "Tap the things that are loud.", yes: "🥁 drum|🚒 fire truck|⚡ thunder", no: "🪶 feather|🐌 snail|🧦 sock", trap: "🪶 feather", why: "A feather makes no sound at all.", win: "Loud things are easy to hear." },
    { say: "Tap the things that are cold, by yourself.", yes: "🧊 ice|⛄ snowman|🍦 ice cream", no: "🔥 fire|☀️ sun|🍲 hot soup", trap: "🍲 hot soup" },
  ],
}));
