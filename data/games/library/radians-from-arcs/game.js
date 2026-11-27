// Radians From Arcs. Skill G-C.B.5-3.
// Defining the radian measure of an angle as the constant of proportionality between arc length and radius. Thinking radians depend on circle size is the known slip.
Sidekick.game(Sidekick.play({
  title: "Radians From Arcs",
  emoji: "🧵",
  premise: "Wrap one radius along the edge of its circle. The angle it marks out is one radian, in a circle of any size.",
  outro: "Radian measure = arc length ÷ radius. It does not depend on the size of the circle.",
  scene: "paper",
  kind: "type",
  icon: "🧵",
  hint: "Divide the arc length by the radius.",
  tag: "radians_depend_on_size",
  rounds: [
    { say: "True or not true?", kind: "sort", fs: 4.8, bins: "True|Not true", items: ["One radian cuts off an arc as long as the radius.|A full turn is 2π radians.", "A bigger circle has a bigger radian.|Radians measure length."], trap: ["A bigger circle has a bigger radian.", 0], why: "In a bigger circle both the arc and the radius grow. Their ratio stays 1.", win: "A radian is a ratio, so size cancels out." },
    { say: "Key in the angle in radians.", q: "Arc length 10, radius 5", ans: 2, trap: 50, why: "Divide the arc by the radius. Do not multiply.", win: "10 ÷ 5 = 2 radians." },
    { say: "Find the angle in radians by yourself.", alt: [{ q: "Arc length 12, radius 4", ans: 3, trap: 48 }, { q: "Arc length 6, radius 6", ans: 1, trap: 36 }, { q: "Arc length 15, radius 3", ans: 5, trap: 45 }] },
  ],
}));
