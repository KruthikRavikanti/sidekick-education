// Angles Stay Put. Skill 8.G.A.1-2.
// Verifying that rigid motions take angles to angles of the same measure. Thinking reflections change angles is the known slip.
Sidekick.game(Sidekick.play({
  title: "Angles Stay Put",
  emoji: "🪞",
  premise: "Slides, flips and turns move a figure without bending it. Every angle keeps its exact measure.",
  outro: "Translations, reflections and rotations keep angle measures and side lengths the same.",
  scene: "night",
  kind: "type",
  icon: "🪞",
  hint: "A mirror shows the same shape. Does the angle open wider or narrower?",
  tag: "reflection_changes_angle",
  rounds: [
    { say: "Key in the measure of the image.", q: "A 40° angle is reflected over a line.", unit: "°", ans: 40, trap: 140, why: "A flip does not open or close the angle. It stays 40°.", win: "Still 40°." },
    { say: "True or not true?", kind: "sort", fs: 4.8, bins: "True|Not true", items: ["A reflected 40° angle is still 40°|A rotated square keeps four 90° angles|A translated side keeps its length", "A reflection turns 40° into 140°|Rotating a shape stretches its sides"], trap: ["A reflection turns 40° into 140°", 0], why: "Reflections flip the direction, not the size of an angle.", win: "Rigid motions keep angles and lengths." },
    { say: "Key in the measure of the image by yourself.", alt: [{ q: "A 75° angle is translated 6 units right.", unit: "°", ans: 75, trap: 81 }, { q: "A 110° angle is rotated 90° about a point.", unit: "°", ans: 110, trap: 200 }, { q: "A 25° angle is reflected over the x-axis.", unit: "°", ans: 25, trap: 155 }] },
  ],
}));
