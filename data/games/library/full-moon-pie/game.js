// Full Moon Pie. Skill 2.G.A.3-3.
// A whole as two halves, three thirds or four fourths: the child shades shares until the whole is covered and sees how many it takes.
Sidekick.game(Sidekick.play({
  title: "Full Moon Pie",
  emoji: "🌕",
  premise: "Shade one share at a time until the whole bar is covered. How many shares make a whole?",
  outro: "A whole is 2 halves, 3 thirds or 4 fourths.",
  scene: "night",
  kind: "dial",
  cast: "",
  dials: [["Shares shaded", 0, 4]],
  hint: "Keep shading until no white is left. Count the shares.",
  tag: "whole_is_one_piece",
  rounds: [
    { say: "This bar is cut in halves. Shade halves until the whole bar is covered.", view: { type: "frac", den: 2 }, ans: [2], trap: [1], why: "One half covers only part. The whole needs both halves.", win: "2 halves make a whole." },
    { say: "This bar is cut in thirds. Shade thirds until the whole bar is covered.", view: { type: "frac", den: 3 }, ans: [3], trap: [1], why: "One third covers only part. Keep shading.", win: "3 thirds make a whole." },
    { say: "Cover the whole bar by yourself.", alt: [{ view: { type: "frac", den: 4 }, ans: [4], trap: [3], trap2: [1] }, { view: { type: "frac", den: 3 }, ans: [3], trap: [2], trap2: [1] }] },
  ],
}));
