// Earned Ending. Skill W.4.3-5.
// Providing a conclusion that follows from the narrated experiences or events. A rushed ending is the known slip.
Sidekick.game(Sidekick.play({
  title: "Earned Ending",
  emoji: "🏆",
  premise: "An ending should grow out of what happened in the story. A rushed ending just stops or solves everything by magic.",
  outro: "A conclusion follows from the narrated events.",
  scene: "field",
  kind: "pick",
  hint: "Does the ending come from what the characters did?",
  tag: "rushed_ending",
  rounds: [
    { say: "The story: Ana trains for weeks to beat her fear of the high dive. Tap the ending that follows.", yes: "She stood at the edge, took one breath, and jumped.|", no: "Then she woke up. It was a dream.|Suddenly she moved to Paris.|The end.", trap: "Then she woke up. It was a dream.", why: "That throws away everything she worked for. What would follow from her training?", win: "The ending grows from the story." },
    { say: "The story: Two brothers build a raft to cross the lake before sunset. Tap the ending that follows.", yes: "As the sun touched the hills, their raft scraped the far shore.|", no: "A helicopter picked them up.|They forgot about it.|And that was that.", trap: "A helicopter picked them up.", why: "Nothing in the story sets that up. What did they build the raft for?", win: "An earned ending." },
    { say: "The story: Mia saves up all summer to buy her brother a gift. Tap the ending by yourself.", yes: "She set the wrapped box on his bed and waited for him to come home.|", no: "She won the lottery instead.|Aliens landed.|It did not matter.|The summer ended.|She forgot why.", trap: "She won the lottery instead." },
  ],
}));
