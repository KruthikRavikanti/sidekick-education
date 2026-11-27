// Copy Machine Fractions. Skill 4.NF.B.4-2.
// Multiplying a fraction by a whole number: 3 × 2/5 = 6/5. Multiplying both the numerator and the denominator is the known slip.
Sidekick.game(Sidekick.play({
  title: "Copy Machine Fractions",
  emoji: "🖨️",
  premise: "The copy machine makes copies of a fraction. More copies means more pieces, but the pieces stay the same size.",
  outro: "To multiply a fraction by a whole number, multiply the top number only.",
  scene: "desk",
  kind: "type",
  icon: "🖨️",
  hint: "Count the pieces in all the copies. The size of each piece does not change.",
  tag: "multiplies_both_parts",
  rounds: [
    { say: "Shade 3 copies of {2/5}. How many fifths is that?", kind: "dial", cast: "", dials: [["Fifths shaded", 0, 10]], view: { type: "frac", den: 5, wholes: 2 }, ans: [6], trap: [5], why: "Three copies of 2 fifths is 6 fifths. That is more than one whole.", win: "3 copies of 2 fifths make 6 fifths." },
    { say: "Key in the product as a fraction.", q: "4 × {2/3}", ans: "8/3", trap: "8/12", why: "Only the number of pieces is multiplied. The pieces are still thirds.", win: "4 copies of 2 thirds is 8 thirds." },
    { say: "Key in the product by yourself.", alt: [{ q: "3 × {2/5}", ans: "6/5", trap: "6/15" }, { q: "5 × {3/8}", ans: "15/8", trap: "15/40" }, { q: "2 × {4/9}", ans: "8/9", trap: "8/18" }] },
  ],
}));
