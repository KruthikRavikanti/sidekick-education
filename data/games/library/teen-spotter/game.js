// Teen Spotter. Skill 1.NBT.B.2-2.
// Numbers 11 to 19 as a ten and some ones: the child finds every way of showing the number. Cards that treat the 1 as one (1 + 4) are the known slip.
Sidekick.game(Sidekick.play({
  title: "Teen Spotter",
  emoji: "🕵️",
  premise: "One teen number can show up in many disguises. Tap every card that shows the number.",
  outro: "A teen number is one ten and some ones.",
  scene: "paper",
  kind: "pick",
  hint: "The 1 in a teen number means one ten.",
  tag: "reads_ten_as_one",
  rounds: [
    { say: "Tap every card that shows 14.", yes: "~rod:1:4|10 + 4|1 ten and 4 ones", no: "1 + 4|~rod:4:1|4 tens and 1 one", trap: "1 + 4", why: "The 1 in 14 is one ten, not one.", win: "14 is 10 and 4." },
    { say: "Tap every card that shows 17.", yes: "~rod:1:7|10 + 7|1 ten and 7 ones", no: "1 + 7|~rod:0:8|7 tens and 1 one", trap: "1 + 7", why: "The 1 in 17 is one ten, not one.", win: "17 is 10 and 7." },
    { say: "Tap every card that shows 12.", yes: "~rod:1:2|10 + 2|1 ten and 2 ones", no: "1 + 2|~rod:2:1|2 tens and 1 one|~rod:0:3", trap: "1 + 2" },
  ],
}));
