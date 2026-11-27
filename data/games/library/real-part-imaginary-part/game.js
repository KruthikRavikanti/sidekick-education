// Real Part, Imaginary Part. Skill N-CN.A.1-2.
// Writing complex numbers in the form a + bi with a and b real. Treating i as a variable, or merging the parts, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Real Part, Imaginary Part",
  emoji: "🧩",
  premise: "Every complex number has two parts that stay separate: a real part and an imaginary part, written a + bi.",
  outro: "Write complex numbers as a + bi. The square root of −25 is 5i.",
  scene: "space",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Take the square root of the positive number, then attach i.",
  tag: "merges_real_and_imaginary",
  rounds: [
    { say: "Write each one in the form a + bi.", rows: [["4 + √(−25)", "4 + 5i"], ["√(−9)", "3i"]], extra: "9 −3", trap: [0, "9"], why: "√(−25) is 5i, an imaginary part. It cannot be added to the real 4.", win: "Real part 4, imaginary part 5." },
    { say: "Name the parts of 3 − 7i.", rows: [["real part", "3"], ["imaginary part", "−7"]], extra: "7i −4", trap: [1, "−4"], why: "3 and −7 never combine. They are different kinds of number.", win: "a = 3, b = −7." },
    { say: "Write each one as a + bi by yourself.", alt: [{ rows: [["2 + √(−16)", "2 + 4i"], ["√(−49)", "7i"], ["5 − √(−4)", "5 − 2i"]], extra: "6 3", trap: [0, "6"] }, { rows: [["1 + √(−36)", "1 + 6i"], ["√(−81)", "9i"], ["8 − √(−1)", "8 − i"]], extra: "7 −9", trap: [0, "7"] }] },
  ],
}));
