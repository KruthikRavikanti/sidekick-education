// Easy Chunks. Skill 5.NBT.B.6-2.
// Explaining two-digit division with equations and partial quotients: 672 ÷ 16 as 40 sixteens and 2 sixteens. Not connecting the steps to the total is the known slip.
Sidekick.game(Sidekick.play({
  title: "Easy Chunks",
  emoji: "🧀",
  premise: "Break a hard division into easy chunks. Take away friendly multiples of the divisor, then add up how many you took.",
  outro: "Subtract easy multiples of the divisor and add the partial quotients.",
  scene: "kitchen",
  kind: "fill",
  cast: "",
  hint: "Each chunk is some number of the divisor. Add those numbers for the answer.",
  tag: "does_not_add_the_parts",
  rounds: [
    { say: "Divide 672 by 16 in chunks.", rows: [["16 × 40 = 640. Left: 672 − 640 = ___", "32"], ["16 × ___ = 32", "2"], ["40 + 2 = ___", "42"]], extra: "402 12", trap: [2, "402"], why: "40 and 2 are added: 42, not 402.", win: "672 ÷ 16 = 42." },
    { say: "Divide 945 by 21 in chunks.", rows: [["21 × 40 = 840. Left: 945 − 840 = ___", "105"], ["21 × ___ = 105", "5"], ["40 + 5 = ___", "45"]], extra: "405 15", trap: [2, "405"], why: "Add the chunks: 40 + 5 is 45.", win: "945 ÷ 21 = 45." },
    { say: "Divide 1,224 by 24 in chunks by yourself.", rows: [["24 × 50 = 1,200. Left: 1,224 − 1,200 = ___", "24"], ["24 × ___ = 24", "1"], ["50 + 1 = ___", "51"]], extra: "501 15", trap: [2, "501"] },
  ],
}));
