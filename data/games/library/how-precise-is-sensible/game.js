// How Precise Is Sensible?. Skill N-Q.A.3-1.
// Choosing a level of accuracy appropriate to limitations on measurement. Reporting far more decimal places than the data supports is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Precise Is Sensible?",
  emoji: "🎯",
  premise: "An answer cannot be more precise than the tool that measured it. Extra decimal places are just noise.",
  outro: "Report a level of accuracy that matches the measuring tool.",
  scene: "desk",
  kind: "sort",
  fs: 5.2,
  hint: "What is the smallest mark on the tool? Stop near there.",
  tag: "too_many_decimals",
  rounds: [
    { say: "A ruler marked in millimeters measures a table. Which reports are sensible?", bins: "Sensible|Too precise", items: ["152.4 cm|152 cm", "152.43817 cm|152.4381726 cm"], trap: ["152.43817 cm", 0], why: "A millimeter ruler cannot see past one decimal place of a centimeter.", win: "Match the tool." },
    { say: "A bathroom scale shows whole pounds. Sort the reports.", bins: "Sensible|Too precise", items: ["143 pounds|about 140 pounds", "143.2281 pounds|143.00004 pounds"], trap: ["143.2281 pounds", 0], why: "The scale shows only whole pounds.", win: "No more digits than the tool gives." },
    { say: "A stopwatch shows tenths of a second. Sort by yourself.", bins: "Sensible|Too precise", items: ["12.4 seconds|12 seconds", "12.43871 seconds|12.400003 seconds"], trap: ["12.43871 seconds", 0] },
  ],
}));
