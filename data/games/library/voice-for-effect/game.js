// Voice for Effect. Skill L.8.3-1.
// Using verbs in the active and passive voice and in the conditional and subjunctive mood to achieve particular effects. Choosing voice at random is the known slip.
Sidekick.game(Sidekick.play({
  title: "Voice for Effect",
  emoji: "🎚️",
  premise: "Writers choose active or passive voice on purpose. Passive can hide who did something. Active puts the doer up front.",
  outro: "Use active voice to stress the actor, passive to stress the action or hide the actor, and the conditional to show what might be.",
  scene: "city",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Who gets the attention in this sentence: the doer, or the thing done?",
  tag: "random_voice_choices",
  rounds: [
    { say: "What effect does each choice have?", rows: [["The window was broken.", "hides who did it"], ["I broke the window.", "takes responsibility"]], extra: "adds a rhyme|", trap: [0, "takes responsibility"], why: "Nobody is named. The passive keeps the doer out of sight.", win: "Passive hides. Active owns up." },
    { say: "What effect does each choice have?", rows: [["Mistakes were made.", "avoids naming anyone"], ["The cure was discovered in 1928.", "stresses the event, not the person"], ["If we had more time, we would finish.", "shows what is not yet real"]], trap: [1, "avoids naming anyone"], why: "Here the discovery matters more than who made it.", win: "Each choice shifts the focus." },
    { say: "Match these by yourself.", rows: [["The goalie blocked the final shot.", "puts the doer up front"], ["The final shot was blocked.", "puts the action up front"]], extra: "asks a question|gives a command", trap: [1, "puts the doer up front"] },
  ],
}));
