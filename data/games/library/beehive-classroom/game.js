// Beehive Classroom. Skill L.5.5-1.
// Interpreting figurative language, including similes and metaphors, in context. Reading it literally is the known slip.
Sidekick.game(Sidekick.play({
  title: "Beehive Classroom",
  emoji: "🐝",
  premise: "Figurative language says one thing and means another. A classroom called a beehive is busy, not full of bees.",
  outro: "Interpret similes and metaphors from their context.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "What quality does the writer want to borrow from the comparison?",
  tag: "reads_literally",
  rounds: [
    { say: "What does each one mean?", rows: [["The classroom was a beehive of activity.", "everyone was busy"], ["Her voice was like velvet.", "her voice was smooth and soft"]], extra: "bees were inside|", trap: [0, "bees were inside"], why: "No real bees. The writer borrows the busyness of a hive.", win: "Busy, and smooth." },
    { say: "What does each one mean?", rows: [["The news hit him like a truck.", "it shocked him badly"], ["Her memory is a steel trap.", "she forgets nothing"], ["The city never sleeps.", "it is always active"]], trap: [1, "it is always active"], why: "A steel trap holds on tight. So does her memory.", win: "Shock, memory, and constant activity." },
    { say: "Work these out by yourself.", rows: [["His room was a disaster area.", "it was very messy"], ["She swims like a fish.", "she swims very well"], ["Fear froze him in place.", "he was too scared to move"]], extra: "it was cold|", trap: [2, "it was cold"] },
  ],
}));
