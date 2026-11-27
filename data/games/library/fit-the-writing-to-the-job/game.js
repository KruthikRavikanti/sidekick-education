// Fit the Writing to the Job. Skill W.9-10.4-1.
// Producing clear and coherent writing appropriate to task, purpose and audience. Ignoring the audience is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fit the Writing to the Job",
  emoji: "🧥",
  premise: "A college essay and a lab report are both good writing, in completely different clothes. The task and reader decide the style.",
  outro: "Match development, organization and style to the task, purpose and audience.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Who will read this, and what do they need from it?",
  tag: "ignores_audience",
  rounds: [
    { say: "Which piece of writing does each sentence belong in?", bins: "College essay|Lab report", items: ["Fixing bikes that summer taught me patience.|I had never been trusted with anything before.", "The solution turned blue after 30 seconds.|Mass was recorded to the nearest 0.1 gram."], trap: ["Fixing bikes that summer taught me patience.", 1], why: "A lab report records what was measured. Personal growth belongs in the essay.", win: "Personal voice, or precise record." },
    { say: "Match each task to the style it needs.", kind: "fill", fs: 4.4, cast: "", rows: [["a text to a friend", "casual and short"], ["a cover letter", "formal and focused on skills"], ["a science abstract", "precise and impersonal"]], trap: [1, "casual and short"], why: "An employer expects formal writing about what you can do.", win: "Reader first." },
    { say: "Sort these by yourself.", bins: "Speech to classmates|Letter to the school board", items: ["Raise your hand if lunch has ever run out!|We have all stood in that line.", "I respectfully request ten minutes on the agenda.|The attached survey summarizes 312 responses."], trap: ["Raise your hand if lunch has ever run out!", 1] },
  ],
}));
