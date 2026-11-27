// Same Sound Hunt. Skill RF.K.2-4.
// Isolating initial, medial and final sounds in simple words: pictures are matched by a shared sound. Matching by letter name instead of sound is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Sound Hunt",
  emoji: "👂",
  premise: "Say each picture word out loud and listen. Which ones start, or end, with the same sound?",
  outro: "Listen for the sound, not the letter. Kite and cat start with the same sound.",
  scene: "forest",
  kind: "pick",
  fs: 5,
  hint: "Say both words. Do your lips and tongue start the same way?",
  tag: "uses_letter_not_sound",
  rounds: [
    { say: "Tap every picture that starts with the same sound as monkey.", pic: "🐒", yes: "🌙 moon|🗺️ map|🥛 milk", no: "🐶 dog|☀️ sun|🐟 fish", trap: "☀️ sun", why: "Sun starts with a sss sound. Monkey starts with mmm.", win: "Moon, map and milk all start with mmm." },
    { say: "Tap every picture that ends with the same sound as cat.", pic: "🐱", yes: "🦇 bat|🎩 hat|🥜 nut", no: "🐕 dog|🐝 bee|🚌 bus", trap: "🚌 bus", why: "Bus ends with sss. Cat ends with a t sound.", win: "Bat, hat and nut end like cat." },
    { say: "Tap every picture that starts with the same sound as cat.", pic: "🐱", yes: "🪁 kite|🥕 carrot|🔑 key", no: "🧀 cheese|🐟 fish|🌙 moon", trap: "-🪁 kite" },
  ],
}));
