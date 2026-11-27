// Compare Two Groups. Skill 7.SP.B.4-1.
// Using measures of center and variability from random samples to compare two populations. Comparing a single data point is the known slip.
Sidekick.game(Sidekick.play({
  title: "Compare Two Groups",
  emoji: "🏫",
  premise: "To compare two groups fairly, use a measure of center and a measure of spread. One standout value proves little.",
  outro: "Compare groups with center (median or mean) and variability (IQR or MAD), not single data points.",
  scene: "city",
  kind: "sort",
  fs: 4.6,
  hint: "Higher center means higher overall. Smaller spread means more consistent.",
  tag: "compares_single_point",
  rounds: [
    { say: "Read the note. True or not true?", q: "Class A: median 82, IQR 6 · Class B: median 75, IQR 20", bins: "True|Not true", items: ["Class A has the higher center|Class A is more consistent", "Class B is more consistent|B did better: one student got 100"], trap: ["B did better: one student got 100", 0], why: "One score does not describe a class. Compare the medians.", win: "A is higher and steadier." },
    { say: "True or not true?", q: "Plant X: mean 30 cm, MAD 2 · Plant Y: mean 24 cm, MAD 7", bins: "True|Not true", items: ["X plants are taller on average|Y heights vary more", "Y is taller: the tallest plant is a Y|X heights vary more"], trap: ["Y is taller: the tallest plant is a Y", 0], why: "The single tallest plant is one data point. The means say X is taller.", win: "Center and spread tell the story." },
    { say: "Sort these by yourself.", q: "Bus 1: median 12 min, IQR 3 · Bus 2: median 15 min, IQR 10", bins: "True|Not true", items: ["Bus 1 is usually faster|Bus 2 times vary more", "Bus 2 is faster: it once took 6 min|Bus 1 times vary more"], trap: ["Bus 2 is faster: it once took 6 min", 0] },
  ],
}));
