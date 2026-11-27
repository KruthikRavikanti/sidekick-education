// Dot Plot Builder. Skill 6.SP.B.4-1.
// Displaying numerical data in a dot plot. Using uneven spacing (skipping numbers with no data) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Dot Plot Builder",
  emoji: "✖️",
  premise: "A dot plot stacks one mark for each data value above an evenly spaced number line. A value with no data keeps its empty space.",
  outro: "Every number on the line gets a place, even when no data lands there.",
  scene: "paper",
  kind: "dial",
  cast: "",
  hint: "Count how many times each number appears in the data.",
  tag: "skips_empty_value",
  rounds: [
    { say: "The marks for 2 and 3 are drawn. Stack the rest.", q: "Data: 2, 3, 3, 4, 4, 4, 6", view: { type: "bars", stack: true, given: [["2", 1], ["3", 2]], names: ["4", "5", "6"], cap: 4 }, dials: [["4", 0, 4], ["5", 0, 4], ["6", 0, 4]], ans: [3, 0, 1], trap: [3, 1, 0], why: "There is no 5 in the data. Leave 5 empty and put the mark at 6.", win: "Three at 4, none at 5, one at 6." },
    { say: "Finish this dot plot.", q: "Data: 1, 1, 2, 4, 4, 4", view: { type: "bars", stack: true, given: [["1", 2]], names: ["2", "3", "4"], cap: 4 }, dials: [["2", 0, 4], ["3", 0, 4], ["4", 0, 4]], ans: [1, 0, 3], trap: [1, 3, 0], why: "No value is 3. The three marks belong above 4.", win: "One at 2, none at 3, three at 4." },
    { say: "Finish the dot plot by yourself.", alt: [{ q: "Data: 5, 6, 6, 8, 8", view: { type: "bars", stack: true, given: [["5", 1]], names: ["6", "7", "8"], cap: 4 }, dials: [["6", 0, 4], ["7", 0, 4], ["8", 0, 4]], ans: [2, 0, 2], trap: [2, 2, 0] }, { q: "Data: 0, 0, 1, 3, 3, 3", view: { type: "bars", stack: true, given: [["0", 2]], names: ["1", "2", "3"], cap: 4 }, dials: [["1", 0, 4], ["2", 0, 4], ["3", 0, 4]], ans: [1, 0, 3], trap: [1, 3, 0] }] },
  ],
}));
