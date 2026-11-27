// Know Your Audience. Skill W.11-12.1-2.
// Developing claims and counterclaims fairly and thoroughly in a way that anticipates the audience’s knowledge level, concerns, values and possible biases. Writing one-sidedly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Know Your Audience",
  emoji: "👥",
  premise: "A thorough argument anticipates its readers: what they already know, what worries them, what they value.",
  outro: "Develop claims and counterclaims thoroughly, anticipating the audience’s knowledge, concerns, values and biases.",
  scene: "city",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "What would this particular reader worry about first?",
  tag: "one_sided",
  rounds: [
    { say: "You argue for a later school start. Match each audience to the concern you must address.", rows: [["taxpayers", "what new bus routes will cost"], ["coaches", "less daylight for practice"], ["families", "care before the later bell"]], extra: "nothing at all|", trap: [0, "nothing at all"], why: "Every audience has a concern. Taxpayers will ask about cost.", win: "Meet each reader’s worry." },
    { say: "Which sentences anticipate the reader?", kind: "sort", fs: 4.2, bins: "Anticipates the reader|Ignores the reader", items: ["Coaches may fear lost practice time; lights solve that.|Readers new to this debate need one term defined.", "Anyone who objects is not paying attention.|The benefits are obvious to everybody."], trap: ["The benefits are obvious to everybody.", 0], why: "If they were obvious, no argument would be needed. Name the doubt and answer it.", win: "Raise their objection before they do." },
    { say: "You argue for a city bike lane. Match by yourself.", rows: [["shop owners", "losing parking out front"], ["drivers", "a narrower road"], ["cyclists", "whether the lane is protected"]], extra: "the color of the paint|", trap: [0, "the color of the paint"] },
  ],
}));
