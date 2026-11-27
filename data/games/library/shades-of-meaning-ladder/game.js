// Shades of Meaning Ladder. Skill L.7.5-3.
// Distinguishing among the connotations of words with similar denotations. Treating such words as interchangeable is the known slip.
Sidekick.game(Sidekick.play({
  title: "Shades of Meaning Ladder",
  emoji: "🪜",
  premise: "Words that mean almost the same thing differ in strength and feeling. Line them up from mildest to strongest.",
  outro: "Related words carry different shades: damp is milder than soaked, and polite is plainer than diplomatic.",
  scene: "city",
  kind: "row",
  fs: 5.6,
  hint: "Which word is the mildest? Which goes the furthest?",
  tag: "interchanges_words",
  rounds: [
    { say: "Order these from mildest to strongest.", seq: "damp wet soaked drenched", trap: "wet damp soaked drenched", why: "Damp is only slightly wet. It comes first.", win: "Damp, wet, soaked, drenched." },
    { say: "Positive or negative feeling?", kind: "sort", fs: 5.4, bins: "Positive|Negative", items: ["diplomatic|refined|respectful", "sneaky|snobbish|bossy"], trap: ["snobbish", 0], why: "Snobbish suggests looking down on others. Refined is the kind version.", win: "Similar meanings, different feelings." },
    { say: "Order these from mildest to strongest by yourself.", alt: [{ seq: "annoyed angry furious", trap: "angry annoyed furious" }, { seq: "chilly cold freezing", trap: "cold chilly freezing" }, { seq: "like love adore", trap: "love like adore" }] },
  ],
}));
