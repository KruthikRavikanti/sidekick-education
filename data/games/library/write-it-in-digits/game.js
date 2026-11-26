// Write It in Digits. Skill 2.NBT.A.3-1.
// Writing numerals to 1000: three hundred fifty-two is 352, not 300 followed by 52. Extra zeros let the known slip be built.
Sidekick.game(Sidekick.play({
  title: "Write It in Digits",
  emoji: "✍️",
  premise: "The owl reads a number out loud. Write it with exactly three digits.",
  outro: "A number in the hundreds is written with three digits.",
  scene: "desk",
  kind: "row",
  cast: "🦉",
  hint: "One digit for the hundreds, one for the tens, one for the ones.",
  tag: "writes_hundreds_then_number",
  rounds: [
    { say: "Write the number with digits.", q: "three hundred fifty-two", seq: "3 5 2", extra: "0 0", trap: "3 0 0 5 2", why: "Do not write 300 and then 52. It is 3, 5, 2.", win: "352." },
    { say: "Write this number with digits.", q: "six hundred eight", seq: "6 0 8", extra: "0", trap: "6 0 0 8", why: "Six hundred eight has no tens: 6, 0, 8.", win: "608." },
    { say: "Write this number by yourself.", alt: [{ q: "four hundred seventy-one", seq: "4 7 1", extra: "0 0", trap: "4 0 0 7 1" }, { q: "nine hundred thirty", seq: "9 3 0", extra: "0 0", trap: "9 0 0 3 0" }] },
  ],
}));
