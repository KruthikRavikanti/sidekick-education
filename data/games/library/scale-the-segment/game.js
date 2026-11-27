// Scale the Segment. Skill G-SRT.A.1-2.
// Verifying that the dilation of a segment is longer or shorter in the ratio given by the scale factor. Adding the scale factor to lengths is the known slip.
Sidekick.game(Sidekick.play({
  title: "Scale the Segment",
  emoji: "📏",
  premise: "A dilation multiplies every length by the scale factor. It never adds.",
  outro: "Image length = scale factor × original length.",
  scene: "paper",
  kind: "type",
  icon: "📏",
  hint: "Multiply the length by the scale factor.",
  tag: "adds_scale_factor",
  rounds: [
    { say: "Key in the length of the image.", q: "A segment of length 4 is dilated by a scale factor of 3.", ans: "12", trap: "7", why: "That adds 3. A dilation multiplies: 4 × 3.", win: "4 × 3 = 12." },
    { say: "Key in the length of the image.", q: "A segment of length 10 is dilated by a scale factor of {1/2}.", ans: "5", trap: "20", why: "A factor of one half shrinks it. Half of 10 is 5.", win: "10 × one half = 5." },
    { say: "Find the image length by yourself.", alt: [{ q: "Length 6, scale factor 4", ans: "24", trap: "10" }, { q: "Length 9, scale factor {1/3}", ans: "3", trap: "27" }, { q: "Length 2.5, scale factor 2", ans: "5", trap: "4.5" }] },
  ],
}));
