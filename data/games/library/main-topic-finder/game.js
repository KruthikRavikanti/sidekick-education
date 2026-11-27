// Main Topic Finder. Skill RI.2.2-1.
// Identifying the main topic of a multi-paragraph text. Naming a detail as the topic is the known slip.
Sidekick.game(Sidekick.play({
  title: "Main Topic Finder",
  emoji: "🧭",
  premise: "An article has many sentences but one main topic. The topic is what all the parts are about.",
  outro: "The main topic covers the whole text. A detail is only one part.",
  scene: "desk",
  kind: "pick",
  hint: "Does it cover ALL the sentences, or only one?",
  tag: "names_a_detail",
  rounds: [
    { say: "Read the article. Tap its main topic.", read: "Some birds fly south when it gets cold. Bears sleep in dens. Squirrels hide nuts to eat later.", yes: "how animals get ready for winter|", no: "bears sleep in dens|birds can fly|what squirrels eat", trap: "bears sleep in dens", why: "That is one detail. The topic covers birds, bears and squirrels.", win: "All three get ready for winter." },
    { say: "Read this article. Tap its main topic.", read: "Trains carry people to work. Trains move coal and grain. Fast trains can cross a whole country in a day.", yes: "what trains do|", no: "trains carry coal|how to buy a ticket|fast cars", trap: "trains carry coal", why: "Coal is in one sentence only.", win: "The article is about what trains do." },
    { say: "Tap the main topic by yourself.", read: "Rain fills rivers and lakes. Rain helps crops grow. Rain washes dust from the air.", yes: "why rain is useful|", no: "rain fills lakes|how clouds form|dust in the air|crops and farms|rainy days are sad", trap: "rain fills lakes" },
  ],
}));
