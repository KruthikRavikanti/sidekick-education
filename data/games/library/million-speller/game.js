// Million Speller. Skill 4.NBT.A.2-1.
// Reading and writing numbers to a million: zeros hold empty places. Leaving out the zeros is the known slip.
Sidekick.game(Sidekick.play({
  title: "Million Speller",
  emoji: "🛰️",
  premise: "Mission control reads out a big number. Key it in digit by digit, with a zero for every empty place.",
  outro: "Zeros hold the empty places so every other digit stays where it belongs.",
  scene: "space",
  kind: "row",
  cast: "🛰️",
  hint: "Say each place in order. If a place is empty, it gets a 0.",
  tag: "leaves_out_zeros",
  rounds: [
    { say: "Write the number with digits.", q: "20,000 + 500 + 3", seq: "2 0 5 0 3", trap: "2 5 3", why: "There are no thousands and no tens. Zeros have to hold those places.", win: "20,503." },
    { say: "Write this number with digits.", q: "three hundred four thousand, fifty-six", seq: "3 0 4 0 5 6", trap: "3 4 5 6", why: "No ten thousands and no hundreds. Zeros hold those places.", win: "304,056." },
    { say: "Write this number by yourself.", alt: [{ q: "seven hundred thousand, nine hundred two", seq: "7 0 0 9 0 2", trap: "7 9 2" }, { q: "60,000 + 4,000 + 8", seq: "6 4 0 0 8", trap: "6 4 8" }] },
  ],
}));
