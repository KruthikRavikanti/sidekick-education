// First Letter Fishing. Skill RF.K.3-1.
// Knowing the most common sound for each consonant: each picture is matched to the letter of its first sound.
Sidekick.game(Sidekick.play({
  title: "First Letter Fishing",
  emoji: "🎣",
  premise: "Each picture word starts with one sound. Catch the letter that makes that first sound.",
  outro: "Each consonant letter stands for a sound you hear in words.",
  scene: "ocean",
  kind: "fill",
  fs: 8,
  cast: "",
  hint: "Say the word. What sound comes out first?",
  tag: "letter_sound_mismatch",
  rounds: [
    { say: "Give each picture the letter it starts with.", rows: [["🌙", "m"], ["☀️", "s"], ["🐢", "t"]], extra: "b f", trap: [0, "s"], why: "Moon starts with mmm. That is the letter m.", win: "M for moon, s for sun, t for turtle." },
    { say: "Match these pictures.", rows: [["🐻", "b"], ["🐟", "f"], ["🦁", "l"]], extra: "p m", trap: [0, "p"], why: "Bear starts with b. Feel your lips pop with your voice on.", win: "B for bear, f for fish, l for lion." },
    { say: "Match these by yourself.", rows: [["🐶", "d"], ["🐷", "p"], ["🌈", "r"], ["🥕", "c"]], extra: "b", trap: [0, "b"] },
  ],
}));
