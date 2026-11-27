// Smooth Transitions. Skill W.4.3-3.
// Using a variety of transitional words and phrases to manage the sequence of events. Choppy order with no transitions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Smooth Transitions",
  emoji: "🚌",
  premise: "Transition words carry the reader from one moment to the next so the story does not feel choppy.",
  outro: "Use a variety of transitions to manage the sequence of events.",
  scene: "city",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "How much time has passed? Is it sudden, or after a wait?",
  tag: "choppy_order",
  rounds: [
    { say: "Drop in the transition that fits.", rows: [["We waited an hour. ___ the bus came.", "Finally"], ["I reached for the door. ___ it flew open.", "Suddenly"]], extra: "Yesterday", trap: [0, "Yesterday"], why: "Yesterday jumps back in time. After a long wait, finally fits.", win: "Finally for a long wait. Suddenly for a surprise." },
    { say: "Drop in these transitions.", rows: [["___ the sky was clear.", "At first"], ["___ clouds gathered.", "Before long"], ["___ the storm broke.", "Moments later"]], trap: [0, "Moments later"], why: "The clear sky comes first. At first fits.", win: "A smooth sequence." },
    { say: "Drop these in by yourself.", rows: [["___ we unpacked the car.", "First"], ["___ we explored the cabin.", "After that"], ["___ everyone was asleep.", "By midnight"]], extra: "Last year", trap: [0, "By midnight"] },
  ],
}));
