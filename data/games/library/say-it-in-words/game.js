// Say It in Words. Skill 2.NBT.A.3-2.
// Writing numbers in word form: 615 is six hundred fifteen. Leaving out the place-value word hundred is the known slip.
Sidekick.game(Sidekick.play({
  title: "Say It in Words",
  emoji: "🗣️",
  premise: "Turn each number into words. Every place gets its say, especially the hundreds.",
  outro: "When you write a number in words, the word hundred tells how many hundreds.",
  scene: "paper",
  kind: "row",
  cast: "",
  hint: "Say the hundreds digit, then the word hundred, then the rest.",
  tag: "leaves_out_hundred",
  rounds: [
    { say: "Build the number in words.", q: "615", seq: "six hundred fifteen", extra: "sixty", trap: "six fifteen", why: "The 6 is in the hundreds place. Say six hundred.", win: "Six hundred fifteen." },
    { say: "Build this number in words.", q: "340", seq: "three hundred forty", extra: "thirty", trap: "three forty", why: "The 3 is in the hundreds place. Say three hundred.", win: "Three hundred forty." },
    { say: "Build this one by yourself.", alt: [{ q: "802", seq: "eight hundred two", extra: "eighty", trap: "eight two" }, { q: "527", seq: "five hundred twenty seven", extra: "fifty", trap: "five twenty seven" }] },
  ],
}));
