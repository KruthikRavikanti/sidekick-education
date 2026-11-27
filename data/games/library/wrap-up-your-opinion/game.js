// Wrap Up Your Opinion. Skill W.1.1-2.
// Providing a sense of closure in opinion writing. Ending abruptly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Wrap Up Your Opinion",
  emoji: "🎀",
  premise: "Opinion writing needs an ending. A good ending tells the reader your opinion one more time.",
  outro: "End opinion writing with a sentence that wraps it up.",
  scene: "candy",
  kind: "pick",
  hint: "Which sentence sounds like the end, and says the opinion again?",
  tag: "ends_abruptly",
  rounds: [
    { say: "Read the writing. Tap the best ending.", read: "Dogs are the best pet. They play fetch with you.", yes: "That is why dogs are the best pet.|", no: "Dogs can bark.|I have a bike.|Dogs.", trap: "Dogs can bark.", why: "That adds a new fact. An ending wraps up the opinion.", win: "The ending says the opinion again." },
    { say: "Read this writing. Tap the best ending.", read: "Pizza is the best food. It has cheese and you can pick the toppings.", yes: "So pizza is my top pick for dinner.|", no: "Cheese is yellow.|My mom has a car.|Pizza is round.", trap: "Pizza is round.", why: "That is a new fact. Wrap up what you think instead.", win: "A good ending wraps it up." },
    { say: "Tap the best ending by yourself.", read: "The park is the best place to play. It has swings and a big slide.", yes: "That is why I love the park.|", no: "The slide is red.|I ate lunch.|Swings go up.|My park has trees.|Parks.", trap: "The slide is red." },
  ],
}));
