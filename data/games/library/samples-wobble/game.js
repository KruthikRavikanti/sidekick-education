// Samples Wobble. Skill 7.SP.A.2-2.
// Generating multiple samples to gauge the variation in estimates. Expecting every sample to match exactly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Samples Wobble",
  emoji: "🎲",
  premise: "Two random samples from the same population rarely match exactly. A little wobble is normal and expected.",
  outro: "Random samples vary. Several samples show how much an estimate can wobble.",
  scene: "candy",
  kind: "sort",
  fs: 4.6,
  hint: "Would you expect two handfuls from the same bag to be exactly the same?",
  tag: "expects_identical_samples",
  rounds: [
    { say: "Read the note. True or not true?", q: "Two random samples of 40 students: 10 walkers, then 13 walkers", bins: "True|Not true", items: ["Samples vary a little|Both suggest about a quarter walk", "One sample must be a mistake|Every sample should match exactly"], trap: ["One sample must be a mistake", 0], why: "Different students were picked each time. Small differences are normal.", win: "Samples wobble a little." },
    { say: "True or not true?", q: "Five samples of 20 marbles give 6, 7, 5, 8 and 6 reds", bins: "True|Not true", items: ["About 6 of 20 are red|More samples show the usual range", "The bag changes each time|Only the 8 is correct"], trap: ["The bag changes each time", 0], why: "The bag is the same. The handful is what changes.", win: "The estimate is about 6 in 20." },
    { say: "Sort these by yourself.", q: "Three samples of 50 voters: 21, 19 and 24 say yes", bins: "True|Not true", items: ["About 40% say yes|Small differences are expected", "The samples disagree, so none can be used|The next sample will be exactly 21"], trap: ["The next sample will be exactly 21", 0] },
  ],
}));
