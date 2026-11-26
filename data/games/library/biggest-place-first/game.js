// Biggest Place First. Skill 2.NBT.A.4-1.
// Comparing three-digit numbers by hundreds, then tens, then ones: 301 is greater than 299 even though 299 has bigger digits.
Sidekick.game(Sidekick.play({
  title: "Biggest Place First",
  emoji: "🏔️",
  premise: "To compare big numbers, start at the biggest place. Line the numbers up from least to greatest.",
  outro: "Compare hundreds first, then tens, then ones.",
  scene: "snow",
  kind: "row",
  cast: "",
  hint: "Look at the hundreds first. More hundreds means a bigger number.",
  tag: "big_digits_mean_bigger",
  rounds: [
    { say: "Line up the numbers from least to greatest.", seq: "299 301 310", trap: "301 310 299", why: "299 has only 2 hundreds. It is the smallest.", win: "299, 301, 310." },
    { say: "Four numbers. Least to greatest.", seq: "189 198 201 210", trap: "201 210 189 198", why: "Numbers with 1 hundred come before numbers with 2 hundreds.", win: "189, 198, 201, 210." },
    { say: "Line these up by yourself.", alt: [{ seq: "399 401 410 499", trap: "401 410 399 499" }, { seq: "578 587 601 610", trap: "601 610 578 587" }] },
  ],
}));
