// Close With Meaning. Skill W.11-12.3-4.
// Providing a conclusion that follows from and reflects on what is experienced, observed or resolved over the course of the narrative. Ending abruptly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Close With Meaning",
  emoji: "🌅",
  premise: "The last lines of a narrative should look back over what was lived through and let its meaning settle.",
  outro: "Provide a conclusion that follows from and reflects on what is experienced, observed or resolved.",
  scene: "night",
  kind: "sort",
  fs: 4.2,
  hint: "Does the ending show what the events came to mean?",
  tag: "abrupt_ending",
  rounds: [
    { say: "A story about caring for a grandfather. Reflective ending or abrupt one?", bins: "Reflective|Abrupt", items: ["I had gone to keep him company and found he had been keeping mine.|His chair is empty now, and I still set out two cups.", "Then he died. The end.|After that I went back to school."], trap: ["After that I went back to school.", 0], why: "It reports the next event but says nothing about what the time with him meant.", win: "Look back and let it land." },
    { say: "A story about a shop that closed. Sort the endings.", bins: "Reflective|Abrupt", items: ["The shop closed, but I can still price a thing by its weight in my hand.|I lost the lease and kept the nerve.", "So it closed.|That was that."], trap: ["So it closed.", 0], why: "We know it closed. What did the narrator carry away?", win: "An ending weighs the experience." },
    { say: "A story about learning to swim as an adult. Sort these by yourself.", bins: "Reflective|Abrupt", items: ["The water had not changed. I had stopped fighting it.|Forty years of fear, undone a length at a time.", "Then the lesson ended.|I got out and dried off."], trap: ["I got out and dried off.", 0] },
  ],
}));
