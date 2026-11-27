// Roots on the Line. Skill 8.NS.A.2-2.
// Locating irrational numbers approximately on a number line and ordering them. Ordering them incorrectly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Roots on the Line",
  emoji: "🌱",
  premise: "An irrational number still has an exact place on the number line. Estimate it to see where it sits.",
  outro: "Estimate a root by finding the perfect squares on each side of it: √10 is a little more than 3.",
  scene: "field",
  kind: "row",
  fs: 7,
  hint: "Which perfect squares is the number under the root between?",
  tag: "misorders_irrationals",
  rounds: [
    { say: "Put them in order from least to greatest.", seq: "3 π √10", trap: "3 √10 π", why: "√10 is about 3.16. That is a little more than π, about 3.14.", win: "3, then π, then √10." },
    { say: "Slide the marker to the tick nearest √8.", kind: "line", icon: "🌱", cast: "", line: [0, 5, 0.5, 2], from: 0, ans: 3, trap: 4, why: "4 is half of 8. √8 is the number that times itself makes 8: just under 3.", win: "√8 is about 2.83, so the nearest tick is 3." },
    { say: "Order these by yourself, least to greatest.", alt: [{ seq: "√5 2.5 π", trap: "2.5 √5 π" }, { seq: "4 √17 4.5", trap: "√17 4 4.5" }, { seq: "√2 1.5 √3", trap: "1.5 √2 √3" }] },
  ],
}));
