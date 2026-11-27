// Same Size, Same Shape. Skill 8.G.A.2-1.
// Understanding that a figure is congruent to another if obtained by a sequence of rigid motions. Describing motions vaguely is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Size, Same Shape",
  emoji: "🧩",
  premise: "Two figures are congruent if slides, flips and turns can carry one exactly onto the other.",
  outro: "Congruent figures match after a sequence of translations, reflections and rotations.",
  scene: "candy",
  kind: "sort",
  fs: 5,
  hint: "Did any move change the size? If not, the figures are congruent.",
  tag: "vague_about_motions",
  rounds: [
    { say: "Shape B was made from shape A. Is B congruent to A?", bins: "Congruent|Not congruent", items: ["slid right, then flipped|turned 90°, then slid up|flipped twice", "enlarged by 2|stretched sideways"], trap: ["slid right, then flipped", 1], why: "Slides and flips do not change size or shape.", win: "Only rigid motions keep it congruent." },
    { say: "Tap every move that keeps a figure congruent.", kind: "pick", fs: 5.6, yes: "translation|reflection|rotation", no: "dilation by 3|stretch|shrink by half", trap: "dilation by 3", why: "A dilation changes the size.", win: "Translation, reflection, rotation." },
    { say: "Sort these by yourself.", bins: "Congruent|Not congruent", items: ["rotated 180°, then slid left|reflected over the y-axis|slid up 4 and right 2", "dilated by {1/2}|doubled in height only"], trap: ["rotated 180°, then slid left", 1] },
  ],
}));
