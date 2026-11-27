// Summary, Not Review. Skill RL.5.2-2.
// Summarizing a text. Including opinions in the summary is the known slip.
Sidekick.game(Sidekick.play({
  title: "Summary, Not Review",
  emoji: "📝",
  premise: "A summary reports what happened. It leaves out what you thought of it. I loved it belongs in a review.",
  outro: "A summary is objective: main events only, no opinions.",
  scene: "paper",
  kind: "sort",
  hint: "Does it report an event, or give the reader’s opinion?",
  tag: "opinion_in_summary",
  rounds: [
    { say: "Which sentences belong in a summary?", bins: "Summary|Opinion", items: ["A boy trains a wild horse.|In the end he sets it free.", "It was the best book ever.|The ending made me cry."], trap: ["The ending made me cry.", 0], why: "That is your reaction. A summary sticks to what happened.", win: "Events in, opinions out." },
    { say: "Sort these.", bins: "Summary|Opinion", items: ["Two sisters search for their lost dog.|They find him at a farm across town.", "The dog is so cute.|I think the sisters were silly to lose him."], trap: ["I think the sisters were silly to lose him.", 0], why: "I think signals an opinion.", win: "An objective summary." },
    { say: "Sort these by yourself.", bins: "Summary|Opinion", items: ["A girl enters a baking contest.|Her cake collapses, but she wins for flavor.", "Baking contests are boring.|She deserved to win."], trap: ["She deserved to win.", 0] },
  ],
}));
