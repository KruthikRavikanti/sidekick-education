// The Last Word of an Argument. Skill W.11-12.1-4.
// Providing a concluding statement or section that follows from and supports the argument. Repeating the introduction is the known slip.
Sidekick.game(Sidekick.play({
  title: "The Last Word of an Argument",
  emoji: "🏁",
  premise: "The conclusion is the final chance to make the argument stick. It should grow out of the evidence, not circle back to the opening line.",
  outro: "Provide a concluding section that follows from and supports the argument presented.",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Does it draw on what was proved, or copy the first paragraph?",
  tag: "repeats_intro",
  rounds: [
    { say: "The essay argued for funding community college. Strong ending or weak?", bins: "Strong ending|Weak ending", items: ["Higher earnings, tax returns and lower debt all point one way.|The cost is real; the evidence shows it is repaid.", "As I said in my introduction, college should be funded.|That is my essay about college."], trap: ["As I said in my introduction, college should be funded.", 0], why: "It repeats the claim without the weight of the evidence since gathered.", win: "Gather the proof and close." },
    { say: "The essay argued for demand-based parking prices. Sort the endings.", bins: "Strong ending|Weak ending", items: ["Less circling, cleaner air, fuller shops: the pilot delivered all three.|If one block can change this much, a district can.", "So, in conclusion, parking.|To repeat my thesis, prices should change."], trap: ["To repeat my thesis, prices should change.", 0], why: "Repeating is not concluding. Show what the evidence added up to.", win: "Follow from the argument." },
    { say: "The essay argued for teaching personal finance. Sort these by yourself.", bins: "Strong ending|Weak ending", items: ["Students who took the course borrowed less and saved sooner.|One semester now can spare a decade of debt.", "Finance is important, as stated above.|I hope you liked my points."], trap: ["Finance is important, as stated above.", 0] },
  ],
}));
