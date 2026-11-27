// Sound Effects in Verse. Skill RL.7.4-1.
// Analyzing the impact of rhymes and other repetitions of sounds on a section of a poem or story. Naming devices without their effect is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sound Effects in Verse",
  emoji: "🥁",
  premise: "Poets choose words for their sounds. Repeated sounds can hush a line, speed it up or make it pound.",
  outro: "Name the sound device and its effect: soft repeated s sounds hush, hard repeated sounds hit.",
  scene: "night",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Say the line aloud. Does it sound soft, harsh, fast or slow?",
  tag: "device_without_effect",
  rounds: [
    { say: "What effect do the repeated sounds create?", rows: [["The sea sighs softly on the sand.", "a hushed, calm mood"], ["Drums beat, boots stomp, doors bang.", "a loud, pounding mood"]], extra: "a funny mood|", trap: [0, "a loud, pounding mood"], why: "The repeated s is soft, like a whisper.", win: "Soft s sounds calm. Hard b and d sounds pound." },
    { say: "Tap the four words that repeat the same beginning sound.", kind: "pick", fs: 5.6, mark: "The *wild *wind *whipped the *waves all night.", trap: "night.", why: "Night does not begin with the w sound.", win: "The repeated w sounds like rushing wind." },
    { say: "Match these by yourself.", rows: [["Slowly the slow snow settles.", "slow and quiet"], ["Crack! Clatter! Crash went the cart.", "sudden and noisy"]], extra: "warm and sunny|sad and lonely", trap: [1, "slow and quiet"] },
  ],
}));
