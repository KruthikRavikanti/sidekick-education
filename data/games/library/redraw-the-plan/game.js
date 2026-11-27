// Redraw the Plan. Skill 7.G.A.1-3.
// Reproducing a scale drawing at a different scale. Changing only one dimension is the known slip.
Sidekick.game(Sidekick.play({
  title: "Redraw the Plan",
  emoji: "📐",
  premise: "To redraw at a new scale, every length changes by the same factor. Stretch only one side and the shape is no longer the same.",
  outro: "A new scale changes every dimension by the same factor.",
  scene: "paper",
  kind: "type",
  icon: "📐",
  hint: "Find the real length first. Then use the new scale on it.",
  tag: "changes_one_dimension",
  rounds: [
    { say: "This 3 by 2 drawing is redrawn twice as big. Set both new sides.", kind: "dial", cast: "", view: { type: "rect", grid: true, unit: 60 }, dials: [["Width", 1, 8, 1, 3], ["Height", 1, 8, 1, 2]], ans: [6, 4], trap: [6, 2], why: "Only the width doubled, so the shape got stretched. Double the height too.", win: "6 by 4 keeps the same shape." },
    { say: "Key in the length on the new drawing, in centimeters.", q: "At 1 cm = 2 m a wall is 6 cm long. Redraw it at 1 cm = 3 m.", ans: "4", trap: "9", why: "The real wall is 12 m. At 3 m per centimeter it needs fewer centimeters.", win: "12 m ÷ 3 = 4 cm." },
    { say: "Find the new length by yourself.", alt: [{ q: "At 1 cm = 4 m a path is 3 cm long. Redraw it at 1 cm = 2 m.", ans: "6", trap: "1.5" }, { q: "At 1 in = 3 ft a fence is 10 in long. Redraw it at 1 in = 6 ft.", ans: "5", trap: "20" }, { q: "At 1 cm = 1 m a room is 12 cm long. Redraw it at 1 cm = 4 m.", ans: "3", trap: "48" }] },
  ],
}));
