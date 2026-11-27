// Slide and Flip Points. Skill 8.G.A.3-1.
// Describing the effect of translations and reflections using coordinates. Changing the other coordinate is the known slip.
Sidekick.game(Sidekick.play({
  title: "Slide and Flip Points",
  emoji: "📍",
  premise: "A translation adds to the coordinates. Left and right change x. Up and down change y. A reflection flips one sign.",
  outro: "Left or right changes x, up or down changes y. Reflecting over the x-axis flips y. Over the y-axis flips x.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -4, 4],
  quiet: true,
  hint: "Left and right move along x. Up and down move along y.",
  tag: "changes_other_coordinate",
  rounds: [
    { say: "Translate P left 3 and up 2. Tap where it lands.", given: [[2, -1, "P"]], ans: [[-1, 1]], trap: [[4, -4]], why: "Left 3 changes x: 2 − 3. Up 2 changes y: −1 + 2.", win: "P lands on (−1, 1)." },
    { say: "Reflect P over the x-axis. Tap its image.", given: [[3, 2, "P"]], ans: [[3, -2]], trap: [[-3, 2]], why: "That is a flip over the y-axis. Over the x-axis, the point goes straight down.", win: "(3, 2) becomes (3, −2)." },
    { say: "Tap the image by yourself.", alt: [{ say: "Reflect P over the y-axis. Tap its image.", given: [[-2, 3, "P"]], ans: [[2, 3]], trap: [[-2, -3]] }, { say: "Translate P right 2 and down 3. Tap where it lands.", given: [[-1, 2, "P"]], ans: [[1, -1]], trap: [[-4, 4]] }, { say: "Reflect P over the x-axis. Tap its image.", given: [[4, -1, "P"]], ans: [[4, 1]], trap: [[-4, -1]] }] },
  ],
}));
