// Build the Box Plot. Skill 6.SP.B.4-3.
// Displaying numerical data in a box plot from the five-number summary. Drawing the box from the minimum to the maximum is the known slip.
Sidekick.game(Sidekick.play({
  title: "Build the Box Plot",
  emoji: "🗃️",
  premise: "A box plot shows five numbers. The box holds the middle half of the data: from the first quartile to the third.",
  outro: "The box runs from Q1 to Q3 with a line at the median. Whiskers reach the least and greatest values.",
  scene: "paper",
  kind: "dial",
  cast: "",
  hint: "The median splits the data in half. Q1 is the middle of the lower half, Q3 of the upper half.",
  tag: "box_from_min_to_max",
  rounds: [
    { say: "Set Q1, the median and Q3 to draw the box.", q: "Data: 2, 4, 5, 7, 8, 10, 12", view: { type: "boxplot", data: [2, 4, 5, 7, 8, 10, 12], line: [0, 14, 1] }, dials: [["Q1", 0, 14, 1, 1], ["Median", 0, 14, 1, 5], ["Q3", 0, 14, 1, 13]], ans: [4, 7, 10], trap: [2, 7, 12], why: "The box is not the whole range. Q1 is the middle of 2, 4, 5 and Q3 the middle of 8, 10, 12.", win: "Q1 4, median 7, Q3 10." },
    { say: "Draw this box.", q: "Data: 1, 3, 4, 6, 9, 10, 11", view: { type: "boxplot", data: [1, 3, 4, 6, 9, 10, 11], line: [0, 14, 1] }, dials: [["Q1", 0, 14, 1, 2], ["Median", 0, 14, 1, 7], ["Q3", 0, 14, 1, 12]], ans: [3, 6, 10], trap: [1, 6, 11], why: "1 and 11 are the ends of the whiskers. The box is the middle half.", win: "Q1 3, median 6, Q3 10." },
    { say: "Draw the box by yourself.", alt: [{ q: "Data: 3, 5, 6, 8, 9, 11, 13", view: { type: "boxplot", data: [3, 5, 6, 8, 9, 11, 13], line: [0, 14, 1] }, dials: [["Q1", 0, 14, 1, 2], ["Median", 0, 14, 1, 6], ["Q3", 0, 14, 1, 12]], ans: [5, 8, 11], trap: [3, 8, 13] }, { q: "Data: 2, 3, 5, 6, 8, 9, 12", view: { type: "boxplot", data: [2, 3, 5, 6, 8, 9, 12], line: [0, 14, 1] }, dials: [["Q1", 0, 14, 1, 1], ["Median", 0, 14, 1, 7], ["Q3", 0, 14, 1, 13]], ans: [3, 6, 9], trap: [2, 6, 12] }] },
  ],
}));
