// Comma Between Adjectives. Skill L.7.2-1.
// Using a comma to separate coordinate adjectives. Leaving it out is the known slip.
Sidekick.game(Sidekick.play({
  title: "Comma Between Adjectives",
  emoji: "✒️",
  premise: "When adjectives describe a noun equally, a comma separates them. Test it: could you say and between them?",
  outro: "Use a comma between coordinate adjectives. No comma between the last adjective and the noun.",
  scene: "paper",
  kind: "pick",
  fs: 5.6,
  hint: "Try saying and between the adjectives. If it works, a comma belongs.",
  tag: "omits_adjective_comma",
  rounds: [
    { say: "Tap the two commas that belong.", mark: "It was a long *, cold *, lonely , night.", trap: "-,", why: "Long and cold and lonely: each and becomes a comma.", win: "A long, cold, lonely night." },
    { say: "Tap the two commas that belong.", mark: "He gave a clear *, honest *, brave , answer.", trap: "-,", why: "Clear and honest and brave. No comma before the noun.", win: "A clear, honest, brave answer." },
    { say: "Tap the two commas that belong by yourself.", mark: "We crossed a dark *, windy *, narrow , bridge.", trap: "-," },
  ],
}));
