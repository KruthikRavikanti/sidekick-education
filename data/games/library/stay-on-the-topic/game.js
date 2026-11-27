// Stay on the Topic. Skill W.2.2-1.
// Introducing a topic and using facts and definitions to develop points. Writing a list of unrelated facts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stay on the Topic",
  emoji: "🐧",
  premise: "Informative writing introduces a topic, then gives facts about that topic. Facts about other things do not belong.",
  outro: "Introduce your topic, then use facts and definitions that are all about it.",
  scene: "snow",
  kind: "pick",
  hint: "Is the fact about the topic in the first sentence?",
  tag: "unrelated_facts",
  rounds: [
    { say: "The topic sentence: Penguins are birds that cannot fly. Tap the facts that belong.", yes: "Penguins swim with their wings.|Penguins eat fish.", no: "Dogs can bark.|Summer is hot.", trap: "Dogs can bark.", why: "That is a fact, but it is not about penguins.", win: "Both facts are about penguins." },
    { say: "The topic sentence: A volcano is a mountain that can erupt. Tap the facts that belong.", yes: "Hot melted rock called lava flows out.|Some volcanoes are under the sea.", no: "Rivers flow to the sea.|My favorite color is red.|Trees have leaves.", trap: "Rivers flow to the sea.", why: "That is about rivers. Keep to volcanoes.", win: "Facts that stay on the topic." },
    { say: "The topic sentence: Spiders are not insects. Tap the facts that belong, by yourself.", yes: "Spiders have eight legs.|Spiders spin silk webs.", no: "Bees make honey.|Cats have fur.|Winter is cold.", trap: "Bees make honey." },
  ],
}));
