// Hungry Gator. Skill 1.NBT.B.3-2.
// Using the symbols for greater than, less than and equal: the child places a sign between two numbers and reads the comparison. Reversing the sign is the known slip.
Sidekick.game(Sidekick.play({
  title: "Hungry Gator",
  emoji: "🐊",
  premise: "The gator always opens its mouth toward the bigger number. Drop the right sign between each pair.",
  outro: "The open side of the sign faces the greater number.",
  scene: "ocean",
  kind: "fill",
  fs: 7,
  cast: "",
  hint: "The open side of the sign faces the bigger number.",
  tag: "reverses_the_sign",
  rounds: [
    { say: "Drop the sign that makes each one true.", rows: [["47 ___ 74", "<"], ["63 ___ 36", ">"]], extra: "=", trap: [0, ">"], why: "The open side faces the bigger number. 74 is bigger.", win: "47 is less than 74. 63 is greater than 36." },
    { say: "Three pairs. One pair is equal.", rows: [["58 ___ 58", "="], ["29 ___ 92", "<"], ["81 ___ 18", ">"]], trap: [1, ">"], why: "92 is bigger, so the open side faces 92.", win: "Equal, less than, greater than." },
    { say: "Place the signs by yourself.", rows: [["35 ___ 53", "<"], ["70 ___ 70", "="], ["64 ___ 46", ">"]], trap: [0, ">"] },
  ],
}));
