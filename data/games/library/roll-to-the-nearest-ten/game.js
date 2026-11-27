// Roll to the Nearest Ten. Skill 3.NBT.A.1-3.
// Using a number line to round: the ball starts on the number and rolls to the nearer ten. Rolling the other way is the known slip.
Sidekick.game(Sidekick.play({
  title: "Roll to the Nearest Ten",
  emoji: "⚽",
  premise: "The ball sits on a number between two tens. Roll it to the ten it is closer to.",
  outro: "A number rounds to the ten it is closest to. Halfway or more rolls up.",
  scene: "field",
  kind: "line",
  cast: "",
  icon: "⚽",
  hint: "Find the halfway point. Which side of it is the ball on?",
  tag: "rounds_the_other_way",
  rounds: [
    { say: "43 is between 40 and 50. Roll the ball to the nearer ten.", line: [40, 50, 1], marks: [[45, "halfway"]], from: 43, ans: 40, trap: 50, why: "43 is before the halfway point, so it is closer to 40.", win: "43 rounds to 40." },
    { say: "78 is between 70 and 80. Roll the ball to the nearer ten.", line: [70, 80, 1], marks: [[75, "halfway"]], from: 78, ans: 80, trap: 70, why: "78 is past the halfway point, so it is closer to 80.", win: "78 rounds to 80." },
    { say: "Roll the ball by yourself.", alt: [{ say: "26 is between 20 and 30. Roll the ball to the nearer ten.", line: [20, 30, 1], marks: [[25, "halfway"]], from: 26, ans: 30, trap: 20 }, { say: "64 is between 60 and 70. Roll the ball to the nearer ten.", line: [60, 70, 1], marks: [[65, "halfway"]], from: 64, ans: 60, trap: 70 }] },
  ],
}));
