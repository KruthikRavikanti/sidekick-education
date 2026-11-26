// Rod and Cubes. Skill K.NBT.A.1-3.
// Building a teen number from a ten and ones: the child sets a ten rod and loose cubes and watches the blocks. Leaving out the rod builds only the ones.
Sidekick.game(Sidekick.play({
  title: "Rod and Cubes",
  emoji: "🧮",
  premise: "Build teen numbers with one long ten rod and some little ones cubes.",
  outro: "A teen number is one ten and some ones.",
  scene: "desk",
  kind: "dial",
  cast: "",
  hint: "Every teen number needs one ten rod. Then add the ones.",
  tag: "leaves_out_the_ten",
  dials: [["Tens", 0, 1], ["Ones", 0, 9]],
  view: "tens",
  rounds: [
    { say: "Build 13 with a ten rod and ones.", ans: [1, 3], trap: [0, 3], why: "You need the ten rod. 13 is one ten and 3 ones.", win: "One ten and 3 ones make 13." },
    { say: "Build 17.", ans: [1, 7], trap: [0, 7], why: "You need the ten rod. 17 is one ten and 7 ones.", win: "One ten and 7 ones make 17." },
    { say: "Build this number by yourself.", alt: [{ say: "Build 15 by yourself.", ans: [1, 5], trap: [0, 5] }, { say: "Build 18 by yourself.", ans: [1, 8], trap: [0, 8] }, { say: "Build 12 by yourself.", ans: [1, 2], trap: [0, 2] }] },
  ],
}));
