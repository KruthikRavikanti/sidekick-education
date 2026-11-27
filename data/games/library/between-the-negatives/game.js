// Between the Negatives. Skill 6.NS.C.6-3.
// Finding and positioning integers and other rational numbers on a number line. Placing −3.5 between −3 and −2 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Between the Negatives",
  emoji: "❄️",
  premise: "Negative numbers count leftward from zero. So −3.5 is past −3, not before it.",
  outro: "On the negative side, numbers get more negative as you go left: −3.5 is between −4 and −3.",
  scene: "snow",
  kind: "line",
  icon: "⛷️",
  cast: "",
  hint: "Start at 0 and go left. You pass −3 before you reach −3.5.",
  tag: "misplaces_negative_decimal",
  rounds: [
    { say: "Slide the skier to −3.5.", line: [-5, 5, 0.5, 2], from: 0, ans: -3.5, trap: -2.5, why: "That is −2.5. Go past −3, half a step more.", win: "−3.5 is halfway between −4 and −3." },
    { say: "Slide the skier to −1.5.", line: [-5, 5, 0.5, 2], from: 0, ans: -1.5, trap: -0.5, why: "That is −0.5. Go past −1, half a step more.", win: "−1.5 is between −2 and −1." },
    { say: "Slide the skier by yourself.", alt: [{ say: "Slide the skier to −4.5 by yourself.", line: [-5, 5, 0.5, 2], from: 0, ans: -4.5, trap: -3.5 }, { say: "Slide the skier to −2.5 by yourself.", line: [-5, 5, 0.5, 2], from: 0, ans: -2.5, trap: -1.5 }] },
  ],
}));
