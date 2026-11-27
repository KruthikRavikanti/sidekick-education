// Read the Essay Twice. Skill RI.9-10.10-1.
// Reading and comprehending literary nonfiction in the grades 9 to 10 complexity band. Needing support and stopping at the surface is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read the Essay Twice",
  emoji: "🔁",
  premise: "Literary nonfiction makes its point through images and reflection. Read once for what happens and once for what it means.",
  outro: "For an essay: find what the writer describes, then what the writer is saying about it.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "What is described? And what larger point does the writer draw from it?",
  tag: "stops_at_surface",
  rounds: [
    { say: "Tap the ONE sentence that states the central idea of this essay excerpt.", read: "My grandmother mended everything: socks, chairs, quarrels. I used to think she simply hated waste. Now I see that mending was how she said a thing, or a person, was worth keeping.", mark: "The grandmother fixed socks.|She disliked waste.|*Repairing things was her way of showing they mattered.|The writer owned a chair.", trap: "She disliked waste.", why: "That is what the writer used to think. The essay turns at Now I see.", win: "Mending means worth keeping." },
    { say: "Match each phrase of the excerpt to its job.", read: "My grandmother mended everything: socks, chairs, quarrels. I used to think she simply hated waste. Now I see that mending was how she said a thing, or a person, was worth keeping.", kind: "fill", fs: 4.6, cast: "", rows: [["I used to think", "an earlier view"], ["Now I see", "the turn to the central idea"]], extra: "a concrete example|", trap: [0, "the turn to the central idea"], why: "Used to think sets up the old view. The turn comes with Now I see.", win: "Old view, then new insight." },
    { say: "Tap the ONE sentence that states the central idea by yourself.", read: "We moved eleven times. Each time I packed my shoebox of bus tickets. I thought I was saving places. I was saving proof that I had belonged.", mark: "The family moved often.|She kept bus tickets.|The box was old.|*The keepsakes proved she had belonged.|Buses were cheap.|There were eleven homes.", trap: "She kept bus tickets." },
  ],
}));
