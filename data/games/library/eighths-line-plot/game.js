// Eighths Line Plot. Skill 4.MD.B.4-1.
// Making a line plot of measurements in halves, fourths and eighths: marks are evenly spaced and equivalent fractions share a position. Spacing fractions unevenly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Eighths Line Plot",
  emoji: "🐛",
  premise: "The bug lengths are measured in halves, quarters and eighths. Put them on a line plot, one X each.",
  outro: "On a line plot, equal fractions like 2/8 and 1/4 share the same spot.",
  scene: "meadow",
  kind: "dial",
  cast: "",
  hint: "Rename every length in eighths. Then they are easy to order and to match.",
  tag: "spaces_fractions_unevenly",
  rounds: [
    { say: "First mark the number line. Put the lengths in order from shortest to longest.", kind: "row", fs: 6, seq: "{1/8} {1/4} {3/8} {1/2} {5/8} {3/4} {7/8}", trap: "{1/8} {3/8} {5/8} {7/8} {1/4} {1/2} {3/4}", why: "One fourth is 2 eighths, so it comes between 1 eighth and 3 eighths.", win: "Every mark is one eighth past the last." },
    { say: "Build the line plot. Each bug gets one X.", q: "Bug lengths in inches: 1/4, 2/8, 1/2, 3/4, 6/8, 1/2", dials: [["1/4 in", 0, 5], ["1/2 in", 0, 5], ["3/4 in", 0, 5]], view: { type: "bars", stack: true, cap: 5, tick: 1 }, ans: [2, 2, 2], trap: [1, 2, 1], why: "2 eighths is the same length as 1 fourth. It goes in that stack.", win: "Two bugs at each length." },
    { say: "Build this line plot by yourself.", dials: [["3/8 in", 0, 5], ["1/2 in", 0, 5], ["5/8 in", 0, 5]], view: { type: "bars", stack: true, cap: 5, tick: 1 }, alt: [{ q: "Bug lengths in inches: 5/8, 3/8, 1/2, 5/8, 4/8, 5/8", ans: [1, 2, 3], trap: [1, 1, 3] }, { q: "Bug lengths in inches: 3/8, 4/8, 3/8, 5/8, 1/2, 4/8", ans: [2, 3, 1], trap: [2, 1, 1] }] },
  ],
}));
