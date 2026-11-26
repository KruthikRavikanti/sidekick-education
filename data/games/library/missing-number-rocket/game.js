// Missing Number Rocket. Skill 1.OA.D.8-1.
// Finding the unknown in a + ? = c. Keying in the total, or adding the two shown numbers, are the known slips.
Sidekick.game(Sidekick.play({
  title: "Missing Number Rocket",
  emoji: "🚀",
  premise: "The rocket will not launch until the missing number is keyed in. What goes in the box?",
  outro: "The missing number is what you add to get from the first number to the total.",
  scene: "space",
  kind: "type",
  icon: "🚀",
  hint: "Count up from the first number to the total. How many did you count?",
  tag: "writes_the_total",
  tag2: "adds_both_numbers",
  rounds: [
    { say: "Key in the number that goes in the box.", q: "8 + ▢ = 11", ans: 3, trap: 11, trap2: 19, why: "11 is the total. What do you add to 8 to get there?", win: "8 + 3 = 11." },
    { say: "What goes in the box?", q: "6 + ▢ = 14", ans: 8, trap: 14, trap2: 20, why: "14 is the total. Count up from 6 to 14.", win: "6 + 8 = 14." },
    { say: "Find the missing number by yourself.", alt: [{ q: "9 + ▢ = 15", ans: 6, trap: 15, trap2: 24 }, { q: "7 + ▢ = 12", ans: 5, trap: 12, trap2: 19 }, { q: "5 + ▢ = 13", ans: 8, trap: 13, trap2: 18 }] },
  ],
}));
