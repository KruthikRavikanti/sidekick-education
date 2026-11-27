// Shape the Wave. Skill F-TF.B.5-1.
// Choosing trigonometric functions to model periodic phenomena with a given amplitude, frequency and midline. Mixing up the parts, such as period and frequency or amplitude and midline, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Shape the Wave",
  emoji: "🎡",
  premise: "A Ferris wheel, a tide, a swing: each repeats like a sine wave. Amplitude is its height from the middle. The midline is its middle.",
  outro: "Amplitude: distance from midline to peak. Midline: the middle height. Period: time for one full cycle.",
  scene: "sky",
  kind: "dial",
  cast: "",
  dials: [["Height", 1, 4, 1, 1], ["Speed", 1, 2, 1, 1], ["Lift", -2, 3, 1, 0]],
  hint: "Height changes how tall the wave is. Lift moves the whole wave up. Speed squeezes it.",
  tag: "mixes_amplitude_midline",
  rounds: [
    { say: "Match the dashed wave: amplitude 2, midline 1, one cycle every 4 units.", view: { type: "graph", fn: "sin", win: [0, 8, -6, 6], ghost: [2, 1, 1] }, ans: [2, 1, 1], trap: [1, 1, 2], why: "Those are swapped. The wave should reach 2 above its middle, and its middle sits at 1.", win: "Height 2, lifted 1." },
    { say: "A Ferris wheel has radius 20 m, its center is 25 m high, and one turn takes 40 seconds. Name each part.", kind: "fill", fs: 5.6, cast: "", rows: [["amplitude", "20"], ["midline", "25"], ["period", "40"]], extra: "45 5", trap: [0, "25"], why: "25 is the center height, the midline. The amplitude is the radius.", win: "Radius, center height, time per turn." },
    { say: "Build the wave by yourself.", alt: [{ say: "By yourself: build a wave with amplitude 3, midline 2, and one cycle every 4 units.", view: { type: "graph", fn: "sin", win: [0, 8, -6, 6], pts: [[1, 5], [3, -1]] }, ans: [3, 1, 2], trap: [2, 1, 3] }, { say: "By yourself: build a wave with amplitude 4, midline −1, and one cycle every 4 units.", view: { type: "graph", fn: "sin", win: [0, 8, -6, 6], pts: [[1, 3], [3, -5]] }, ans: [4, 1, -1], trap: [1, 1, 3] }, { say: "By yourself: build a wave with amplitude 2, midline 3, and one cycle every 2 units.", view: { type: "graph", fn: "sin", win: [0, 8, -6, 6], pts: [[0.5, 5], [1.5, 1]] }, ans: [2, 2, 3], trap: [3, 2, 2] }] },
  ],
}));
