// Real Difference or Shuffle Luck?. Skill S-IC.B.5-1.
// Using simulations to decide if differences between two treatments are significant. Treating any difference as meaningful is the known slip.
Sidekick.game(Sidekick.play({
  title: "Real Difference or Shuffle Luck?",
  emoji: "🃏",
  premise: "Shuffle the group labels many times. If a difference as big as yours shows up often, chance alone could explain it.",
  outro: "A difference is significant when random shuffles almost never produce one that large.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Out of 1,000 shuffles, how many gave a difference this big? Many, or almost none?",
  tag: "any_difference_matters",
  rounds: [
    { say: "Two groups differ. The labels are shuffled 1,000 times. What does each result suggest?", bins: "Could be chance|Probably real", items: ["a difference this big in 400 of 1,000 shuffles|in 250 of 1,000 shuffles", "in 3 of 1,000 shuffles|in 12 of 1,000 shuffles"], trap: ["a difference this big in 400 of 1,000 shuffles", 1], why: "If chance alone makes it 40% of the time, it is not surprising.", win: "Rare under shuffling means probably real." },
    { say: "A difference this large appeared in 30 of 1,000 shuffles. Key in that as a percent.", kind: "type", icon: "🃏", unit: "%", ans: 3, trap: 30, why: "30 out of 1,000 is 3 out of 100.", win: "3%. Chance rarely does this." },
    { say: "Sort these by yourself.", bins: "Could be chance|Probably real", items: ["a 2-point difference, seen in 380 of 1,000 shuffles|a 1-point difference, seen in 610 of 1,000 shuffles", "a 9-point difference, seen in 4 of 1,000 shuffles|an 8-point difference, seen in 15 of 1,000 shuffles"], trap: ["a 2-point difference, seen in 380 of 1,000 shuffles", 1] },
  ],
}));
