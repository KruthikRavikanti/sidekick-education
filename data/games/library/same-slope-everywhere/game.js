// Same Slope Everywhere. Skill 8.EE.B.6-1.
// Using similar triangles to explain why the slope is the same between any two points on a line. Thinking the slope changes along the line is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Slope Everywhere",
  emoji: "📐",
  premise: "Pick any two points on a line and draw the slope triangle. Big or small, the triangles are similar, so rise over run never changes.",
  outro: "The slope between any two points on a line is the same.",
  scene: "paper",
  kind: "type",
  icon: "📐",
  hint: "Find rise and run between those two points. Divide.",
  tag: "slope_changes_along_line",
  rounds: [
    { say: "Key in the slope between the last two points.", q: "On one line: (1, 2), (3, 6), (5, 10). The slope between the first two is 2.", ans: 2, trap: 4, why: "The line does not get steeper. From (3, 6) to (5, 10) is 4 up for 2 across.", win: "4 ÷ 2 = 2, the same as before." },
    { say: "True or not true?", kind: "sort", fs: 4.8, bins: "True|Not true", items: ["Any two points on a line give the same slope|A bigger slope triangle has the same rise ÷ run", "The slope grows farther along the line|Slope depends on which two points you pick"], trap: ["The slope grows farther along the line", 0], why: "A straight line has one steepness the whole way.", win: "One line, one slope." },
    { say: "Find the slope by yourself.", alt: [{ q: "On one line: (0, 0), (2, 6), (4, 12). Find the slope between the last two points.", ans: 3, trap: 6 }, { q: "On one line: (1, 1), (2, 3), (5, 9). Find the slope between the last two points.", ans: 2, trap: 6 }, { q: "On one line: (0, 2), (1, 6), (3, 14). Find the slope between the last two points.", ans: 4, trap: 8 }] },
  ],
}));
