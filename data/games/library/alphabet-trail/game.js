// Alphabet Trail. Skill L.1.1-1.
// Knowing all upper- and lowercase letters in order: missing letters are supplied in alphabet sequences. Forming or ordering letters inconsistently is the known slip.
Sidekick.game(Sidekick.play({
  title: "Alphabet Trail",
  emoji: "🔡",
  premise: "The letters of the alphabet walk in a line, always in the same order. Fill in the ones that wandered off.",
  outro: "The alphabet always goes in the same order, a to z.",
  scene: "forest",
  kind: "fill",
  fs: 7,
  pSize: 6,
  cast: "",
  hint: "Sing the alphabet song up to that spot.",
  tag: "letters_out_of_order",
  rounds: [
    { say: "Drop in the missing letters.", rows: [["a b ___ d", "c"], ["l m ___ o", "n"], ["w x ___ z", "y"]], extra: "e v", trap: [0, "e"], why: "Sing it: a, b, c, d. The letter after b is c.", win: "C, n and y." },
    { say: "Give each uppercase letter its lowercase partner.", rows: [["G", "g"], ["Q", "q"], ["R", "r"]], extra: "p j", trap: [1, "p"], why: "Small q has its round part on the left side.", win: "G with g, Q with q, R with r." },
    { say: "Drop in the missing letters by yourself.", rows: [["e f ___ h", "g"], ["p q ___ s", "r"], ["h i ___ k", "j"], ["s t ___ v", "u"]], extra: "w", trap: [0, "j"] },
  ],
}));
