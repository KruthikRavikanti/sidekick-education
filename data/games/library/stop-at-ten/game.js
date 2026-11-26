// Stop at Ten. Skill 1.OA.C.6-4.
// Using known facts to subtract (13 − 4 = 13 − 3 − 1): the child goes back to ten and then keeps going back. Adding the leftover instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stop at Ten",
  emoji: "🛑",
  premise: "Taking away is easier with a rest stop at 10. Slide back to 10 first, then slide the rest of the way.",
  outro: "Break the number you take away into two parts, and take both away.",
  scene: "city",
  kind: "line",
  cast: "",
  hint: "Slide back to 10. Then keep sliding back the rest.",
  tag: "adds_the_leftover",
  line: [0, 20, 1],
  icon: "🚙",
  marks: [[10, "🛑"]],
  rounds: [
    { say: "13 − 4. Slide back 3 to land on 10. Then slide back 1 more.", from: 13, ans: 9, trap: 11, why: "After landing on 10, keep sliding back. Do not go forward.", win: "13 − 3 is 10, and 1 more back is 9." },
    { say: "15 − 7. Slide back 5 to land on 10. Then slide back 2 more.", from: 15, ans: 8, trap: 12, why: "After 10, the last 2 are still taken away.", win: "15 − 5 is 10, and 2 more back is 8." },
    { say: "Stop at ten by yourself.", alt: [{ say: "14 − 6. Slide back to 10, then slide back the rest.", from: 14, ans: 8, trap: 12 }, { say: "12 − 5. Slide back to 10, then slide back the rest.", from: 12, ans: 7, trap: 13 }, { say: "16 − 8. Slide back to 10, then slide back the rest.", from: 16, ans: 8, trap: 12 }] },
  ],
}));
