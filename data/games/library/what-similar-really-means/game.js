// What Similar Really Means. Skill G-SRT.A.2-2.
// Explaining the meaning of similarity for triangles as equality of angles and proportionality of sides. Thinking equal sides are required is the known slip.
Sidekick.game(Sidekick.play({
  title: "What Similar Really Means",
  emoji: "👯",
  premise: "Similar triangles are the same shape at different sizes. Their angles match exactly. Their sides are in proportion.",
  outro: "Similar: all corresponding angles equal and all corresponding sides proportional.",
  scene: "paper",
  kind: "sort",
  fs: 4.6,
  hint: "A dilation changes lengths but never angles.",
  tag: "equal_sides_required",
  rounds: [
    { say: "True or not true about similar triangles?", bins: "True|Not true", items: ["Matching angles are equal.|Matching sides are in proportion.|Congruent triangles are also similar.", "Matching sides must be equal.|Matching angles can differ."], trap: ["Matching sides must be equal.", 0], why: "Equal sides would make them congruent. Similar only needs the same ratio.", win: "Equal angles, proportional sides." },
    { say: "A 3-4-5 triangle has a 37° angle. A similar triangle has sides 9, 12, 15. Match each fact.", kind: "fill", fs: 5.2, cast: "", rows: [["the matching angle in the larger triangle", "37°"], ["the scale factor", "3"]], extra: "111°|12", trap: [0, "111°"], why: "Angles do not scale. The matching angle is still 37°.", win: "Sides triple. Angles stay." },
    { say: "Sort these by yourself.", bins: "True|Not true", items: ["A dilation produces a similar figure.|Similar triangles have the same angle measures.", "A larger similar triangle has larger angles.|Similar triangles always have the same perimeter."], trap: ["A larger similar triangle has larger angles.", 0] },
  ],
}));
