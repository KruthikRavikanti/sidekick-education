// Question Word Keys. Skill L.K.1-4.
// Understanding and using question words: each question word is matched to the kind of answer it asks for. Answering where with a time is the known slip.
Sidekick.game(Sidekick.play({
  title: "Question Word Keys",
  emoji: "🗝️",
  premise: "Each question word opens a different kind of answer. Who is for people, where is for places, when is for time.",
  outro: "Who asks about a person. Where asks about a place. When asks about a time.",
  scene: "night",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Think of the answer. Is it a person, a place or a time?",
  tag: "mixes_where_and_when",
  rounds: [
    { say: "Which question word asks for each thing?", rows: [["asks about a place", "where"], ["asks about a person", "who"], ["asks about a time", "when"]], extra: "why", trap: [0, "when"], why: "When asks about time. Where asks about a place.", win: "Where, who and when." },
    { say: "Pick the question word for each answer.", rows: [["___ is it? At the park.", "Where"], ["___ is it? My mom.", "Who"], ["___ is it? After lunch.", "When"]], extra: "How", trap: [2, "Where"], why: "After lunch is a time. That needs When.", win: "A place, a person and a time." },
    { say: "Pick the question word by yourself.", rows: [["___ is the cat? Under the bed.", "Where"], ["___ made this? Dad did.", "Who"], ["___ do we go? In the morning.", "When"], ["___ are you sad? I lost my hat.", "Why"]], trap: [0, "When"] },
  ],
}));
