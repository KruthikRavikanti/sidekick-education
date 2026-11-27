// Hook the Reader. Skill W.6.3-1.
// Engaging and orienting the reader by establishing a context and introducing a narrator. A flat start is the known slip.
Sidekick.game(Sidekick.play({
  title: "Hook the Reader",
  emoji: "🪝",
  premise: "A story opening should drop the reader into a moment, with a voice and a hint of trouble.",
  outro: "Engage the reader by setting up a situation and a narrator, not by announcing the story.",
  scene: "ocean",
  kind: "sort",
  fs: 4.6,
  hint: "Does it put you in a moment and make you wonder what happens next?",
  tag: "flat_start",
  rounds: [
    { say: "Which openings pull a reader in?", bins: "Pulls you in|Flat start", items: ["The boat was already sinking when I found the note.|Nobody told me the mountain could growl.", "This is a story about a boat.|I will tell you about my trip."], trap: ["This is a story about a boat.", 0], why: "It announces the story. It does not start it.", win: "Start inside a moment." },
    { say: "Sort these openings.", bins: "Pulls you in|Flat start", items: ["By the third knock, I knew it was not the wind.|My sister swore the map was a joke, until it glowed.", "One day something happened.|Hello, my name is Sam and this is my story."], trap: ["One day something happened.", 0], why: "Something happened is too vague to picture.", win: "Specific and surprising wins." },
    { say: "Sort these by yourself.", bins: "Pulls you in|Flat start", items: ["The bus left without me, and my phone was on it.|Grandma never locked the attic, except that night.", "This story is about a bus.|It was a day like any other day."], trap: ["It was a day like any other day.", 0] },
  ],
}));
