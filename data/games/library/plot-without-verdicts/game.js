// Plot Without Verdicts. Skill RL.11-12.2-2.
// Providing an objective summary of a literary text. Including opinions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Plot Without Verdicts",
  emoji: "🧾",
  premise: "Even with a novel you love or hate, the summary stays neutral. Analysis and judgment come afterward.",
  outro: "An objective summary reports events and ideas without evaluation.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "Look for verdict words and for claims about what readers should feel.",
  tag: "includes_opinions",
  rounds: [
    { say: "Tap the two sentences that are not objective.", mark: "A governess takes a post at a remote estate.|*The master of the house is obviously the villain.|She discovers a locked room in the attic.|She leaves, then returns after a fire.|*It is easily the greatest ending in fiction.", trap: "-It is easily the greatest ending in fiction.", why: "Greatest is a ranking. A summary only reports that she returns.", win: "Events only." },
    { say: "Tap the two that are not objective.", mark: "A fisherman hooks a giant fish far from shore.|He fights it for three days.|*Any sensible person would have cut the line.|Sharks strip the catch on the way home.|*The book drags in the middle.", trap: "-The book drags in the middle.", why: "That reviews the pacing. It is not part of what happens.", win: "Two judgments removed." },
    { say: "Tap the two that are not objective by yourself.", mark: "A young man inherits a debt along with a farm.|*He is far too stubborn for his own good.|He sells the north field to a neighbor.|A drought ruins the first harvest.|*Readers will adore the final chapter.", trap: "-Readers will adore the final chapter." },
  ],
}));
