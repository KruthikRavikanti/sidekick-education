// Reasons That Fit. Skill RI.2.8-1.
// Describing how reasons support specific points the author makes in a text. Listing reasons that do not match the point is the known slip.
Sidekick.game(Sidekick.play({
  title: "Reasons That Fit",
  emoji: "🧲",
  premise: "An author makes a point and gives reasons for it. A good reason matches the point.",
  outro: "Reasons support a point when they explain why it is true.",
  scene: "desk",
  kind: "pick",
  hint: "Does it tell why THIS point is true?",
  tag: "reasons_do_not_match",
  rounds: [
    { say: "The point: Bees are important. Tap the reasons that support it.", yes: "They help plants make fruit.|They make honey we can eat.", no: "Bees are yellow and black.|Some people fear bees.", trap: "Bees are yellow and black.", why: "Their color does not show why they are important.", win: "Two reasons that fit the point." },
    { say: "The point: Sleep is good for you. Tap the reasons that support it.", yes: "Sleep helps your body grow.|Sleep helps you think clearly.", no: "Beds can be soft.|Some people snore.|Night is dark.", trap: "Beds can be soft.", why: "That is about beds, not about why sleep is good for you.", win: "Two reasons that fit." },
    { say: "The point: Trees help cities. Tap the reasons by yourself.", yes: "Trees give shade on hot days.|Trees clean the air.", no: "Trees have bark.|Some trees are very old.|Leaves can be green.", trap: "Trees have bark." },
  ],
}));
