// Negative to Positive Scale. Skill L.8.5-3.
// Distinguishing among the connotations of words with similar denotations. Treating them as interchangeable is the known slip.
Sidekick.game(Sidekick.play({
  title: "Negative to Positive Scale",
  emoji: "📶",
  premise: "Bullheaded, firm and resolute all describe someone who will not budge. They run from insult to praise.",
  outro: "Words with the same basic meaning can range from negative to positive in connotation.",
  scene: "city",
  kind: "row",
  fs: 5.6,
  hint: "Which word would you use to criticize? Which to praise?",
  tag: "interchanges_words",
  rounds: [
    { say: "Order from most negative to most positive.", seq: "bullheaded firm resolute", trap: "firm bullheaded resolute", why: "Bullheaded is an insult. It belongs at the negative end.", win: "Bullheaded, firm, resolute." },
    { say: "Order from most negative to most positive.", seq: "cheap thrifty wise-with-money", trap: "thrifty cheap wise-with-money", why: "Cheap criticizes. Thrifty is mildly positive.", win: "Cheap, thrifty, wise with money." },
    { say: "Order from most negative to most positive by yourself.", alt: [{ seq: "nosy curious inquisitive", trap: "curious nosy inquisitive" }, { seq: "scrawny thin slender", trap: "thin scrawny slender" }, { seq: "reckless bold courageous", trap: "bold reckless courageous" }] },
  ],
}));
