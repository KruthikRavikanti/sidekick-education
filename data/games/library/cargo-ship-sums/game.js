// Cargo Ship Sums. Skill 4.NBT.B.4-1.
// Adding multi-digit numbers with the standard algorithm. Dropping the carried digits is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cargo Ship Sums",
  emoji: "🚢",
  premise: "Big numbers are loaded place by place. When a place overflows, the extra is carried to the next one.",
  outro: "Add each place from the right and carry whenever a place reaches ten.",
  scene: "ocean",
  kind: "type",
  icon: "🚢",
  hint: "Start at the ones. Carry a 1 whenever a place adds to 10 or more.",
  tag: "drops_the_carries",
  rounds: [
    { say: "Key in the total.", q: "3,456 + 2,378", ans: 5834, trap: 5724, why: "6 + 8 is 14. The new ten must be added to the tens.", win: "3,456 + 2,378 = 5,834." },
    { say: "A bigger load.", q: "45,678 + 27,594", ans: 73272, trap: 62162, why: "Almost every place overflows here. Carry each time.", win: "45,678 + 27,594 = 73,272." },
    { say: "Key in the total by yourself.", alt: [{ q: "26,489 + 15,736", ans: 42225, trap: 31115 }, { q: "8,967 + 4,585", ans: 13552, trap: 12442 }] },
  ],
}));
