// Bug Plot Questions. Skill 4.MD.B.4-2.
// Solving addition and subtraction problems from a fraction line plot. Reading stack height as the measurement is the known slip.
Sidekick.game(Sidekick.play({
  title: "Bug Plot Questions",
  emoji: "🐞",
  premise: "The line plot shows how long each bug is. Read it with care: the tallest stack is not the longest bug.",
  outro: "On a line plot, how far right tells the length. How tall the stack is tells how many.",
  scene: "meadow",
  kind: "type",
  hint: "The numbers along the bottom are the lengths. The Xs count the bugs.",
  tag: "misreads_the_plot",
  rounds: [
    { say: "How much longer is the longest bug than the shortest? Key in a fraction.", fig: { type: "bars", stack: true, given: [["3/8", 2], ["1/2", 1], ["5/8", 3], ["7/8", 1]], cap: 4, tick: 1, v: [] }, ans: "4/8", trap: "2/8", why: "The tallest stack is the most common length. The longest bug is the one furthest right.", win: "7 eighths − 3 eighths = 4 eighths." },
    { say: "How many bugs are {5/8} inch or longer?", fig: { type: "bars", stack: true, given: [["3/8", 2], ["1/2", 1], ["5/8", 3], ["7/8", 1]], cap: 4, tick: 1, v: [] }, ans: 4, trap: 3, why: "Count the Xs at 5 eighths AND the X at 7 eighths.", win: "3 bugs and 1 more bug make 4." },
    { say: "Read the plot by yourself.", alt: [{ say: "What is the length of the two shortest bugs put end to end? Key in a fraction.", fig: { type: "bars", stack: true, given: [["1/8", 2], ["3/8", 3], ["5/8", 1], ["6/8", 2]], cap: 4, tick: 1, v: [] }, ans: "2/8", trap: "4/8" }, { say: "How much longer is the longest bug than the shortest? Key in a fraction.", fig: { type: "bars", stack: true, given: [["1/8", 2], ["3/8", 3], ["5/8", 1], ["6/8", 2]], cap: 4, tick: 1, v: [] }, ans: "5/8", trap: "2/8" }] },
  ],
}));
