// Apple Cart Tape. Skill 2.OA.A.1-1.
// One-step problems with the unknown in any position: a tape diagram shows the whole and the parts, and the typed number becomes the missing bar. Adding because of the word more is the known slip.
Sidekick.game(Sidekick.play({
  title: "Apple Cart Tape",
  emoji: "🍎",
  premise: "Every story has a missing piece. The two bars must end up the same length. Key in the piece that makes them match.",
  outro: "Draw the story as bars, and the missing part shows itself.",
  scene: "meadow",
  kind: "type",
  hint: "The two rows of bars must be the same length when you are done.",
  tag: "adds_on_the_word_more",
  rounds: [
    { say: "Read the story. Key in the missing part so the bars match.", q: "A shop had 45 apples. It sold some and has 27 left. How many did it sell?", view: { type: "tape", top: [45], bottom: [27, "x"], names: ["had", "left + sold"] }, ans: 18, trap: 72, why: "The shop sold apples, so the answer is a part of 45, not more than 45.", win: "27 and 18 make 45." },
    { say: "A new story. Key in the missing bar.", q: "Jo has 36 cards. Max has 15 more cards than Jo. How many cards does Max have?", view: { type: "tape", top: [36, 15], bottom: ["x"], names: ["Jo and 15 more", "Max"] }, ans: 51, trap: 21, why: "Max has more than Jo, so his bar is longer than 36.", win: "36 and 15 more is 51." },
    { say: "Solve this story by yourself.", alt: [{ q: "Ty had some stickers. He got 20 more. Now he has 54. How many did he start with?", view: { type: "tape", top: [54], bottom: ["x", 20], names: ["now", "start + 20"] }, ans: 34, trap: 74 }, { q: "Liv has 62 beads. She has 25 more than Sam. How many beads does Sam have?", view: { type: "tape", top: [62], bottom: ["x", 25], names: ["Liv", "Sam + 25"] }, ans: 37, trap: 87 }] },
  ],
}));
