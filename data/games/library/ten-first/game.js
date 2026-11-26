// Ten First. Skill 1.OA.A.2-2.
// Making ten first when adding three numbers: the child finds which addend is left after two others make ten. Going left to right picks the third number instead.
Sidekick.game(Sidekick.play({
  title: "Ten First",
  emoji: "🎯",
  premise: "Adding three numbers is quicker when two of them make a ten. Spot the ten, then see what is left.",
  outro: "Look for a pair that makes 10 before you add.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Which two numbers make 10? The other one is what is left.",
  tag: "adds_left_to_right",
  rounds: [
    { say: "Two numbers make a ten. Drag in the number that is left.", rows: [["7 + 5 + 3 = 10 + ___", "5"], ["4 + 6 + 8 = 10 + ___", "8"]], extra: "3 6", trap: [0, "3"], why: "7 and 3 make the ten. The 5 is what is left.", win: "10 + 5 and 10 + 8." },
    { say: "Find the ten in each one.", rows: [["2 + 9 + 8 = 10 + ___", "9"], ["1 + 6 + 9 = 10 + ___", "6"]], extra: "8 1", trap: [0, "8"], why: "2 and 8 make the ten. The 9 is what is left.", win: "10 + 9 and 10 + 6." },
    { say: "Find the ten by yourself.", rows: [["5 + 7 + 5 = 10 + ___", "7"], ["3 + 4 + 7 = 10 + ___", "4"], ["6 + 9 + 4 = 10 + ___", "9"]], extra: "5 3 6", trap: [0, "5"] },
  ],
}));
