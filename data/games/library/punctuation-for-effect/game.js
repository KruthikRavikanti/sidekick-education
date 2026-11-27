// Punctuation for Effect. Skill L.4.3-2.
// Choosing punctuation for effect. Overusing exclamation points is the known slip.
Sidekick.game(Sidekick.play({
  title: "Punctuation for Effect",
  emoji: "❗",
  premise: "Punctuation changes how a sentence feels. Used with care, each mark has its own effect. Used too often, it loses its power.",
  outro: "Choose punctuation for effect. Save the exclamation point for real excitement.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "What feeling should the reader get from this sentence?",
  tag: "overuses_exclamation_points",
  rounds: [
    { say: "Which mark gives each sentence the right effect?", rows: [["We won the championship", "!"], ["The library opens at nine", "."], ["Did you hear that noise", "?"]], trap: [1, "!"], why: "Opening hours are not exciting. A period is right.", win: "Excitement, a plain fact, a question." },
    { say: "Which mark gives each sentence the right effect?", rows: [["Look out for that car", "!"], ["She slowly opened the door", "..."], ["My brother is seven", "."]], trap: [2, "!"], why: "An age is a plain fact. If every sentence shouts, none stands out.", win: "Alarm, suspense, and a plain fact." },
    { say: "Pick the marks by yourself.", rows: [["The volcano is erupting", "!"], ["Water boils at 100 degrees", "."], ["Where did everyone go", "?"], ["And then the lights went out", "..."]], trap: [1, "!"] },
  ],
}));
