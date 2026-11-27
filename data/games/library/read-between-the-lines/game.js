// Read Between the Lines. Skill RL.4.1-2.
// Drawing inferences from a text, supported by details. Making guesses that the text does not support is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read Between the Lines",
  emoji: "📦",
  premise: "Authors do not say everything outright. An inference is a smart conclusion you draw from clues in the text.",
  outro: "An inference must be supported by clues in the text, not just a guess.",
  scene: "city",
  kind: "pick",
  hint: "Which conclusion do the clues in the story point to?",
  tag: "unsupported_guess",
  rounds: [
    { say: "Read the story. How does Ivy feel about moving?", read: "Ivy packed her last box slowly. She traced the pencil marks on the doorframe where her height had been measured each year. \"Do we have to go?\" she whispered.", yes: "She is sad to leave.|", no: "She is excited to go.|She is angry at her brother.|She is bored.", trap: "She is excited to go.", why: "Packing slowly and asking do we have to go are clues that she does not want to leave.", win: "The clues point to sadness." },
    { say: "Read this story. What can you infer about the weather?", read: "Dad came in stamping his boots. He shook white flakes from his hat and held his red hands near the stove.", yes: "It is snowing and cold.|", no: "It is a hot summer day.|It is raining lightly.|It is windy but warm.", trap: "It is raining lightly.", why: "White flakes and red hands by the stove point to snow.", win: "The clues add up to snow." },
    { say: "What can you infer? Work it out by yourself.", read: "Leo checked the mailbox for the fifth time that day. When the envelope finally came, he tore it open before he reached the porch.", yes: "He had been eagerly waiting for it.|", no: "He did not care about it.|He was afraid of it.|He had lost his keys.|He was tired.|He disliked mail.", trap: "He did not care about it." },
  ],
}));
