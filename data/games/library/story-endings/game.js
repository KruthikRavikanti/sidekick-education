// Story Endings. Skill W.1.3-3.
// Providing some sense of closure in a narrative. Having no ending is the known slip.
Sidekick.game(Sidekick.play({
  title: "Story Endings",
  emoji: "🌙",
  premise: "A story should not just stop. A good ending tells how things turned out or how someone felt.",
  outro: "End a story by telling how it turned out or how you felt.",
  scene: "night",
  kind: "pick",
  hint: "Which ones tell how it turned out, or how someone felt?",
  tag: "no_ending",
  rounds: [
    { say: "The story is about a lost puppy that got found. Tap the good endings.", yes: "We were so happy to have him back.|He never ran off again.", no: "The puppy is brown.|We have a car.", trap: "The puppy is brown.", why: "That describes the puppy. It does not end the story.", win: "Those endings close the story." },
    { say: "The story is about a first day at a new school. Tap the good endings.", yes: "By the end, I had a new friend.|I could not wait to go back.", no: "The school has a door.|Then we had math.|My bag is blue.", trap: "Then we had math.", why: "That is one more event. An ending tells how it turned out.", win: "Two strong endings." },
    { say: "The story is about a rainy picnic. Tap the good endings by yourself.", yes: "It was the best picnic ever, rain and all.|We laughed all the way home.", no: "Rain is water.|We had bread.|Then it rained more.", trap: "Then it rained more." },
  ],
}));
