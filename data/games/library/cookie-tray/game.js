// Cookie Tray. Skill 2.OA.C.4-1.
// Finding the total in an array up to 5 by 5: the child counts all the objects by rows. Giving the number of rows is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cookie Tray",
  emoji: "🍪",
  premise: "The baker lines up cookies in neat rows. Key in how many cookies are on the whole tray.",
  outro: "In an array, count every object, row after row.",
  scene: "kitchen",
  kind: "type",
  icon: "👩‍🍳",
  hint: "Count how many in one row. Then count by that for each row.",
  tag: "counts_rows_not_objects",
  tag2: "adds_rows_and_columns",
  rounds: [
    { say: "How many cookies are on the tray?", fig: { type: "array", v: [3, 4], icon: "🍪" }, ans: 12, trap: 3, trap2: 7, why: "There are 3 rows, but each row has 4 cookies.", why2: "Do not add 3 and 4. Count 4, 8, 12.", win: "4, 8, 12 cookies." },
    { say: "A bigger tray. How many cookies?", fig: { type: "array", v: [4, 5], icon: "🍪" }, ans: 20, trap: 4, trap2: 9, why: "There are 4 rows, and each row has 5 cookies.", win: "5, 10, 15, 20 cookies." },
    { say: "Count the tray by yourself.", alt: [{ fig: { type: "array", v: [5, 3], icon: "🍪" }, ans: 15, trap: 5, trap2: 8 }, { fig: { type: "array", v: [4, 4], icon: "🍪" }, ans: 16, trap: 4, trap2: 8 }] },
  ],
}));
