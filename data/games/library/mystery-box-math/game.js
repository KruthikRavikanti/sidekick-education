// Mystery Box Math. Skill 1.OA.A.1-4.
// Writing an equation with a symbol for the unknown: the child arranges tiles so the box sits where the unknown is in the story, not at the end by habit.
Sidekick.game(Sidekick.play({
  title: "Mystery Box Math",
  emoji: "📦",
  premise: "Each story has a number nobody knows yet. Build a number sentence with a box for the mystery number.",
  outro: "A box can hold the place of a number you do not know yet.",
  scene: "desk",
  kind: "row",
  hint: "Tell the story in order. Put the box where the unknown number happens.",
  tag: "box_in_the_usual_place",
  rounds: [
    { say: "Build the number sentence. Use the box for the number we do not know.", q: "Sam had 5 cars. He got some more. Now he has 12.", seq: "5 + ▢ = 12", also: ["▢ + 5 = 12", "12 = 5 + ▢", "12 = ▢ + 5"], trap: "5 + 12 = ▢", why: "12 is how many he has at the end. The box is how many he got.", win: "5 + ▢ = 12." },
    { say: "Build the number sentence for this story.", q: "Mia had some stickers. She got 4 more. Now she has 10.", seq: "▢ + 4 = 10", also: ["4 + ▢ = 10", "10 = ▢ + 4", "10 = 4 + ▢"], trap: "4 + 10 = ▢", why: "10 is the total. The box is how many she started with.", win: "▢ + 4 = 10." },
    { say: "Build this number sentence by yourself.", alt: [{ q: "Kim had 7 pens. She got some more. Now she has 15.", seq: "7 + ▢ = 15", also: ["▢ + 7 = 15", "15 = 7 + ▢", "15 = ▢ + 7"], trap: "7 + 15 = ▢" }, { q: "Leo had some rocks. He found 6 more. Now he has 13.", seq: "▢ + 6 = 13", also: ["6 + ▢ = 13", "13 = ▢ + 6", "13 = 6 + ▢"], trap: "6 + 13 = ▢" }] },
  ],
}));
