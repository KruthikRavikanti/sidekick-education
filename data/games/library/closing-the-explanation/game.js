// Closing the Explanation. Skill W.8.2-4.
// Providing a concluding statement or section that follows from and supports the information presented. Leaving it out is the known slip.
Sidekick.game(Sidekick.play({
  title: "Closing the Explanation",
  emoji: "🔚",
  premise: "An explanation should end by showing the reader what the information adds up to.",
  outro: "Provide a concluding section that follows from and supports the explanation.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does it sum up the explanation or show why it matters?",
  tag: "no_conclusion",
  rounds: [
    { say: "The piece explained how vaccines train the immune system. Sort the endings.", bins: "Supports it|Does not", items: ["By rehearsing the fight in advance, the body is ready for the real germ.|This is why one small shot can prevent a serious illness.", "Needles hurt a bit.|Next, the history of hospitals."], trap: ["Needles hurt a bit.", 0], why: "That is a side note, not what the explanation adds up to.", win: "Close on the main idea." },
    { say: "The piece explained how earthquakes happen. Sort the endings.", bins: "Supports it|Does not", items: ["When stressed rock finally slips, the stored energy shakes the ground.|Understanding faults helps cities build safely.", "Volcanoes are cooler.|That is everything I found."], trap: ["That is everything I found.", 0], why: "It ends the paper without concluding anything.", win: "Sum up and show why it matters." },
    { say: "The piece explained how bees communicate. Sort by yourself.", bins: "Supports it|Does not", items: ["Through dance alone, a hive shares a map of the fields.|Their signals show that language is not only human.", "Honey is tasty.|I ran out of time."], trap: ["Honey is tasty.", 0] },
  ],
}));
