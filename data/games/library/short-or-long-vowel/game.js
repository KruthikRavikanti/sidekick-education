// Short or Long Vowel. Skill RF.K.3-2.
// Knowing long and short sounds for the five vowels: picture words are sorted by vowel sound. Using only the letter name for vowels is the known slip.
Sidekick.game(Sidekick.play({
  title: "Short or Long Vowel",
  emoji: "🎵",
  premise: "Vowels have two sounds. The long sound says the letter name, like the a in cake. The short sound is quick, like the a in cat.",
  outro: "A long vowel says its name. A short vowel makes a quick sound.",
  scene: "night",
  kind: "sort",
  fs: 5,
  hint: "Say the word. Do you hear the letter name in the middle?",
  tag: "uses_only_letter_name",
  rounds: [
    { say: "Say each word. Is the a short, like cat, or long, like cake?", bins: "Short a|Long a", items: ["🐱 cat|🎩 hat|🗺️ map", "🎂 cake|🌧️ rain|🐍 snake"], trap: ["🎩 hat", 1], why: "Hat has the quick a sound, like cat.", win: "Quick a and long a." },
    { say: "Now the letter i. Short like pig, or long like kite?", bins: "Short i|Long i", items: ["🐷 pig|🐟 fish|🫦 lip", "🪁 kite|🚲 bike|🍦 ice"], trap: ["🚲 bike", 0], why: "Bike says the name of the letter i. That is the long sound.", win: "Quick i and long i." },
    { say: "Sort the o words by yourself.", bins: "Short o|Long o", items: ["🐶 dog|🧦 sock|📦 box", "🦴 bone|⛵ boat|🌹 rose"], trap: ["🦴 bone", 0] },
  ],
}));
