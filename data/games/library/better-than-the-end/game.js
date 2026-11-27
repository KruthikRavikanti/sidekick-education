// Better Than The End. Skill W.3.3-4.
// Providing a sense of closure in a narrative. Ending with just The end is the known slip.
Sidekick.game(Sidekick.play({
  title: "Better Than The End",
  emoji: "🌅",
  premise: "Writing The End does not finish a story. A real ending shows how the problem turned out.",
  outro: "An ending follows from the events and wraps up the problem.",
  scene: "sky",
  kind: "pick",
  hint: "Which ending shows how the problem was settled?",
  tag: "ends_with_the_end",
  rounds: [
    { say: "The story: A girl loses her kite in a tree. Tap the endings that wrap it up.", yes: "With one last tug, the kite came free, and she flew it all afternoon.|She left the kite for the birds and walked home smiling.", no: "The end.|Then she ate lunch.", trap: "The end.", why: "That only says it is over. What happened to the kite?", win: "Those endings settle the problem." },
    { say: "The story: Two friends have a fight. Tap the endings that wrap it up.", yes: "They shook hands and promised never to fight over a game again.|By sunset they were laughing together like always.", no: "The end.|It was Tuesday.|That is all.", trap: "That is all.", why: "That tells nothing. What happened between the friends?", win: "The fight is settled." },
    { say: "The story: A boy is afraid of the dark. Tap the endings by yourself.", yes: "From that night on, he slept with the light off.|He smiled at the shadows, no longer afraid.", no: "The end.|He had a bed.|So yeah.", trap: "The end." },
  ],
}));
