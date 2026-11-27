// Signs by Quadrant. Skill F-TF.A.2-2.
// Determining the signs of trigonometric values by quadrant. Getting signs reversed in quadrants II to IV is the known slip.
Sidekick.game(Sidekick.play({
  title: "Signs by Quadrant",
  emoji: "🧲",
  premise: "Sine is the height and cosine is the across distance. So their signs follow the signs of y and x in each quadrant.",
  outro: "Quadrant I: both positive. II: only sine. III: neither. IV: only cosine.",
  scene: "night",
  kind: "sort",
  fs: 5.6,
  hint: "Left of the y-axis, cosine is negative. Below the x-axis, sine is negative.",
  tag: "quadrant_sign_slip",
  rounds: [
    { say: "Positive or negative? Think about where the angle lands.", bins: "Positive|Negative", items: ["sin 120°|cos 300°|sin 30°", "cos 120°|sin 200°|cos 180°"], trap: ["cos 120°", 0], why: "120° is in Quadrant II, left of the y-axis. x is negative there.", win: "Height for sine, across for cosine." },
    { say: "Match each quadrant to its signs.", kind: "fill", fs: 4.6, cast: "", rows: [["Quadrant I", "sin +, cos +"], ["Quadrant II", "sin +, cos −"], ["Quadrant III", "sin −, cos −"], ["Quadrant IV", "sin −, cos +"]], trap: [1, "sin −, cos +"], why: "In Quadrant II you are above the x-axis and left of the y-axis.", win: "Follow the signs of y and x." },
    { say: "Sort these by yourself.", bins: "Positive|Negative", items: ["sin 150°|cos 330°|cos 45°", "sin 240°|cos 150°|sin 300°"], trap: ["cos 330°", 1] },
  ],
}));
