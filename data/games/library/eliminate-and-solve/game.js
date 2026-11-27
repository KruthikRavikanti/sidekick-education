// Eliminate and Solve. Skill A-REI.C.6-1.
// Solving systems of linear equations exactly. Dropping a sign when combining equations is the known slip.
Sidekick.game(Sidekick.play({
  title: "Eliminate and Solve",
  emoji: "🧹",
  premise: "Line up two equations so that adding them removes one variable. Then solve what is left.",
  outro: "Scale an equation if needed, add or subtract to eliminate a variable, then substitute back.",
  scene: "desk",
  kind: "type",
  icon: "🧹",
  hint: "Add the equations term by term. Watch the signs on y.",
  tag: "drops_sign_combining",
  rounds: [
    { say: "Solve 2x + 3y = 12 and x − y = 1. Put the steps in place.", kind: "fill", fs: 5.4, cast: "", rows: [["multiply x − y = 1 by 3", "3x − 3y = 3"], ["add it to 2x + 3y = 12", "5x = 15"], ["solve", "x = 3, y = 2"]], extra: "5x = 9|", trap: [1, "5x = 9"], why: "12 + 3 is 15. The 3 is added, not subtracted.", win: "The y terms cancelled." },
    { say: "Add the equations to remove y. Key in x.", q: "3x + y = 11 and x − y = 1", ans: 3, trap: 5, why: "Adding gives 4x = 12. Subtracting would not remove y.", win: "4x = 12, so x = 3." },
    { say: "Key in x by yourself.", alt: [{ q: "2x + y = 9 and x − y = 3", ans: 4, trap: 6 }, { q: "x + 2y = 8 and x − 2y = 0", ans: 4, trap: 8 }, { q: "4x + y = 14 and 2x − y = 4", ans: 3, trap: 5 }] },
  ],
}));
