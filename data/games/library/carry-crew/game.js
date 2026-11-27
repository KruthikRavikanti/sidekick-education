// Carry Crew. Skill 2.NBT.B.7-1.
// Adding three-digit numbers with composing: each place can hold only one digit. Writing a two-digit sum in one place (51214 for 358 + 276) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Carry Crew",
  emoji: "🚧",
  premise: "When a place fills up past nine, the crew carries a ten or a hundred to the next place. Key in the total.",
  outro: "Each place holds one digit. Ten ones make a ten, and ten tens make a hundred.",
  scene: "city",
  kind: "type",
  icon: "👷",
  hint: "If a place adds to 10 or more, carry one to the next place.",
  tag: "two_digits_in_one_place",
  rounds: [
    { say: "Key in the total.", q: "245 + 132", ans: 377, trap: 277, why: "Add each place: 5 + 2 ones, 4 + 3 tens, 2 + 1 hundreds.", win: "245 + 132 = 377." },
    { say: "This one needs carrying twice.", q: "358 + 276", ans: 634, trap: 51214, why: "Each place holds one digit. 14 ones is 1 ten and 4 ones.", win: "358 + 276 = 634." },
    { say: "Key in the total by yourself.", alt: [{ q: "467 + 285", ans: 752, trap: 61412 }, { q: "189 + 356", ans: 545, trap: 41315 }] },
  ],
}));
