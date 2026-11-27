// Back It With the Text. Skill W.7.9-1.
// Drawing evidence from literary or informational texts to support analysis. Giving no evidence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Back It With the Text",
  emoji: "📎",
  premise: "An analysis paragraph makes a claim about a text and proves it with lines from that text.",
  outro: "Draw evidence from the text: quotations and details, not outside opinions.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "Which sentences point to something the text actually says?",
  tag: "no_evidence",
  rounds: [
    { say: "Claim: the narrator feels trapped. Tap the two sentences that use text evidence.", mark: "*She describes her room as “a box with one window.”|Feeling trapped is awful.|*She counts the bars of the fence each morning.|I would feel the same way.", trap: "Feeling trapped is awful.", why: "That is the student’s reaction, not evidence from the text.", win: "A quotation and a detail from the text." },
    { say: "Claim: the article shows that noise harms whales. Tap the two with text evidence.", mark: "Whales are amazing animals.|*The author reports that ship noise drowns out whale calls.|*One study cited found whales left noisy feeding areas.|People should be quieter.", trap: "People should be quieter.", why: "That is advice, not something the article shows.", win: "Both point to the article." },
    { say: "Claim: the poem treats winter as peaceful. Tap the two with text evidence by yourself.", mark: "*The poet calls the snow “a quilt for sleeping fields.”|Winter is my least favorite season.|*The last line says the world “breathes slow.”|Snow can be dangerous.|Poems are short.", trap: "Snow can be dangerous." },
  ],
}));
