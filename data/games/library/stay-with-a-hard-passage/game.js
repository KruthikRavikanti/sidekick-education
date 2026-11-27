// Stay With a Hard Passage. Skill RL.9-10.10-1.
// Reading and comprehending literature in the grades 9 to 10 complexity band. Avoiding complex texts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stay With a Hard Passage",
  emoji: "🧗",
  premise: "Complex writing rewards patience. Slow down, break long sentences into parts, and track who does what.",
  outro: "For a dense passage: reread, split long sentences, and retell events in order.",
  scene: "night",
  kind: "row",
  fs: 4.4,
  hint: "Find the subject and the verb first. Then add the extra pieces.",
  tag: "avoids_complex_text",
  rounds: [
    { say: "Read slowly. Then put the events in the order they happened.", read: "Long before the bell had finished tolling, and while the others still argued over whose turn it was, Wren, who had never once volunteered, was already halfway up the tower stairs.", seq: "The bell starts tolling.|The others argue over turns.|Wren climbs the stairs.", trap: "Wren climbs the stairs.|The bell starts tolling.|The others argue over turns.", why: "Wren is named last in the sentence, but the bell and the argument come first.", win: "Bell, argument, Wren on the stairs." },
    { say: "Break the sentence into its parts.", read: "Long before the bell had finished tolling, and while the others still argued over whose turn it was, Wren, who had never once volunteered, was already halfway up the tower stairs.", kind: "fill", fs: 4.6, cast: "", rows: [["who is it about?", "Wren"], ["what is surprising?", "she had never volunteered"]], extra: "the bell broke|the others", trap: [1, "the bell broke"], why: "The bell is still ringing. The surprise is tucked in: who had never once volunteered.", win: "Find the subject, then the twist." },
    { say: "Put the events in order by yourself.", read: "Only after the last guest had gone, and the candles had burned to stubs, did Osei unfold the letter he had carried since morning.", seq: "Osei pockets a letter.|The guests leave.|Osei unfolds the letter.", trap: "Osei unfolds the letter.|The guests leave.|Osei pockets a letter." },
  ],
}));
