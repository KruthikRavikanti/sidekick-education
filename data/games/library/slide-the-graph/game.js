// Slide the Graph. Skill F-BF.B.3-1.
// Identifying the effect on the graph of replacing f(x) by f(x) + k and f(x + k). Shifting f(x + 3) to the right is the known slip.
Sidekick.game(Sidekick.play({
  title: "Slide the Graph",
  emoji: "↔️",
  premise: "Adding a number outside the function lifts the graph. Adding it inside, next to x, slides the graph sideways the opposite way.",
  outro: "f(x) + k moves up k. f(x + k) moves LEFT k. f(x − k) moves right k.",
  scene: "paper",
  kind: "fill",
  fs: 6,
  figW: 17,
  cast: "",
  hint: "Inside the brackets works backward: x + 3 is zero at x = −3.",
  tag: "shifts_inside_change_right",
  rounds: [
    { say: "The plain curve is f(x). Match each change to its graph.", rows: [["f(x) + 3", "~plot:quad:0.4:0:2.5"], ["f(x + 3)", "~plot:quad:0.4:-2.5:0"]], extra: "~plot:quad:0.4:2.5:0", trap: [1, "~plot:quad:0.4:2.5:0"], why: "f(x + 3) reaches its low point when x + 3 = 0, at x = −3. That is to the left.", win: "Outside moves up. Inside plus moves left." },
    { say: "The blue curve is y = x^2. Set the orange curve to y = (x + 3)^2 + 2.", kind: "dial", cast: "", view: { type: "graph", fn: "quad", pre: [1], also: [["quad", 1, 0, 0]], win: [-6, 6, -2, 10] }, dials: [["Across", -5, 5, 1, 1], ["Up", -1, 6, 1, 0]], ans: [-3, 2], trap: [3, 2], why: "x + 3 slides the curve 3 to the LEFT.", win: "Left 3 and up 2." },
    { say: "Match these by yourself.", rows: [["f(x) − 2", "~plot:quad:0.4:0:-2.5"], ["f(x − 2)", "~plot:quad:0.4:2.5:0"], ["f(x + 2)", "~plot:quad:0.4:-2.5:0"]], extra: "~plot:quad:0.4:0:2.5", trap: [1, "~plot:quad:0.4:-2.5:0"] },
  ],
}));
