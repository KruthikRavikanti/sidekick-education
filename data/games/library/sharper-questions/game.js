// Sharper Questions. Skill W.7.7-1.
// Conducting short research projects and generating additional focused questions. Unfocused questions are the known slip.
Sidekick.game(Sidekick.play({
  title: "Sharper Questions",
  emoji: "🔎",
  premise: "Good research breeds better questions. After a first look, ask follow-ups that are narrow enough to investigate.",
  outro: "Generate focused follow-up questions that can be researched and answered.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does the question name something specific to find out?",
  tag: "unfocused",
  rounds: [
    { say: "You are researching the Dust Bowl. Which follow-up questions are focused?", bins: "Focused|Too vague", items: ["Which farming methods made the soil blow away?|How did families decide whether to leave?", "What about dust?|Why are things the way they are?"], trap: ["What about dust?", 0], why: "What about it? The question does not say what to find out.", win: "Focused questions name a target." },
    { say: "You are researching sleep. Sort the follow-up questions.", bins: "Focused|Too vague", items: ["How does screen light affect falling asleep?|Do later school starts raise test scores?", "Is sleep good?|What is the deal with dreams and stuff?"], trap: ["Is sleep good?", 0], why: "It can be answered with one word and leads nowhere.", win: "Narrow and researchable." },
    { say: "You are researching ocean plastic. Sort by yourself.", bins: "Focused|Too vague", items: ["Which rivers carry the most plastic to sea?|How do microplastics enter the food chain?", "What about the ocean?|Is plastic a thing people use?"], trap: ["What about the ocean?", 0] },
  ],
}));
