// Check It Back. Skill 2.NBT.B.5-3.
// Using the relationship between addition and subtraction to check: each card shows a subtraction and its addition check, and the child sorts those that check out.
Sidekick.game(Sidekick.play({
  title: "Check It Back",
  emoji: "🔁",
  premise: "Adding undoes taking away. Use that to check each answer: does it really add back to the start?",
  outro: "To check a subtraction, add the answer to what you took away.",
  scene: "paper",
  kind: "sort",
  hint: "Add the answer and the number taken away. Do you get the starting number?",
  tag: "does_not_check",
  rounds: [
    { say: "Does the adding check match the starting number?", bins: "Checks out|Does not check", items: ["63 − 28 = 35, since 35 + 28 = 63|50 − 24 = 26, since 26 + 24 = 50", "72 − 35 = 47, since 47 + 35 = 82|41 − 17 = 34, since 34 + 17 = 51"], trap: ["72 − 35 = 47, since 47 + 35 = 82", 0], why: "The check gives 82, but the starting number was 72.", win: "A check must land on the starting number." },
    { say: "Check these answers.", bins: "Checks out|Does not check", items: ["80 − 45 = 35, since 35 + 45 = 80|56 − 29 = 27, since 27 + 29 = 56", "64 − 38 = 36, since 36 + 38 = 74|90 − 53 = 47, since 47 + 53 = 100"], trap: ["64 − 38 = 36, since 36 + 38 = 74", 0], why: "The check gives 74, but the starting number was 64.", win: "You caught the ones that do not add back." },
    { say: "Check these by yourself.", bins: "Checks out|Does not check", items: ["71 − 46 = 25, since 25 + 46 = 71|43 − 18 = 25, since 25 + 18 = 43", "55 − 27 = 38, since 38 + 27 = 65|82 − 44 = 48, since 48 + 44 = 92"], trap: ["55 − 27 = 38, since 38 + 27 = 65", 0] },
  ],
}));
