// Take a Ten Away. Skill 1.NBT.C.5-2.
// Finding 10 less than a two-digit number: one ten rod goes and the ones stay. Changing the ones digit instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Take a Ten Away",
  emoji: "🧃",
  premise: "A number is already built with rods and cubes. Make it exactly ten less.",
  outro: "Ten less means one fewer ten. The ones stay the same.",
  scene: "kitchen",
  kind: "dial",
  cast: "",
  view: "tens",
  hint: "Ten less is one fewer ten rod. Leave the ones alone.",
  tag: "changes_the_ones",
  rounds: [
    { say: "62 is built. Make it 10 less.", dials: [["Tens", 0, 9, 1, 6], ["Ones", 0, 9, 1, 2]], ans: [5, 2], trap: [6, 1], why: "That took away 1 one. Ten less means one fewer ten rod.", win: "10 less than 62 is 52." },
    { say: "47 is built. Make it 10 less.", dials: [["Tens", 0, 9, 1, 4], ["Ones", 0, 9, 1, 7]], ans: [3, 7], trap: [4, 6], why: "That took away 1 one. Take away a ten rod.", win: "10 less than 47 is 37." },
    { say: "Make it 10 less by yourself.", alt: [{ say: "85 is built. Make it 10 less.", dials: [["Tens", 0, 9, 1, 8], ["Ones", 0, 9, 1, 5]], ans: [7, 5], trap: [8, 4] }, { say: "39 is built. Make it 10 less.", dials: [["Tens", 0, 9, 1, 3], ["Ones", 0, 9, 1, 9]], ans: [2, 9], trap: [3, 8] }, { say: "53 is built. Make it 10 less.", dials: [["Tens", 0, 9, 1, 5], ["Ones", 0, 9, 1, 3]], ans: [4, 3], trap: [5, 2] }] },
  ],
}));
