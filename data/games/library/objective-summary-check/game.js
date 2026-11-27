// Objective Summary Check. Skill RL.7.2-2.
// Providing an objective summary of the text. Including opinions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Objective Summary Check",
  emoji: "⚖️",
  premise: "An objective summary tells what the story says, not what you think of it.",
  outro: "Leave out judgments such as best, boring, should and deserved.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "Does the sentence report an event, or judge it?",
  tag: "includes_opinions",
  rounds: [
    { say: "Tap the two sentences that are not objective.", mark: "A boy finds a wallet full of cash on the bus.|*Keeping it would have been the smart move.|He tracks down the owner, an elderly baker.|*The baker’s reward was far too small.|The boy starts working at the bakery.", trap: "-The baker’s reward was far too small.", why: "Too small is a judgment. A summary just reports the reward.", win: "Two judgments removed." },
    { say: "Tap the two sentences that are not objective.", mark: "Twin sisters compete for one spot on the team.|*The coach is obviously unfair.|One twin is chosen, and the other quits practicing.|*This part is the saddest thing ever written.|They train together again by the end.", trap: "-The coach is obviously unfair.", why: "Obviously unfair is the reader’s view, not an event.", win: "Events only." },
    { say: "Tap the two that are not objective by yourself.", mark: "A girl inherits her uncle’s failing bookshop.|*Nobody reads books anymore anyway.|She starts a midnight story hour.|The shop fills with neighbors.|*It is the most heartwarming ending possible.", trap: "-Nobody reads books anymore anyway." },
  ],
}));
