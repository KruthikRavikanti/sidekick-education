// Table Patterns. Skill 3.OA.D.9-1.
// Finding patterns in the multiplication table: the child tests statements against every number in a row, instead of just listing the numbers.
Sidekick.game(Sidekick.play({
  title: "Table Patterns",
  emoji: "🕸️",
  premise: "The times table is full of patterns. Look at one row and tap everything that is true about every number in it.",
  outro: "Numbers in a times table row follow patterns you can count on.",
  scene: "night",
  kind: "pick",
  hint: "Test each idea on every number in the list, not just one.",
  tag: "misses_the_structure",
  rounds: [
    { say: "Tap everything that is true about every number in the list.", q: "4, 8, 12, 16, 20", yes: "They are all even|They go up by 4|They are in the 4 times table", no: "They are all odd|They go up by 2|They all end in 4", trap: "They go up by 2", why: "From 4 to 8 is 4, not 2. Check each jump.", win: "Even, up by 4, the 4 times table." },
    { say: "Tap everything that is true about every number in the list.", q: "5, 10, 15, 20, 25", yes: "They go up by 5|They end in 5 or 0|They are in the 5 times table", no: "They are all even|They go up by 10|They all end in 5", trap: "They are all even", why: "5, 15 and 25 are odd. Check every number.", win: "Up by 5, ending in 5 or 0." },
    { say: "Tap everything that is true about every number in the list.", q: "9, 18, 27, 36, 45", yes: "They go up by 9|Their digits add to 9|They are in the 9 times table", no: "They are all odd|They go up by 10|They all end in 9", trap: "They are all odd" },
  ],
}));
