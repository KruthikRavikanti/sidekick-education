// Three Kinds of Clues. Skill L.4.4-1.
// Using context (definitions, examples, restatements) as a clue to the meaning of a word. Ignoring the context clues is the known slip.
Sidekick.game(Sidekick.play({
  title: "Three Kinds of Clues",
  emoji: "🦇",
  premise: "Writers leave clues to hard words: a definition, an example, or a restatement in simpler words.",
  outro: "Look for definitions, examples and restatements near an unknown word.",
  scene: "night",
  kind: "fill",
  cast: "",
  hint: "Look for such as, or, which means, and commas.",
  tag: "ignores_context_clues",
  rounds: [
    { say: "Use the clue in each sentence to find the meaning.", rows: [["Nocturnal animals, such as owls and bats, are active at night.", "active at night"], ["The stream was shallow, or not deep, so we waded.", "not deep"]], extra: "very loud|", trap: [0, "very loud"], why: "The examples are owls and bats, and the sentence says active at night.", win: "An example clue and a restatement clue." },
    { say: "Use the clue in each sentence.", rows: [["An arid region is one that gets almost no rain.", "very dry"], ["He was famished; he had not eaten all day.", "very hungry"]], extra: "very tired|", trap: [1, "very tired"], why: "He had not eaten all day. That points to hunger.", win: "A definition clue and an explanation clue." },
    { say: "Find the meanings by yourself.", rows: [["Predators, such as lions and hawks, hunt other animals.", "animals that hunt"], ["The trail was treacherous, or dangerous, after the rain.", "dangerous"]], extra: "very long|animals that hide", trap: [0, "animals that hide"] },
  ],
}));
