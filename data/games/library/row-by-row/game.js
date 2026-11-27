// Row by Row. Skill 2.OA.C.4-2.
// Writing an array total as a sum of equal addends: 3 rows of 4 is 4 + 4 + 4. Adding the number of rows to the number in a row is the known slip.
Sidekick.game(Sidekick.play({
  title: "Row by Row",
  emoji: "🚜",
  premise: "The farmer plants in equal rows. Write the adding sentence that adds up one row after another.",
  outro: "An array is the same number added again and again, once for each row.",
  scene: "field",
  kind: "row",
  cast: "",
  hint: "Add the number in one row, once for every row.",
  tag: "adds_rows_and_columns",
  rounds: [
    { say: "Build the adding sentence for these rows.", fig: { type: "array", v: [3, 4], icon: "🌽" }, seq: "4 + 4 + 4 = 12", also: ["12 = 4 + 4 + 4"], extra: "3 7", trap: "3 + 4 = 7", why: "There are 3 rows with 4 in each. Add 4 three times.", win: "4 + 4 + 4 = 12." },
    { say: "Two rows this time.", fig: { type: "array", v: [2, 5], icon: "🥕" }, seq: "5 + 5 = 10", also: ["10 = 5 + 5"], extra: "2 7", trap: "2 + 5 = 7", why: "There are 2 rows with 5 in each. Add 5 two times.", win: "5 + 5 = 10." },
    { say: "Build the sentence by yourself.", alt: [{ fig: { type: "array", v: [3, 5], icon: "🍅" }, seq: "5 + 5 + 5 = 15", also: ["15 = 5 + 5 + 5"], extra: "3 8", trap: "3 + 5 = 8" }, { fig: { type: "array", v: [4, 2], icon: "🎃" }, seq: "2 + 2 + 2 + 2 = 8", also: ["8 = 2 + 2 + 2 + 2"], extra: "4 6", trap: "4 + 2 = 6" }] },
  ],
}));
