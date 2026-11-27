// Pencil Boxes. Skill 3.OA.A.2-3.
// Writing a division equation for a situation: total ÷ number of groups = size of each group. Putting the smaller number first is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pencil Boxes",
  emoji: "✏️",
  premise: "Things get packed into equal groups. Write the division sentence that tells the story in order.",
  outro: "In a division sentence, the total comes first.",
  scene: "desk",
  kind: "row",
  hint: "Start with the total that is being split up.",
  tag: "reverses_dividend_and_divisor",
  rounds: [
    { say: "Build the division sentence.", q: "30 pencils are put into 5 equal boxes.", seq: "30 ÷ 5 = 6", also: ["6 = 30 ÷ 5"], trap: "5 ÷ 30 = 6", why: "The 30 pencils are what is being split. 30 comes first.", win: "30 ÷ 5 = 6." },
    { say: "Build this division sentence.", q: "24 stickers are shared by 4 friends.", seq: "24 ÷ 4 = 6", also: ["6 = 24 ÷ 4"], trap: "4 ÷ 24 = 6", why: "The 24 stickers are what is being shared. 24 comes first.", win: "24 ÷ 4 = 6." },
    { say: "Build this one by yourself.", alt: [{ q: "42 cards are dealt into 6 equal piles.", seq: "42 ÷ 6 = 7", also: ["7 = 42 ÷ 6"], trap: "6 ÷ 42 = 7" }, { q: "18 fish are put into 3 tanks equally.", seq: "18 ÷ 3 = 6", also: ["6 = 18 ÷ 3"], trap: "3 ÷ 18 = 6" }] },
  ],
}));
