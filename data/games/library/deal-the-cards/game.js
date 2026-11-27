// Deal the Cards. Skill 3.OA.A.3-4.
// Representing an equal-groups problem with an equation and a symbol for the unknown. Using the other operation is the known slip.
Sidekick.game(Sidekick.play({
  title: "Deal the Cards",
  emoji: "🃏",
  premise: "Each story is about equal groups. Build the number sentence, with a ? for what you need to find.",
  outro: "An equation with a ? says exactly what the story asks.",
  scene: "candy",
  kind: "row",
  hint: "Is the story joining equal groups, or splitting a total into equal groups?",
  tag: "picks_opposite_operation",
  rounds: [
    { say: "Build the number sentence for the story.", q: "42 cards are dealt equally to 6 players. How many does each player get?", seq: "42 ÷ 6 = ?", also: ["? = 42 ÷ 6", "6 × ? = 42", "? × 6 = 42"], extra: "×", trap: "42 × 6 = ?", why: "The cards are split up among the players. That is dividing.", win: "42 ÷ 6 = ?" },
    { say: "Build this number sentence.", q: "5 shelves hold 8 books each. How many books?", seq: "5 × 8 = ?", also: ["8 × 5 = ?", "? = 5 × 8", "? = 8 × 5"], extra: "+", trap: "5 + 8 = ?", why: "Each shelf has 8 books. That is 5 groups of 8.", win: "5 × 8 = ?" },
    { say: "Build this one by yourself.", alt: [{ q: "63 beads are put on 7 strings equally. How many on each string?", seq: "63 ÷ 7 = ?", also: ["? = 63 ÷ 7", "7 × ? = 63", "? × 7 = 63"], extra: "×", trap: "63 × 7 = ?" }, { q: "9 bags hold 4 oranges each. How many oranges?", seq: "9 × 4 = ?", also: ["4 × 9 = ?", "? = 9 × 4", "? = 4 × 9"], extra: "+", trap: "9 + 4 = ?" }] },
  ],
}));
