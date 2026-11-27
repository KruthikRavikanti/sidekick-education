// Sketch the Story. Skill 8.F.B.5-2.
// Sketching a graph that exhibits the qualitative features of a function described verbally. Drawing the path travelled instead of the relationship is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sketch the Story",
  emoji: "✏️",
  premise: "Turn a story into a graph. Across is time. Up is distance from home. Mark the moments when something changes.",
  outro: "A graph of a story shows how one quantity changes with another, not the path you walked.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [0, 8, 0, 8],
  join: "line",
  quiet: true,
  hint: "At each moment in the story, how far from home are you?",
  tag: "draws_path_not_relationship",
  rounds: [
    { say: "Across is minutes, up is blocks from home. Plot the four corner points.", q: "Leave at 0 · reach a store 4 blocks away at minute 3 · leave it at minute 5 · home at minute 7", ans: [[0, 0], [3, 4], [5, 4], [7, 0]], trap: [[0, 0], [3, 4], [5, 4], [7, 4]], why: "At minute 7 you are home again. Distance from home is 0.", win: "Up, flat, then back down to zero." },
    { say: "Across is minutes, up is water level. Plot the four corner points.", q: "Empty at 0 · filled to level 6 by minute 2 · soak until minute 5 · empty at minute 8", ans: [[0, 0], [2, 6], [5, 6], [8, 0]], trap: [[0, 0], [2, 6], [5, 6], [8, 6]], why: "By minute 8 the tub has drained. The level is 0.", win: "Fill, soak, drain." },
    { say: "Plot the four corner points by yourself.", alt: [{ q: "Bike ride · 6 blocks from home at minute 4 · rest until minute 6 · home at minute 8", ans: [[0, 0], [4, 6], [6, 6], [8, 0]], trap: [[0, 0], [4, 6], [6, 6], [8, 6]] }, { q: "Elevator · up to floor 5 by minute 2 · wait until minute 4 · back at floor 0 by minute 5", ans: [[0, 0], [2, 5], [4, 5], [5, 0]], trap: [[0, 0], [2, 5], [4, 5], [5, 5]] }] },
  ],
}));
