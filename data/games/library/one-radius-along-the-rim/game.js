// One Radius Along the Rim. Skill F-TF.A.1-1.
// Understanding the radian measure of an angle as the length of the arc on the unit circle. Thinking radians and degrees are the same units is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Radius Along the Rim",
  emoji: "🎡",
  premise: "A radian measures an angle by its arc: how many radius-lengths fit along the rim.",
  outro: "Angle in radians = arc length ÷ radius. A full turn is 2π radians, about 6.28.",
  scene: "sky",
  kind: "type",
  icon: "🎡",
  hint: "How many radius-lengths long is the arc?",
  tag: "radians_as_degrees",
  rounds: [
    { say: "Key in the angle in radians.", q: "On a circle of radius 5, the arc is 10 long.", ans: 2, trap: 50, why: "Divide the arc by the radius: 10 ÷ 5.", win: "Two radius-lengths of arc: 2 radians." },
    { say: "Radians or degrees? Sort each fact.", kind: "sort", fs: 5, bins: "Radians|Degrees", items: ["a full turn is 2π|arc length ÷ radius|a half turn is π", "a full turn is 360|a right angle is 90"], trap: ["a full turn is 2π", 1], why: "2π is about 6.28 radius-lengths around the rim. That is radians.", win: "2π radians equals 360 degrees." },
    { say: "Find the angle in radians by yourself.", alt: [{ q: "Radius 4, arc length 12", ans: 3, trap: 48 }, { q: "Radius 6, arc length 6", ans: 1, trap: 36 }, { q: "Radius 2, arc length 9", ans: 4.5, trap: 18 }, { q: "On the unit circle (radius 1), arc length 2", ans: 2, trap: 0.5 }] },
  ],
}));
