// Ten Factory. Skill 1.NBT.C.4-3.
// Composing a new ten when ones add to ten or more: 27 + 6 is 33. Writing all 13 ones in the ones place (213) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ten Factory",
  emoji: "🏭",
  premise: "When the ones pile up past ten, the factory packs ten of them into a new ten. Key in the total.",
  outro: "When the ones make ten or more, they make a new ten.",
  scene: "city",
  kind: "type",
  icon: "🏭",
  hint: "Add the ones. If you get 10 or more, make a new ten.",
  tag: "writes_all_the_ones",
  rounds: [
    { say: "Key in the total. Watch the ones.", q: "27 + 6", ans: 33, trap: 213, why: "7 + 6 is 13 ones. Ten of them make a new ten.", win: "27 + 6 = 33." },
    { say: "The ones make a new ten again.", q: "48 + 5", ans: 53, trap: 413, why: "8 + 5 is 13 ones. Ten of them make a new ten.", win: "48 + 5 = 53." },
    { say: "Key in the total by yourself.", alt: [{ q: "36 + 8", ans: 44, trap: 314 }, { q: "59 + 4", ans: 63, trap: 513 }, { q: "27 + 7", ans: 34, trap: 214 }] },
  ],
}));
