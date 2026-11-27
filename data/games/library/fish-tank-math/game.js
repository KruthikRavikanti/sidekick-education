// Fish Tank Math. Skill K.OA.A.1-3.
// Connecting an action to an expression: joining goes with plus and leaving goes with minus. The child matches each tank story to its expression.
Sidekick.game(Sidekick.play({
  title: "Fish Tank Math",
  emoji: "🐠",
  premise: "Fish swim in and fish swim away. Match what happens in each tank to its number sentence.",
  outro: "Plus means joining. Minus means taking away.",
  scene: "ocean",
  kind: "fill",
  cast: "",
  hint: "Did more join, or did some leave? Joining is plus.",
  tag: "plus_does_not_mean_join",
  rounds: [
    { say: "Drag the number sentence that matches each tank.", rows: [["🐟🐟🐟 and 🐟🐟 more", "3 + 2"], ["🐟🐟🐟🐟 and 🐟 more", "4 + 1"]], extra: "3 − 2|", trap: [0, "3 − 2"], why: "More fish joined. Joining is plus.", win: "Joining is plus." },
    { say: "Watch for fish that swim away.", rows: [["🐠🐠 and 🐠🐠 more", "2 + 2"], ["🐠🐠🐠🐠🐠, then 🐠🐠 swim away", "5 − 2"]], extra: "5 + 2|", trap: [1, "5 + 2"], why: "Fish swam away. Taking away is minus.", win: "Swimming away is minus." },
    { say: "Match every tank by yourself.", rows: [["🐡 and 🐡🐡🐡 more", "1 + 3"], ["🐡🐡🐡🐡, then 🐡 swims away", "4 − 1"], ["🐡🐡 and 🐡 more", "2 + 1"]], extra: "4 + 1|", trap: [1, "4 + 1"] },
  ],
}));
