// Which Whole?. Skill 3.NF.A.1-3.
// Identifying the whole: the same fraction of different-sized wholes is not the same amount. Treating all halves as equal is the known slip.
Sidekick.game(Sidekick.play({
  title: "Which Whole?",
  emoji: "🎂",
  premise: "Half of a huge cake and half of a cupcake are both halves, but not the same amount. It depends on the whole.",
  outro: "A fraction is an amount of its own whole. Different wholes give different amounts.",
  scene: "candy",
  kind: "sort",
  hint: "Ask: half of what? Are the two wholes the same size?",
  tag: "ignores_the_whole",
  rounds: [
    { say: "Are the two amounts the same?", bins: "Same amount|Not the same", items: ["half of a pizza and half of a same-size pizza|a third of a rope and a third of a same-length rope", "half of a big pizza and half of a small pizza|a fourth of a pond and a fourth of a puddle"], trap: ["half of a big pizza and half of a small pizza", 0], why: "The wholes are different sizes, so their halves are different sizes.", win: "The whole matters." },
    { say: "Look at the wholes again.", bins: "Same amount|Not the same", items: ["a fourth of an hour and a fourth of an hour|half of 10 and half of 10", "half of a watermelon and half of a grape|a third of a mile and a third of a step"], trap: ["half of a watermelon and half of a grape", 0], why: "A watermelon is much bigger than a grape, so half of it is more.", win: "Same fraction, different wholes." },
    { say: "Sort these by yourself.", bins: "Same amount|Not the same", items: ["half of a dollar and half of a dollar|a fourth of a class and a fourth of the same class", "half of a bus and half of a bike|a third of a day and a third of a minute"], trap: ["half of a bus and half of a bike", 0] },
  ],
}));
