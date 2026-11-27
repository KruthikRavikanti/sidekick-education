// Fold Line. Skill GA-2-GSR.7.2-1.
// Finding a line that splits an object into matching halves: the dashed line must make two mirror halves. Accepting any line through the middle is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fold Line",
  emoji: "🦋",
  premise: "Fold a shape on the dashed line. If the two sides land right on each other, you found a matching fold.",
  outro: "A line of symmetry splits a shape into two halves that match exactly.",
  scene: "meadow",
  kind: "pick",
  cast: "",
  hint: "Picture folding on the dashed line. Do the two sides land on each other?",
  tag: "any_middle_line_works",
  rounds: [
    { say: "Tap every picture where the fold makes two matching halves.", yes: "~sym:heart:v ~sym:rect:v ~sym:tri:v", no: "~sym:heart:h ~sym:tri:h ~sym:rect:d", trap: "~sym:heart:h", why: "Fold on that line. The two parts of the heart would not match.", win: "Those folds make matching halves." },
    { say: "Tap every matching fold.", yes: "~sym:sq:d ~sym:circle:h ~sym:arrow:v ~sym:rect:h", no: "~sym:arrow:h ~sym:flag:h ~sym:rect:o", trap: "~sym:rect:o", why: "That line is off to one side. One part is bigger.", win: "You found every matching fold." },
    { say: "Tap every matching fold by yourself.", yes: "~sym:heart:v ~sym:sq:v ~sym:circle:d", no: "~sym:tri:h ~sym:rect:d ~sym:flag:v ~sym:heart:o", trap: "~sym:rect:d" },
  ],
}));
