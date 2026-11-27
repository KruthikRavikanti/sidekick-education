// Pause and Break Marks. Skill L.8.2-1.
// Using punctuation (comma, ellipsis, dash) to indicate a pause or break. Misusing these marks is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pause and Break Marks",
  emoji: "⏸️",
  premise: "A comma is a short pause. A dash is a sudden break. An ellipsis is a voice trailing off.",
  outro: "Use a comma for a brief pause, a dash for a sharp break, an ellipsis for trailing off.",
  scene: "night",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Is the pause short, sudden, or fading away?",
  tag: "misuses_pause_marks",
  rounds: [
    { say: "Match each effect to its mark.", rows: [["a sudden break in thought", "dash"], ["a voice trailing off", "ellipsis"], ["a short pause between parts", "comma"]], trap: [0, "ellipsis"], why: "An ellipsis fades out slowly. A sudden break needs a dash.", win: "Dash, ellipsis, comma." },
    { say: "What is the punctuation doing in each sentence?", kind: "sort", fs: 4.4, bins: "Sudden break|Trailing off", items: ["I opened the door – and froze.|The winner is – wait, check the card.", "I thought I knew, but now... I am not sure.|If only we had left sooner..."], trap: ["If only we had left sooner...", 0], why: "The thought fades away without finishing.", win: "A dash snaps. Dots drift." },
    { say: "Drop in the mark that fits by yourself.", rows: [["She reached for the handle ___ and the lights went out.", "–"], ["Well ___ I suppose that could work.", "..."]], extra: "; :", trap: [0, ";"] },
  ],
}));
