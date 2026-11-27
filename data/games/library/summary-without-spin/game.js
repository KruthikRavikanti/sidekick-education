// Summary Without Spin. Skill RI.9-10.2-2.
// Providing an objective summary of an informational text. Adding opinions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Summary Without Spin",
  emoji: "📰",
  premise: "Summarizing an article means reporting its ideas fairly, even if you disagree. Your reaction comes later.",
  outro: "An objective summary of nonfiction states the central idea and key points with no opinion.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "Look for judging words and for I think or should.",
  tag: "includes_opinions",
  rounds: [
    { say: "Tap the two sentences that do not belong in an objective summary.", mark: "The article explains how cities are adding bike lanes.|*Honestly, it is about time.|It reports that lane use tripled in one city.|Some drivers object to losing parking.|*Those drivers are just being selfish.", trap: "-Those drivers are just being selfish.", why: "Selfish is your verdict on the drivers. The article only reports that they object.", win: "Report it, do not rate it." },
    { say: "Tap the two that do not belong.", mark: "The essay argues that libraries should lend tools as well as books.|*This is a brilliant idea.|It describes one library that lends drills and ladders.|It notes the cost of repairs.|*The author should have written more.", trap: "-The author should have written more.", why: "That reviews the essay. A summary says what the essay contains.", win: "Two opinions out." },
    { say: "Tap the two that do not belong by yourself.", mark: "The report describes a drop in honeybee numbers.|It names pesticides and lost habitat as causes.|*I found it really depressing.|It lists steps gardeners can take.|*Farmers obviously do not care.", trap: "-Farmers obviously do not care." },
  ],
}));
