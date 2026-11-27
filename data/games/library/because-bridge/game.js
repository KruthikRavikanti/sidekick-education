// Because Bridge. Skill L.1.6-1.
// Using words acquired through reading and conversation, including frequently occurring conjunctions to signal simple relationships such as because.
Sidekick.game(Sidekick.play({
  title: "Because Bridge",
  emoji: "🧥",
  premise: "The word because builds a bridge from what happened to why it happened.",
  outro: "Use because to connect an action to its reason.",
  scene: "snow",
  kind: "fill",
  cast: "",
  hint: "Which ending tells WHY?",
  tag: "no_reason_after_because",
  rounds: [
    { say: "Finish each sentence with a reason.", rows: [["I wore my coat because", "it was cold"], ["We stayed inside because", "it was raining"]], extra: "my coat is blue|", trap: [0, "my coat is blue"], why: "Blue does not tell why you put the coat on.", win: "Each because has a reason." },
    { say: "Finish these with a reason.", rows: [["She went to bed because", "she was sleepy"], ["He got a drink because", "he was thirsty"]], extra: "she has a bed|", trap: [0, "she has a bed"], why: "Having a bed is not why she went to it.", win: "Sleepy and thirsty are the reasons." },
    { say: "Finish these by yourself.", rows: [["The plant grew because", "it got sun and water"], ["I laughed because", "the joke was funny"], ["We ran because", "we were late"]], extra: "plants are green|", trap: [0, "plants are green"] },
  ],
}));
