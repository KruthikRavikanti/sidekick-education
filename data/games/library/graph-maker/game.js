// Graph Maker. Skill 2.MD.D.10-1.
// Drawing a bar graph for a small data set: each bar is raised to its count on an even scale. Swapping two bars is the known slip.
Sidekick.game(Sidekick.play({
  title: "Graph Maker",
  emoji: "📈",
  premise: "Turn a list of counts into a bar graph. Raise each bar to just the right height.",
  outro: "In a bar graph, the height of each bar shows how many.",
  scene: "paper",
  kind: "dial",
  cast: "",
  view: { type: "bars", cap: 8, tick: 1 },
  hint: "Read one count from the list, then raise its bar to that number.",
  tag: "bars_on_the_wrong_group",
  rounds: [
    { say: "Make the bar graph for this list.", q: "4 dogs, 6 cats, 2 birds", dials: [["🐶", 0, 8], ["🐱", 0, 8], ["🐦", 0, 8]], ans: [4, 6, 2], trap: [6, 4, 2], why: "Check each picture. The dogs bar should stop at 4.", win: "Bars at 4, 6 and 2." },
    { say: "Make the graph for this list.", q: "5 red, 3 blue, 7 green", dials: [["🔴", 0, 8], ["🔵", 0, 8], ["🟢", 0, 8]], ans: [5, 3, 7], trap: [3, 5, 7], why: "Red is 5 and blue is 3. Check which bar is which.", win: "Bars at 5, 3 and 7." },
    { say: "Make this graph by yourself.", alt: [{ q: "2 apples, 8 pears, 5 peaches", dials: [["🍎", 0, 8], ["🍐", 0, 8], ["🍑", 0, 8]], ans: [2, 8, 5], trap: [8, 2, 5] }, { q: "6 cars, 1 bus, 4 bikes", dials: [["🚗", 0, 8], ["🚌", 0, 8], ["🚲", 0, 8]], ans: [6, 1, 4], trap: [1, 6, 4] }] },
  ],
}));
