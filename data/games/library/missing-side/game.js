// Missing Side. Skill 3.MD.D.8-2.
// Finding an unknown side length from the perimeter. Subtracting only one known side is the known slip.
Sidekick.game(Sidekick.play({
  title: "Missing Side",
  emoji: "🖼️",
  premise: "You know the distance all the way around the frame, and one side. Work back to find the side that is missing.",
  outro: "Take the sides you know away from the perimeter, then share what is left.",
  scene: "desk",
  kind: "type",
  icon: "🖼️",
  hint: "A rectangle has two of each side. Take away both of the sides you know.",
  tag: "subtracts_only_one_side",
  rounds: [
    { say: "Key in the length of one side.", q: "A square has a perimeter of 36 inches. How long is each side?", ans: 9, trap: 18, why: "A square has 4 equal sides. Share 36 among 4.", win: "36 ÷ 4 = 9 inches." },
    { say: "Key in the width.", fig: { type: "rect", d: [7, 3], l: ["7 cm", "?"] }, q: "The perimeter is 20 cm. The length is 7 cm. How wide is it?", ans: 3, trap: 13, why: "There are two sides of 7. Take away both, then halve what is left.", win: "20 − 14 = 6, and half of 6 is 3 cm." },
    { say: "Find the missing side by yourself.", alt: [{ q: "A rectangle has a perimeter of 24 cm. Its length is 8 cm. How wide is it?", ans: 4, trap: 16 }, { q: "A rectangle has a perimeter of 30 m. Its length is 10 m. How wide is it?", ans: 5, trap: 20 }] },
  ],
}));
