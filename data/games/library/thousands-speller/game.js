// Thousands Speller. Skill GA-3-NR.1.1-1.
// Reading and writing four-digit numbers: zeros hold empty places. Leaving out a zero (345 for 3,045) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Thousands Speller",
  emoji: "🏛️",
  premise: "Four-digit numbers need all four places filled, even when a place is empty. Write each number with digits.",
  outro: "A zero holds an empty place so the other digits stay where they belong.",
  scene: "city",
  kind: "row",
  cast: "🦉",
  labels: "Thousands Hundreds Tens Ones",
  hint: "Say each place: thousands, hundreds, tens, ones. Empty places get a 0.",
  tag: "leaves_out_the_zero",
  rounds: [
    { say: "Write the number with digits, one in each place.", q: "three thousand forty-five", seq: "3 0 4 5", trap: "3 4 5", why: "There are no hundreds. A 0 has to hold that place.", win: "3,045." },
    { say: "Write the number for this expanded form.", q: "6,000 + 200 + 8", seq: "6 2 0 8", trap: "6 2 8", why: "There are no tens. A 0 has to hold that place.", win: "6,208." },
    { say: "Write this number by yourself.", alt: [{ q: "five thousand six", seq: "5 0 0 6", trap: "5 6" }, { q: "2,000 + 90 + 1", seq: "2 0 9 1", trap: "2 9 1" }] },
  ],
}));
