// Find It Fast. Skill RI.1.5-1.
// Knowing and using text features to locate key facts or information. Reading every page to find one fact is the known slip.
Sidekick.game(Sidekick.play({
  title: "Find It Fast",
  emoji: "📑",
  premise: "You do not have to read a whole fact book to find one thing. The table of contents tells you which page to turn to.",
  outro: "Text features like the table of contents, headings and the glossary help you find things fast.",
  scene: "desk",
  kind: "type",
  icon: "📑",
  hint: "Find the right title in the list. Read across to its page number.",
  tag: "reads_every_page",
  rounds: [
    { say: "Use the table of contents. Which page tells what ants eat?", fig: { type: "table", rows: [["Where Ants Live", "page 4"], ["What Ants Eat", "page 8"], ["Ant Jobs", "page 12"]] }, ans: 8, trap: 4, why: "Page 4 is about where ants live. Find the line that says What Ants Eat.", win: "What Ants Eat is on page 8." },
    { say: "What does each part of the book help you do?", kind: "fill", cast: "", rows: [["table of contents", "find the page for a part"], ["glossary", "find what a word means"], ["heading", "see what a part is about"]], trap: [1, "find the page for a part"], why: "A glossary is a little word list with meanings.", win: "Three tools for finding things." },
    { say: "Use the table of contents by yourself.", alt: [{ say: "Which page tells how frogs grow?", fig: { type: "table", rows: [["Frog Homes", "page 2"], ["Frog Food", "page 6"], ["How Frogs Grow", "page 10"]] }, ans: 10, trap: 2 }, { say: "Which page tells about baby whales?", fig: { type: "table", rows: [["Kinds of Whales", "page 3"], ["Baby Whales", "page 7"], ["Whale Songs", "page 11"]] }, ans: 7, trap: 3 }] },
  ],
}));
