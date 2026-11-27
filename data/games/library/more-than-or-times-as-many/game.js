// More Than or Times As Many?. Skill 4.OA.A.2-3.
// Telling multiplicative from additive comparison: each story is sorted by the operation it needs. Using the same operation for both is the known slip.
Sidekick.game(Sidekick.play({
  title: "More Than or Times As Many?",
  emoji: "🆚",
  premise: "Five more and five times as many sound alike but are very different. Decide which operation each story needs.",
  outro: "More than means add. Times as many means multiply.",
  scene: "paper",
  kind: "sort",
  hint: "Listen for the words: more than, or times as many?",
  tag: "same_operation_for_both",
  rounds: [
    { say: "Which operation does each story need?", bins: "Add|Multiply", items: ["Ana has 5 more than Ben, who has 8.|A rope is 3 feet longer than a 9 foot rope.", "Ana has 5 times as many as Ben, who has 8.|A rope is 3 times as long as a 9 foot rope."], trap: ["Ana has 5 times as many as Ben, who has 8.", 0], why: "Times as many means 5 copies of 8. Multiply.", win: "More than adds. Times as many multiplies." },
    { say: "Sort these stories.", bins: "Add|Multiply", items: ["A dog is 4 pounds heavier than a 6 pound cat.|Jo scored 2 more points than Al, who scored 7.", "A dog weighs 4 times as much as a 6 pound cat.|Jo scored twice as many points as Al, who scored 7."], trap: ["Jo scored twice as many points as Al, who scored 7.", 0], why: "Twice as many means 2 times as many. Multiply.", win: "You heard the difference." },
    { say: "Sort these by yourself.", bins: "Add|Multiply", items: ["Liv is 6 years older than her 3 year old brother.|A pine is 10 feet taller than a 5 foot bush.", "Liv is 6 times as old as her 3 year old brother.|A pine is 10 times as tall as a 5 foot bush."], trap: ["Liv is 6 times as old as her 3 year old brother.", 0] },
  ],
}));
