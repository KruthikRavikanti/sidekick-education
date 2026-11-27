// Above and Below Zero. Skill 6.NS.C.5-1.
// Using positive and negative numbers to represent quantities in real-world contexts. Thinking negative numbers are not real is the known slip.
Sidekick.game(Sidekick.play({
  title: "Above and Below Zero",
  emoji: "🌊",
  premise: "Negative numbers describe real things: depths below sea level, temperatures below zero, money owed.",
  outro: "Positive and negative numbers describe opposite directions from zero.",
  scene: "ocean",
  kind: "type",
  icon: "🤿",
  hint: "Below, loss, owe and drop are negative. Above, gain and rise are positive.",
  tag: "ignores_the_sign",
  rounds: [
    { say: "Key in a number for the situation. Use the ± key.", q: "20 feet below sea level", ans: -20, trap: 20, why: "Below sea level is on the negative side of zero.", win: "−20 feet." },
    { say: "Key in a number for the situation.", q: "A temperature 8 degrees below zero", ans: -8, trap: 8, why: "Below zero is negative.", win: "−8 degrees." },
    { say: "Key in the number by yourself.", alt: [{ q: "A debt of 45 dollars", ans: -45, trap: 45 }, { q: "A loss of 12 yards in football", ans: -12, trap: 12 }, { q: "A submarine 300 meters under the surface", ans: -300, trap: 300 }] },
  ],
}));
