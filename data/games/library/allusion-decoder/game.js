// Allusion Decoder. Skill L.7.5-1.
// Interpreting figures of speech such as literary, biblical and mythological allusions. Missing the allusion is the known slip.
Sidekick.game(Sidekick.play({
  title: "Allusion Decoder",
  emoji: "🏺",
  premise: "An allusion is a quick reference to a famous story or event. Knowing the story unlocks the meaning.",
  outro: "An allusion borrows meaning from myth, literature or the past: an Achilles heel is a weak point.",
  scene: "night",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What happened in the old story? That is the meaning being borrowed.",
  tag: "misses_allusions",
  rounds: [
    { say: "What does each allusion mean?", rows: [["Math is his Achilles heel.", "his one weak point"], ["She has the Midas touch.", "everything she does succeeds"]], extra: "he hurt his foot|", trap: [0, "he hurt his foot"], why: "In the myth, Achilles could be harmed only at his heel. It means a weakness.", win: "A weak point, and a golden touch." },
    { say: "What does each allusion mean?", rows: [["The general met his Waterloo.", "suffered a final defeat"], ["Opening that file was a Pandora’s box.", "it set loose many troubles"]], extra: "found a gift|", trap: [1, "found a gift"], why: "In the myth, Pandora’s box released troubles into the world.", win: "A final defeat, and troubles set loose." },
    { say: "Match these by yourself.", rows: [["Carrying the team was a Herculean task.", "needing great strength"], ["He is a real Scrooge with money.", "very stingy"]], extra: "very generous|quick and easy", trap: [1, "very generous"] },
  ],
}));
