// Number Speller. Skill 1.NBT.A.1-2.
// Writing numerals to 120: one hundred twelve is 112, not 100 followed by 12. Extra zero tiles let the known slip be built.
Sidekick.game(Sidekick.play({
  title: "Number Speller",
  emoji: "🔢",
  premise: "The parrot says a big number. Spell it with digits, using just the right number of them.",
  outro: "Numbers from 100 to 120 are written with three digits.",
  scene: "desk",
  kind: "row",
  cast: "🦜",
  hint: "One hundred and something has three digits in all.",
  tag: "writes_100_then_number",
  rounds: [
    { say: "Spell the number with digits.", q: "one hundred five", seq: "1 0 5", extra: "0", trap: "1 0 0 5", why: "That has too many digits. One hundred five is 1, 0, 5.", win: "105." },
    { say: "Spell this number with digits.", q: "one hundred twelve", seq: "1 1 2", extra: "0 0", trap: "1 0 0 1 2", why: "Do not write 100 and then 12. One hundred twelve is 1, 1, 2.", win: "112." },
    { say: "Spell this number by yourself.", alt: [{ q: "one hundred seventeen", seq: "1 1 7", extra: "0 0", trap: "1 0 0 1 7" }, { q: "one hundred nine", seq: "1 0 9", extra: "0", trap: "1 0 0 9" }, { q: "one hundred fourteen", seq: "1 1 4", extra: "0 0", trap: "1 0 0 1 4" }] },
  ],
}));
