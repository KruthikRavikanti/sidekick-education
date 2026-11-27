// Closer To Which End?. Skill 5.NBT.A.4-2.
// Using a number line to justify rounding decimals: 6.37 is past the midpoint 6.35, so it rounds to 6.4. Placing decimals incorrectly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Closer To Which End?",
  emoji: "🚩",
  premise: "Zoom in on the number line. A decimal rounds to whichever end it sits closer to.",
  outro: "A number rounds to the nearer end. The halfway mark is where rounding up begins.",
  scene: "field",
  kind: "line",
  icon: "🚩",
  cast: "",
  hint: "Find the halfway mark. Which side of it is the number on?",
  tag: "places_decimals_incorrectly",
  rounds: [
    { say: "Slide the flag to 6.37.", line: [6.3, 6.4, 0.01, 5], from: 6.3, ans: 6.37, trap: 6.33, why: "Count 7 small steps up from 6.30.", win: "6.37 is past the halfway mark, 6.35." },
    { say: "6.37 is marked. Key in 6.37 rounded to the nearest tenth.", kind: "type", icon: "🚩", fig: { type: "numline", line: [6.3, 6.4, 0.01], pts: [[6.37, "6.37"]], every: 5, v: [] }, ans: "6.4", trap: "6.3", why: "6.37 is past the halfway mark, so it is closer to 6.4.", win: "6.37 rounds to 6.4." },
    { say: "Slide the flag to the tenth it rounds to.", alt: [{ say: "The flag is on 2.84. Slide it to the tenth that 2.84 rounds to.", line: [2.8, 2.9, 0.01, 5], from: 2.84, ans: 2.8, trap: 2.9 }, { say: "The flag is on 5.16. Slide it to the tenth that 5.16 rounds to.", line: [5.1, 5.2, 0.01, 5], from: 5.16, ans: 5.2, trap: 5.1 }] },
  ],
}));
