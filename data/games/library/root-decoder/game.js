// Root Decoder. Skill L.6.4-2.
// Using common Greek or Latin affixes and roots as clues to the meaning of a word. Ignoring the roots is the known slip.
Sidekick.game(Sidekick.play({
  title: "Root Decoder",
  emoji: "🌿",
  premise: "Many English words are built from Greek and Latin roots. Learn one root and you unlock a whole family of words.",
  outro: "Roots carry meaning: aud means hear, vis means see, port means carry.",
  scene: "forest",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "What do the two example words have in common?",
  tag: "ignores_roots",
  rounds: [
    { say: "What does each root mean?", rows: [["aud (audience, auditory)", "hear"], ["vis (vision, visible)", "see"], ["port (transport, portable)", "carry"]], extra: "write", trap: [0, "see"], why: "An audience listens. Auditory is about hearing.", win: "Hear, see, carry." },
    { say: "What does each root mean?", rows: [["scrib (scribble, describe)", "write"], ["bio (biology, biography)", "life"], ["geo (geography, geology)", "earth"]], extra: "water", trap: [1, "earth"], why: "Biology studies living things. Bio means life.", win: "Write, life, earth." },
    { say: "Match these by yourself.", rows: [["tele (telephone, telescope)", "far"], ["therm (thermometer, thermal)", "heat"], ["graph (autograph, paragraph)", "write"]], extra: "small", trap: [0, "small"] },
  ],
}));
