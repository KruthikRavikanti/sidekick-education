// Credit Where It Is Due. Skill W.9-10.8-1.
// Integrating information into a text selectively, avoiding plagiarism and following a standard citation format. Plagiarizing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Credit Where It Is Due",
  emoji: "🏷️",
  premise: "Using someone’s words or ideas is fine when you show whose they are. Without credit, it is plagiarism.",
  outro: "Quote exactly with quotation marks, or paraphrase fully in your own words. Cite the source either way.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Are the borrowed words marked? Is the source named?",
  tag: "plagiarizes",
  rounds: [
    { say: "Properly credited, or plagiarism?", bins: "Credited|Plagiarism", items: ["Rivera calls the river “a tired old engine” (12).|Rivera argues the river is worn out (12).", "copying a sentence with no quotation marks or name|swapping two words and adding no citation"], trap: ["swapping two words and adding no citation", 0], why: "The idea and most of the wording still belong to the author.", win: "Mark it and name it." },
    { say: "What does each kind of borrowing need?", kind: "fill", fs: 4.4, cast: "", rows: [["a direct quote", "quotation marks and a citation"], ["a paraphrase", "your own wording and a citation"], ["common knowledge", "no citation"]], trap: [1, "no citation"], why: "The idea still came from the source, so it still needs credit.", win: "Quotes and paraphrases both get cited." },
    { say: "Sort these by yourself.", bins: "Credited|Plagiarism", items: ["According to Okafor, sleep “resets attention” (88).|Okafor found that rest restores focus (88).", "pasting a paragraph from a website as your own|using a classmate’s essay with a new title"], trap: ["pasting a paragraph from a website as your own", 0] },
  ],
}));
