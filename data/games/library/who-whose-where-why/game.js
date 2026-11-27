// Who, Whose, Where, Why. Skill L.4.1-1.
// Using relative pronouns and relative adverbs. Using that for people and which at random is the known slip.
Sidekick.game(Sidekick.play({
  title: "Who, Whose, Where, Why",
  emoji: "🏅",
  premise: "Little linking words add detail about a noun. Who is for people, which is for things, where for places, whose for owners.",
  outro: "Use who for people, which or that for things, whose for ownership, where for places and why for reasons.",
  scene: "field",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Is the word before the blank a person, a thing, a place, or an owner?",
  tag: "mixes_relative_words",
  rounds: [
    { say: "Drop in the word that fits.", rows: [["The girl ___ won is my friend.", "who"], ["The book ___ I lost was new.", "which"]], extra: "where", trap: [0, "which"], why: "A girl is a person. People take who.", win: "Who for people, which for things." },
    { say: "Drop in these words.", rows: [["That is the park ___ we play.", "where"], ["The boy ___ dog ran off is sad.", "whose"], ["I know the reason ___ she left.", "why"]], trap: [1, "where"], why: "The dog belongs to the boy. Ownership takes whose.", win: "Where, whose and why." },
    { say: "Drop these in by yourself.", rows: [["The teacher ___ helped me smiled.", "who"], ["This is the town ___ I was born.", "where"], ["The girl ___ bike broke walked home.", "whose"]], extra: "which", trap: [0, "which"] },
  ],
}));
