// Summary, No Opinions. Skill RI.6.2-2.
// Providing a summary of an informational text distinct from personal opinions. Adding opinions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Summary, No Opinions",
  emoji: "📰",
  premise: "A summary of an article reports its ideas. What you think of them comes later, somewhere else.",
  outro: "An objective summary gives the central idea and key details with no opinions.",
  scene: "desk",
  kind: "pick",
  fs: 4.6,
  hint: "Is this from the article, or is it a reaction to it?",
  tag: "adds_opinions",
  rounds: [
    { say: "Tap the two sentences that do not belong in this summary.", mark: "The article explains how wind turbines make electricity.|*Wind power is obviously the best idea ever.|Blades spin a generator inside the tower.|*I think turbines look ugly.|Wind farms are growing in many countries.", trap: "-I think turbines look ugly.", why: "How they look to you is an opinion. It is not in the article.", win: "Only the article’s ideas remain." },
    { say: "Tap the two opinions.", mark: "The article describes how the printing press changed Europe.|Books became cheaper and more common.|*Everyone should love books.|More people learned to read.|*Old handwritten books were a waste of time.", trap: "-Everyone should love books.", why: "Should is a clue that this is an opinion.", win: "Two opinions removed." },
    { say: "Tap the two opinions by yourself.", mark: "The article explains why some frogs are bright colors.|*Bright frogs are prettier than dull ones.|The colors warn predators of poison.|*Predators deserve what they get.|Some harmless frogs copy the colors.", trap: "-Predators deserve what they get." },
  ],
}));
