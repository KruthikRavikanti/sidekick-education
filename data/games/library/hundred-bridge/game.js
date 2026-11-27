// Hundred Bridge. Skill 1.NBT.A.1-1.
// Counting to 120 across one hundred: the child orders planks such as 98, 99, 100, 101. A plank with a jump (110 after 100) is there to catch the known slip.
Sidekick.game(Sidekick.play({
  title: "Hundred Bridge",
  emoji: "🌉",
  premise: "The bridge crosses right over one hundred. Lay the number planks in counting order so cars can cross.",
  outro: "After 100 comes 101, and the counting keeps going the same way.",
  scene: "city",
  kind: "row",
  fs: 5,
  cast: "🌉 🚗 🚕 🚙",
  hint: "After 100, count the same way again: 101, 102, 103.",
  tag: "jumps_after_100",
  rounds: [
    { say: "Lay the planks in counting order.", seq: "98 99 100 101", extra: "110", trap: "98 99 100 110", why: "After 100 comes 101. 110 is ten more.", win: "98, 99, 100, 101." },
    { say: "Keep counting past one hundred ten.", seq: "108 109 110 111", extra: "120", trap: "108 109 120 111", why: "After 109 comes 110, then 111.", win: "108, 109, 110, 111." },
    { say: "Lay these planks by yourself.", alt: [{ seq: "99 100 101 102", extra: "110", trap: "99 100 110 101" }, { seq: "109 110 111 112", extra: "120", trap: "109 120 111 112" }, { seq: "117 118 119 120", extra: "109", trap: "117 118 109 120" }] },
  ],
}));
