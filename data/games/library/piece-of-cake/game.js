// Piece of Cake. Skill RL.3.4-1.
// Determining the meaning of words and phrases as they are used in a text. Using a dictionary meaning that does not fit is the known slip.
Sidekick.game(Sidekick.play({
  title: "Piece of Cake",
  emoji: "🍰",
  premise: "Stories use phrases that do not mean what the words say. A piece of cake can mean something easy.",
  outro: "Work out what a phrase means from the story around it, not from each word.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Does the plain meaning make sense in the story? If not, what is the writer really saying?",
  tag: "dictionary_meaning_does_not_fit",
  rounds: [
    { say: "What does each phrase mean in its sentence?", rows: [["The test was a piece of cake.", "it was easy"], ["It was raining cats and dogs.", "it rained hard"]], extra: "there was dessert|", trap: [0, "there was dessert"], why: "No one is eating. The writer means the test was simple.", win: "Easy, and raining hard." },
    { say: "What does each phrase mean?", rows: [["I am all ears.", "I am listening"], ["She was feeling blue.", "she was sad"], ["Hold your horses.", "wait a moment"]], extra: "she was painted|", trap: [1, "she was painted"], why: "Blue here is a feeling, not a color on her skin.", win: "Listening, sad, wait." },
    { say: "Work these out by yourself.", rows: [["Break a leg tonight.", "good luck"], ["He spilled the beans.", "he told the secret"], ["It cost an arm and a leg.", "it was very expensive"]], extra: "he made a mess|", trap: [1, "he made a mess"] },
  ],
}));
