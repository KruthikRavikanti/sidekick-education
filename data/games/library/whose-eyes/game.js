// Whose Eyes?. Skill W.7.3-1.
// Engaging and orienting the reader by establishing a context and point of view. A flat start with no clear point of view is the known slip.
Sidekick.game(Sidekick.play({
  title: "Whose Eyes?",
  emoji: "👁️",
  premise: "Every story is told through someone’s eyes. An opening sets up who is telling it and drops the reader into their world.",
  outro: "Establish a point of view in the opening: a narrator who says I, or one who watches from outside.",
  scene: "ocean",
  kind: "sort",
  fs: 4.4,
  hint: "Is the teller inside the story saying I, or outside saying he and she?",
  tag: "no_point_of_view",
  rounds: [
    { say: "Who is telling each opening?", bins: "First person|Third person", items: ["I had never stolen anything before the night of the flood.|My sister and I counted the lightning.", "Mara had never stolen anything before the flood.|The twins counted the lightning from the porch."], trap: ["My sister and I counted the lightning.", 1], why: "My and I show the narrator is inside the story.", win: "I and my: first person. Names and they: third." },
    { say: "Which openings set up a narrator AND pull the reader in?", bins: "Engaging|Flat", items: ["I knew the bridge was out, and I ran for it anyway.|Nobody warned Dev that the house could hear him.", "This is my story.|There was a person and a house."], trap: ["This is my story.", 0], why: "It has a narrator but no moment, no trouble, nothing to picture.", win: "A voice plus a hint of trouble." },
    { say: "Sort these by yourself.", bins: "First person|Third person", items: ["We missed the last train because of me.|My hands were still shaking.", "Leo missed the last train.|Her hands were still shaking."], trap: ["We missed the last train because of me.", 1] },
  ],
}));
