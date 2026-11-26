// Tens Elevator. Skill 2.NBT.B.8-1.
// Mentally adding or subtracting 10 with a three-digit number: only the tens place changes (and the hundreds when a ten crosses over). Changing the ones is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tens Elevator",
  emoji: "🛗",
  premise: "A number is already built. Ride the tens up or down by exactly one ten.",
  outro: "Ten more or ten less changes the tens place.",
  scene: "city",
  kind: "dial",
  cast: "",
  view: "tens",
  hint: "Ten more is one more ten rod. Leave the ones alone.",
  tag: "changes_the_ones",
  rounds: [
    { say: "347 is built. Make it 10 more.", dials: [["Hundreds", 0, 9, 1, 3], ["Tens", 0, 9, 1, 4], ["Ones", 0, 9, 1, 7]], ans: [3, 5, 7], trap: [3, 4, 8], why: "That added 1 one. Ten more means one more ten.", win: "347 + 10 = 357." },
    { say: "562 is built. Make it 10 less.", dials: [["Hundreds", 0, 9, 1, 5], ["Tens", 0, 9, 1, 6], ["Ones", 0, 9, 1, 2]], ans: [5, 5, 2], trap: [5, 6, 1], why: "That took away 1 one. Ten less means one fewer ten.", win: "562 − 10 = 552." },
    { say: "Change it by ten by yourself.", alt: [{ say: "425 is built. Make it 10 more.", dials: [["Hundreds", 0, 9, 1, 4], ["Tens", 0, 9, 1, 2], ["Ones", 0, 9, 1, 5]], ans: [4, 3, 5], trap: [4, 2, 6] }, { say: "718 is built. Make it 10 less.", dials: [["Hundreds", 0, 9, 1, 7], ["Tens", 0, 9, 1, 1], ["Ones", 0, 9, 1, 8]], ans: [7, 0, 8], trap: [7, 1, 7] }] },
  ],
}));
