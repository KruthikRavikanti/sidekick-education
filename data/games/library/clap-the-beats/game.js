// Clap the Beats. Skill RF.K.2-2.
// Counting syllables in spoken words: the child says the word for a picture and sets one clap per syllable. Clapping once per word is the known slip.
Sidekick.game(Sidekick.play({
  title: "Clap the Beats",
  emoji: "👏",
  premise: "Words have beats. Say the word slowly and clap once for each beat you hear.",
  outro: "Each beat in a word is a syllable. Clap them to count them.",
  scene: "meadow",
  kind: "dial",
  cast: "",
  dials: [["Claps", 0, 6]],
  view: { type: "mix", icons: "👏" },
  hint: "Say it slowly. Your chin drops once for each beat.",
  tag: "one_clap_per_word",
  rounds: [
    { say: "Say banana slowly. Set one clap for each beat.", pic: "🍌", ans: [3], trap: [1], why: "Ba, na, na. That is three beats, not one.", win: "Ba-na-na has three beats." },
    { say: "Say turtle slowly. Set one clap for each beat.", pic: "🐢", ans: [2], trap: [1], why: "Tur, tle. That is two beats.", win: "Tur-tle has two beats." },
    { say: "Say the word and clap its beats by yourself.", alt: [{ say: "Say butterfly. Set one clap for each beat.", pic: "🦋", ans: [3], trap: [1] }, { say: "Say watermelon. Set one clap for each beat.", pic: "🍉", ans: [4], trap: [1] }, { say: "Say sandwich. Set one clap for each beat.", pic: "🥪", ans: [2], trap: [1] }] },
  ],
}));
