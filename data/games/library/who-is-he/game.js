// Who Is He?. Skill L.6.1-4.
// Recognizing and correcting vague pronouns with unclear or ambiguous antecedents. Using it and they with unclear references is the known slip.
Sidekick.game(Sidekick.play({
  title: "Who Is He?",
  emoji: "❓",
  premise: "A pronoun must point clearly to one person or thing. If the reader has to guess, the sentence needs fixing.",
  outro: "A clear pronoun has one obvious noun it refers to. Rewrite when two nouns could fit.",
  scene: "city",
  kind: "sort",
  fs: 4.6,
  hint: "Could the pronoun mean two different people or things?",
  tag: "vague_reference",
  rounds: [
    { say: "Is it clear who the pronoun means?", bins: "Clear|Vague", items: ["Sam told Jo, “I am late.”|Mia thanked Ana for Ana’s help.", "Sam told Jo that he was late.|They say it will rain."], trap: ["Sam told Jo that he was late.", 0], why: "He could be Sam or Jo. The reader cannot tell.", win: "Clear sentences leave no guessing." },
    { say: "Sort these.", bins: "Clear|Vague", items: ["The cup fell off the shelf, and the cup broke.|Dad called Uncle Ray when Dad got home.", "Take the lid off the jar and wash it.|In the book it says that owls hunt at night."], trap: ["Take the lid off the jar and wash it.", 0], why: "Wash the lid or the jar? It could mean either.", win: "Name the noun when two could fit." },
    { say: "Sort these by yourself.", bins: "Clear|Vague", items: ["Lena lent Kim a pen, and Kim lost the pen.|The coach praised Ty because Ty scored.", "When the bus hit the pole, it was dented.|Lena told Kim that she had won."], trap: ["Lena told Kim that she had won.", 0] },
  ],
}));
