// Neutral Retelling. Skill RL.8.2-2.
// Providing an objective summary of the text. Including opinions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Neutral Retelling",
  emoji: "🧊",
  premise: "An objective summary is cool and even. It reports the story without cheering or booing.",
  outro: "Keep interpretation and judgment out of a summary.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "Look for judging words: best, foolish, should, obviously.",
  tag: "includes_opinions",
  rounds: [
    { say: "Tap the two sentences that are not objective.", mark: "A fisherman’s daughter takes over the boat when he is injured.|*She is clearly the bravest character ever.|The other crews doubt her.|She brings in the largest catch of the season.|*The doubters got exactly what they deserved.", trap: "-The doubters got exactly what they deserved.", why: "Deserved is a verdict. A summary only says what happened.", win: "Events without verdicts." },
    { say: "Tap the two that are not objective.", mark: "A boy lies about his age to join a traveling circus.|*Lying like that is foolish.|He trains as a tightrope walker.|His mother finds him after a year.|*The ending drags on far too long.", trap: "-The ending drags on far too long.", why: "That is a review of the writing, not part of the plot.", win: "Two opinions removed." },
    { say: "Tap the two that are not objective by yourself.", mark: "Two neighbors feud over a fallen tree.|A flood forces them to share one roof.|*Honestly, they are both ridiculous.|They rebuild the fence together.|*This story is better than most.", trap: "-This story is better than most." },
  ],
}));
