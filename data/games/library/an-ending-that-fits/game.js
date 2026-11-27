// An Ending That Fits. Skill W.6.3-4.
// Providing a conclusion that follows from the narrated experiences or events. Ending abruptly is the known slip.
Sidekick.game(Sidekick.play({
  title: "An Ending That Fits",
  emoji: "🌅",
  premise: "A good ending grows out of what happened in the story. It should not pop up from nowhere.",
  outro: "A narrative conclusion follows from the events and shows how the problem turned out.",
  scene: "ocean",
  kind: "sort",
  fs: 4.6,
  hint: "Does it settle the problem the story set up?",
  tag: "abrupt_ending",
  rounds: [
    { say: "The story: Ana trains all summer for a swim race she fears. Which endings fit?", bins: "Follows the story|Out of nowhere", items: ["She touched the wall third, grinning, no longer afraid of deep water.|She lost the race but swam the whole length without stopping.", "Then a dragon ate the pool.|Then I woke up."], trap: ["Then I woke up.", 0], why: "A dream ending throws away everything the story built.", win: "The ending answers the fear." },
    { say: "The story: two friends stop speaking after a lie. Sort the endings.", bins: "Follows the story|Out of nowhere", items: ["Jo knocked on the door, the truth ready on her tongue.|They shared the bench again, quieter but honest.", "Suddenly they won the lottery.|The end."], trap: ["Suddenly they won the lottery.", 0], why: "Nothing in the story leads to a lottery.", win: "The ending deals with the lie." },
    { say: "The story: Ben hides a stray dog from his family. Sort by yourself.", bins: "Follows the story|Out of nowhere", items: ["His dad set down a second bowl without a word.|Ben finally said, “There is someone you should meet.”", "Aliens landed in the yard.|And that is all."], trap: ["Aliens landed in the yard.", 0] },
  ],
}));
