// Read It Solo. Skill RL.8.10-1.
// Reading and comprehending literature at the high end of the grades 6 to 8 band independently. Needing support is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read It Solo",
  emoji: "📗",
  premise: "Independent readers track a demanding passage on their own: the situation, the turn, the outcome.",
  outro: "Summarize a complex passage accurately in your own words.",
  scene: "forest",
  kind: "row",
  fs: 4.4,
  hint: "Find the situation, the turning point and the result.",
  tag: "needs_support",
  rounds: [
    { say: "Read the passage. Put the summary in order.", read: "For eleven years the clockmaker had refused to repair the tower clock that struck on the night his son left. When a stranger asked the hour and no one could say, he climbed the stairs with his tools. At noon the bell rang, and people stopped in the street.", seq: "He refuses to fix the clock for years.|A stranger’s question moves him to act.|The bell rings again.", trap: "A stranger’s question moves him to act.|He refuses to fix the clock for years.|The bell rings again.", why: "The long refusal comes first. The question is what changes it.", win: "Refusal, turning point, result." },
    { say: "Why had he refused? Tap the reason the passage suggests.", kind: "pick", read: "For eleven years the clockmaker had refused to repair the tower clock that struck on the night his son left.", yes: "The clock reminds him of losing his son.|", no: "He lost his tools.|The tower is too tall.|Nobody asked him.", trap: "He lost his tools.", why: "He climbs with his tools later. Look at what happened the night it last struck.", win: "The clock is tied to his grief." },
    { say: "Read this passage. Put the summary in order by yourself.", read: "The translator had been hired to soften the general’s threats. On the third day she began translating them exactly. The other side, hearing the truth at last, walked out, and the war she had been delaying began in the open.", seq: "She softens the threats at first.|She starts translating them exactly.|The talks collapse.", trap: "She starts translating them exactly.|She softens the threats at first.|The talks collapse." },
  ],
}));
