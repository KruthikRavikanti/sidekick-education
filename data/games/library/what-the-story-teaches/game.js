// What the Story Teaches. Skill RL.1.2-2.
// Demonstrating understanding of the central message or lesson of a story. Stating a detail as the lesson is the known slip.
Sidekick.game(Sidekick.play({
  title: "What the Story Teaches",
  emoji: "🐜",
  premise: "Many stories teach a lesson. The lesson is a big idea you can use in your own life.",
  outro: "The lesson of a story is a big idea, not one small detail.",
  scene: "meadow",
  kind: "pick",
  hint: "What could YOU learn from what happened?",
  tag: "states_a_detail_as_lesson",
  rounds: [
    { say: "Read the story. Tap the lesson it teaches.", read: "Ant worked all summer to store food. Grasshopper played all day. When winter came, Ant had food and Grasshopper had none.", yes: "Work now so you are ready later.|", no: "Ants are small.|Winter is cold.|Grasshoppers can hop.", trap: "Winter is cold.", why: "That is a detail in the story. The lesson is a big idea for your life.", win: "Get ready before you need it." },
    { say: "Read this story. Tap the lesson.", read: "Hare ran fast and stopped for a nap. Tortoise walked slowly and never stopped. Tortoise won the race.", yes: "Keep going and do not give up.|", no: "Hares are fast.|Naps are nice.|The race was long.", trap: "Hares are fast.", why: "That is a detail. What can you learn from how Tortoise won?", win: "Slow and steady keeps going." },
    { say: "Tap the lesson by yourself.", read: "A boy cried Wolf for fun, and people came to help. He did it again. When a real wolf came, no one believed him.", yes: "Tell the truth so people trust you.|", no: "Wolves are scary.|The boy had sheep.|People can run fast.|It is fun to shout.|Boys like games.", trap: "Wolves are scary." },
  ],
}));
