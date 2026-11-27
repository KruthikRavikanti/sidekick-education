// Choices Have Consequences. Skill RL.11-12.3-1.
// Analyzing the impact of the author’s choices regarding how to develop and relate elements of a story or drama. Describing the elements only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Choices Have Consequences",
  emoji: "♟️",
  premise: "Where a story is set, the order events arrive in, how a character first appears: each is a decision with an effect.",
  outro: "Analyze the impact of the author’s choices about setting, order of events and character development.",
  scene: "night",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "What would be lost if the author had chosen differently?",
  tag: "describes_elements",
  rounds: [
    { say: "Match each choice to its impact.", rows: [["set on an island", "no one can leave, so pressure builds"], ["murder shown first", "we ask why, not who"], ["hero enters late", "others’ gossip shapes our view first"]], extra: "the island is small|", trap: [0, "the island is small"], why: "That describes the setting. The impact is what the island does to the characters.", win: "Choice, then consequence." },
    { say: "Match each choice to its impact.", rows: [["told in letters", "we see only what each writer admits"], ["set in one night", "every hour feels urgent"], ["ending left open", "the reader must judge"]], extra: "there are many letters|", trap: [0, "there are many letters"], why: "Count is a fact. Letters limit what we know to what each writer chooses to say.", win: "Form shapes meaning." },
    { say: "Match these by yourself.", rows: [["winter setting", "isolation mirrors the family’s silence"], ["events out of order", "we learn the cause after the effect"], ["unnamed narrator", "she could be anyone"]], extra: "it is cold|", trap: [0, "it is cold"] },
  ],
}));
