// Fractions With Letters. Skill A-APR.D.7-1.
// Adding, subtracting, multiplying and dividing rational expressions. Adding the denominators is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fractions With Letters",
  emoji: "🧮",
  premise: "Rational expressions follow the same rules as number fractions. To add them you need a common denominator.",
  outro: "Add with a common denominator. Multiply straight across. Never add the denominators.",
  scene: "paper",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Would you add the bottoms of one half plus one third? Same rule here.",
  tag: "adds_denominators",
  rounds: [
    { say: "Add or multiply.", rows: [["{1/x} + {2/x}", "{3/x}"], ["{1/x} × {2/x}", "{2/x^2}"]], extra: "{3/2x}|", trap: [0, "{3/2x}"], why: "The denominators already match. Keep x and add the numerators.", win: "Same bottom: add the upper numbers." },
    { say: "These have different denominators.", rows: [["{1/x} + {1/x + 1}", "{2x + 1/x(x + 1)}"], ["{1/x} × {1/x + 1}", "{1/x(x + 1)}"]], extra: "{2/2x + 1}|", trap: [0, "{2/2x + 1}"], why: "That added the bottoms. Use the common denominator x(x + 1).", win: "(x + 1) + x over x(x + 1)." },
    { say: "Work these out by yourself.", rows: [["{2/x} + {3/x}", "{5/x}"], ["{1/x} + {1/y}", "{x + y/xy}"], ["{x/2} ÷ {x/4}", "2"]], extra: "{5/2x}|{2/x + y}", trap: [1, "{2/x + y}"] },
  ],
}));
