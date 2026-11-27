// Part of a Part. Skill 5.NF.B.6-2.
// Using an area model for a product of fractions: 2/3 of 3/4 is 6 of 12 parts. Taking the fraction of the whole instead of the part is the known slip.
Sidekick.game(Sidekick.play({
  title: "Part of a Part",
  emoji: "🧁",
  premise: "Two thirds OF three fourths means: first mark three fourths, then take two thirds of just that part.",
  outro: "A fraction of a fraction is a part of a part. The pieces of the whole tell the denominator.",
  scene: "candy",
  kind: "paint",
  cast: "",
  hint: "Columns show the first fraction. Rows show the fraction you take of it.",
  tag: "uses_the_wrong_whole",
  rounds: [
    { say: "The tray has 4 columns and 3 rows. Paint {2/3} of {3/4}: 3 columns wide and 2 rows tall.", grid: [4, 3], rect: [3, 2], strict: true, noun: "Twelfths painted", trap: [4, 2], why: "That is two thirds of the whole tray. Use only 3 of the 4 columns.", win: "6 of the 12 parts are painted." },
    { say: "Key in {2/3} of {3/4} as a fraction.", kind: "type", icon: "🧁", q: "{2/3} × {3/4}", ans: "6/12", trap: "5/7", why: "You painted 6 parts out of 12. Multiply across, do not add.", win: "6 twelfths, which is one half." },
    { say: "Paint the product by yourself.", alt: [{ say: "The tray has 5 columns and 2 rows. Paint {1/2} of {3/5} by yourself.", grid: [5, 2], rect: [3, 1], strict: true, trap: [5, 1] }, { say: "The tray has 3 columns and 4 rows. Paint {3/4} of {2/3} by yourself.", grid: [3, 4], rect: [2, 3], strict: true, trap: [3, 3] }] },
  ],
}));
