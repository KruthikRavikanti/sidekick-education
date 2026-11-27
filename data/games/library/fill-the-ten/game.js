// Fill the Ten. Skill 1.OA.C.6-2.
// Making ten to add (8 + 6 = 8 + 2 + 4): a ten frame shows the first addend and the child splits the second into the part that fills the ten and the part left over.
Sidekick.game(Sidekick.play({
  title: "Fill the Ten",
  emoji: "🚎",
  premise: "The tram has 10 seats. Move just enough riders on to fill it, and let the rest wait outside.",
  outro: "Fill the ten first. Then the rest is easy to add on.",
  scene: "city",
  kind: "dial",
  cast: "",
  hint: "How many empty seats are there? Only that many can get on.",
  tag: "does_not_split_to_ten",
  dials: [["Fill the ten", 0, 9], ["Left outside", 0, 9]],
  rounds: [
    { say: "8 + 6. Move just enough of the 6 to fill the ten. Leave the rest outside.", view: { type: "mix", icons: "🔴 🟡 🔵", cols: 5, slots: 10, pre: [8] }, ans: [2, 4], trap: [6, 0], why: "Only 2 seats are empty. The other 4 stay outside.", win: "8 + 2 makes 10, and 4 more is 14." },
    { say: "9 + 5. Fill the ten, then leave the rest outside.", view: { type: "mix", icons: "🔴 🟡 🔵", cols: 5, slots: 10, pre: [9] }, ans: [1, 4], trap: [5, 0], why: "Only 1 seat is empty. The other 4 stay outside.", win: "9 + 1 makes 10, and 4 more is 14." },
    { say: "Fill the ten by yourself.", alt: [{ say: "7 + 6. Fill the ten, then leave the rest outside.", view: { type: "mix", icons: "🔴 🟡 🔵", cols: 5, slots: 10, pre: [7] }, ans: [3, 3], trap: [6, 0] }, { say: "8 + 5. Fill the ten, then leave the rest outside.", view: { type: "mix", icons: "🔴 🟡 🔵", cols: 5, slots: 10, pre: [8] }, ans: [2, 3], trap: [5, 0] }, { say: "9 + 7. Fill the ten, then leave the rest outside.", view: { type: "mix", icons: "🔴 🟡 🔵", cols: 5, slots: 10, pre: [9] }, ans: [1, 6], trap: [7, 0] }] },
  ],
}));
