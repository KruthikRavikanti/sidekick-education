// Text Says or I Think. Skill RL.3.1-2.
// Distinguishing what the text states from the reader’s own opinion. Mixing opinion with text evidence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Text Says or I Think",
  emoji: "🚪",
  premise: "Some things are written right in the story. Other things are your own ideas about it. Keep the two apart.",
  outro: "Separate what the text says from what you think about it.",
  scene: "paper",
  kind: "sort",
  hint: "Could you put your finger on it in the story?",
  tag: "mixes_opinion_with_evidence",
  rounds: [
    { say: "Read the story. Sort each statement.", read: "Jen slammed the door and threw her bag on the floor.", bins: "The text says|I think", items: ["Jen slammed the door.|She threw her bag.", "Jen is rude.|Jen had a bad day."], trap: ["Jen is rude.", 0], why: "The story does not say rude. That is your idea about her.", win: "Evidence and opinion, kept apart." },
    { say: "Read this story. Sort each statement.", read: "The old man fed the birds every morning at six. He never missed a day.", bins: "The text says|I think", items: ["He fed the birds at six.|He never missed a day.", "He is lonely.|He loves animals."], trap: ["He loves animals.", 0], why: "He may, but the text only tells what he does.", win: "What it says, and what you think." },
    { say: "Sort these by yourself.", read: "Mira hid her test under a book. She did not look up when her dad came in.", bins: "The text says|I think", items: ["She hid her test.|She did not look up.", "She got a low score.|She feels ashamed."], trap: ["She got a low score.", 0] },
  ],
}));
