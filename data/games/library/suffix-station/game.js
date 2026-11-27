// Suffix Station. Skill RF.3.3-2.
// Decoding words with common Latin suffixes. Dropping the suffix and reading only the base is the known slip.
Sidekick.game(Sidekick.play({
  title: "Suffix Station",
  emoji: "🚉",
  premise: "Endings like -able, -ment, -tion and -ible come from Latin. Read the base word, then add the ending.",
  outro: "A Latin suffix changes how a word is used: enjoy becomes enjoyment, comfort becomes comfortable.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "Find the base word. Then read the ending and think about what it adds.",
  tag: "drops_the_suffix",
  rounds: [
    { say: "Match each word to its meaning.", rows: [["comfortable", "able to give comfort"], ["enjoyment", "the feeling of enjoying"]], extra: "to enjoy|", trap: [1, "to enjoy"], why: "That is the base word alone. The ending -ment makes it a thing.", win: "The endings change the meaning." },
    { say: "Match these words.", rows: [["celebration", "the act of celebrating"], ["washable", "able to be washed"], ["movement", "the act of moving"]], extra: "to wash|", trap: [1, "to wash"], why: "Washable has -able on the end. It means it can be washed.", win: "Three Latin endings." },
    { say: "Match these by yourself.", rows: [["breakable", "able to be broken"], ["payment", "the act of paying"], ["invention", "something invented"]], extra: "to break|to pay", trap: [0, "to break"] },
  ],
}));
