// Group the Facts. Skill W.3.2-1.
// Introducing a topic and grouping related information together. Mixing topics in one paragraph is the known slip.
Sidekick.game(Sidekick.play({
  title: "Group the Facts",
  emoji: "🗂️",
  premise: "Good informative writing keeps facts that go together in the same paragraph.",
  outro: "Introduce the topic, then group related information together.",
  scene: "desk",
  kind: "sort",
  hint: "Which paragraph is this fact about?",
  tag: "mixes_topics",
  rounds: [
    { say: "You are writing about wolves. Put each fact in its paragraph.", bins: "What they eat|Where they live", items: ["Wolves hunt deer.|They also eat rabbits.", "Wolves live in forests.|Some live on cold plains."], trap: ["Some live on cold plains.", 0], why: "Plains are a place. That fact is about where they live.", win: "Food facts and home facts." },
    { say: "You are writing about the moon. Put each fact in its paragraph.", bins: "What it looks like|How it moves", items: ["It has gray craters.|It seems to change shape.", "It circles Earth.|One trip takes about a month."], trap: ["It circles Earth.", 0], why: "Circling is movement.", win: "Looks and movement." },
    { say: "You are writing about bees. Sort by yourself.", bins: "Jobs in the hive|How honey is made", items: ["The queen lays eggs.|Workers guard the door.", "Bees collect nectar.|They fan it until it thickens."], trap: ["Bees collect nectar.", 0] },
  ],
}));
