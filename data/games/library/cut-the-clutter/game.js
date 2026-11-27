// Cut the Clutter. Skill L.7.3-1.
// Choosing language that expresses ideas precisely and concisely, eliminating wordiness and redundancy. Wordy writing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cut the Clutter",
  emoji: "✂️",
  premise: "Extra words hide your point. Say it once, in the fewest words that keep the meaning.",
  outro: "Choose precise, concise language and remove wordiness and repetition.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Are any words saying the same thing twice?",
  tag: "wordy",
  rounds: [
    { say: "Concise, or wordy?", bins: "Concise|Wordy", items: ["He left because he was tired.|The plan worked.", "In my opinion, I think that the reason why he left is because he was tired.|The plan that was planned ended up working out."], trap: ["In my opinion, I think that the reason why he left is because he was tired.", 0], why: "In my opinion and I think say the same thing twice.", win: "Fewer words, same meaning." },
    { say: "Tighten each phrase.", kind: "fill", fs: 5, cast: "", rows: [["at this point in time", "now"], ["due to the fact that", "because"], ["a free gift", "a gift"]], extra: "however", trap: [1, "now"], why: "Due to the fact that gives a reason. One word does it: because.", win: "Now, because, a gift." },
    { say: "Sort these by yourself.", bins: "Concise|Wordy", items: ["We returned at noon.|She whispered.", "We returned back again at twelve noon.|She whispered quietly in a soft voice."], trap: ["She whispered quietly in a soft voice.", 0] },
  ],
}));
