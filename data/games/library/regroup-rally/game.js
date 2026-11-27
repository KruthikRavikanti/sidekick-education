// Regroup Rally. Skill 3.NBT.A.2-1.
// Adding three-digit numbers with regrouping. Forgetting to add the regrouped ten or hundred is the known slip.
Sidekick.game(Sidekick.play({
  title: "Regroup Rally",
  emoji: "🏎️",
  premise: "Adding big numbers means carrying tens and hundreds over to the next lane. Make sure every one of them crosses over.",
  outro: "When a place adds up to ten or more, one goes to the next place.",
  scene: "city",
  kind: "type",
  icon: "🏎️",
  hint: "If a place adds to 10 or more, carry one to the next place and add it there.",
  tag: "forgets_the_carry",
  rounds: [
    { say: "Key in the total.", q: "245 + 328", ans: 573, trap: 563, why: "5 + 8 is 13. The new ten has to be added to the tens.", win: "245 + 328 = 573." },
    { say: "Two carries this time.", q: "376 + 458", ans: 834, trap: 724, why: "The ones make a new ten, and the tens make a new hundred. Add both.", win: "376 + 458 = 834." },
    { say: "Key in the total by yourself.", alt: [{ q: "567 + 286", ans: 853, trap: 743 }, { q: "489 + 175", ans: 664, trap: 554 }] },
  ],
}));
