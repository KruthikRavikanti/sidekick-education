// Fair Summary. Skill RI.8.2-2.
// Providing an objective summary of an informational text. Including opinions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fair Summary",
  emoji: "📋",
  premise: "To summarize an argument fairly, report what the author says, even if you disagree.",
  outro: "An objective summary presents the author’s ideas without adding your stance.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "Is this the author’s point, or the summarizer’s reaction?",
  tag: "includes_opinions",
  rounds: [
    { say: "Tap the two sentences that do not belong in a fair summary.", mark: "The author argues that cursive should still be taught.|She says it builds fine motor skills.|*That argument is completely outdated.|She notes that many old documents are in cursive.|*Typing is obviously more useful.", trap: "-Typing is obviously more useful.", why: "That is the summarizer arguing back.", win: "Report first. Respond elsewhere." },
    { say: "Tap the two that do not belong.", mark: "The essay claims zoos should focus on rescue, not display.|*Finally, someone talking sense.|It describes three zoos that changed their mission.|It admits the change is costly.|*Anyone who disagrees is heartless.", trap: "-Anyone who disagrees is heartless.", why: "Insulting others is not part of the essay.", win: "A fair summary stays neutral." },
    { say: "Tap the two that do not belong by yourself.", mark: "The author proposes a four-day school week.|He cites savings on buses and heating.|*Kids would just waste the extra day.|He admits some families would need child care.|*It is the smartest plan in years.", trap: "-It is the smartest plan in years." },
  ],
}));
