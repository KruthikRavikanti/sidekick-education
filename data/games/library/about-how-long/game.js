// About How Long?. Skill 2.MD.A.3-1.
// Benchmark lengths: familiar objects are sorted by whether they are about an inch, a foot or a meter, building a feel for unit sizes.
Sidekick.game(Sidekick.play({
  title: "About How Long?",
  emoji: "🤔",
  premise: "An inch, a foot and a meter each have things that are just about their size. Sort each thing by its best match.",
  outro: "A paper clip is about an inch. A ruler is a foot. A baseball bat is about a meter.",
  scene: "desk",
  kind: "sort",
  cast: "",
  hint: "An inch is about a paper clip. A foot is a ruler. A meter is a big step.",
  tag: "no_sense_of_unit_size",
  rounds: [
    { say: "About how long is each thing?", bins: "About 1 inch|About 1 foot", items: ["📎 paper clip|🪙 quarter", "📏 ruler|📄 sheet of paper"], trap: ["📎 paper clip", 1], why: "A paper clip is small. It is about 1 inch, not a whole foot.", win: "Small things are about an inch." },
    { say: "Now a meter joins in.", bins: "About 1 inch|About 1 foot|About 1 meter", items: ["🧢 bottle cap|📎 paper clip", "👟 grown-up shoe|📏 ruler", "🏏 baseball bat|🚪 width of a door"], trap: ["🏏 baseball bat", 1], why: "A bat is much longer than a ruler. It is about a meter.", win: "Inch, foot and meter." },
    { say: "Sort these by yourself.", bins: "About 1 inch|About 1 foot|About 1 meter", items: ["🪙 quarter|🧢 bottle cap", "📄 sheet of paper|🥖 short loaf of bread", "🎸 guitar|🚶 one giant step"], trap: ["🎸 guitar", 1] },
  ],
}));
