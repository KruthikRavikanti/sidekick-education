// Round the Decimal. Skill 5.NBT.A.4-1.
// Rounding decimals to any place. Rounding to a different place than the one asked for is the known slip.
Sidekick.game(Sidekick.play({
  title: "Round the Decimal",
  emoji: "🎳",
  premise: "Rounding decimals works like rounding whole numbers. Find the place, look one digit to the right.",
  outro: "Find the place you are rounding to, then look only at the next digit.",
  scene: "desk",
  kind: "type",
  icon: "🎳",
  hint: "Underline the place you are rounding to. Look at the very next digit.",
  tag: "rounds_to_the_other_place",
  rounds: [
    { say: "Key in the rounded number.", q: "Round 3.478 to the nearest hundredth.", ans: "3.48", trap: "3.5", why: "That is rounded to the nearest tenth. Hundredths are the second place after the point.", win: "3.478 rounds to 3.48." },
    { say: "Round this one.", q: "Round 12.063 to the nearest tenth.", ans: "12.1", trap: "12.06", why: "That is rounded to the nearest hundredth. Tenths are the first place after the point.", win: "12.063 rounds to 12.1." },
    { say: "Round this by yourself.", alt: [{ q: "Round 0.846 to the nearest hundredth.", ans: "0.85", trap: "0.8" }, { q: "Round 7.251 to the nearest tenth.", ans: "7.3", trap: "7.25" }, { q: "Round 5.694 to the nearest whole number.", ans: "6", trap: "5.7" }] },
  ],
}));
