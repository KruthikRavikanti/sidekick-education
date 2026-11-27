// Form Carries Meaning. Skill RL.7.5-1.
// Analyzing how a drama’s or poem’s form or structure contributes to its meaning. Describing the form only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Form Carries Meaning",
  emoji: "📜",
  premise: "The shape of a poem or play is part of its message. Short lines, a refrain or a sudden break all mean something.",
  outro: "Connect a feature of form to what it adds: short lines can feel breathless, a refrain can insist.",
  scene: "paper",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What feeling or idea does that shape create?",
  tag: "describes_form_only",
  rounds: [
    { say: "What does each feature of form add?", rows: [["very short lines in a poem about running", "a breathless pace"], ["one line repeated in every stanza", "an idea that will not let go"]], extra: "more rhymes|", trap: [0, "more rhymes"], why: "Short lines do not add rhyme. They make you read fast, like running.", win: "Form matches meaning." },
    { say: "What does each feature add?", rows: [["a long pause written into a play", "tension before an answer"], ["a poem shaped like a falling leaf", "the slow drift downward"]], extra: "a faster plot|", trap: [0, "a faster plot"], why: "A pause slows things down. It makes the audience wait.", win: "A pause builds tension." },
    { say: "Match these by yourself.", rows: [["a final line that stands all alone", "extra weight on that thought"], ["two voices printed side by side", "a conversation or clash"]], extra: "a longer poem|a happy ending", trap: [0, "a longer poem"] },
  ],
}));
