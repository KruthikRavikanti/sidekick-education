// Dino Stomp. Skill K.CC.A.1-3.
// Counting by tens: every tile in the row is ten more than the last, and a tile like 21 is there to catch counting on by ones.
Sidekick.game(Sidekick.play({
  title: "Dino Stomp",
  emoji: "🦕",
  premise: "The dinosaur takes giant steps of ten. Lay down its footprints so every step is ten more.",
  outro: "Ten, twenty, thirty... you stomped by tens!",
  scene: "sand",
  kind: "row",
  fs: 5,
  cast: "🦕 🌴 🌋 🌴",
  hint: "Each stomp is ten more: 10, 20, 30...",
  tag: "mixes_in_ones",
  rounds: [
    { say: "Lay the footprints counting by tens.", seq: "10 20 30 40 50", extra: "21", trap: "10 20 21 30 40", why: "21 is only one more than 20. A giant step is ten more.", win: "Ten, twenty, thirty, forty, fifty!" },
    { say: "Keep stomping by tens from 50.", seq: "50 60 70 80 90", extra: "61", trap: "50 60 61 70 80", why: "61 is only one more than 60. Step by ten.", win: "Fifty, sixty, seventy, eighty, ninety!" },
    { say: "Lay these giant steps by yourself.", alt: [{ seq: "30 40 50 60 70", extra: "41", trap: "30 40 41 50 60" }, { seq: "60 70 80 90 100", extra: "71", trap: "60 70 71 80 90" }, { seq: "20 30 40 50 60", extra: "31", trap: "20 30 31 40 50" }] },
  ],
}));
