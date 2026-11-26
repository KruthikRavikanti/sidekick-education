// Stretch the Number. Skill 2.NBT.A.3-3.
// Expanded form: 352 is 300 + 50 + 2, not 3 + 5 + 2. Tiles with the bare digits let the known slip be made.
Sidekick.game(Sidekick.play({
  title: "Stretch the Number",
  emoji: "🪗",
  premise: "Pull a number apart to show what each digit is worth. Drop in the piece that is missing.",
  outro: "Expanded form shows the value of every digit: 352 = 300 + 50 + 2.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "What is the digit worth in its place?",
  tag: "adds_bare_digits",
  rounds: [
    { say: "Drop in the missing piece of each stretched number.", rows: [["352 = ___ + 50 + 2", "300"], ["614 = 600 + ___ + 4", "10"]], extra: "3 1", trap: [0, "3"], why: "The 3 in 352 means 3 hundreds. That is 300.", win: "300 + 50 + 2 and 600 + 10 + 4." },
    { say: "Stretch these numbers.", rows: [["478 = 400 + ___ + 8", "70"], ["905 = ___ + 5", "900"]], extra: "7 9", trap: [0, "7"], why: "The 7 in 478 means 7 tens. That is 70.", win: "400 + 70 + 8 and 900 + 5." },
    { say: "Stretch these by yourself.", rows: [["263 = ___ + 60 + 3", "200"], ["531 = 500 + ___ + 1", "30"], ["740 = 700 + ___", "40"]], extra: "2 3 4", trap: [0, "2"] },
  ],
}));
