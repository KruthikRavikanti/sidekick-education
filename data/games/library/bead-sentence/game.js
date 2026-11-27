// Bead Sentence. Skill K.OA.A.3-3.
// Recording a split with an equation: the child builds a sentence such as 5 = 3 + 2 from tiles. Writing only the parts leaves out the whole.
Sidekick.game(Sidekick.play({
  title: "Bead Sentence",
  emoji: "📿",
  premise: "Each string has beads in two colors. Build the number sentence that tells the whole string and its two parts.",
  outro: "A number sentence shows the whole and the parts that make it.",
  scene: "desk",
  kind: "row",
  cast: "",
  hint: "Say it: the whole is the same as one part plus the other part.",
  tag: "writes_parts_not_whole",
  rounds: [
    { say: "Build the number sentence for these beads: the whole and its two parts.", pic: "🔵🔵🔵🔴🔴", seq: "5 = 3 + 2", also: ["5 = 2 + 3", "3 + 2 = 5", "2 + 3 = 5"], trap: "3 + 2", why: "You wrote the parts. Show how many in all, too.", win: "5 = 3 + 2." },
    { say: "Build the number sentence for this string.", pic: "🟢🟢🟢🟢🟡🟡", seq: "6 = 4 + 2", also: ["6 = 2 + 4", "4 + 2 = 6", "2 + 4 = 6"], trap: "4 + 2", why: "You wrote the parts. Show how many in all, too.", win: "6 = 4 + 2." },
    { say: "Build this number sentence by yourself.", alt: [{ pic: "🟣🟣🟣🟣🟣🟠🟠🟠", seq: "8 = 5 + 3", also: ["8 = 3 + 5", "5 + 3 = 8", "3 + 5 = 8"], trap: "5 + 3" }, { pic: "🟤🟤🟤🟤⚪⚪⚪", seq: "7 = 4 + 3", also: ["7 = 3 + 4", "4 + 3 = 7", "3 + 4 = 7"], trap: "4 + 3" }, { pic: "🔴🔴🔴🔴🔴🔴🔵", seq: "7 = 6 + 1", also: ["7 = 1 + 6", "6 + 1 = 7", "1 + 6 = 7"], trap: "6 + 1" }] },
  ],
}));
