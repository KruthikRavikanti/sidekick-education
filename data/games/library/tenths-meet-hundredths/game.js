// Tenths Meet Hundredths. Skill 4.NF.C.5-2.
// Adding tenths and hundredths by renaming: 3/10 + 4/100 = 34/100. Adding tops and bottoms (7/110) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tenths Meet Hundredths",
  emoji: "🪙",
  premise: "Tenths and hundredths are different size pieces. Rename the tenths as hundredths, then add.",
  outro: "Rename tenths as hundredths first. Then add the top numbers.",
  scene: "paper",
  kind: "type",
  icon: "🪙",
  hint: "Change the tenths into hundredths first: each tenth is 10 hundredths.",
  tag: "adds_tops_and_bottoms",
  rounds: [
    { say: "{3/10} is painted. Add {4/100} more by painting 4 small squares.", kind: "paint", cast: "", grid: [10, 10], pre: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9]], need: 4, noun: "Hundredths added", trap: 40, why: "Four hundredths is 4 small squares, not 4 columns.", win: "30 hundredths and 4 hundredths make 34 hundredths." },
    { say: "Key in the sum as hundredths.", q: "{3/10} + {4/100}", ans: "34/100", trap: "7/110", why: "Rename 3 tenths as 30 hundredths first. Then add 4 hundredths.", win: "30 hundredths + 4 hundredths = 34 hundredths." },
    { say: "Key in the sum by yourself.", alt: [{ q: "{5/10} + {7/100}", ans: "57/100", trap: "12/110" }, { q: "{2/10} + {9/100}", ans: "29/100", trap: "11/110" }] },
  ],
}));
