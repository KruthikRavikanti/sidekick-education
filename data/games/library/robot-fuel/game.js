// Robot Fuel. Skill 2.NBT.B.5-1.
// Adding two-digit numbers by place value: the child keys in a total, and forgetting the new ten made by the ones gives a number that is ten too small.
Sidekick.game(Sidekick.play({
  title: "Robot Fuel",
  emoji: "🤖",
  premise: "The robot runs on numbers. Key in the right total to fuel it up.",
  outro: "The robot is fully fueled. Tens with tens, ones with ones.",
  scene: "space",
  kind: "type",
  hint: "Add the ones first. If you get ten or more, make a new ten.",
  tag: "forgets_the_new_ten",
  rounds: [
    { say: "Key in the total fuel.", q: "24 + 13", ans: 37, trap: 36, why: "Add the ones: 4 + 3. Then the tens: 2 tens + 1 ten.", win: "24 + 13 = 37." },
    { say: "This one makes a new ten. Key in the total.", q: "28 + 15", ans: 43, trap: 33, why: "8 + 5 is 13. That is a new ten to add.", win: "28 + 15 = 43." },
    { say: "Key in the total fuel.", alt: [{ q: "37 + 26", ans: 63, trap: 53 }, { q: "48 + 17", ans: 65, trap: 55 }, { q: "47 + 38", ans: 85, trap: 75 }] },
  ],
}));
