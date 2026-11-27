// Draw Without Putting Back. Skill S-CP.B.8-1.
// Applying the general multiplication rule. Multiplying unconditional probabilities for dependent events is the known slip.
Sidekick.game(Sidekick.play({
  title: "Draw Without Putting Back",
  emoji: "🔴",
  premise: "Pull a marble and keep it. The bag has changed, so the chance for the second draw changes too.",
  outro: "P(A and B) = P(A) × P(B given A). After the first draw, update the bag.",
  scene: "desk",
  kind: "type",
  icon: "🔴",
  hint: "After one red is gone, how many reds are left, out of how many marbles?",
  tag: "ignores_dependence",
  rounds: [
    { say: "A bag has 3 red and 2 blue marbles. Draw two and keep them. Key in P(both red) as a fraction.", q: "first red: {3/5} · then red: {2/4}", ans: "6/20", trap: "9/25", why: "{3/5} × {3/5} acts as if the first red went back in. One red is gone: use {2/4}.", win: "{3/5} × {2/4} = {6/20}, which is {3/10}." },
    { say: "A bag has 4 green and 2 yellow marbles. Draw two and keep them. Key in P(both green) as a fraction.", q: "first green: {4/6} · then green: {3/5}", ans: "12/30", trap: "16/36", why: "After one green is out, 3 greens remain among 5 marbles.", win: "{4/6} × {3/5} = {12/30}." },
    { say: "Draw two without putting back. Key in the fraction by yourself.", alt: [{ q: "2 red and 2 blue marbles. P(both red)?", ans: "2/12", trap: "4/16" }, { q: "5 red and 1 blue marble. P(both red)?", ans: "20/30", trap: "25/36" }, { q: "3 red and 1 blue marble. P(both red)?", ans: "6/12", trap: "9/16" }] },
  ],
}));
