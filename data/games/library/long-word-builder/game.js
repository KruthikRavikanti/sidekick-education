// Long Word Builder. Skill RF.3.3-3.
// Decoding multisyllable words. Skipping the middle syllables is the known slip.
Sidekick.game(Sidekick.play({
  title: "Long Word Builder",
  emoji: "🏗️",
  premise: "A long word is easy when you take it one syllable at a time. Do not skip the middle.",
  outro: "Read every syllable of a long word in order, including the middle ones.",
  scene: "city",
  kind: "row",
  fs: 6.4,
  hint: "Clap the word. How many beats? Put a part down for each one.",
  tag: "skips_middle_syllables",
  rounds: [
    { say: "Build the word fantastic from its syllables.", seq: "fan tas tic", extra: "ter", trap: "fan ter tic", why: "Say it slowly: fan-tas-tic. The middle part is tas.", win: "Fan, tas, tic." },
    { say: "Build the word remember.", seq: "re mem ber", extra: "num", trap: "re num ber", why: "Say it slowly: re-mem-ber. The middle part is mem.", win: "Re, mem, ber." },
    { say: "Build the word by yourself.", alt: [{ say: "Build the word important by yourself.", seq: "im por tant", extra: "pen", trap: "im pen tant" }, { say: "Build the word September by yourself.", seq: "Sep tem ber", extra: "num", trap: "Sep num ber" }, { say: "Build the word wonderful by yourself.", seq: "won der ful", extra: "ter", trap: "won ter ful" }] },
  ],
}));
