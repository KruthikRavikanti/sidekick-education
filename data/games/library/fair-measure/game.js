// Fair Measure. Skill 1.MD.A.2-3.
// Using same-size units only: descriptions of measuring are sorted into good and needs a fix. Mixing big and small units is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fair Measure",
  emoji: "📎",
  premise: "Not every way of measuring is fair. Sort the good measuring from the measuring that needs a fix.",
  outro: "Good measuring uses units that are all the same size, touching, with no spaces.",
  scene: "paper",
  kind: "sort",
  hint: "Are all the units the same size? Do they touch with no spaces?",
  tag: "mixes_unit_sizes",
  rounds: [
    { say: "Is this good measuring, or does it need a fix?", bins: "Good measuring|Needs a fix", items: ["5 small clips, all touching|4 big clips, all the same", "3 big clips and 4 small clips|5 clips with spaces between"], trap: ["3 big clips and 4 small clips", 0], why: "The units must all be the same size.", win: "Same size, touching, no spaces." },
    { say: "Check each way of measuring.", bins: "Good measuring|Needs a fix", items: ["6 cubes in a row, all touching|7 pennies, edge to edge", "2 long straws and 3 short straws|4 cubes that overlap"], trap: ["2 long straws and 3 short straws", 0], why: "Long and short straws are different sizes. Pick one size.", win: "You spotted the fair measuring." },
    { say: "Sort these by yourself.", bins: "Good measuring|Needs a fix", items: ["8 tiles, side by side|5 same-size sticks, end to end", "3 big steps and 2 baby steps|6 clips, some big, some small|4 blocks with spaces between"], trap: ["6 clips, some big, some small", 0] },
  ],
}));
