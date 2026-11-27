// Inputs That Make Sense. Skill F-IF.B.5-1.
// Relating the domain of a function to its graph and to the quantitative relationship it describes. Allowing negative time or fractional people is the known slip.
Sidekick.game(Sidekick.play({
  title: "Inputs That Make Sense",
  emoji: "⏱️",
  premise: "A formula may accept any number, but the situation does not. Time cannot be negative. You cannot sell half a ticket.",
  outro: "The domain of a function in context includes only inputs that make sense in the situation.",
  scene: "field",
  kind: "sort",
  fs: 6,
  hint: "Could this input really happen in the situation?",
  tag: "allows_impossible_inputs",
  rounds: [
    { say: "h(t) is a ball’s height from the throw at t = 0 until it lands at t = 4. Which inputs make sense?", bins: "Makes sense|Does not", items: ["t = 0|t = 2.5|t = 4", "t = −1|t = 6"], trap: ["t = −1", 0], why: "One second before the throw, there is no flight to describe.", win: "The domain is 0 to 4 seconds." },
    { say: "C(n) is the cost of n concert tickets. Sort the inputs.", bins: "Makes sense|Does not", items: ["n = 0|n = 3|n = 12", "n = 2.5|n = −4"], trap: ["n = 2.5", 0], why: "You cannot buy two and a half tickets.", win: "Whole numbers from 0 up." },
    { say: "A(s) is the area of a square tile with side s cm. Sort by yourself.", bins: "Makes sense|Does not", items: ["s = 2|s = 0.5|s = 10", "s = −3|s = −0.5"], trap: ["s = −3", 0] },
  ],
}));
