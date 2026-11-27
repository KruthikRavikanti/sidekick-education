// Just the Facts Summary. Skill RL.6.2-2.
// Providing a summary of the text distinct from personal opinions or judgments. Including opinions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Just the Facts Summary",
  emoji: "✂️",
  premise: "A summary retells what happened. It leaves your own opinions out.",
  outro: "An objective summary gives the main events with no opinions or judgments.",
  scene: "desk",
  kind: "pick",
  fs: 4.6,
  hint: "Could everyone check this in the story, or is it what one reader thinks?",
  tag: "includes_opinions",
  rounds: [
    { say: "This summary needs trimming. Tap the two sentences that are opinions.", mark: "Lena finds a lost dog in the park.|*It is the cutest dog ever.|She puts up posters around town.|*The owner was silly to lose it.|The owner calls and thanks her.", trap: "-The owner was silly to lose it.", why: "Calling the owner silly is a judgment, not an event.", win: "Two opinions out. Three events stay." },
    { say: "Tap the two opinions in this summary.", mark: "Omar enters the science fair with a model volcano.|*Volcano projects are boring.|The model leaks the night before.|He rebuilds it and wins third place.|*He should have won first.", trap: "-He should have won first.", why: "That is what a reader thinks should happen. It did not happen in the story.", win: "The summary now sticks to events." },
    { say: "Tap the two opinions by yourself.", mark: "Two sisters argue over the last ticket.|*The older sister is the mean one.|They decide to flip a coin.|The younger sister gives the ticket away.|*That was the best ending possible.", trap: "-That was the best ending possible." },
  ],
}));
