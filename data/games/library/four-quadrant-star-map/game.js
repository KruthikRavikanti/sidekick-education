// Four Quadrant Star Map. Skill 6.NS.C.6-4.
// Finding and positioning pairs of integers and other rational numbers on a coordinate plane. Reversing x and y is the known slip.
Sidekick.game(Sidekick.play({
  title: "Four Quadrant Star Map",
  emoji: "🌌",
  premise: "With negative numbers the plane has four quarters. The first number still goes across, the second still goes up or down.",
  outro: "In (x, y), x moves left or right and y moves up or down. Negative means left or down.",
  scene: "space",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -4, 4],
  hint: "First number: left or right. Second number: up or down.",
  tag: "reverses_x_and_y",
  rounds: [
    { say: "Tap the point (−3, 2).", ans: [[-3, 2]], trap: [[2, -3]], why: "That is (2, −3). The first number, −3, goes left.", win: "Left 3, up 2." },
    { say: "Tap the point (2, −3).", ans: [[2, -3]], trap: [[-3, 2]], why: "That is (−3, 2). The first number, 2, goes right.", win: "Right 2, down 3." },
    { say: "Place the star by yourself.", alt: [{ say: "Tap the point (−4, −1) by yourself.", ans: [[-4, -1]], trap: [[-1, -4]] }, { say: "Tap the point (3, −2) by yourself.", ans: [[3, -2]], trap: [[-2, 3]] }, { say: "Tap the point (−1, 4) by yourself.", ans: [[-1, 4]], trap: [[4, -1]] }] },
  ],
}));
