// How Did It Feel?. Skill W.K.3-2.
// Providing a reaction to what happened in a narrative. Leaving out any reaction is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Did It Feel?",
  emoji: "😊",
  premise: "A good ending tells how you felt about what happened. It lets the reader feel it too.",
  outro: "End your story with a reaction: how did it make you feel?",
  scene: "candy",
  kind: "pick",
  hint: "Which ones tell a feeling?",
  tag: "leaves_out_reaction",
  rounds: [
    { say: "We went to the park. Tap the endings that tell how it felt.", yes: "It was so much fun!|I felt happy.", no: "We went on a bus.|The slide is red.", trap: "The slide is red.", why: "That tells about the slide. It does not tell a feeling.", win: "Those endings share a feeling." },
    { say: "My ice cream fell. Tap the endings that tell how it felt.", yes: "I was so sad.|It made me cry.", no: "It was pink.|It fell on the path.|I had a cone.", trap: "It was pink.", why: "Pink is a color, not a feeling.", win: "Sad is how it felt." },
    { say: "I got a new puppy. Tap the feeling endings by yourself.", yes: "I was so glad!|I love him.", no: "He is brown.|He has a bed.|We got him on a Monday.", trap: "He is brown." },
  ],
}));
