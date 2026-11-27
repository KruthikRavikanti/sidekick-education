// Page, Screen, Speaker. Skill RI.9-10.7-1.
// Analyzing various accounts of a subject told in different mediums, determining which details are emphasized in each. Listing without analysis is the known slip.
Sidekick.game(Sidekick.play({
  title: "Page, Screen, Speaker",
  emoji: "🎞️",
  premise: "A life told in a print biography and the same life in a documentary are not the same story. Each medium spotlights different details.",
  outro: "Compare accounts in different mediums by which details each emphasizes.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Print can hold exact records. Film can show faces, voices and places.",
  tag: "lists_only",
  rounds: [
    { say: "A scientist’s life is told in a print biography and in a documentary. Which emphasizes each detail?", bins: "Print biography|Documentary film", items: ["pages of her quoted letters|exact dates and footnotes", "the sound of her voice in an interview|footage of her lab at work"], trap: ["the sound of her voice in an interview", 0], why: "Print can quote her words but cannot let you hear her.", win: "Records on the page. Presence on the screen." },
    { say: "A flood is covered by a newspaper and by a radio report. Sort the details.", bins: "Newspaper|Radio report", items: ["a map of the flooded streets|a table of rainfall by day", "a resident’s shaking voice|the sound of rushing water"], trap: ["a map of the flooded streets", 1], why: "Radio has no pictures. A map needs the page.", win: "Each medium plays to its strength." },
    { say: "A moon landing is told in a memoir and in a film. Sort these by yourself.", bins: "Written memoir|Film", items: ["the astronaut’s private doubts|long reflection on what it meant", "the roar of the launch|the view of Earth from the window"], trap: ["the astronaut’s private doubts", 1] },
  ],
}));
