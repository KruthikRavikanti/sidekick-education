// Proof by Adding. Skill 3.NBT.A.2-3.
// Checking three-digit subtraction with addition: each card shows the subtraction and its check, and only correct ones add back to the starting number.
Sidekick.game(Sidekick.play({
  title: "Proof by Adding",
  emoji: "🧾",
  premise: "Every subtraction can be proved by adding back. Sort the answers whose proof really lands on the starting number.",
  outro: "To check a subtraction, add the answer to what was taken away.",
  scene: "paper",
  kind: "sort",
  hint: "Add the answer and the number taken away. You should get the starting number.",
  tag: "does_not_check",
  rounds: [
    { say: "Does the adding check land on the starting number?", bins: "Checks out|Does not check", items: ["604 − 278 = 326, since 326 + 278 = 604|500 − 164 = 336, since 336 + 164 = 500", "731 − 245 = 514, since 514 + 245 = 759|420 − 187 = 247, since 247 + 187 = 434"], trap: ["731 − 245 = 514, since 514 + 245 = 759", 0], why: "The check gives 759, but the starting number was 731.", win: "A check must land on the starting number." },
    { say: "Check these answers.", bins: "Checks out|Does not check", items: ["800 − 365 = 435, since 435 + 365 = 800|652 − 148 = 504, since 504 + 148 = 652", "913 − 476 = 463, since 463 + 476 = 939|540 − 276 = 274, since 274 + 276 = 550"], trap: ["913 − 476 = 463, since 463 + 476 = 939", 0], why: "The check gives 939, but the starting number was 913.", win: "You caught the ones that do not add back." },
    { say: "Check these by yourself.", bins: "Checks out|Does not check", items: ["702 − 356 = 346, since 346 + 356 = 702|480 − 195 = 285, since 285 + 195 = 480", "625 − 248 = 387, since 387 + 248 = 635|901 − 564 = 347, since 347 + 564 = 911"], trap: ["625 − 248 = 387, since 387 + 248 = 635", 0] },
  ],
}));
