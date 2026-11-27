// Comma Before the Joiner. Skill L.4.2-3.
// Using a comma before a coordinating conjunction in a compound sentence. Leaving it out is the known slip.
Sidekick.game(Sidekick.play({
  title: "Comma Before the Joiner",
  emoji: "🪢",
  premise: "When and, but, or or so joins two complete sentences, a comma goes right before it.",
  outro: "In a compound sentence, put a comma before the coordinating conjunction.",
  scene: "desk",
  kind: "pick",
  fs: 5.4,
  hint: "Find the joining word between two complete ideas. The comma goes just before it.",
  tag: "leaves_out_comma",
  rounds: [
    { say: "Tap the spot where the comma belongs.", mark: ["I wanted", ",", "to play", "*,", "but it was", ",", "raining."], trap: ",", why: "The comma goes right before but, where the two ideas join.", win: "I wanted to play, but it was raining." },
    { say: "Tap the spot where the comma belongs.", mark: ["We missed", ",", "the bus", "*,", "so we", ",", "walked home."], trap: ",", why: "The comma goes right before so.", win: "We missed the bus, so we walked home." },
    { say: "Tap the comma spot by yourself.", alt: [{ mark: ["She studied", ",", "all night", "*,", "and she", ",", "passed the test."], trap: "," }, { mark: ["You can", ",", "ride with us", "*,", "or you", ",", "can take the train."], trap: "," }] },
  ],
}));
