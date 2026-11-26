// Shark Bite Signs. Skill 2.NBT.A.4-2.
// Using greater than, less than and equal with three-digit numbers. Reversing the sign is the known slip.
Sidekick.game(Sidekick.play({
  title: "Shark Bite Signs",
  emoji: "🦈",
  premise: "The shark always bites toward the bigger number. Drop the right sign between each pair.",
  outro: "The open side of the sign faces the greater number.",
  scene: "ocean",
  kind: "fill",
  fs: 7,
  cast: "",
  hint: "The open side of the sign faces the bigger number.",
  tag: "reverses_the_sign",
  rounds: [
    { say: "Drop the sign that makes each one true.", rows: [["518 ___ 581", "<"], ["740 ___ 704", ">"]], extra: "=", trap: [0, ">"], why: "581 is bigger, so the open side faces 581.", win: "518 is less than 581. 740 is greater than 704." },
    { say: "Three pairs. One pair is equal.", rows: [["365 ___ 365", "="], ["299 ___ 301", "<"], ["820 ___ 802", ">"]], trap: [1, ">"], why: "301 is bigger, so the open side faces 301.", win: "Equal, less than, greater than." },
    { say: "Place the signs by yourself.", rows: [["649 ___ 694", "<"], ["500 ___ 500", "="], ["731 ___ 713", ">"]], trap: [0, ">"] },
  ],
}));
