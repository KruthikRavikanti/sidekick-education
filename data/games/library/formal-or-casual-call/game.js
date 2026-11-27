// Formal or Casual Call. Skill W.8.4-1.
// Producing clear writing appropriate to task, purpose and audience. Ignoring the audience is the known slip.
Sidekick.game(Sidekick.play({
  title: "Formal or Casual Call",
  emoji: "✉️",
  premise: "A cover letter and a group chat have different readers and different goals. Clear writing fits both.",
  outro: "Produce writing in which style fits the task, purpose and audience.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Who reads this, and what do they expect?",
  tag: "ignores_audience",
  rounds: [
    { say: "Where does each line belong?", bins: "Cover letter|Group chat", items: ["I am writing to apply for the volunteer position.|I have two years of experience tutoring.", "u coming tonight??|lol that was so funny"], trap: ["u coming tonight??", 0], why: "Shortcuts and double question marks are for friends.", win: "Formal for an employer." },
    { say: "Sort these.", bins: "Science report|Diary entry", items: ["The solution turned blue after 30 seconds.|Three trials produced the same result.", "I cannot believe today actually happened.|Note to self: never trust Leo with a secret."], trap: ["I cannot believe today actually happened.", 0], why: "A report gives observations, not private feelings.", win: "Task decides the voice." },
    { say: "Sort these by yourself.", bins: "Speech to the school board|Text to a sibling", items: ["Members of the board, thank you for hearing us.|We ask that you restore the music program.", "did you feed the cat|save me some pizza"], trap: ["did you feed the cat", 0] },
  ],
}));
