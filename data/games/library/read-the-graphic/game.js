// Read the Graphic. Skill RI.4.7-1.
// Interpreting information presented visually or quantitatively and explaining how it contributes to the text. Ignoring graphics is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read the Graphic",
  emoji: "📊",
  premise: "Charts, graphs and timelines carry facts the paragraphs leave out. Read them as carefully as the words.",
  outro: "Interpret charts and timelines and connect them to the text.",
  scene: "desk",
  kind: "type",
  icon: "📊",
  hint: "Find the right row. Read across to the number.",
  tag: "ignores_graphics",
  rounds: [
    { say: "The text says recycling grew. Use the chart: how many tons were recycled in 2020?", fig: { type: "table", rows: [["Year", "2010", "2015", "2020"], ["Tons recycled", "12", "20", "31"]] }, ans: 31, trap: 12, why: "That is 2010. Read across to the 2020 column.", win: "31 tons in 2020." },
    { say: "How many more tons were recycled in 2020 than in 2010?", fig: { type: "table", rows: [["Year", "2010", "2015", "2020"], ["Tons recycled", "12", "20", "31"]] }, ans: 19, trap: 31, why: "That is the 2020 amount. Compare it with 2010.", win: "31 − 12 = 19 more tons." },
    { say: "Use the timeline by yourself.", alt: [{ say: "How many years passed between the first flight and the moon landing?", fig: { type: "table", rows: [["1903", "first airplane flight"], ["1927", "first flight across the Atlantic"], ["1969", "first moon landing"]] }, ans: 66, trap: 42 }, { say: "How many years after the first flight was the Atlantic crossed?", fig: { type: "table", rows: [["1903", "first airplane flight"], ["1927", "first flight across the Atlantic"], ["1969", "first moon landing"]] }, ans: 24, trap: 66 }] },
  ],
}));
