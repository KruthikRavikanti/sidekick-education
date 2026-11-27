// Join In Line. Skill RL.K.10-1.
// Engaging in group reading with purpose: the child finds the repeated line of a pattern text and supplies it. Listening without following the text is the known slip.
Sidekick.game(Sidekick.play({
  title: "Join In Line",
  emoji: "🐸",
  premise: "Some books say one line again and again. When you spot it, you can join in and read along.",
  outro: "A line that repeats is your part to join in.",
  scene: "meadow",
  kind: "pick",
  hint: "Which words come back again and again?",
  tag: "does_not_follow_the_text",
  rounds: [
    { say: "Read along. Tap the words that come again and again.", read: "Hop, hop, hop went the frog. / Hop, hop, hop on the log. / Hop, hop, hop in the bog.", yes: "Hop, hop, hop|", no: "on the log|went the frog|in the bog", trap: "on the log", why: "That comes only once. Look at how every line starts.", win: "Hop, hop, hop is the line to join in on." },
    { say: "The next line is missing its start. Drop in the words that repeat.", kind: "fill", cast: "", read: "Hop, hop, hop went the frog. / Hop, hop, hop on the log.", rows: [["___ in the bog.", "Hop, hop, hop"]], extra: "Run, run, run|Hop on", trap: [0, "Run, run, run"], why: "The book always says hop, hop, hop.", win: "You joined in at the right time." },
    { say: "Read along. Tap the words that come again and again.", read: "Up, up, up went the kite. / Up, up, up in the light. / Up, up, up out of sight.", yes: "Up, up, up|", no: "went the kite|in the light|out of sight|Down, down, down|the kite", trap: "out of sight" },
  ],
}));
