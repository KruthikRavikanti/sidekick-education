// Chapter Summary. Skill RL.3.10-1.
// Reading and comprehending literature at the high end of the grades 2-3 band independently: a passage is summarized. Needing constant support is the known slip.
Sidekick.game(Sidekick.play({
  title: "Chapter Summary",
  emoji: "🏔️",
  premise: "After reading a chapter on your own, sum it up in a sentence or two. A summary is short and covers the whole thing.",
  outro: "A summary tells the most important things that happened, briefly.",
  scene: "snow",
  kind: "pick",
  hint: "Which choice covers the WHOLE passage in a few words?",
  tag: "cannot_summarize",
  rounds: [
    { say: "Read the chapter. Tap the best summary.", read: "Nora and her grandfather set out before dawn. The trail was steep, and twice Nora wanted to turn back. But when they reached the peak, the sunrise made every step worth it.", yes: "Nora struggles up a mountain and is rewarded with a sunrise.|", no: "Nora wakes up early.|The trail is steep.|Grandfather likes hiking.", trap: "The trail is steep.", why: "That is one detail. A summary covers the whole chapter.", win: "That sums it up." },
    { say: "Read this chapter. Tap the best summary.", read: "The twins had argued all week about the tree house. Then a storm knocked half of it down. Working side by side to fix it, they forgot what the fight was about.", yes: "Fixing the tree house together ends the twins’ fight.|", no: "A storm comes.|The twins argue.|The tree house is made of wood.", trap: "The twins argue.", why: "That is only the beginning. What about the rest?", win: "That covers the whole chapter." },
    { say: "Tap the best summary by yourself.", read: "Kofi was sure he would lose the spelling bee. He studied on the bus, at lunch and before bed. On the day, he spelled every word and could hardly believe it.", yes: "Kofi works hard and wins the spelling bee.|", no: "Kofi rides a bus.|Kofi is nervous.|There is a spelling bee.|Kofi eats lunch.|He goes to bed.", trap: "Kofi is nervous." },
  ],
}));
