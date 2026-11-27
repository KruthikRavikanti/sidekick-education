// Hundred Tile Floor. Skill 4.NF.C.5-1.
// Renaming tenths as hundredths: 3/10 = 30/100, shown by painting three columns of a hundred grid. Treating them as different amounts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Hundred Tile Floor",
  emoji: "🟧",
  premise: "A floor of 100 tiles has 10 columns. Each column is one tenth, and each tile is one hundredth.",
  outro: "One tenth is ten hundredths, so 3 tenths is 30 hundredths.",
  scene: "paper",
  kind: "fill",
  fs: 5.5,
  pSize: 6,
  cast: "",
  hint: "Each tenth is a whole column of 10 small squares.",
  tag: "thinks_amounts_differ",
  rounds: [
    { say: "Each column is one tenth. Paint 3 tenths. How many small squares is that?", kind: "paint", grid: [10, 10], need: 30, noun: "Hundredths", trap: 3, why: "Three squares are 3 hundredths. Three tenths is 3 whole columns.", win: "3 tenths is the same as 30 hundredths." },
    { say: "Rename each as hundredths.", rows: [["{3/10} =", "{30/100}"], ["{7/10} =", "{70/100}"]], extra: "{3/100} {7/100}", trap: [0, "{3/100}"], why: "Three hundredths is only 3 small squares. Three tenths is 3 columns.", win: "Thirty hundredths and seventy hundredths." },
    { say: "Rename these by yourself.", rows: [["{5/10} =", "{50/100}"], ["{9/10} =", "{90/100}"], ["{2/10} =", "{20/100}"]], extra: "{5/100} {9/100}", trap: [0, "{5/100}"] },
  ],
}));
