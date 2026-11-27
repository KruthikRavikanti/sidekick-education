// Quote It, Cite It. Skill W.7.8-2.
// Quoting or paraphrasing while avoiding plagiarism and following a standard citation format. Plagiarizing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Quote It, Cite It",
  emoji: "🗒️",
  premise: "Borrowed words need quotation marks. Borrowed ideas need your own wording. Both need a citation.",
  outro: "Quote exactly with quotation marks, or paraphrase fully, and cite the source either way.",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Exact words need quote marks. Any borrowed idea needs the source named.",
  tag: "plagiarizes",
  rounds: [
    { say: "Source (Okoye): “Crows remember human faces for years.” Sort the student sentences.", bins: "Done right|Plagiarized", items: ["Okoye notes that crows “remember human faces for years.”|Crows can recognize a person long afterward (Okoye).", "Crows remember human faces for years.|Crows remember the human faces for many years."], trap: ["Crows remember human faces for years.", 0], why: "Those are the source’s exact words with no quote marks or credit.", win: "Quote marks or new words, plus the source." },
    { say: "Source (Hale): “Rivers once powered every mill in the valley.” Sort these.", bins: "Done right|Plagiarized", items: ["Hale writes that rivers “powered every mill in the valley.”|Long ago, the valley’s mills all ran on river power (Hale).", "Rivers once powered every mill in the valley.|Rivers once powered each mill in the valley."], trap: ["Rivers once powered each mill in the valley.", 0], why: "Swapping one word is still copying.", win: "Change the wording fully, or quote." },
    { say: "Source (Diaz): “Bats eat tons of insects each night.” Sort by yourself.", bins: "Done right|Plagiarized", items: ["Diaz reports that bats “eat tons of insects each night.”|Bats clear huge numbers of bugs after dark (Diaz).", "Bats eat tons of insects each night.|Bats eat tons of bugs each night."], trap: ["Bats eat tons of bugs each night.", 0] },
  ],
}));
