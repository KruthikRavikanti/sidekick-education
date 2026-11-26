// Clip Line. Skill 1.MD.A.2-1.
// Laying units end to end with no spaces or overlaps: the child adds clips until they reach exactly from one end to the other. One too few leaves part uncovered.
Sidekick.game(Sidekick.play({
  title: "Clip Line",
  emoji: "🖇️",
  premise: "Measure by laying paper clips end to end, from one end of the thing to the other. No spaces, no extras.",
  outro: "Units go end to end, touching, from one end to the other.",
  scene: "desk",
  kind: "dial",
  cast: "",
  hint: "The clips should reach from one dotted line to the other, no more and no less.",
  tag: "leaves_a_space",
  tag2: "goes_past_the_end",
  dials: [["Clips", 0, 10]],
  rounds: [
    { say: "Lay clips under the pencil from end to end. Touching, with no spaces.", view: { type: "units", len: 5, icon: "✏️" }, ans: [5], trap: [4], why: "Part of the pencil has no clip under it yet.", win: "The pencil is 5 clips long." },
    { say: "Measure the paintbrush with clips.", view: { type: "units", len: 7, icon: "🖌️" }, ans: [7], trap: [6], trap2: [8], why: "Part of the brush has no clip under it yet.", why2: "That clip sticks out past the end.", win: "The brush is 7 clips long." },
    { say: "Measure this one by yourself.", alt: [{ view: { type: "units", len: 6, icon: "🥄" }, ans: [6], trap: [5], trap2: [7] }, { view: { type: "units", len: 8, icon: "🪥" }, ans: [8], trap: [7], trap2: [9] }, { view: { type: "units", len: 4, icon: "🔑" }, ans: [4], trap: [3], trap2: [5] }] },
  ],
}));
