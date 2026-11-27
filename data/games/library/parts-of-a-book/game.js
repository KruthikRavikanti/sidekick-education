// Parts of a Book. Skill RI.K.5-1.
// Identifying the front cover, back cover and title page of a book. Calling the title page the cover is the known slip.
Sidekick.game(Sidekick.play({
  title: "Parts of a Book",
  emoji: "📕",
  premise: "A book has a front cover, a back cover and a title page. Each one is in its own place.",
  outro: "The front cover is outside at the front. The title page is the first page inside.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Is it on the outside of the book, or inside?",
  tag: "title_page_called_cover",
  rounds: [
    { say: "Name each part of the book.", rows: [["📕 outside, at the front", "front cover"], ["📖 the first page inside", "title page"], ["📕 outside, at the back", "back cover"]], trap: [1, "front cover"], why: "This one is inside the book. The cover is on the outside.", win: "Front cover, title page, back cover." },
    { say: "Where do you find each thing?", rows: [["the big picture you see first", "front cover"], ["the title again, on a page inside", "title page"], ["the last thing when you close the book", "back cover"]], trap: [1, "front cover"], why: "It is on a page inside. That is the title page.", win: "You know your way around a book." },
    { say: "Name each part by yourself.", rows: [["📖 the first page inside", "title page"], ["📕 outside, at the back", "back cover"], ["📕 outside, at the front", "front cover"]], extra: "last page|", trap: [0, "front cover"] },
  ],
}));
