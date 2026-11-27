// Active or Passive?. Skill L.8.1-2.
// Forming and using verbs in the active and passive voice. Overusing the passive voice is the known slip.
Sidekick.game(Sidekick.play({
  title: "Active or Passive?",
  emoji: "⚾",
  premise: "In active voice the subject does the action. In passive voice the subject receives it. Active is usually clearer.",
  outro: "Active: Sam threw the ball. Passive: The ball was thrown by Sam.",
  scene: "field",
  kind: "sort",
  fs: 4.6,
  hint: "Is the subject doing the action, or having it done to it?",
  tag: "overuses_passive",
  rounds: [
    { say: "Active or passive?", bins: "Active|Passive", items: ["Sam threw the ball.|The chef burned the toast.", "The ball was thrown by Sam.|The toast was burned."], trap: ["The toast was burned.", 0], why: "The toast did not burn anything. It received the action.", win: "Who is doing it?" },
    { say: "Match each passive sentence to its active version.", kind: "fill", fs: 4.6, cast: "", rows: [["The window was broken by the storm.", "The storm broke the window."], ["The song was written by Mia.", "Mia wrote the song."]], extra: "The window broke the storm.|", trap: [0, "The window broke the storm."], why: "The storm is the doer. It becomes the subject.", win: "Doer first." },
    { say: "Sort these by yourself.", bins: "Active|Passive", items: ["The dog chased the cat.|Our team won the match.", "The cat was chased by the dog.|The match was won by our team."], trap: ["The match was won by our team.", 0] },
  ],
}));
