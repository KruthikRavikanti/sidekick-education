// Read the Story Graph. Skill 8.F.B.5-1.
// Describing qualitatively the functional relationship between two quantities by analyzing a graph. Reading a distance-time graph as a picture of a hill is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read the Story Graph",
  emoji: "🚶",
  premise: "A distance-time graph is not a picture of a hill. Going up means getting farther away. Flat means standing still.",
  outro: "Rising: increasing. Flat: constant. Falling: decreasing. The graph shows a relationship, not the scenery.",
  scene: "city",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "What is the y-axis measuring? Is that amount going up, staying put or going down?",
  tag: "graph_as_picture",
  rounds: [
    { say: "The graph shows distance from home. What happens in each part?", fig: { type: "graph", fn: "none", path: [[0, 0], [2, 2], [4, 2], [6, 7]], win: [0, 7, 0, 8], axis: ["minutes", "distance"], h: 50, v: [] }, rows: [["2 to 4 min", "standing still"], ["4 to 6 min", "moving away fast"]], extra: "on flat ground|coming back home", trap: [0, "on flat ground"], why: "The graph is not the ground. Flat means the distance is not changing.", win: "Stopped, then moving away fast." },
    { say: "Think about your distance from home. Is it increasing, constant or decreasing?", kind: "sort", fs: 5.2, bins: "Increasing|Constant|Decreasing", items: ["walking to school|", "waiting at a light|", "walking back home|riding the bus home"], trap: ["walking back home", 0], why: "Walking back, you get closer to home. The distance shrinks.", win: "Up, flat and down." },
    { say: "Distance from home again. Match these by yourself.", fig: { type: "graph", fn: "none", path: [[0, 6], [2, 6], [5, 0]], win: [0, 7, 0, 8], axis: ["minutes", "distance"], h: 50, v: [] }, rows: [["0 to 2 min", "staying in one place"], ["2 to 5 min", "coming closer to home"]], extra: "walking downhill|going farther away", trap: [1, "walking downhill"] },
  ],
}));
