// Decimal Point Drop. Skill 4.NF.C.6-1.
// Writing tenths and hundredths as decimals: 7/100 is 0.07. Writing 0.7 for 7/100 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Decimal Point Drop",
  emoji: "💧",
  premise: "A decimal is another way to write tenths and hundredths. The first place after the point is tenths, the second is hundredths.",
  outro: "Tenths take one place after the point. Hundredths take two.",
  scene: "sky",
  kind: "type",
  icon: "💧",
  hint: "Tenths go in the first place after the point. Hundredths go in the second.",
  tag: "tenths_for_hundredths",
  rounds: [
    { say: "Key in the decimal.", q: "Write {3/10} as a decimal.", ans: "0.3", trap: "0.03", why: "0.03 is 3 hundredths. Tenths sit right after the point.", win: "Three tenths is 0.3." },
    { say: "Key in this decimal.", q: "Write {7/100} as a decimal.", ans: "0.07", trap: "0.7", why: "0.7 is 7 tenths. Hundredths need two places after the point.", win: "Seven hundredths is 0.07." },
    { say: "Key in the decimal by yourself.", alt: [{ q: "Write {9/100} as a decimal.", ans: "0.09", trap: "0.9" }, { q: "Write {45/100} as a decimal.", ans: "0.45", trap: "4.5" }, { q: "Write {6/100} as a decimal.", ans: "0.06", trap: "0.6" }] },
  ],
}));
