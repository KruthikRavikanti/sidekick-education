// Donut Share. Skill 3.OA.A.2-1.
// Division as fair sharing: a total is dealt into equal groups and the quotient is the size of each group. Unequal shares are the known slip.
Sidekick.game(Sidekick.play({
  title: "Donut Share",
  emoji: "🍩",
  premise: "Share the donuts so every kid gets the same number. That is what dividing means.",
  outro: "Dividing shares a total into equal groups.",
  scene: "kitchen",
  kind: "build",
  cast: "",
  plates: "Kid 1|Kid 2|Kid 3",
  hint: "Deal them out one at a time, like cards, until they are gone.",
  tag: "unequal_shares",
  rounds: [
    { say: "12 donuts are shared by 3 kids. Give every kid the same number.", pile: [["🍩", 1, 12]], goal: [4, 4, 4], trap: [5, 4, 3], why: "One kid has more. Sharing means everyone gets the same.", win: "12 ÷ 3 = 4 each." },
    { say: "15 donuts are shared by 3 kids. Give every kid the same number.", pile: [["🍩", 1, 15]], goal: [5, 5, 5], trap: [6, 5, 4], why: "The shares are not equal yet. Even them out.", win: "15 ÷ 3 = 5 each." },
    { say: "Share fairly by yourself.", alt: [{ say: "18 donuts are shared by 3 kids. Give every kid the same number.", pile: [["🍩", 1, 18]], goal: [6, 6, 6], trap: [7, 6, 5] }, { say: "14 donuts are shared by 2 kids. Give both kids the same number.", pile: [["🍩", 1, 14]], goal: [7, 7], trap: [8, 6] }] },
  ],
}));
