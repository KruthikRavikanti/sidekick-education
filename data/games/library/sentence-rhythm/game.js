// Sentence Rhythm. Skill L.11-12.3-1.
// Varying syntax for effect and applying an understanding of syntax to complex texts. Repetitive syntax is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sentence Rhythm",
  emoji: "🥁",
  premise: "Sentences of one length drone. A short one after several long ones hits like a drum. Vary the pattern on purpose.",
  outro: "Vary syntax for effect: mix long and short sentences and change how they begin.",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Do the sentences all start the same way and run the same length?",
  tag: "repetitive_syntax",
  rounds: [
    { say: "Varied for effect, or monotonous?", bins: "Varied|Monotonous", items: ["After hours of argument, the vote was counted. She had won.|All night the wind worked at the shutters. Then, silence.", "The wind blew. The shutters shook. The night ended.|She ran. She won. She smiled."], trap: ["She ran. She won. She smiled.", 0], why: "Three sentences of the same shape and length. Nothing stands out.", win: "A long one, then a short one." },
    { say: "What does each choice do?", kind: "fill", fs: 4.4, cast: "", rows: [["one short sentence", "adds emphasis"], ["a long, flowing sentence", "builds momentum"], ["a question", "pulls the reader in"]], extra: "fixes spelling|", trap: [0, "fixes spelling"], why: "Length has nothing to do with spelling. A short sentence makes a point hit.", win: "Shape creates effect." },
    { say: "Sort these by yourself.", bins: "Varied|Monotonous", items: ["When the river rose, the bridge closed. We walked.|He tried the handle, the window, the cellar. Nothing.", "The river rose. The bridge closed. We walked.|He tried it. He tried again. He tried more."], trap: ["He tried it. He tried again. He tried more.", 0] },
  ],
}));
