// Same Fence, New Garden. Skill 3.MD.D.8-3.
// Rectangles with the same perimeter and different areas: the child reshapes a rectangle and watches both numbers. Assuming the same perimeter means the same area is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Fence, New Garden",
  emoji: "🌼",
  premise: "You have one length of fence. Bend it into different rectangles and watch the space inside change.",
  outro: "Rectangles with the same perimeter can have different areas.",
  scene: "meadow",
  kind: "dial",
  cast: "",
  dials: [["Across", 1, 9], ["Down", 1, 9]],
  view: { type: "rect", grid: true, calc: true, unit: 60 },
  hint: "Watch both numbers. Keep the distance around the same and change the shape.",
  tag: "same_perimeter_same_area",
  rounds: [
    { say: "Build a rectangle that is 16 around with 7 squares inside.", ans: [7, 1], also: [[1, 7]], trap: [4, 4], why: "That is 16 around, but it has 16 squares inside. Try a long thin one.", win: "7 by 1 is 16 around and 7 inside." },
    { say: "Keep it 16 around, but get 15 squares inside.", ans: [5, 3], also: [[3, 5]], trap: [7, 1], why: "Still 16 around, but only 7 inside. Make it less thin.", win: "5 by 3 is 16 around and 15 inside." },
    { say: "Use the fence by yourself.", alt: [{ say: "Build the rectangle that is 12 around with the most squares inside.", ans: [3, 3], trap: [5, 1], trap2: [1, 5] }, { say: "Build the rectangle that is 20 around with the most squares inside.", ans: [5, 5], trap: [9, 1], trap2: [1, 9] }] },
  ],
}));
