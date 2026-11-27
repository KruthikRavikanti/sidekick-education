// Wrap Up the Opinion. Skill W.3.1-4.
// Providing a concluding statement or section for opinion writing. Restating nothing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Wrap Up the Opinion",
  emoji: "🎁",
  premise: "A concluding statement ties the paragraph together. It reminds the reader of your opinion in fresh words.",
  outro: "A conclusion restates the opinion. It does not add a new reason.",
  scene: "candy",
  kind: "pick",
  hint: "Which one reminds the reader of the opinion?",
  tag: "restates_nothing",
  rounds: [
    { say: "Read the paragraph. Tap the best conclusion.", read: "Students should have less homework. Kids need time to play, and families need time together.", yes: "For these reasons, homework should be cut back.|", no: "Homework is done at home.|Another reason is sleep.|I have a desk.", trap: "Another reason is sleep.", why: "That adds a new reason. A conclusion wraps up what you said.", win: "It restates the opinion." },
    { say: "Read this paragraph. Tap the best conclusion.", read: "Our town needs a new park. Kids have nowhere to play, and trees clean the air.", yes: "Clearly, a park would make our town better.|", no: "Parks have benches.|Also, parks are pretty.|The town has a mayor.", trap: "Also, parks are pretty.", why: "Also starts another reason. Close it up instead.", win: "A conclusion that restates." },
    { say: "Tap the best conclusion by yourself.", read: "Dogs are the best pets. They are loyal and they keep you active.", yes: "In short, a dog makes a wonderful pet.|", no: "Dogs have tails.|Next, dogs are funny.|Cats exist too.|My dog is Rex.|Dogs eat food.", trap: "Next, dogs are funny." },
  ],
}));
