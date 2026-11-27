// Two Letters, One Sound. Skill RF.1.3-1.
// Knowing the spelling-sound correspondences for common consonant digraphs. Reading a digraph as two separate sounds is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Letters, One Sound",
  emoji: "🧀",
  premise: "Some letter pairs team up to make one new sound: sh, ch, th, wh and ck.",
  outro: "Sh, ch, th, wh and ck are two letters that make one sound together.",
  scene: "kitchen",
  kind: "fill",
  fs: 6.4,
  cast: "",
  hint: "Say the picture word. What one sound do you hear at the blank?",
  tag: "splits_the_digraph",
  rounds: [
    { say: "Drop in the letter team for each word.", rows: [["🚢 ___ip", "sh"], ["🧀 ___eese", "ch"], ["👍 ___umb", "th"]], extra: "wh", trap: [0, "ch"], why: "Ship starts with the quiet shh sound. That is sh.", win: "Ship, cheese, thumb." },
    { say: "Drop in these letter teams.", rows: [["🐳 ___ale", "wh"], ["🦆 du___", "ck"], ["🐚 ___ell", "sh"]], extra: "th", trap: [2, "th"], why: "Shell starts with shh. That is sh.", win: "Whale, duck, shell." },
    { say: "Drop in the letter teams by yourself.", rows: [["🪑 ___air", "ch"], ["🧦 so___", "ck"], ["🛁 ba___", "th"], ["🐑 ___eep", "sh"]], extra: "wh", trap: [0, "sh"] },
  ],
}));
