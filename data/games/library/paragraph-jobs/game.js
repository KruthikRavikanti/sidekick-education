// Paragraph Jobs. Skill RI.6.5-1.
// Analyzing how a sentence, paragraph or section contributes to the development of the ideas. Describing it without its function is the known slip.
Sidekick.game(Sidekick.play({
  title: "Paragraph Jobs",
  emoji: "🗂️",
  premise: "Each paragraph in an article has a job: to introduce, give an example, show a cause, or wrap things up.",
  outro: "Explain the function of a section: introduces the idea, gives an example, explains a cause, or concludes.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What would be missing from the article without this part?",
  tag: "describes_without_function",
  rounds: [
    { say: "What job does each paragraph do?", rows: [["Coral reefs are in danger around the world.", "introduces the idea"], ["On one reef, half the coral turned white in a summer.", "gives an example"], ["Warmer water is the main reason.", "explains a cause"]], trap: [1, "introduces the idea"], why: "The idea is already introduced. This shows one case of it.", win: "Idea, example, cause." },
    { say: "What job does each paragraph do?", rows: [["Some people say reefs will recover on their own.", "presents another view"], ["Protecting reefs now gives them the best chance.", "concludes"]], extra: "gives an example|", trap: [0, "concludes"], why: "It brings in what other people think. The article is not ending yet.", win: "Another view, then the conclusion." },
    { say: "Match these by yourself.", rows: [["What is a glacier, exactly?", "raises a question"], ["A glacier is a slow river of ice.", "gives a definition"]], extra: "concludes|tells a story", trap: [1, "concludes"] },
  ],
}));
