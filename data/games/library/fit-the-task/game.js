// Fit the Task. Skill W.7.4-1.
// Producing writing appropriate to task, purpose and audience. Ignoring the audience is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fit the Task",
  emoji: "🧪",
  premise: "A lab report and a personal story need different kinds of writing. Let the task and the reader decide the style.",
  outro: "Match development, organization and style to the task, purpose and audience.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "What is this piece for? What does that reader need?",
  tag: "ignores_audience",
  rounds: [
    { say: "Which kind of writing does each line belong in?", bins: "Lab report|Personal story", items: ["Add 50 mL of water to the beaker.|The temperature rose 4 degrees in two minutes.", "My stomach flipped as the bus pulled away.|I will never forget that smell."], trap: ["My stomach flipped as the bus pulled away.", 0], why: "Feelings belong in a story. A lab report gives precise steps.", win: "Steps and measurements, or feelings and moments." },
    { say: "Sort these.", bins: "News article|Birthday card", items: ["The council voted 5 to 2 on Tuesday.|Officials expect the bridge to open in May.", "Hope your day is as great as you are!|Another year older and still the funniest."], trap: ["Hope your day is as great as you are!", 0], why: "A news article reports facts in a neutral voice.", win: "Purpose shapes the style." },
    { say: "Sort these by yourself.", bins: "Instructions|Poem", items: ["Step 2: Tighten the bolt clockwise.|Unplug the device before cleaning.", "The moon leans on the roof to listen.|Rain writes its name on the glass."], trap: ["The moon leans on the roof to listen.", 0] },
  ],
}));
