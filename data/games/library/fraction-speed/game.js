// Fraction Speed. Skill 7.RP.A.1-1.
// Computing unit rates associated with ratios of fractions. Not being able to divide a fraction by a fraction in context is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fraction Speed",
  emoji: "🚶",
  premise: "A unit rate can come from two fractions. Divide the amount by the time, even when both are fractions.",
  outro: "Unit rate = amount ÷ time. Dividing by a fraction means asking how many of it fit in 1.",
  scene: "field",
  kind: "type",
  icon: "🚶",
  hint: "How many of those time pieces fit in one whole hour? Multiply the distance by that.",
  tag: "multiplies_the_fractions",
  rounds: [
    { say: "Key in the speed in miles per hour.", q: "You walk {1/2} mile in {1/4} hour.", ans: "2", trap: "1/8", why: "That multiplies. Four quarter hours make an hour, so you walk 4 halves of a mile.", win: "One half ÷ one quarter = 2 miles per hour." },
    { say: "Key in the feet per hour.", q: "A snail crawls {2/3} foot in {1/6} hour.", ans: "4", trap: "1/9", why: "Six of those time pieces make an hour. The snail goes 6 times as far.", win: "2 thirds × 6 = 4 feet per hour." },
    { say: "Find the unit rate by yourself.", alt: [{ q: "You read {1/2} page in {1/10} minute. How many pages per minute?", ans: "5", trap: "1/20" }, { q: "A tap fills {3/5} liter in {1/5} minute. How many liters per minute?", ans: "3", trap: "3/25" }, { q: "A bike goes {5/6} mile in {1/6} hour. How many miles per hour?", ans: "5", trap: "5/36" }] },
  ],
}));
