// Detail Detective. Skill RL.4.1-1.
// Referring to details and examples in a text when explaining what it says explicitly. Answering without evidence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Detail Detective",
  emoji: "🔍",
  premise: "When you explain what a story says, back it up with a detail or example from the text.",
  outro: "Support what you say about a text with specific details and examples from it.",
  scene: "paper",
  kind: "pick",
  hint: "Which sentence from the story proves the claim?",
  tag: "answers_without_evidence",
  rounds: [
    { say: "Claim: Ravi was nervous before the recital. Tap the detail that supports it.", mark: ["Ravi had played piano for three years.", "*His hands shook as he waited backstage.", "The hall had red seats.", "His teacher wore a blue dress."], trap: "Ravi had played piano for three years.", why: "That is background. Which detail shows he was nervous?", win: "Shaking hands are the evidence." },
    { say: "Claim: The old bridge was unsafe. Tap the details that support it.", mark: ["The bridge crossed a wide river.", "*Two boards were missing from its floor.", "*It swayed whenever the wind blew.", "It had been built in 1920."], trap: "It had been built in 1920.", why: "Old is not the same as unsafe. Which details show danger?", win: "Missing boards and swaying are the evidence." },
    { say: "Claim: Nell cared deeply for her horse. Tap the supporting details by yourself.", mark: ["Nell lived on a ranch.", "*She brushed him every morning before school.", "The horse was brown.", "*She slept in the barn the night he was sick.", "The ranch had a red gate."], trap: "The horse was brown." },
  ],
}));
