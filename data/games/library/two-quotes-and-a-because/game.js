// Two Quotes and a Because. Skill RL.9-10.1-1.
// Citing strong and thorough textual evidence for what a text says explicitly and by inference. Citing one quote with no explanation is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Quotes and a Because",
  emoji: "🧾",
  premise: "A strong reading needs more than one quote dropped on the page. Choose the lines that prove the claim, then say how they prove it.",
  outro: "Strong, thorough evidence: more than one well-chosen quote, each explained.",
  scene: "night",
  kind: "pick",
  fs: 4.4,
  hint: "Which lines show it in action? And what does each line reveal?",
  tag: "one_quote_no_explanation",
  rounds: [
    { say: "Claim: Imani hides her fear from the team. Tap the TWO lines that prove it.", mark: "The bus reached the stadium at noon.|*Imani laughed too loudly at the coach’s joke.|The grass had been cut that morning.|*She laced her cleats twice so no one would see her hands shake.|Her number was eleven.", trap: "-She laced her cleats twice so no one would see her hands shake.", why: "One quote is thin. The shaking hands she hides are the second proof.", win: "A forced laugh and hidden hands: two proofs." },
    { say: "Now explain each quote. Match it to what it shows.", kind: "fill", fs: 4.6, cast: "", rows: [["She laughed too loudly at the joke.", "the big laugh is a cover for nerves"], ["She laced her cleats twice to hide her hands.", "her body shows fear and she conceals it"]], extra: "she thinks the coach is funny|", trap: [0, "she thinks the coach is funny"], why: "Too loudly is the clue. The laugh is a performance.", win: "Quote plus because." },
    { say: "Claim: the old house frightens Tomas. Tap the TWO lines that prove it by yourself.", mark: "The house stood at the end of Vine Street.|*Tomas crossed to the far sidewalk whenever he passed it.|It had been empty since March.|*He held his breath until the gate was out of sight.|The shutters were green.|A mailbox leaned by the fence.", trap: "-He held his breath until the gate was out of sight." },
  ],
}));
