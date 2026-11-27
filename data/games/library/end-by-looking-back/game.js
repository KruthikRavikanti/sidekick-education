// End by Looking Back. Skill W.9-10.3-4.
// Providing a conclusion that follows from and reflects on the narrated experiences. Ending abruptly is the known slip.
Sidekick.game(Sidekick.play({
  title: "End by Looking Back",
  emoji: "🪞",
  premise: "A strong narrative ending does more than stop. It looks back and shows what the experience came to mean.",
  outro: "Provide a conclusion that follows from and reflects on what was experienced or resolved.",
  scene: "night",
  kind: "sort",
  fs: 4.4,
  hint: "Does the last line show what changed or what was learned?",
  tag: "abrupt_ending",
  rounds: [
    { say: "A story about a lost race. Reflective ending or abrupt one?", bins: "Reflective|Abrupt", items: ["I lost by a stride, and found I did not mind who had won.|The medal went to her. The friendship stayed with me.", "Then I went home. The end.|And that is what happened."], trap: ["Then I went home. The end.", 0], why: "It stops the action but says nothing about what the race meant.", win: "An ending reflects." },
    { say: "A story about moving away. Sort the endings.", bins: "Reflective|Abrupt", items: ["The new house is quiet, but I have stopped listening for the old stairs.|I kept the key anyway. Some doors you only close slowly.", "So we moved.|After that nothing else happened."], trap: ["So we moved.", 0], why: "We know they moved. What does the narrator feel now?", win: "Look back, then close." },
    { say: "A story about a first job. Sort these by yourself.", bins: "Reflective|Abrupt", items: ["I still fold towels the way she taught me, corners first.|That summer I learned that being on time is a kind of respect.", "Then summer ended. Bye.|I quit in August."], trap: ["I quit in August.", 0] },
  ],
}));
