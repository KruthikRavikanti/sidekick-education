// Check for Impostors. Skill A-REI.A.2-2.
// Solving radical equations and identifying extraneous solutions. Not checking is the known slip.
Sidekick.game(Sidekick.play({
  title: "Check for Impostors",
  emoji: "🕵️",
  premise: "Squaring both sides can create answers that do not fit the original equation. Those are extraneous. Always check.",
  outro: "After solving a radical equation, test every candidate in the original equation.",
  scene: "night",
  kind: "sort",
  fs: 5,
  hint: "Plug the value into the original. A square root is never negative.",
  tag: "does_not_check",
  rounds: [
    { say: "Squaring gave these candidates. Which ones really work?", bins: "Works|Extraneous", items: ["√(x + 2) = x with x = 2|√(x + 6) = x with x = 3", "√(x + 2) = x with x = −1|√(x + 6) = x with x = −2"], trap: ["√(x + 2) = x with x = −1", 0], why: "The left side is √1 = 1, but the right side is −1. They do not match.", win: "A square root cannot equal a negative." },
    { say: "Solve √(x + 5) = 3. Key in x.", kind: "type", icon: "🕵️", q: "Square both sides: x + 5 = 9", ans: 4, trap: 14, why: "Subtract 5 from 9.", win: "x = 4, and √9 = 3 checks." },
    { say: "Sort the candidates by yourself.", bins: "Works|Extraneous", items: ["√(2x + 3) = x with x = 3|√(x + 12) = x with x = 4", "√(2x + 3) = x with x = −1|√(x + 12) = x with x = −3"], trap: ["√(x + 12) = x with x = −3", 0] },
  ],
}));
