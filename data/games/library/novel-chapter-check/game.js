// Novel Chapter Check. Skill RL.7.10-1.
// Reading and comprehending literature in the grades 6 to 8 complexity band proficiently. Needing support to keep track is the known slip.
Sidekick.game(Sidekick.play({
  title: "Novel Chapter Check",
  emoji: "📘",
  premise: "Reading a full chapter means holding on to who wants what, and how each scene changes things.",
  outro: "Summarize a chapter by its key events in order.",
  scene: "forest",
  kind: "row",
  fs: 4.4,
  hint: "Reread the passage. What happens first, then next, then last?",
  tag: "loses_the_thread",
  rounds: [
    { say: "Read the passage. Put the summary in order.", read: "The caravan had three days of water left when the guide fell ill. Zara, the youngest, had memorized the stars on every crossing with her father. That night she pointed the lead camel toward the Hunter’s belt. At dawn the well at Tamrit shimmered ahead.", seq: "The guide falls ill.|Zara steers by the stars.|They reach the well.", trap: "Zara steers by the stars.|The guide falls ill.|They reach the well.", why: "She takes over only after the guide cannot lead.", win: "Trouble, a decision, a result." },
    { say: "Why is Zara able to lead? Tap the reason.", kind: "pick", read: "The caravan had three days of water left when the guide fell ill. Zara, the youngest, had memorized the stars on every crossing with her father.", yes: "She learned the stars on earlier crossings.|", no: "She is the oldest traveler.|She owns the camels.|She has a map.", trap: "She is the oldest traveler.", why: "The passage calls her the youngest. Look at what she memorized.", win: "Her star knowledge makes it possible." },
    { say: "Read this passage. Put the summary in order by yourself.", read: "When the mill closed, half the town packed up. Old Mrs. Adeyemi stayed and turned its empty floor into a market. One stall became ten. By autumn, families who had left were writing to ask about work.", seq: "The mill closes and people leave.|Mrs. Adeyemi starts a market.|The market grows and draws people back.", trap: "Mrs. Adeyemi starts a market.|The mill closes and people leave.|The market grows and draws people back." },
  ],
}));
