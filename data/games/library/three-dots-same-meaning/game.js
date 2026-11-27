// Three Dots, Same Meaning. Skill L.8.2-2.
// Using an ellipsis to indicate an omission. Misusing it, including cuts that change the meaning, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Three Dots, Same Meaning",
  emoji: "✂️",
  premise: "An ellipsis shows where words were cut from a quotation. A fair cut shortens it without changing what it says.",
  outro: "Use an ellipsis to mark an omission, and never let the cut change the meaning.",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Read the short version. Does it still say what the original said?",
  tag: "misuses_ellipsis",
  rounds: [
    { say: "Original: “The film was not the triumph that critics had expected.” Sort the shortened quotes.", bins: "Fair cut|Changes the meaning", items: ["“The film was not the triumph ... expected.”|“The film was not the triumph that critics ... expected.”", "“The film was ... the triumph that critics had expected.”|“The film was ... the triumph.”"], trap: ["“The film was ... the triumph.”", 0], why: "Cutting not flips the meaning completely.", win: "A fair cut keeps the message." },
    { say: "Original: “We hold these truths, which are many, to be self-evident.” Sort these.", bins: "Fair cut|Changes the meaning", items: ["“We hold these truths ... to be self-evident.”|", "“We hold ... many.”|“These truths ... are many.”"], trap: ["“We hold ... many.”", 0], why: "That turns the sentence into something it never said.", win: "Cut the aside, keep the point." },
    { say: "Original: “The mayor said she would never, under any pressure, raise fares.” Sort by yourself.", bins: "Fair cut|Changes the meaning", items: ["“The mayor said she would never ... raise fares.”|", "“The mayor said she would ... raise fares.”|“She would ... under any pressure, raise fares.”"], trap: ["“The mayor said she would ... raise fares.”", 0] },
  ],
}));
