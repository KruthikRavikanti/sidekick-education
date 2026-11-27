// Land the Argument. Skill W.6.1-4.
// Providing a concluding statement that follows from the argument presented. Leaving the conclusion out, or ending off topic, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Land the Argument",
  emoji: "🏁",
  premise: "A conclusion wraps up the argument. It restates the claim in fresh words and leaves the reader convinced.",
  outro: "A concluding statement follows from the argument: it restates the claim and why it matters.",
  scene: "city",
  kind: "sort",
  fs: 4.6,
  hint: "Does it tie back to the claim and the reasons given?",
  tag: "no_conclusion",
  rounds: [
    { say: "The essay argued for a later school start. Which endings work?", bins: "Strong ending|Weak ending", items: ["For better sleep, grades and health, our school should start later.|A later bell would give students the rest they need to learn.", "That is all I have to say.|Also, the gym needs new paint."], trap: ["Also, the gym needs new paint.", 0], why: "New paint is a brand-new topic. A conclusion wraps up this argument.", win: "Strong endings return to the claim." },
    { say: "The essay argued for more street trees. Sort the endings.", bins: "Strong ending|Weak ending", items: ["Cooler, drier streets are worth the cost of planting.|Planting trees now protects the town for decades.", "The end.|Trees have leaves."], trap: ["Trees have leaves.", 0], why: "True, but it does not sum up why the town should plant them.", win: "A conclusion restates why it matters." },
    { say: "The essay argued for a longer lunch. Sort by yourself.", bins: "Strong ending|Weak ending", items: ["Ten more minutes would mean less waste and better focus.|A longer lunch is a small change with a big payoff.", "Thank you for reading my essay.|My favorite lunch is tacos."], trap: ["My favorite lunch is tacos.", 0] },
  ],
}));
