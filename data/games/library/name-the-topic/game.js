// Name the Topic. Skill RI.1.2-1.
// Identifying the main topic of an informational text. Naming the most interesting fact as the topic is the known slip.
Sidekick.game(Sidekick.play({
  title: "Name the Topic",
  emoji: "🏷️",
  premise: "The main topic is what the whole page is about. One fun fact is only a small part of it.",
  outro: "The main topic is what ALL the sentences are about.",
  scene: "desk",
  kind: "pick",
  hint: "What are all of the sentences about?",
  tag: "names_a_fact_as_topic",
  rounds: [
    { say: "Read the page. Tap its main topic.", read: "Ants live in nests. Ants work in teams. Ants can lift heavy things.", yes: "how ants live|", no: "ants lift heavy things|bees|a picnic", trap: "ants lift heavy things", why: "That is one fact. The topic covers all three sentences.", win: "The whole page is about how ants live." },
    { say: "Read this page. Tap its main topic.", read: "Some trucks carry sand. Some trucks put out fires. Some trucks pick up trash.", yes: "kinds of trucks|", no: "fire trucks|sand|cars and bikes", trap: "fire trucks", why: "Fire trucks are in only one sentence.", win: "The page is about kinds of trucks." },
    { say: "Tap the main topic by yourself.", read: "In fall, leaves turn red. In winter, snow falls. In spring, flowers bloom. In summer, it is hot.", yes: "the four seasons|", no: "snow in winter|red leaves|hot days|flowers|the moon", trap: "snow in winter" },
  ],
}));
