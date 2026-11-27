// Round and Round. Skill F-TF.A.4-2.
// Using the unit circle to explain the periodicity of trigonometric functions. Thinking all trig values repeat every π is the known slip.
Sidekick.game(Sidekick.play({
  title: "Round and Round",
  emoji: "🎠",
  premise: "Go all the way around the unit circle and you are back where you started. So sine and cosine repeat every full turn.",
  outro: "sin and cos have period 2π (360°). tan has period π (180°).",
  scene: "night",
  kind: "sort",
  fs: 5.6,
  hint: "After half a turn the point is on the opposite side. Is its height the same?",
  tag: "period_pi_for_all",
  rounds: [
    { say: "How long before each function repeats?", bins: "Every 2π|Every π", items: ["sin x|cos x", "tan x|"], trap: ["sin x", 1], why: "After half a turn the height has the opposite sign. Sine needs a full turn.", win: "Full turn for sine and cosine." },
    { say: "sin 30° is 0.5. Key in the next larger angle with exactly the same sine and cosine.", kind: "type", icon: "🎠", unit: "°", ans: 390, trap: 210, why: "At 210° the point is on the opposite side, where the sine is −0.5. Add a full 360°.", win: "30 + 360 = 390°." },
    { say: "Match these by yourself.", kind: "fill", fs: 5.6, cast: "", rows: [["sin(x + 2π)", "sin x"], ["tan(x + π)", "tan x"], ["sin(x + π)", "−sin x"]], extra: "cos x|", trap: [2, "sin x"] },
  ],
}));
