// Four Rooms. Skill 4.NBT.B.5-2.
// Multiplying two two-digit numbers with an area model: there are four partial products. Using only tens times tens and ones times ones is the known slip.
Sidekick.game(Sidekick.play({
  title: "Four Rooms",
  emoji: "🏘️",
  premise: "Split each number into tens and ones and you get a house with four rooms. Every room is part of the product.",
  outro: "Two-digit times two-digit has four parts. Add all four.",
  scene: "paper",
  kind: "type",
  icon: "🏘️",
  hint: "There are four rooms in the box. Add all four numbers.",
  tag: "uses_only_two_parts",
  rounds: [
    { say: "Add all four rooms to find 12 × 13.", fig: { type: "table", rows: [["×", "10", "3"], ["10", "100", "30"], ["2", "20", "6"]] }, ans: 156, trap: 106, why: "That is only two of the rooms. Add the 30 and the 20 as well.", win: "100 + 30 + 20 + 6 = 156." },
    { say: "Add all four rooms to find 23 × 45.", fig: { type: "table", rows: [["×", "40", "5"], ["20", "800", "100"], ["3", "120", "15"]] }, ans: 1035, trap: 815, why: "That is only two of the rooms. Add the 100 and the 120 as well.", win: "800 + 100 + 120 + 15 = 1,035." },
    { say: "Add the four rooms by yourself.", alt: [{ say: "Add all four rooms to find 34 × 21.", fig: { type: "table", rows: [["×", "20", "1"], ["30", "600", "30"], ["4", "80", "4"]] }, ans: 714, trap: 604 }, { say: "Add all four rooms to find 15 × 32.", fig: { type: "table", rows: [["×", "30", "2"], ["10", "300", "20"], ["5", "150", "10"]] }, ans: 480, trap: 310 }] },
  ],
}));
