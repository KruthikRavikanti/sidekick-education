// Contrast and Cause Clues. Skill L.5.4-1.
// Using context (cause/effect relationships and comparisons in text) as a clue to word meaning. Ignoring context is the known slip.
Sidekick.game(Sidekick.play({
  title: "Contrast and Cause Clues",
  emoji: "🧩",
  premise: "Words like unlike, but and because are clues. They show a new word is the opposite of, or the result of, something you know.",
  outro: "Use cause/effect and comparison clues in the sentence to find a word’s meaning.",
  scene: "desk",
  kind: "pick",
  hint: "Find the signal word. Is the new word being contrasted or explained?",
  tag: "ignores_context",
  rounds: [
    { say: "Read the sentence. What does gregarious mean?", read: "Unlike her gregarious brother, Ana was shy.", yes: "outgoing and sociable|", no: "shy|tall|grumpy", trap: "shy", why: "Unlike signals the opposite. If Ana is shy, her brother is the reverse.", win: "Gregarious means outgoing." },
    { say: "Read the sentence. What does parched mean?", read: "Because it had not rained in months, the fields were parched.", yes: "extremely dry|", no: "flooded|green|planted", trap: "flooded", why: "No rain for months is the cause. The effect is dryness.", win: "Parched means extremely dry." },
    { say: "Read the sentence by yourself.", alt: [{ say: "What does frugal mean?", read: "While his sister spent freely, Marco was frugal and saved every coin.", yes: "careful with money|", no: "wasteful|generous|rich|careless|lucky", trap: "wasteful" }, { say: "What does lethargic mean?", read: "After staying up all night, she felt lethargic and could barely move.", yes: "sluggish and tired|", no: "energetic|cheerful|hungry|alert|nervous", trap: "energetic" }] },
  ],
}));
