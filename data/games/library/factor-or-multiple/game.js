// Factor or Multiple?. Skill 4.OA.B.4-2.
// A whole number is a multiple of each of its factors: factors of 12 are sorted from multiples of 12. Swapping the two words is the known slip.
Sidekick.game(Sidekick.play({
  title: "Factor or Multiple?",
  emoji: "🧬",
  premise: "Factors go into a number. Multiples are what you get when you count by it. Sort them out.",
  outro: "Factors divide a number evenly. Multiples are the number times 1, 2, 3 and so on.",
  scene: "desk",
  kind: "sort",
  cast: "",
  hint: "Factors are the same size or smaller. Multiples are the same size or bigger.",
  tag: "confuses_factor_and_multiple",
  rounds: [
    { say: "Is it a factor of 12 or a multiple of 12?", bins: "Factor of 12|Multiple of 12", items: ["1 2 3 4 6", "24 36 48"], trap: ["24", 0], why: "24 is 12 × 2. You get it by counting by 12, so it is a multiple.", win: "Factors go into 12. Multiples come from 12." },
    { say: "Is it a factor of 20 or a multiple of 20?", bins: "Factor of 20|Multiple of 20", items: ["2 4 5 10", "40 60 100"], trap: ["40", 0], why: "40 is 20 × 2. It is a multiple of 20.", win: "Sorted." },
    { say: "Is it a factor of 18 or a multiple of 18?", bins: "Factor of 18|Multiple of 18", items: ["2 3 6 9", "36 54 90"], trap: ["36", 0] },
  ],
}));
