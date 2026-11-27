// Find It in Two Sources. Skill RI.5.7-1.
// Drawing on information from multiple print or digital sources to locate an answer or solve a problem. Relying on one source is the known slip.
Sidekick.game(Sidekick.play({
  title: "Find It in Two Sources",
  emoji: "🌉",
  premise: "One source may not hold the whole answer. Pull facts from two and put them together.",
  outro: "Draw on more than one source to answer a question.",
  scene: "city",
  kind: "type",
  icon: "🌉",
  hint: "Which fact comes from each source? Use both.",
  tag: "relies_on_one_source",
  rounds: [
    { say: "Use both sources. In what year did the bridge open?", read: "Website: Work on the bridge began in 1933. / Book: The bridge took four years to build.", ans: 1937, trap: 1933, why: "That is when work began. Add the four years from the book.", win: "1933 + 4 = 1937." },
    { say: "Use both sources. How many miles is the whole trail?", read: "Map: The north section is 120 miles. / Guidebook: The south section is 85 miles.", ans: 205, trap: 120, why: "That is only the north section. Add the south section too.", win: "120 + 85 = 205 miles." },
    { say: "Use both sources by yourself.", alt: [{ say: "How old was the inventor when she died?", read: "Encyclopedia: She was born in 1867. / Article: She died in 1934.", ans: 67, trap: 34 }, { say: "How many people live in the two towns together?", read: "Census page: Elm Town has 4,200 people. / News report: Oak Town has 3,500 people.", ans: 7700, trap: 4200 }] },
  ],
}));
