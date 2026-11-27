// Look It Up, Settle It. Skill L.11-12.1-2.
// Resolving issues of complex or contested usage by consulting references. Never checking is the known slip.
Sidekick.game(Sidekick.play({
  title: "Look It Up, Settle It",
  emoji: "📚",
  premise: "When writers disagree about usage, they do not guess. They check a usage guide or dictionary and follow its reasoning.",
  outro: "Resolve contested usage by consulting references such as a usage dictionary or style guide.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Use the note in the entry: try he or him in the blank.",
  tag: "never_checks",
  rounds: [
    { say: "Use the usage note to choose who or whom.", fig: { type: "table", rows: [["who", "subject: fits where he or she would"], ["whom", "object: fits where him or her would"]], v: [] }, rows: [["___ wrote this report?", "Who"], ["To ___ should I send it?", "whom"]], extra: "Whose", trap: [1, "Who"], why: "Try it: send it to him. Him is an object, so use whom.", win: "He fits who. Him fits whom." },
    { say: "Use the usage note to choose fewer or less.", fig: { type: "table", rows: [["fewer", "things you can count"], ["less", "an amount you cannot count"]], v: [] }, rows: [["___ cars are on the road.", "Fewer"], ["There is ___ traffic today.", "less"]], extra: "Lesser", trap: [0, "less"], why: "Cars can be counted one by one, so the note calls for fewer.", win: "Count: fewer. Amount: less." },
    { say: "Use the usage note by yourself.", fig: { type: "table", rows: [["affect", "usually a verb: to influence"], ["effect", "usually a noun: a result"]], v: [] }, rows: [["The rule will ___ every student.", "affect"], ["The rule had a large ___.", "effect"]], extra: "effected affects", trap: [0, "effect"] },
  ],
}));
