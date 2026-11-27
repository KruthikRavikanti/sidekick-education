// Scan, Do Not Read It All. Skill RI.3.5-1.
// Using text features and search tools to locate information efficiently. Reading everything instead of scanning is the known slip.
Sidekick.game(Sidekick.play({
  title: "Scan, Do Not Read It All",
  emoji: "🛰️",
  premise: "To find one fact quickly, use the tools on the page: headings, sidebars, key words and links.",
  outro: "Scan headings, key words, sidebars and links to find information fast.",
  scene: "space",
  kind: "fill",
  cast: "",
  hint: "Which part of the page is about that?",
  tag: "reads_everything",
  rounds: [
    { say: "An article has these headings. Where would you look for each fact?", rows: [["what wolves eat", "heading: Diet"], ["where wolves live", "heading: Habitat"], ["how pups grow up", "heading: Life Cycle"]], trap: [0, "heading: Habitat"], why: "Habitat is about where they live. Food is under Diet.", win: "Headings point the way." },
    { say: "Which tool would you use?", rows: [["a short extra fact beside the text", "sidebar"], ["jump to another web page", "hyperlink"], ["words in dark print to notice", "key words"]], trap: [1, "sidebar"], why: "A sidebar sits beside the text. A hyperlink takes you to another page.", win: "Sidebar, hyperlink and key words." },
    { say: "Match these by yourself.", rows: [["find a topic by typing a word", "search box"], ["find what bold words mean", "glossary"], ["see the parts of the article", "headings"]], extra: "read every page|", trap: [0, "read every page"] },
  ],
}));
