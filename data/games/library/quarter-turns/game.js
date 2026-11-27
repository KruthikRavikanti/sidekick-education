// Quarter Turns. Skill 8.G.A.3-2.
// Describing the effect of rotations using coordinates. Rotating in the opposite direction is the known slip.
Sidekick.game(Sidekick.play({
  title: "Quarter Turns",
  emoji: "🔄",
  premise: "A quarter turn counterclockwise about the origin sends (x, y) to (−y, x). The point swings to the next quadrant on the left.",
  outro: "90° counterclockwise: (x, y) → (−y, x). 90° clockwise: (x, y) → (y, −x). 180°: (x, y) → (−x, −y).",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -4, 4],
  quiet: true,
  hint: "Counterclockwise goes the way the quadrants are numbered: I to II to III.",
  tag: "rotates_other_direction",
  rounds: [
    { say: "Rotate P 90° counterclockwise about the origin. Tap its image.", given: [[2, 3, "P"]], ans: [[-3, 2]], trap: [[3, -2]], why: "That is a clockwise turn. Counterclockwise swings it up and to the left.", win: "(2, 3) turns to (−3, 2)." },
    { say: "Rotate P 180° about the origin. Tap its image.", given: [[1, 4, "P"]], ans: [[-1, -4]], trap: [[-1, 4]], why: "A half turn flips both signs.", win: "(1, 4) turns to (−1, −4)." },
    { say: "Tap the image by yourself.", alt: [{ say: "Rotate P 90° counterclockwise about the origin.", given: [[3, 1, "P"]], ans: [[-1, 3]], trap: [[1, -3]] }, { say: "Rotate P 90° clockwise about the origin.", given: [[2, 4, "P"]], ans: [[4, -2]], trap: [[-4, 2]] }, { say: "Rotate P 180° about the origin.", given: [[-2, 1, "P"]], ans: [[2, -1]], trap: [[2, 1]] }] },
  ],
}));
