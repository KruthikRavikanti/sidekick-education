// Greatest Common Factor. Skill 6.NS.B.4-1.
// Finding the greatest common factor of two whole numbers. Confusing GCF with LCM is the known slip.
Sidekick.game(Sidekick.play({
  title: "Greatest Common Factor",
  emoji: "🔑",
  premise: "A common factor divides both numbers. The greatest one is the biggest number that goes into both.",
  outro: "The GCF is the largest number that divides both. It is never bigger than the smaller number.",
  scene: "desk",
  kind: "type",
  icon: "🔑",
  hint: "A factor goes INTO a number. It cannot be bigger than the number itself.",
  tag: "confuses_gcf_and_lcm",
  rounds: [
    { say: "Tap every number that divides both 12 and 18.", kind: "pick", fs: 6, yes: "1 2 3 6", no: "4 9 12 36", trap: "36", why: "36 is a multiple of both. A factor has to go into them.", win: "1, 2, 3 and 6. The greatest is 6." },
    { say: "Key in the greatest common factor.", q: "GCF of 36 and 48", ans: 12, trap: 144, why: "144 is a common multiple. The GCF divides both numbers.", win: "12 is the largest number that divides 36 and 48." },
    { say: "Key in the GCF by yourself.", alt: [{ q: "GCF of 24 and 40", ans: 8, trap: 120 }, { q: "GCF of 30 and 45", ans: 15, trap: 90 }, { q: "GCF of 28 and 42", ans: 14, trap: 84 }] },
  ],
}));
