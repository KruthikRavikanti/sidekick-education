// Tiptoe, Walk, March. Skill L.K.5-4.
// Distinguishing shades of meaning among verbs describing the same general action. Treating the verbs as the same is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tiptoe, Walk, March",
  emoji: "🥁",
  premise: "Some words mean almost the same thing, but not quite. Tiptoe, walk and march are three ways to move.",
  outro: "Words that are close in meaning can be a little weaker or a little stronger.",
  scene: "field",
  kind: "row",
  hint: "Act each one out. Which is the smallest? Which is the biggest?",
  tag: "treats_verbs_as_same",
  rounds: [
    { say: "Put the moves in order from slowest to fastest.", seq: "🐌 crawl|🚶 walk|🏃 run", trap: "🚶 walk|🐌 crawl|🏃 run", why: "Crawling on hands and knees is the slowest.", win: "Crawl, walk, run." },
    { say: "Match each move to how you do it.", kind: "fill", cast: "", rows: [["walk very quietly on your toes", "tiptoe"], ["walk with big strong steps", "march"], ["walk in a slow, sleepy way", "plod"]], extra: "hop", trap: [0, "march"], why: "Marching is loud. Quiet toes is tiptoe.", win: "Three kinds of walking." },
    { say: "Put the sounds in order from quietest to loudest.", seq: "🤫 whisper|🗣️ talk|📢 shout", trap: "🗣️ talk|🤫 whisper|📢 shout" },
  ],
}));
