// Thousandths in Words. Skill 5.NBT.A.3-1.
// Reading and writing decimals to thousandths in standard, word and expanded form. Reading 0.305 as three hundred five is the known slip.
Sidekick.game(Sidekick.play({
  title: "Thousandths in Words",
  emoji: "🔤",
  premise: "Read a decimal by its last place. 0.305 ends in the thousandths place, so it is counted in thousandths.",
  outro: "Name a decimal by the place of its last digit.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "Which place is the last digit in? That place names the decimal.",
  tag: "reads_decimal_as_whole",
  rounds: [
    { say: "Match each decimal to its name.", rows: [["0.305", "three hundred five thousandths"], ["0.35", "thirty-five hundredths"]], extra: "three hundred five|three and five tenths", trap: [0, "three hundred five"], why: "The 5 sits in the thousandths place, so the number is counted in thousandths.", win: "Thousandths and hundredths." },
    { say: "Match each expanded form to its decimal.", fs: 5, rows: [["3 × {1/10} + 5 × {1/1000}", "0.305"], ["3 × {1/10} + 5 × {1/100}", "0.35"], ["3 × 1 + 5 × {1/100}", "3.05"]], extra: "0.035", trap: [0, "0.35"], why: "5 thousandths go three places after the point.", win: "0.305, 0.35 and 3.05." },
    { say: "Key in the decimal by yourself.", kind: "type", icon: "🔤", alt: [{ q: "Write four hundred seven thousandths as a decimal.", ans: "0.407", trap: "0.47" }, { q: "Write sixty-two thousandths as a decimal.", ans: "0.062", trap: "0.62" }, { q: "Write 2 + 5 × {1/100} as a decimal.", ans: "2.05", trap: "2.5" }] },
  ],
}));
