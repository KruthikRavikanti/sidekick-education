// Myth in Five Sentences. Skill RL.3.2-1.
// Recounting fables, folktales and myths. Retelling every detail is the known slip.
Sidekick.game(Sidekick.play({
  title: "Myth in Five Sentences",
  emoji: "☀️",
  premise: "A myth is an old story that explains something. Recount one with just its key events, in order.",
  outro: "Recount a tale in a few sentences: the key events, in order, without every detail.",
  scene: "sky",
  kind: "row",
  hint: "What is the first big thing that happens? What follows from it?",
  tag: "retells_every_detail",
  rounds: [
    { say: "Put the key events of this myth in order.", seq: "A boy and his father were trapped on an island.|The father made wings of feathers and wax.|The boy flew too close to the sun.|The wax melted and he fell into the sea.", trap: "The boy flew too close to the sun.|A boy and his father were trapped on an island.|The father made wings of feathers and wax.|The wax melted and he fell into the sea.", why: "He cannot fly before the wings are made.", win: "Trapped, wings, too high, fell." },
    { say: "Which sentences belong in a short recount? Tap the key events.", kind: "pick", read: "A greedy king wished that all he touched would turn to gold. His food turned to gold. His daughter turned to gold. He begged to have the wish undone.", yes: "The king wished for a golden touch.|His daughter turned to gold.|He begged to undo the wish.", no: "Gold is yellow.|The king wore a crown.", trap: "The king wore a crown.", why: "That is not even in the story. Keep to what happened.", win: "Wish, loss, regret." },
    { say: "Put the key events of this folktale in order by yourself.", seq: "A hungry traveler had only a stone.|He boiled it and called it soup.|Each villager added a little food.|Soon there was soup for everyone.", trap: "Each villager added a little food.|A hungry traveler had only a stone.|He boiled it and called it soup.|Soon there was soup for everyone." },
  ],
}));
