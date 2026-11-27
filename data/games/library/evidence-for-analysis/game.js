// Evidence for Analysis. Skill W.5.9-1.
// Drawing evidence from literary or informational texts to support analysis, reflection and research. Writing without evidence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Evidence for Analysis",
  emoji: "🧾",
  premise: "When you analyze a text, every claim needs proof from the text. Without evidence it is only an opinion.",
  outro: "Draw evidence from the text to support your analysis.",
  scene: "paper",
  kind: "pick",
  hint: "Which sentences come from the text and support the claim?",
  tag: "writes_without_evidence",
  rounds: [
    { say: "Claim: Maya is more daring than Finn. Tap the evidence from the story.", read: "When the bridge washed out, Maya waded into the current to test the depth. Finn stayed on the bank and called for help.", yes: "Maya waded into the current.|Finn stayed on the bank.", no: "Maya seems cool.|I would have done the same.", trap: "Maya seems cool.", why: "That is your impression. Evidence is what the story says they did.", win: "Evidence about both characters." },
    { say: "Claim: The author wants readers to save water. Tap the evidence from the article.", read: "A dripping tap wastes 3,000 gallons a year. \"Fix it today,\" the author urges.", yes: "A dripping tap wastes 3,000 gallons a year.|The author urges readers to fix it today.", no: "Water is wet.|I think the author is right.|Taps are in kitchens.", trap: "I think the author is right.", why: "Agreeing is not evidence.", win: "Evidence from the article." },
    { say: "Claim: The narrator admires her grandmother. Tap the evidence by yourself.", read: "Gran fixed the tractor herself, as she fixed everything. \"I want hands like hers,\" I thought.", yes: "Gran fixed the tractor herself.|The narrator wants hands like hers.", no: "Grandmothers are nice.|Tractors are loud.|I like this story.", trap: "Grandmothers are nice." },
  ],
}));
