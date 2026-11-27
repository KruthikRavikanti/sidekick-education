// Mark the End. Skill L.1.2-2.
// Using end punctuation for sentences. Putting periods on questions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Mark the End",
  emoji: "❗",
  premise: "Each sentence needs the right end mark: a period to tell, a question mark to ask, an exclamation point for strong feeling.",
  outro: "Asking sentences end with a question mark. Telling sentences end with a period.",
  scene: "paper",
  kind: "sort",
  hint: "Read it out loud. Does your voice ask, tell, or shout?",
  tag: "period_on_question",
  rounds: [
    { say: "Which end mark does each sentence need?", bins: ".|?|!", items: ["I like my hat|", "Can you help me|", "Watch out|"], trap: ["Can you help me", 0], why: "It asks for help. A question needs a question mark.", win: "Period, question mark, exclamation point." },
    { say: "Sort these sentences.", bins: ".|?|!", items: ["We have a dog|The sky is blue", "Where is the cat|", "Run fast|"], trap: ["Where is the cat", 0], why: "Where starts a question.", win: "You gave each one its mark." },
    { say: "Sort these by yourself.", bins: ".|?|!", items: ["My bed is soft|", "Who is that|What time is it", "We won|Look out"], trap: ["What time is it", 0] },
  ],
}));
