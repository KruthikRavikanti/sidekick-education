// Advanced Search Lab. Skill W.8.8-1.
// Using search terms effectively; assessing credibility; quoting or paraphrasing while avoiding plagiarism and following a citation format. Plagiarizing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Advanced Search Lab",
  emoji: "🔬",
  premise: "Search tools have tricks: exact phrases, excluded words, trusted kinds of sites. Then you still have to judge and cite what you find.",
  outro: "Use search terms effectively, assess each source, and quote or paraphrase with citations.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "What do you want the search to do: match exactly, leave out, or narrow?",
  tag: "plagiarizes",
  rounds: [
    { say: "Match each goal to the search trick.", rows: [["find an exact phrase", "put it in quotation marks"], ["leave out a word", "put a minus sign before it"], ["see only school or government pages", "limit to edu or gov sites"]], trap: [0, "put a minus sign before it"], why: "A minus sign removes a word. Quotation marks keep a phrase together.", win: "Three ways to sharpen a search." },
    { say: "Source (Amin, 2022): “City farms can feed a tenth of a city.” Sort the student sentences.", kind: "sort", fs: 4.1, bins: "Done right|Plagiarized", items: ["Amin (2022) estimates urban plots could supply 10 percent of food.|Amin says farms “can feed a tenth of a city” (2022).", "City farms can feed a tenth of a city.|City farms could feed a tenth of a city."], trap: ["City farms could feed a tenth of a city.", 0], why: "One changed word and no credit is still copying.", win: "Paraphrase or quote, and cite." },
    { say: "Match these by yourself.", rows: [["find the exact title of a speech", "put it in quotation marks"], ["skip results about a movie of the same name", "put a minus sign before movie"]], extra: "type it in capitals|add more commas", trap: [0, "type it in capitals"] },
  ],
}));
