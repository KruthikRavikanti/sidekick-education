// What Is This Paragraph For?. Skill RI.9-10.5-1.
// Analyzing how an author’s claims are developed and refined by particular sentences, paragraphs or sections. Summarizing instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "What Is This Paragraph For?",
  emoji: "🧩",
  premise: "Each paragraph in an argument has a job: state the claim, give an example, answer an objection, or drive it home.",
  outro: "Analyze how a sentence or paragraph develops the claim by naming its function.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Ask what the paragraph does, not what it says.",
  tag: "summarizes_instead",
  rounds: [
    { say: "An essay claims that schools should teach cooking. Match each job to its paragraph.", fs: 4.4, rows: [["claim", "Every student should learn to cook."], ["example", "At one school, students plan a week of meals."], ["rebuttal", "Some say there is no time, but one period is enough."]], trap: [1, "Some say there is no time, but one period is enough."], why: "Some say signals an objection being answered. The example is the school.", win: "Claim, example, rebuttal." },
    { say: "An essay claims that cities need more benches. Match each job.", rows: [["A city without seats tells older people to stay home.", "states the claim"], ["After benches were added, foot traffic on Elm Street rose.", "gives evidence"], ["So the next budget should count benches, not just lanes.", "calls for action"]], trap: [0, "calls for action"], why: "This line makes the central point. The call for action comes at the end, with should.", win: "Each paragraph moves the claim along." },
    { say: "An essay claims that homework should be shorter. Match by yourself.", rows: [["Critics warn that grades will fall, yet scores held steady.", "answers an objection"], ["One school cut homework to 30 minutes.", "gives an example"]], extra: "states the title|adds a joke", trap: [0, "gives an example"] },
  ],
}));
