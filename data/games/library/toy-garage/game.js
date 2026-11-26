// Toy Garage. Skill 1.OA.A.1-2.
// Change-unknown problems (5 + ? = 12): the garage shows the cars already there and the child adds until the total matches. Adding the two given numbers overshoots.
Sidekick.game(Sidekick.play({
  title: "Toy Garage",
  emoji: "🚗",
  premise: "Some cars are parked and more drive in. Add cars until the garage holds the number in the story.",
  outro: "When you know the start and the end, the missing part is what gets you from one to the other.",
  scene: "city",
  kind: "dial",
  cast: "",
  hint: "Count the cars as you add. Stop when the garage has the total from the story.",
  tag: "adds_the_two_numbers",
  dials: [["Cars to add", 0, 25]],
  rounds: [
    { say: "Sam had 5 cars. He got some more. Now he has 12. Add cars until there are 12.", view: { type: "mix", icons: "🚗 🚙", cols: 10, pre: [5] }, ans: [7], trap: [17], why: "That is 5 and 12 added together. Stop when the garage has 12 in all.", win: "5 and 7 more make 12." },
    { say: "Kim had 8 cars. She got some more. Now she has 13. Add cars until there are 13.", view: { type: "mix", icons: "🚗 🚙", cols: 10, pre: [8] }, ans: [5], trap: [21], why: "That is 8 and 13 added together. Stop at 13 in all.", win: "8 and 5 more make 13." },
    { say: "Fill the garage by yourself.", alt: [{ say: "Ben had 6 cars. He got some more. Now he has 14. Add cars until there are 14.", view: { type: "mix", icons: "🚗 🚙", cols: 10, pre: [6] }, ans: [8], trap: [20] }, { say: "Ivy had 9 cars. She got some more. Now she has 15. Add cars until there are 15.", view: { type: "mix", icons: "🚗 🚙", cols: 10, pre: [9] }, ans: [6], trap: [24] }, { say: "Max had 7 cars. He got some more. Now he has 11. Add cars until there are 11.", view: { type: "mix", icons: "🚗 🚙", cols: 10, pre: [7] }, ans: [4], trap: [18] }] },
  ],
}));
