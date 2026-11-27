// Main Idea Mountain. Skill RI.3.2-1.
// Determining the main idea of a text. Picking the first sentence or a detail is the known slip.
Sidekick.game(Sidekick.play({
  title: "Main Idea Mountain",
  emoji: "⛰️",
  premise: "The main idea sits on top like a mountain peak. All the details are the slopes that hold it up.",
  outro: "The main idea is the big point the whole text makes. It is not just the first sentence.",
  scene: "snow",
  kind: "pick",
  hint: "Which sentence do all the others help to explain?",
  tag: "picks_a_detail",
  rounds: [
    { say: "Read the article. Tap its main idea.", read: "A camel can go a week without water. Its wide feet do not sink in sand. Long lashes keep sand out of its eyes. Camels are built for life in the desert.", yes: "Camels are built for desert life.|", no: "A camel can go a week without water.|Camels have long lashes.|Sand is hot.", trap: "A camel can go a week without water.", why: "That is the first sentence, but it is one detail.", win: "Every detail shows how camels fit the desert." },
    { say: "Read this article. Tap its main idea.", read: "Honeybees dance to tell each other where flowers are. A waggle shows the direction. The length of the dance shows how far. Bees have a clever way of sharing information.", yes: "Bees share information by dancing.|", no: "A waggle shows the direction.|Bees like flowers.|Dancing is fun.", trap: "A waggle shows the direction.", why: "That is one part of the dance. What is the whole article about?", win: "The dance is how bees talk." },
    { say: "Tap the main idea by yourself.", read: "Old tires can become playground mats. Glass bottles can be melted into new ones. Paper can be turned into boxes. Recycling gives old things a new use.", yes: "Recycling gives old things a new use.|", no: "Old tires become mats.|Glass can melt.|Paper makes boxes.|Playgrounds are fun.|Bottles hold water.", trap: "Old tires become mats." },
  ],
}));
