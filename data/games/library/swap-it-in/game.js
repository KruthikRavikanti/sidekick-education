// Swap It In. Skill 8.EE.C.8-3.
// Solving systems algebraically by substitution and elimination. Substituting into the same equation it came from is the known slip.
Sidekick.game(Sidekick.play({
  title: "Swap It In",
  emoji: "🔄",
  premise: "If one equation says what y equals, put that in place of y in the OTHER equation. Then there is only x to solve for.",
  outro: "Substitute an expression from one equation into the other one, then solve.",
  scene: "desk",
  kind: "type",
  icon: "🔄",
  hint: "Take what y equals and put it into the other equation.",
  tag: "substitutes_into_same_equation",
  rounds: [
    { say: "Solve y = 2x and x + y = 12. Put the steps in place.", kind: "fill", fs: 5.8, cast: "", rows: [["replace y with 2x", "x + 2x = 12"], ["combine", "3x = 12"], ["solve", "x = 4, y = 8"]], extra: "2x = 2x|", trap: [0, "2x = 2x"], why: "That put y = 2x back into itself. Use the other equation.", win: "x = 4 and y = 8." },
    { say: "Key in the value of x.", q: "y = 3x and x + y = 20", ans: 5, trap: 10, why: "Replace y with 3x: x + 3x = 20, so 4x = 20.", win: "x = 5, and y = 15." },
    { say: "Add the two equations to remove y. Key in x.", q: "x + y = 10 and x − y = 4", ans: 7, trap: 3, why: "Adding gives 2x = 14. 3 is the value of y.", win: "2x = 14, so x = 7." },
    { say: "Key in the value of x by yourself.", alt: [{ q: "y = x + 2 and x + y = 10", ans: 4, trap: 8 }, { q: "y = 4x and x + y = 15", ans: 3, trap: 5 }, { q: "x + y = 12 and x − y = 2", ans: 7, trap: 5 }] },
  ],
}));
