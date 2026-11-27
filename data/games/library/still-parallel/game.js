// Still Parallel. Skill 8.G.A.1-3.
// Verifying experimentally that rigid motions take parallel lines to parallel lines. Not being able to verify it is the known slip.
Sidekick.game(Sidekick.play({
  title: "Still Parallel",
  emoji: "🛤️",
  premise: "Slide, flip or turn a pair of parallel lines and they stay parallel. Test it yourself.",
  outro: "Rigid motions take parallel lines to parallel lines.",
  scene: "paper",
  kind: "type",
  icon: "🛤️",
  hint: "Parallel lines have the same slope. Does a slide change the slope?",
  tag: "cannot_verify_parallel",
  rounds: [
    { say: "The blue line is y = x + 1. Slide it up 3. Set the orange line to its image.", kind: "dial", cast: "", view: { type: "graph", fn: "line", also: [["line", 1, 1]], win: [-6, 6, -6, 6] }, dials: [["Slope", -3, 3, 1, 0], ["Intercept", -5, 5, 1, 0]], ans: [1, 4], trap: [2, 4], why: "A slide does not tilt the line. The slope stays 1.", win: "Same slope, so the image is parallel." },
    { say: "Key in the slope of each image.", q: "Two parallel lines both have slope 2. Both are translated 5 units up.", ans: 2, trap: 7, why: "Moving a line up changes where it crosses, not its slope.", win: "Both still have slope 2." },
    { say: "Sort these by yourself.", kind: "sort", fs: 4.8, bins: "True|Not true", items: ["Translated parallel lines stay parallel|Rotated parallel lines stay parallel", "A slide makes parallel lines cross|A flip changes how far apart they are"], trap: ["A slide makes parallel lines cross", 0] },
  ],
}));
