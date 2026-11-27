// Talking or Writing?. Skill L.3.3-2.
// Recognizing differences between the conventions of spoken and written standard English. Writing the way one talks is the known slip.
Sidekick.game(Sidekick.play({
  title: "Talking or Writing?",
  emoji: "🦈",
  premise: "We talk one way with friends and write another way for a school report. A report uses complete, clear sentences.",
  outro: "Written English for school leaves out fillers like like, super and and stuff.",
  scene: "ocean",
  kind: "sort",
  hint: "Would this sentence belong in a printed report?",
  tag: "writes_as_spoken",
  rounds: [
    { say: "Which sentences fit a school report?", bins: "Fits a report|Sounds like talking", items: ["Sharks are fascinating animals.|Sharks have lived for millions of years.", "Sharks are like, super cool and stuff.|So yeah, sharks are awesome."], trap: ["So yeah, sharks are awesome.", 0], why: "So yeah is how we chat. A report states it plainly.", win: "Report language and chat language." },
    { say: "Sort these sentences.", bins: "Fits a report|Sounds like talking", items: ["The volcano erupted in 1980.|Ash covered the nearby towns.", "It was, um, a really big boom.|The volcano was kinda scary, you know."], trap: ["It was, um, a really big boom.", 0], why: "Um is a filler we say out loud. It does not belong in writing.", win: "You can hear the difference." },
    { say: "Sort these by yourself.", bins: "Fits a report|Sounds like talking", items: ["Bees pollinate many crops.|A hive can hold thousands of bees.", "Bees are gonna sting ya.|Honey is, like, the best."], trap: ["Honey is, like, the best.", 0] },
  ],
}));
