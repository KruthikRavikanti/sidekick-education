// Sentence Roles in a Paragraph. Skill RI.8.5-1.
// Analyzing in detail the structure of a specific paragraph, including the role of particular sentences. Summarizing the paragraph is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sentence Roles in a Paragraph",
  emoji: "🧩",
  premise: "Inside a strong paragraph, each sentence has a role: stating the point, giving evidence, explaining it, wrapping up.",
  outro: "Identify each sentence’s role in developing the paragraph’s key concept.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Is it the main point, a fact that backs it, or an explanation of the fact?",
  tag: "summarizes_paragraph",
  rounds: [
    { say: "What role does each sentence play?", rows: [["Urban trees save cities money.", "states the point"], ["One study found shade cut cooling costs by a fifth.", "gives evidence"], ["Less cooling means lower bills.", "explains the evidence"]], trap: [1, "states the point"], why: "A study with a number is evidence for the point.", win: "Point, evidence, explanation." },
    { say: "What role does each sentence play?", rows: [["Bats are vital to farms.", "states the point"], ["A single colony eats tons of insects a year.", "gives evidence"], ["So, protecting bats protects crops.", "concludes"]], trap: [2, "gives evidence"], why: "So signals a wrap-up drawn from the evidence.", win: "Point, evidence, conclusion." },
    { say: "Match these by yourself.", rows: [["Recess improves learning.", "states the point"], ["Students tested after a break scored higher.", "gives evidence"]], extra: "concludes|tells a story", trap: [1, "concludes"] },
  ],
}));
