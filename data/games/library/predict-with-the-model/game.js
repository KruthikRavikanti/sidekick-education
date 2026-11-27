// Predict With the Model. Skill 8.SP.A.3-1.
// Using the equation of a linear model to solve problems. Substituting into the other variable or term is the known slip.
Sidekick.game(Sidekick.play({
  title: "Predict With the Model",
  emoji: "🔮",
  premise: "A linear model is a rule for predicting. Put the input where it belongs in the equation and work it out.",
  outro: "Substitute the input for the right variable, multiply by the slope, then add the starting value.",
  scene: "desk",
  kind: "type",
  icon: "🔮",
  hint: "The input multiplies the slope. Then add the number that stands alone.",
  tag: "plugs_into_other_term",
  rounds: [
    { say: "Key in the predicted score for 3 hours.", q: "score = 8 × hours + 55", ans: 79, trap: 173, why: "That multiplied the 55 by 3. The hours go with the 8.", win: "8 × 3 + 55 = 79." },
    { say: "Key in the predicted height for 6 weeks.", q: "height = 2 × weeks + 5", ans: 17, trap: 32, why: "The weeks multiply the 2, not the 5.", win: "2 × 6 + 5 = 17." },
    { say: "Predict by yourself.", alt: [{ q: "cost = 4 × miles + 3. Predict the cost for 5 miles.", ans: 23, trap: 19 }, { q: "savings = 10 × weeks + 20. Predict the savings after 4 weeks.", ans: 60, trap: 90 }, { q: "temperature = 3 × hours + 50. Predict it after 2 hours.", ans: 56, trap: 103 }] },
  ],
}));
