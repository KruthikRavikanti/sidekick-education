// Had, Have, Will Have. Skill L.5.1-2.
// Forming and using the perfect verb tenses. Using simple past for everything is the known slip.
Sidekick.game(Sidekick.play({
  title: "Had, Have, Will Have",
  emoji: "🥾",
  premise: "Perfect tenses show an action finished before another time: I had walked, I have walked, I will have walked.",
  outro: "Perfect tenses use had, have or will have with the past participle.",
  scene: "forest",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Was it finished before another moment in the past, by now, or by a future time?",
  tag: "simple_past_for_everything",
  rounds: [
    { say: "Drop in the verb form that fits.", rows: [["By noon, I ___ five miles.", "had walked"], ["I ___ this trail many times.", "have walked"]], extra: "walked", trap: [0, "walked"], why: "It was finished before noon, an earlier point in the past. Use had walked.", win: "Had walked, have walked." },
    { say: "Drop in these forms.", rows: [["By next June, she ___ here ten years.", "will have lived"], ["Before the bell rang, we ___ lunch.", "had finished"], ["They ___ the museum twice so far.", "have visited"]], trap: [0, "have visited"], why: "Next June is in the future. Use will have.", win: "Future, past and present perfect." },
    { say: "Drop these in by yourself.", rows: [["When we arrived, the show ___.", "had started"], ["I ___ my homework already.", "have done"], ["By Friday, he ___ the whole book.", "will have read"]], extra: "started", trap: [0, "started"] },
  ],
}));
