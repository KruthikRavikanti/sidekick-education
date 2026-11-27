// Strongest Line Wins. Skill RL.8.1-1.
// Citing the textual evidence that most strongly supports an analysis. Citing weak or loosely related evidence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Strongest Line Wins",
  emoji: "🏆",
  premise: "Several lines may relate to a claim. One of them proves it best. Choose the line that leaves the least doubt.",
  outro: "The strongest evidence shows the claim most directly, with the least guessing.",
  scene: "night",
  kind: "pick",
  fs: 4.4,
  hint: "Which line would convince a doubter all by itself?",
  tag: "cites_weak_evidence",
  rounds: [
    { say: "Claim: Noor is terrified of the water. Tap the ONE line that proves it most strongly.", mark: "Noor stood near the pool.|She wore her blue swimsuit.|*Her knuckles went white on the ladder, and she could not make her foot move.|The lifeguard blew a whistle.", trap: "Noor stood near the pool.", why: "Standing near a pool could mean anything. Which line shows fear in her body?", win: "White knuckles and a frozen foot leave no doubt." },
    { say: "Claim: Eli is loyal to his brother. Tap the ONE strongest line.", mark: "Eli and his brother shared a room.|They were two years apart.|*Eli took the blame for the broken window so his brother could still play in the final.|They both liked soccer.", trap: "They both liked soccer.", why: "A shared hobby does not show loyalty. Look for a sacrifice.", win: "Taking the blame is loyalty in action." },
    { say: "Claim: the town has given up hope. Tap the ONE strongest line by yourself.", mark: "The town sat in a valley.|Shops lined the main street.|*No one bothered to repaint the welcome sign after the last factory closed.|It rained often there.|The school had a bell.|A river ran nearby.", trap: "Shops lined the main street." },
  ],
}));
