// Article Summary, Opinion Free. Skill RI.7.2-2.
// Providing an objective summary of an informational text. Including opinions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Article Summary, Opinion Free",
  emoji: "🧽",
  premise: "Summarizing an article means reporting its points fairly, whether or not you agree with them.",
  outro: "An objective summary restates the central ideas without the reader’s views.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "Would the author recognize this as their point, or is it yours?",
  tag: "includes_opinions",
  rounds: [
    { say: "Tap the two sentences that do not belong in an objective summary.", mark: "The article explains why some cities ban cars downtown.|*Banning cars is a terrible idea.|Supporters point to cleaner air and safer streets.|Shop owners worry about losing customers.|*Those shop owners are just being selfish.", trap: "-Those shop owners are just being selfish.", why: "Calling them selfish is a judgment the article did not make.", win: "Both sides reported, no verdict." },
    { say: "Tap the two that do not belong.", mark: "The article describes a plan for year-round school.|Shorter breaks may reduce summer learning loss.|*Summer is sacred and should never be touched.|Families raise concerns about child care.|*Anyone who likes this plan hates fun.", trap: "-Anyone who likes this plan hates fun.", why: "That attacks people. It is not a point from the article.", win: "The summary stays neutral." },
    { say: "Tap the two that do not belong by yourself.", mark: "The article compares paper books and e-readers.|*Real readers only use paper.|E-readers hold thousands of titles.|Some studies find better recall from paper.|*Screens are ruining everything.", trap: "-Screens are ruining everything." },
  ],
}));
