// Word Endings. Skill RF.1.3-6.
// Reading words with inflectional endings. Dropping the ending is the known slip.
Sidekick.game(Sidekick.play({
  title: "Word Endings",
  emoji: "🦘",
  premise: "The end of a word tells when it happens. Jumps, jumped and jumping all come from jump.",
  outro: "Read to the very end of the word: -s, -ed and -ing change its meaning.",
  scene: "field",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Read the whole sentence. Which ending makes it sound right?",
  tag: "drops_the_ending",
  rounds: [
    { say: "Drop each word where it fits.", rows: [["The frog ___ on a log every day.", "jumps"], ["Last night it ___.", "jumped"], ["Look, it is ___ now!", "jumping"]], extra: "jump", trap: [1, "jump"], why: "Last night is over. The word needs -ed on the end.", win: "Jumps, jumped, jumping." },
    { say: "Drop these where they fit.", rows: [["She ___ ball every day.", "plays"], ["Last week we ___.", "played"], ["We are ___ now.", "playing"]], extra: "play", trap: [2, "play"], why: "We are play does not sound right. It needs -ing.", win: "Plays, played, playing." },
    { say: "Drop these where they fit, by yourself.", rows: [["Dad ___ dinner every night.", "cooks"], ["Last night he ___ rice.", "cooked"], ["He is ___ soup now.", "cooking"]], extra: "cook", trap: [1, "cook"] },
  ],
}));
