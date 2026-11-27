// Power of Ten Launch. Skill 5.NBT.A.2-1.
// Explaining patterns in the zeros of a product when multiplying by powers of 10. Adding zeros to a decimal (3.2 × 10 = 3.20) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Power of Ten Launch",
  emoji: "🚀",
  premise: "Multiplying by 10, 100 or 1,000 shifts every digit to a bigger place. It is not just about sticking zeros on the end.",
  outro: "Each power of ten moves every digit one place to the left.",
  scene: "space",
  kind: "type",
  icon: "🚀",
  hint: "Every digit moves one place bigger for each 10 you multiply by.",
  tag: "adds_zeros_to_decimals",
  rounds: [
    { say: "Key in the product.", q: "47 × 1,000", ans: 47000, trap: 4700, why: "1,000 has three zeros, so every digit moves three places.", win: "47 × 1,000 = 47,000." },
    { say: "A decimal this time.", q: "3.2 × 10", ans: "32", trap: "3.20", why: "3.20 is the same as 3.2. Each digit must move one place bigger.", win: "3.2 × 10 = 32." },
    { say: "Key in the product by yourself.", alt: [{ q: "60 × 100", ans: 6000, trap: 600 }, { q: "4.5 × 100", ans: "450", trap: "4.500" }, { q: "0.7 × 10", ans: "7", trap: "0.70" }] },
  ],
}));
