// Pond Stories. Skill K.OA.A.2-3.
// Making sense of a story before solving: the child sorts short events by whether they leave more or fewer, instead of grabbing the numbers.
Sidekick.game(Sidekick.play({
  title: "Pond Stories",
  emoji: "🦆",
  premise: "Every little story changes how many there are. Decide what happened: are there more now, or fewer?",
  outro: "Know what is happening in the story before you work with the numbers.",
  scene: "ocean",
  kind: "sort",
  cast: "🦆 🌾 🐸 🌾",
  hint: "Picture it. Did some come, or did some go?",
  tag: "grabs_numbers_not_story",
  rounds: [
    { say: "Read each story. Are there more now, or fewer now?", bins: "More now|Fewer now", items: ["2 more ducks came.|A duck joined in.", "3 ducks swam away.|1 duck flew off."], trap: ["3 ducks swam away.", 0], why: "Swam away means some left. Now there are fewer.", win: "Coming makes more. Leaving makes fewer." },
    { say: "New stories. What happened in each one?", bins: "More now|Fewer now", items: ["Mom gave me 2 more.|I found 3 more shells.", "I ate 2 of them.|4 balloons popped."], trap: ["I ate 2 of them.", 0], why: "The ones you ate are gone. Now there are fewer.", win: "You pictured each story." },
    { say: "Sort these stories by yourself.", bins: "More now|Fewer now", items: ["Dad baked 4 more.|2 friends came to play.", "3 cars drove away.|I gave 2 to my sister.|5 leaves blew off."], trap: ["I gave 2 to my sister.", 0] },
  ],
}));
