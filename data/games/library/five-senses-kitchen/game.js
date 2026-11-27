// Five Senses Kitchen. Skill W.4.3-4.
// Using concrete words and phrases and sensory details. Generic description is the known slip.
Sidekick.game(Sidekick.play({
  title: "Five Senses Kitchen",
  emoji: "🍳",
  premise: "Sensory details tell what something looked, sounded, smelled, tasted or felt like. They make writing real.",
  outro: "Use concrete words and sensory details to convey experiences precisely.",
  scene: "kitchen",
  kind: "sort",
  hint: "Which sense does the detail use? Or is it too general to picture?",
  tag: "generic_description",
  rounds: [
    { say: "Which sense does each detail use?", bins: "Smell|Sound|Too general", items: ["the sharp scent of onions frying|", "bacon sizzling in the pan|", "the kitchen was nice|"], trap: ["the kitchen was nice", 0], why: "Nice gives the reader nothing to smell or hear.", win: "Smell, sound, and one that says little." },
    { say: "Sort these details about a beach.", bins: "Touch|Sight|Too general", items: ["hot sand burning my feet|", "gulls wheeling against a pink sky|", "the beach was good|"], trap: ["hot sand burning my feet", 1], why: "Burning feet is something you feel.", win: "Concrete details you can sense." },
    { say: "Sort these details about a forest by yourself.", bins: "Sound|Smell|Too general", items: ["twigs snapping underfoot|an owl hooting far off", "the damp smell of moss|", "the woods were cool|"], trap: ["the woods were cool", 0] },
  ],
}));
