// What the Cut Shows. Skill G-GMD.B.4-1.
// Identifying the shapes of two-dimensional cross sections of three-dimensional objects. Not picturing slanted or lengthwise slices is the known slip.
Sidekick.game(Sidekick.play({
  title: "What the Cut Shows",
  emoji: "🔪",
  premise: "Cut straight through a solid and look at the fresh face. That flat shape is the cross section.",
  outro: "The cross section depends on the solid and on the direction of the cut.",
  scene: "kitchen",
  kind: "fill",
  figW: 12,
  cast: "",
  hint: "Picture the knife going through. What outline does the cut face have?",
  tag: "cannot_picture_slice",
  rounds: [
    { say: "Match each cut to the shape of its cross section.", rows: [["a cone cut parallel to its base", "~circle"], ["a cylinder cut straight down through its middle", "~quad:rect"]], extra: "~tri:e", trap: [1, "~circle"], why: "Cutting down through the middle shows straight sides and flat ends: a rectangle.", win: "Across gives a circle. Down gives a rectangle." },
    { say: "Match each cut to its cross section.", rows: [["a cone cut straight down through its tip", "~tri:e"], ["a ball cut anywhere", "~circle"], ["a cube cut parallel to a face", "~quad:sq"]], extra: "~oval", trap: [0, "~circle"], why: "Cut through the tip and you see two slanted edges meeting: a triangle.", win: "Triangle, circle, square." },
    { say: "Match the cuts by yourself.", rows: [["a cylinder cut parallel to its base", "~circle"], ["a square pyramid cut parallel to its base", "~quad:sq"], ["a cylinder cut on a slant", "~oval"]], extra: "~tri:e ~quad:rect", trap: [2, "~circle"] },
  ],
}));
