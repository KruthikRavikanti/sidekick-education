// Fact Book Makers. Skill RI.K.6-1.
// Naming the author and illustrator of a text and defining their roles in presenting information. Confusing the two roles is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fact Book Makers",
  emoji: "🚚",
  premise: "A book about trucks needs two jobs. The author writes the facts. The illustrator makes the pictures.",
  outro: "The author writes the words. The illustrator makes the pictures.",
  scene: "city",
  kind: "sort",
  hint: "Words come from the author. Pictures come from the illustrator.",
  tag: "confuses_roles",
  rounds: [
    { say: "Whose job is it?", bins: "Author|Illustrator", items: ["writes the facts|picks the words", "draws the trucks|paints the pictures"], trap: ["draws the trucks", 0], why: "Drawing is the job of the illustrator.", win: "Words and pictures, two jobs." },
    { say: "Sort these jobs.", bins: "Author|Illustrator", items: ["tells how a truck works|writes the title", "shows what a truck looks like|colors the cover art"], trap: ["writes the title", 1], why: "The title is made of words. Words come from the author.", win: "You know who does what." },
    { say: "Sort these by yourself.", bins: "Author|Illustrator", items: ["writes each sentence|tells the facts in words", "draws a map|takes the photos|paints a big red truck"], trap: ["draws a map", 0] },
  ],
}));
