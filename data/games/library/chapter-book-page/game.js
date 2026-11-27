// Chapter Book Page. Skill RL.2.10-1.
// Reading and comprehending literature in the grades 2-3 text complexity band. Choosing only very easy books is the known slip.
Sidekick.game(Sidekick.play({
  title: "Chapter Book Page",
  emoji: "📖",
  premise: "Chapter books have longer pages with more to think about. Read a page and show you understood it.",
  outro: "Longer stories take careful reading. Stop and ask yourself what just happened.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Go back to the page and find the part that tells you.",
  tag: "avoids_longer_text",
  rounds: [
    { say: "Read the page. Answer each question.", read: "Mr. Finch had lost his glasses again. He looked in the kitchen, the garden and even the dog’s bed. Then Lily giggled and pointed to his head.", rows: [["What was lost?", "his glasses"], ["Where were they?", "on his head"]], extra: "his keys|in the garden", trap: [1, "in the garden"], why: "He looked there, but Lily pointed to his head.", win: "The glasses were on his head all along." },
    { say: "Read this page. Answer each question.", read: "The boat rocked as the waves grew taller. Captain Jo tied down the sails and told the crew to stay low. No one spoke until the storm had passed.", rows: [["What was the danger?", "a storm at sea"], ["What did Jo do?", "tied down the sails"]], extra: "a pirate ship|", trap: [0, "a pirate ship"], why: "There are no pirates here. Read about the waves.", win: "A storm, and a calm captain." },
    { say: "Read and answer by yourself.", read: "Dev wanted to win the race so much that his legs shook. When the whistle blew, he tripped. He got up, laughed, and ran anyway.", rows: [["What went wrong for Dev?", "he tripped"], ["What did he do then?", "got up and ran"]], extra: "he won the race|he went home", trap: [1, "he went home"] },
  ],
}));
