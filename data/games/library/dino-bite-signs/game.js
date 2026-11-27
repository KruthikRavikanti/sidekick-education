// Dino Bite Signs. Skill GA-3-NR.1.1-2.
// Comparing four-digit numbers with symbols: comparison starts at the greatest place. Comparing from the right is the known slip.
Sidekick.game(Sidekick.play({
  title: "Dino Bite Signs",
  emoji: "🦖",
  premise: "The dinosaur always bites toward the bigger number. Compare from the thousands down.",
  outro: "Compare four-digit numbers starting with the thousands place.",
  scene: "sand",
  kind: "fill",
  fs: 7,
  cast: "",
  hint: "Start at the left. The first place where the digits differ decides.",
  tag: "compares_from_the_right",
  rounds: [
    { say: "Drop the sign that makes each one true.", rows: [["4,089 ___ 4,809", "<"], ["7,310 ___ 7,301", ">"]], extra: "=", trap: [0, ">"], why: "Both have 4 thousands. Then 0 hundreds is less than 8 hundreds.", win: "4,089 is less than 4,809." },
    { say: "Three pairs. One pair is equal.", rows: [["5,620 ___ 5,620", "="], ["2,999 ___ 3,001", "<"], ["8,450 ___ 8,405", ">"]], trap: [1, ">"], why: "3 thousands is more than 2 thousands.", win: "Equal, less than, greater than." },
    { say: "Place the signs by yourself.", rows: [["6,078 ___ 6,708", "<"], ["9,100 ___ 9,100", "="], ["3,521 ___ 3,512", ">"]], trap: [0, ">"] },
  ],
}));
