// Right Speed Reader. Skill RF.5.4-2.
// Reading with appropriate rate and expression. Reading too fast to understand is the known slip.
Sidekick.game(Sidekick.play({
  title: "Right Speed Reader",
  emoji: "🐇",
  premise: "Racing through the words is not good reading. Change your speed to fit the text so you can still understand it.",
  outro: "Read at a rate that lets you understand: slow down for hard parts, and keep a steady pace for easy ones.",
  scene: "field",
  kind: "sort",
  hint: "Is this the kind of text you need to think hard about?",
  tag: "reads_too_fast",
  rounds: [
    { say: "When should you slow down, and when can you keep a steady pace?", bins: "Slow down|Steady pace", items: ["directions for a science lab|a paragraph full of new terms", "a story you know well|an easy bit of dialogue"], trap: ["a paragraph full of new terms", 1], why: "New terms take thought. Slow down so you can take them in.", win: "The text sets the speed." },
    { say: "Which are signs you are reading too fast?", kind: "pick", yes: "You cannot say what you just read.|You skip over punctuation.", no: "You pause at commas.|You can retell the paragraph.", trap: "You pause at commas.", why: "Pausing at commas is a sign of careful reading.", win: "If you cannot retell it, slow down." },
    { say: "Sort these by yourself.", bins: "Slow down|Steady pace", items: ["a math word problem|a poem with unusual word order", "a comic you have read before|a friendly note"], trap: ["a math word problem", 1] },
  ],
}));
