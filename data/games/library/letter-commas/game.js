// Letter Commas. Skill L.2.2-2.
// Using commas in greetings and closings of letters. Leaving out the commas is the known slip.
Sidekick.game(Sidekick.play({
  title: "Letter Commas",
  emoji: "💌",
  premise: "A friendly letter has a comma after the greeting and a comma after the closing.",
  outro: "Put a comma after the greeting (Dear Grandma,) and after the closing (Love,).",
  scene: "paper",
  kind: "pick",
  fs: 5.6,
  hint: "Find the greeting and the closing. Each one gets a comma.",
  tag: "leaves_out_commas",
  rounds: [
    { say: "Tap the commas that belong in this letter.", mark: ["Dear", ",", "Grandma", "*,", "Thank you for the hat.", "Love", "*,", "Sam"], trap: ",", why: "The comma goes after the whole greeting: Dear Grandma,", win: "Dear Grandma, and Love," },
    { say: "Tap the commas that belong in this letter.", mark: ["Dear Mr. Lee", "*,", "I liked", ",", "the book.", "Your friend", "*,", "Ana"], trap: "-,", why: "The greeting needs a comma after it: Dear Mr. Lee,", win: "After the greeting and after the closing." },
    { say: "Tap the commas that belong, by yourself.", alt: [{ mark: ["Dear Aunt Jo", "*,", "Please", ",", "visit soon.", "Love", "*,", "Max"], trap: "-," }, { mark: ["Dear Coach", "*,", "We won", ",", "the game.", "Sincerely", "*,", "Kim"], trap: "-," }] },
  ],
}));
