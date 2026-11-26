// Even Split. Skill 2.OA.C.3-2.
// An even number as a sum of two equal addends: the child shares an even pile into two equal groups. Unequal piles are the known slip.
Sidekick.game(Sidekick.play({
  title: "Even Split",
  emoji: "🧦",
  premise: "Even numbers split into two equal piles with nothing left over. Share the socks so both piles match.",
  outro: "An even number is two equal groups added together.",
  scene: "candy",
  kind: "build",
  cast: "",
  plates: "Left pile|Right pile",
  hint: "Both piles must have the same number. Deal them out one at a time.",
  tag: "unequal_addends",
  rounds: [
    { say: "Share all 12 socks into two equal piles.", pile: [["🧦", 1, 12]], goal: [6, 6], trap: [7, 5], why: "One pile has more. Move one sock across so they match.", win: "12 = 6 + 6." },
    { say: "Share all 16 socks into two equal piles.", pile: [["🧦", 1, 16]], goal: [8, 8], trap: [9, 7], why: "The piles do not match yet. Even them out.", win: "16 = 8 + 8." },
    { say: "Make two equal piles by yourself.", alt: [{ say: "Share all 14 socks into two equal piles.", pile: [["🧦", 1, 14]], goal: [7, 7], trap: [8, 6] }, { say: "Share all 18 socks into two equal piles.", pile: [["🧦", 1, 18]], goal: [9, 9], trap: [10, 8] }] },
  ],
}));
