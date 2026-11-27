// Tricky Spelling Spots. Skill L.6.2-2.
// Spelling grade-appropriate words correctly. Relying on spellcheck only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tricky Spelling Spots",
  emoji: "👹",
  premise: "Some words trip everyone up. A spell checker will not catch them all, so learn their tricky spots.",
  outro: "Know the spelling of common tricky words: receive, believe, weird, neighbor.",
  scene: "desk",
  kind: "sort",
  fs: 6,
  hint: "Look at the tricky spot: ie or ei? One letter or two?",
  tag: "relies_on_spellcheck",
  rounds: [
    { say: "Which words are spelled correctly?", bins: "Spelled right|Needs fixing", items: ["receive|believe|weird", "recieve|beleive|wierd"], trap: ["recieve", 0], why: "After c the letters go e then i: receive.", win: "Receive, believe, weird." },
    { say: "Sort these.", bins: "Spelled right|Needs fixing", items: ["neighbor|separate|necessary", "nieghbor|seperate|neccessary"], trap: ["seperate", 0], why: "There is a rat in separate: sep-a-rate.", win: "Neighbor, separate, necessary." },
    { say: "Sort these by yourself.", bins: "Spelled right|Needs fixing", items: ["definitely|friend|until", "definately|freind|untill"], trap: ["definately", 0] },
  ],
}));
