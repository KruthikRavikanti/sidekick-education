// Wrap Up the Report. Skill W.6.2-4.
// Providing a concluding statement that follows from the information presented. Leaving out a conclusion is the known slip.
Sidekick.game(Sidekick.play({
  title: "Wrap Up the Report",
  emoji: "🎀",
  premise: "An informative piece should end by pulling its ideas together, not by stopping or by starting something new.",
  outro: "A conclusion follows from the information: it sums up the main idea and why it matters.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Does it sum up what the report explained?",
  tag: "no_conclusion",
  rounds: [
    { say: "The report explained how bees pollinate crops. Which endings fit?", bins: "Fits the report|Does not fit", items: ["Without bees, many of our foods would vanish.|From almonds to apples, bees keep farms growing.", "Wasps are scary.|That is my report."], trap: ["Wasps are scary.", 0], why: "Wasps were not what the report explained.", win: "A fitting ending returns to the main idea." },
    { say: "The report explained how glaciers shape valleys. Sort the endings.", bins: "Fits the report|Does not fit", items: ["Slow as it is, ice carved the valleys we see today.|Glaciers prove that small forces add up over time.", "I like snow.|Now let me tell you about deserts."], trap: ["Now let me tell you about deserts.", 0], why: "A conclusion closes the topic. It does not open a new one.", win: "Sum up, do not start over." },
    { say: "The report explained how the heart pumps blood. Sort by yourself.", bins: "Fits the report|Does not fit", items: ["Beat by beat, the heart keeps every cell supplied.|This tireless pump is why exercise matters.", "Bones are also interesting.|The end, goodbye."], trap: ["Bones are also interesting.", 0] },
  ],
}));
