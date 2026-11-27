// Right Triangle Hunt. Skill 4.G.A.2-2.
// Classifying figures by angle size and identifying right triangles in any orientation. Thinking right triangles must face one way is the known slip.
Sidekick.game(Sidekick.play({
  title: "Right Triangle Hunt",
  emoji: "⛰️",
  premise: "A right triangle has one square corner. It is still a right triangle when the square corner is on its roof or its side.",
  outro: "A right triangle has one right angle, wherever that angle points.",
  scene: "snow",
  kind: "pick",
  figW: 17,
  hint: "Look at every corner. Is one of them a square corner?",
  tag: "right_triangle_faces_one_way",
  rounds: [
    { say: "Sort the triangles by their biggest angle.", kind: "sort", bins: "All acute|One right|One obtuse", items: ["~tri:e ~tri:i", "~tri:r ~poly:30,20;80,20;80,80", "~tri:o"], trap: ["~poly:30,20;80,20;80,80", 0], why: "One corner of this triangle is a square corner. It is a right triangle.", win: "Sorted by the biggest angle." },
    { say: "Tap every right triangle. Some are turned.", yes: "~tri:r ~poly:50,20;20,50;80,50 ~poly:30,30;70,50;15,60", no: "~tri:e ~tri:o ~tri:s", trap: "-~poly:50,20;20,50;80,50", why: "One was left out. Its square corner is on its roof.", win: "Three right triangles, facing three ways." },
    { say: "Tap every right triangle by yourself.", yes: "~poly:30,20;80,20;80,80 ~poly:30,30;70,50;15,60 ~poly:50,20;20,50;80,50", no: "~tri:i ~tri:o ~tri:e ~tri:s", trap: "-~poly:30,30;70,50;15,60" },
  ],
}));
