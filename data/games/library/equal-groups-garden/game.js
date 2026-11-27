// Equal Groups Garden. Skill 3.OA.A.1-2.
// Showing a product as equal groups: 3 × 4 is 3 groups with 4 in each. Building 4 groups of 3 instead is the known slip, and the total is shown only in the guided rounds.
Sidekick.game(Sidekick.play({
  title: "Equal Groups Garden",
  emoji: "🌷",
  premise: "Plant flowers in equal groups to show a multiplication fact. The first number is how many groups.",
  outro: "Multiplying means making equal groups.",
  scene: "meadow",
  kind: "dial",
  cast: "",
  dials: [["Groups", 1, 6], ["In each group", 1, 8]],
  view: { type: "groups", icon: "🌷" },
  hint: "The first number is how many groups. The second is how many in each.",
  tag: "swaps_groups_and_size",
  rounds: [
    { say: "Show 3 × 4: make 3 groups with 4 in each.", ans: [3, 4], trap: [4, 3], why: "That is 4 groups of 3. Here 3 × 4 means 3 groups with 4 in each.", win: "3 groups of 4 is 12." },
    { say: "Show 5 × 2: make 5 groups with 2 in each.", ans: [5, 2], trap: [2, 5], why: "That is 2 groups of 5. Make 5 groups with 2 in each.", win: "5 groups of 2 is 10." },
    { say: "Show the fact by yourself.", alt: [{ say: "Show 2 × 6: 2 groups with 6 in each.", ans: [2, 6], trap: [6, 2] }, { say: "Show 4 × 3: 4 groups with 3 in each.", ans: [4, 3], trap: [3, 4] }] },
  ],
}));
