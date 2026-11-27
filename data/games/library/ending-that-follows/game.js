// Ending That Follows. Skill W.5.3-5.
// Providing a conclusion that follows from the narrated experiences or events. A rushed ending is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ending That Follows",
  emoji: "🌄",
  premise: "The ending should feel like the natural result of everything before it, not a sudden stop.",
  outro: "Write a conclusion that follows from the narrated events.",
  scene: "sky",
  kind: "pick",
  hint: "Which ending grows out of what the character went through?",
  tag: "rushed_ending",
  rounds: [
    { say: "The story: Nadia faces her first night at camp, terrified of noises. Tap the ending that follows.", yes: "The scratching was only a mouse. Nadia laughed, and for the first time, slept soundly.|", no: "Then her mom picked her up. The end.|Suddenly it was a year later.|And she never thought about it.", trap: "Then her mom picked her up. The end.", why: "That skips past how her fear turned out.", win: "The fear is faced and resolved." },
    { say: "The story: A shopkeeper tries all week to open a mysterious locked box. Tap the ending that follows.", yes: "The key had been taped beneath the box all along. Inside lay a deed to the shop.|", no: "He threw it away and forgot it.|A dragon appeared.|That is the end of the story.", trap: "He threw it away and forgot it.", why: "After a week of trying, simply forgetting it does not follow.", win: "The ending answers the story’s question." },
    { say: "The story: Twins suspect each other of taking their shared bike before a race. Tap the ending by yourself.", yes: "Dad wheeled it out, freshly fixed, with two new seats. The twins raced together.|", no: "They moved to another town.|It started to rain.|Nobody ever knew.|Then they ate lunch.|The bike was blue.", trap: "Nobody ever knew." },
  ],
}));
