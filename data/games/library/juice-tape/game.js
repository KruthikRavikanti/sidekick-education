// Juice Tape. Skill 6.RP.A.1-3.
// Representing ratios with tape diagrams: equal-size parts are set for each quantity. Reversing the ratio or scaling only one quantity is the known slip.
Sidekick.game(Sidekick.play({
  title: "Juice Tape",
  emoji: "🧃",
  premise: "A tape diagram shows a ratio with equal-size boxes. Build the recipe one box at a time.",
  outro: "In a tape diagram every box is the same size, so the counts of boxes show the ratio.",
  scene: "kitchen",
  kind: "dial",
  cast: "",
  view: { type: "mix", icons: "🟧 🟦", rows: true },
  hint: "Orange boxes are juice. Blue boxes are water. Every box is one equal part.",
  tag: "misbuilds_tape",
  rounds: [
    { say: "The recipe is 2 parts juice to 3 parts water. Build the tape.", dials: [["Juice", 0, 8], ["Water", 0, 8]], ans: [2, 3], trap: [3, 2], why: "Juice is named first, so juice gets 2 boxes.", win: "2 boxes of juice for 3 of water." },
    { say: "Double the recipe. Keep the ratio 2 to 3.", dials: [["Juice", 0, 8, 1, 2], ["Water", 0, 8, 1, 3]], ans: [4, 6], trap: [4, 3], why: "Both amounts must double, or the taste changes.", win: "4 to 6 is the same ratio as 2 to 3." },
    { say: "Build the tape by yourself.", alt: [{ say: "Paint mix: 3 parts red to 1 part white. Build it, then triple it.", dials: [["Red", 0, 9], ["White", 0, 9]], view: { type: "mix", icons: "🟥 ⬜", rows: true }, ans: [9, 3], trap: [9, 1] }, { say: "Trail mix: 2 parts nuts to 5 parts raisins. Build it.", dials: [["Nuts", 0, 8], ["Raisins", 0, 8]], view: { type: "mix", icons: "🟫 🟪", rows: true }, ans: [2, 5], trap: [5, 2] }] },
  ],
}));
