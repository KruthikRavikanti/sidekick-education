// Follow the Style Guide. Skill L.9-10.3-1.
// Writing and editing work so that it conforms to the guidelines in a style manual. Ignoring format rules is the known slip.
Sidekick.game(Sidekick.play({
  title: "Follow the Style Guide",
  emoji: "📘",
  premise: "Style manuals such as MLA and APA set shared rules for citing sources, so any reader can find what you used.",
  outro: "Write and edit to the guidelines of a style manual. In MLA the page number goes in parentheses after the quote.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "MLA uses author and page. APA adds the year.",
  tag: "ignores_format",
  rounds: [
    { say: "Match each style to its in-text citation.", rows: [["MLA", "(Rivera 12)"], ["APA", "(Rivera, 2020, p. 12)"]], extra: "[Rivera, page twelve]|", trap: [0, "[Rivera, page twelve]"], why: "MLA uses parentheses with the author’s last name and the page number only.", win: "MLA: name and page. APA: name, year, page." },
    { say: "In MLA, where does each piece go?", rows: [["the page number", "in parentheses after the quote"], ["the period", "after the closing parenthesis"], ["the full source", "on the Works Cited page"]], trap: [1, "in parentheses after the quote"], why: "The sentence ends after the citation: “...rose” (Diaz 45).", win: "Quote, citation, period." },
    { say: "Match these by yourself.", rows: [["MLA list of sources", "Works Cited"], ["APA list of sources", "References"], ["MLA in-text citation", "(Okafor 88)"]], extra: "(Okafor, 2019, p. 88)|", trap: [2, "(Okafor, 2019, p. 88)"] },
  ],
}));
