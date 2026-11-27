// Ticket Booth System. Skill 8.EE.C.8-4.
// Solving real-world problems leading to two linear equations in two variables. Writing equations that do not match the story is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ticket Booth System",
  emoji: "🎟️",
  premise: "A story with two unknowns needs two equations: one counts things, the other counts money.",
  outro: "Write one equation for the total count and one for the total value.",
  scene: "city",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Which total is a number of things? Which total is dollars?",
  tag: "equations_do_not_match_story",
  rounds: [
    { say: "Adult tickets cost $8, child tickets $5. 10 tickets cost $62. Match each equation.", rows: [["how many tickets", "a + c = 10"], ["how much money", "8a + 5c = 62"]], extra: "8a + 5c = 10|a + c = 62", trap: [0, "a + c = 62"], why: "62 is dollars. The number of tickets is 10.", win: "Count equation and money equation." },
    { say: "Now key in the number of adult tickets.", kind: "type", icon: "🎟️", q: "a + c = 10 and 8a + 5c = 62", ans: 4, trap: 6, why: "Check it: 8 × 6 + 5 × 4 is 68, not 62.", win: "4 adults and 6 children: 32 + 30 = 62." },
    { say: "Pens cost $2, notebooks $3. 9 items cost $22. Match these by yourself.", rows: [["how many items", "p + n = 9"], ["how much money", "2p + 3n = 22"]], extra: "2p + 3n = 9|p + n = 22", trap: [1, "p + n = 22"] },
  ],
}));
