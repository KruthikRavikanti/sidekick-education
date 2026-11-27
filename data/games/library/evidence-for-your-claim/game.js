// Evidence for Your Claim. Skill W.4.9-1.
// Drawing evidence from literary or informational texts to support analysis. Writing opinions without textual evidence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Evidence for Your Claim",
  emoji: "⚖️",
  premise: "When you write about a text, back up what you say with evidence from the text itself.",
  outro: "Support your analysis with evidence drawn from the text.",
  scene: "paper",
  kind: "pick",
  hint: "Which sentences come from the text and prove the claim?",
  tag: "opinion_without_evidence",
  rounds: [
    { say: "Claim: Mina is brave. Tap the evidence from the story.", read: "Mina heard the kitten crying on the ice. Though she could not swim, she lay flat and slid out to reach it.", yes: "She slid out onto the ice to reach the kitten.|She did it though she could not swim.", no: "I think Mina is awesome.|Mina seems like a nice girl.", trap: "I think Mina is awesome.", why: "That is your opinion. Evidence comes from the story.", win: "Two pieces of evidence from the text." },
    { say: "Claim: The author thinks zoos help animals. Tap the evidence from the article.", read: "Zoos breed endangered species. One zoo raised forty rare condors and released them into the wild.", yes: "Zoos breed endangered species.|One zoo raised and released forty condors.", no: "Zoos are fun to visit.|I agree with the author.|Condors are big.", trap: "I agree with the author.", why: "Agreeing is not evidence. What does the article say?", win: "Evidence from the article." },
    { say: "Claim: Tomas is determined. Tap the evidence by yourself.", read: "Tomas fell off the bike eleven times. Each time he wiped his hands and climbed back on.", yes: "He fell eleven times.|Each time he climbed back on.", no: "Tomas is cool.|Bikes are hard to ride.|I like this story.", trap: "Tomas is cool." },
  ],
}));
