// Article on Your Own. Skill RI.3.10-1.
// Reading and comprehending informational texts at the high end of the grades 2-3 band independently. Avoiding nonfiction is the known slip.
Sidekick.game(Sidekick.play({
  title: "Article on Your Own",
  emoji: "🐙",
  premise: "Read a short article by yourself. Then say its main idea in one sentence.",
  outro: "After reading on your own, state the main idea of the whole article.",
  scene: "ocean",
  kind: "pick",
  hint: "Which sentence covers what the WHOLE article explains?",
  tag: "cannot_state_main_idea",
  rounds: [
    { say: "Read the article. Tap its main idea.", read: "An octopus can squeeze through a gap the size of a coin. It can change color in a second to hide. If caught, it squirts dark ink and jets away. Few animals are better at escaping.", yes: "An octopus is an expert at escaping.|", no: "An octopus can change color.|Ink is dark.|Coins are small.", trap: "An octopus can change color.", why: "That is one of its tricks. What do all the tricks add up to?", win: "All the details are about escaping." },
    { say: "Read this article. Tap its main idea.", read: "Long ago, people sent messages by horse. Later, trains and the telegraph made it faster. Today a message crosses the world in a second. Communication keeps getting quicker.", yes: "Sending messages has become faster over time.|", no: "Horses carried messages.|Trains are fast.|People like to talk.", trap: "Horses carried messages.", why: "That is only the oldest way. What changed over time?", win: "The article is about growing speed." },
    { say: "Tap the main idea by yourself.", read: "Roots hold a tree in place. They soak up water from the soil. They also store food for winter. A tree could not live without its roots.", yes: "Roots do several jobs a tree needs to live.|", no: "Roots hold the tree in place.|Soil has water.|Winter is cold.|Trees are tall.|Roots store food.", trap: "Roots hold the tree in place." },
  ],
}));
