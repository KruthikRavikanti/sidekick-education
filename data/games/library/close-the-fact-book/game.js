// Close the Fact Book. Skill W.1.2-2.
// Providing a sense of closure in informative writing. Stopping mid-thought is the known slip.
Sidekick.game(Sidekick.play({
  title: "Close the Fact Book",
  emoji: "📘",
  premise: "Writing that teaches needs an ending too. The ending tells the reader that you are done.",
  outro: "End informative writing with a closing sentence about the topic.",
  scene: "desk",
  kind: "pick",
  hint: "Which sentence sounds like the end and is about the whole topic?",
  tag: "stops_mid_thought",
  rounds: [
    { say: "Read the writing. Tap the best ending.", read: "Frogs can jump far. Frogs lay eggs in water.", yes: "Now you know about frogs.|", no: "Frogs eat.|And then.|I like pizza.", trap: "Frogs eat.", why: "That starts a new fact and stops. Pick a sentence that closes.", win: "A closing sentence ends it well." },
    { say: "Read this writing. Tap the best ending.", read: "Bees live in hives. They make honey from flowers.", yes: "Bees are busy little helpers.|", no: "Bees have.|They also.|My dog is brown.", trap: "They also.", why: "That stops in the middle. An ending is a whole sentence.", win: "That closes the writing." },
    { say: "Tap the best ending by yourself.", read: "The moon goes around Earth. It looks bright at night.", yes: "The moon is an amazing thing to watch.|", no: "The moon is.|And it.|I have two cats.|Because the.|Then.", trap: "The moon is." },
  ],
}));
