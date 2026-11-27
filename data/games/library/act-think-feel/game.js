// Act, Think, Feel. Skill W.2.3-2.
// Including details to describe actions, thoughts and feelings in a narrative. Leaving out feelings is the known slip.
Sidekick.game(Sidekick.play({
  title: "Act, Think, Feel",
  emoji: "💭",
  premise: "Strong stories tell what the character did, what they thought, and how they felt.",
  outro: "Include actions, thoughts and feelings in your story.",
  scene: "sky",
  kind: "sort",
  hint: "Is it something done, something in the mind, or an emotion?",
  tag: "leaves_out_feelings",
  rounds: [
    { say: "Sort each sentence.", bins: "Action|Thought|Feeling", items: ["I ran to the door.|", "I wondered who it was.|", "I was so excited.|"], trap: ["I was so excited.", 0], why: "Excited is an emotion. That is a feeling.", win: "Did, thought and felt." },
    { say: "Sort these sentences.", bins: "Action|Thought|Feeling", items: ["She climbed the ladder.|", "She hoped it was safe.|", "Her heart was full of fear.|"], trap: ["She hoped it was safe.", 2], why: "Hoping happens in the mind. It is a thought.", win: "An action, a thought and a feeling." },
    { say: "Sort these by yourself.", bins: "Action|Thought|Feeling", items: ["He opened the box.|He kicked the ball.", "He guessed it was a toy.|", "He felt proud.|"], trap: ["He felt proud.", 0] },
  ],
}));
