// Pick the Medium. Skill RI.8.7-1.
// Evaluating the advantages and disadvantages of using different mediums to present a topic or idea. Stating preferences only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pick the Medium",
  emoji: "📺",
  premise: "Print, video and audio each do some jobs well and others badly. Choose by what the topic needs.",
  outro: "Evaluate the advantages and disadvantages of each medium for presenting a topic.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "What can this medium do that the other cannot?",
  tag: "states_preferences_only",
  rounds: [
    { say: "Topic: how to tie a climbing knot. Which medium has each advantage?", bins: "Video|Printed article", items: ["shows the hand movements in motion|lets you hear the instructor’s tips", "can be reread at your own pace|easy to skim for one step"], trap: ["can be reread at your own pace", 0], why: "Print stays still. You control the speed without rewinding.", win: "Video shows motion. Print is easy to revisit." },
    { say: "Topic: the history of a long war. Sort the advantages.", bins: "Documentary film|Book", items: ["real footage and voices of people there|music and images create strong feeling", "room for far more detail|footnotes show the sources"], trap: ["footnotes show the sources", 0], why: "Footnotes are a print feature.", win: "Film moves you. Books go deeper." },
    { say: "Topic: a new song’s meaning. Sort by yourself.", bins: "Audio|Printed lyrics", items: ["you hear the singer’s emotion|the melody carries the mood", "you can study each word|easy to quote exactly"], trap: ["you can study each word", 0] },
  ],
}));
