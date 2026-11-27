// What It Meant. Skill W.8.3-4.
// Providing a conclusion that follows from and reflects on the narrated experiences or events. Ending abruptly is the known slip.
Sidekick.game(Sidekick.play({
  title: "What It Meant",
  emoji: "🌄",
  premise: "A reflective ending steps back from the events to say what they meant to the person who lived them.",
  outro: "Provide a conclusion that follows from and reflects on the narrated experiences.",
  scene: "ocean",
  kind: "sort",
  fs: 4.4,
  hint: "Does the ending say what the experience changed or taught?",
  tag: "abrupt_ending",
  rounds: [
    { say: "The story: a summer spent caring for a sick grandmother. Sort the endings.", bins: "Reflects|Just ends", items: ["I went there to help her and left knowing how to sit quietly with someone.|That summer taught me care is mostly showing up.", "Then school started.|After that we drove home."], trap: ["Then school started.", 0], why: "It tells the next event but not what the summer meant.", win: "Reflection gives the events their meaning." },
    { say: "The story: losing the championship by one point. Sort the endings.", bins: "Reflects|Just ends", items: ["I still replay that last shot, but now I see the season, not the score.|Losing showed me who stayed to stack the chairs.", "We lost.|The buzzer went off and that was that."], trap: ["We lost.", 0], why: "It states the result. What did the narrator take from it?", win: "Look past the event to its meaning." },
    { say: "The story: learning to cook from a neighbor. Sort by yourself.", bins: "Reflects|Just ends", items: ["Every time I chop an onion her way, she is in my kitchen.|I learned that recipes are a way of remembering people.", "Then I made soup.|The lessons ended in June."], trap: ["The lessons ended in June.", 0] },
  ],
}));
