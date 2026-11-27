// Llama Leaps a Hundred. Skill 2.NBT.B.8-2.
// Mentally adding or subtracting 100: only the hundreds place changes. Changing the tens digit is the known slip.
Sidekick.game(Sidekick.play({
  title: "Llama Leaps a Hundred",
  emoji: "🦙",
  premise: "A number is already built. Leap it up or down by exactly one hundred.",
  outro: "A hundred more or a hundred less changes the hundreds place.",
  scene: "sand",
  kind: "dial",
  cast: "",
  view: "tens",
  hint: "A hundred more is one more hundred flat. Leave the tens and ones alone.",
  tag: "changes_the_tens",
  rounds: [
    { say: "347 is built. Make it 100 more.", dials: [["Hundreds", 0, 9, 1, 3], ["Tens", 0, 9, 1, 4], ["Ones", 0, 9, 1, 7]], ans: [4, 4, 7], trap: [3, 5, 7], why: "That added 1 ten. A hundred more means one more hundred.", win: "347 + 100 = 447." },
    { say: "628 is built. Make it 100 less.", dials: [["Hundreds", 0, 9, 1, 6], ["Tens", 0, 9, 1, 2], ["Ones", 0, 9, 1, 8]], ans: [5, 2, 8], trap: [6, 1, 8], why: "That took away 1 ten. A hundred less means one fewer hundred.", win: "628 − 100 = 528." },
    { say: "Change it by a hundred by yourself.", alt: [{ say: "254 is built. Make it 100 more.", dials: [["Hundreds", 0, 9, 1, 2], ["Tens", 0, 9, 1, 5], ["Ones", 0, 9, 1, 4]], ans: [3, 5, 4], trap: [2, 6, 4] }, { say: "731 is built. Make it 100 less.", dials: [["Hundreds", 0, 9, 1, 7], ["Tens", 0, 9, 1, 3], ["Ones", 0, 9, 1, 1]], ans: [6, 3, 1], trap: [7, 2, 1] }] },
  ],
}));
