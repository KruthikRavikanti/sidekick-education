// Chance Scale. Skill 7.SP.C.5-2.
// Understanding that probability near 0 means unlikely, near one half neither, and near 1 likely. Thinking unlikely means impossible is the known slip.
Sidekick.game(Sidekick.play({
  title: "Chance Scale",
  emoji: "🌦️",
  premise: "Probability runs from 0 to 1. Near 0 is unlikely, near 1 is likely. Only exactly 0 is impossible.",
  outro: "Probability 0 is impossible, 1 is certain. Small is unlikely, not impossible.",
  scene: "sky",
  kind: "sort",
  fs: 6,
  hint: "Is it exactly 0, or just small?",
  tag: "unlikely_is_impossible",
  rounds: [
    { say: "Sort each probability.", bins: "Impossible|Unlikely|Likely|Certain", items: ["0|", "0.1|{1/5}", "0.9|{3/4}", "1|"], trap: ["0.1", 0], why: "0.1 is small but not zero. It can still happen.", win: "Only 0 is impossible." },
    { say: "Sort each event.", fs: 4.8, bins: "Impossible|Unlikely|Likely", items: ["rolling a 7 on one die|", "rolling a 6 on one die|picking the 1 red marble out of 10", "rolling more than 1 on one die|"], trap: ["rolling a 6 on one die", 0], why: "A 6 comes up about 1 time in 6. Unlikely, but it happens.", win: "Unlikely events still happen sometimes." },
    { say: "Sort these by yourself.", bins: "Impossible|Unlikely|Likely|Certain", items: ["0|", "0.05|{1/10}", "0.8|{9/10}", "1|"], trap: ["0.05", 0] },
  ],
}));
