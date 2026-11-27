// How Crowded?. Skill G-MG.A.2-1.
// Applying concepts of density based on area and volume in modeling situations. Dividing in the reverse order, or multiplying, is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Crowded?",
  emoji: "🏙️",
  premise: "Density tells how much is packed into each unit of space: people per square mile, grams per cubic centimeter.",
  outro: "Density = amount ÷ space. People per square mile means people divided by square miles.",
  scene: "city",
  kind: "type",
  icon: "🏙️",
  hint: "Per means divide. People per square mile is people ÷ square miles.",
  tag: "divides_reverse_order",
  rounds: [
    { say: "Key in the population density in people per square mile.", q: "12,000 people live in 4 square miles.", ans: 3000, trap: 48000, why: "That multiplies. Per square mile means share the people over the 4 square miles.", win: "12,000 ÷ 4 = 3,000." },
    { say: "Key in the density in grams per cubic centimeter.", q: "A block has a mass of 60 grams and a volume of 20 cubic centimeters.", ans: 3, trap: 1200, why: "Grams per cubic centimeter: divide 60 by 20.", win: "60 ÷ 20 = 3." },
    { say: "Find the density by yourself.", alt: [{ q: "45,000 people live in 9 square miles. People per square mile?", ans: 5000, trap: 405000 }, { q: "800 fish live in a pond of 40 square meters. Fish per square meter?", ans: 20, trap: 32000 }, { q: "A stone has mass 90 grams and volume 30 cubic centimeters. Grams per cubic centimeter?", ans: 3, trap: 2700 }] },
  ],
}));
