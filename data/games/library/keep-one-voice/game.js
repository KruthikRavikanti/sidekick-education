// Keep One Voice. Skill L.6.3-2.
// Maintaining consistency in style and tone. Shifting between casual and formal is the known slip.
Sidekick.game(Sidekick.play({
  title: "Keep One Voice",
  emoji: "🎙️",
  premise: "A formal report should sound formal all the way through. One slangy sentence breaks the spell.",
  outro: "Keep style and tone consistent: do not drop casual language into formal writing.",
  scene: "desk",
  kind: "pick",
  fs: 4.6,
  hint: "Which sentence sounds like chatting with a friend?",
  tag: "tone_shift",
  rounds: [
    { say: "This is a lab report. Tap the sentence that breaks the formal tone.", mark: "The experiment was conducted carefully.|Each sample was measured twice.|*It was super awesome.|The results matched the prediction.", trap: "Each sample was measured twice.", why: "That sentence is plain and formal. Look for slang.", win: "Super awesome is chat, not a report." },
    { say: "This is a letter to the principal. Tap the two sentences that break the tone.", mark: "We are writing to request a recycling program.|*Trash is like, so gross.|Other schools have cut waste by half.|*You guys should totally do it.|Thank you for considering this.", trap: "-You guys should totally do it.", why: "You guys and totally are casual. A letter to the principal stays formal.", win: "Two casual lines out." },
    { say: "This is a book review for class. Tap the two sentences that break the tone by yourself.", mark: "The novel follows a girl who trains a wild horse.|*The ending was kinda meh.|The author describes the desert vividly.|*Anyway, whatever, read it.|The theme of patience is developed well.", trap: "-Anyway, whatever, read it." },
  ],
}));
