// Trip in Order. Skill W.1.3-1.
// Writing narratives that recount two or more appropriately sequenced events. Writing events out of order is the known slip.
Sidekick.game(Sidekick.play({
  title: "Trip in Order",
  emoji: "🎢",
  premise: "A story about a trip tells what happened in order. Time words like first, then and last help.",
  outro: "Tell events in order and use time words: first, then, last.",
  scene: "sky",
  kind: "row",
  hint: "Look for the time words. Which one starts the story?",
  tag: "events_out_of_order",
  rounds: [
    { say: "Put the trip in order.", seq: "First we drove to the fair.|Then we rode the big wheel.|Last we ate popcorn.", trap: "Then we rode the big wheel.|First we drove to the fair.|Last we ate popcorn.", why: "The sentence with First comes first.", win: "First, then, last." },
    { say: "Put this trip in order.", seq: "First we packed a bag.|Next we got on the train.|Then we saw Grandma.|Last we hugged her.", trap: "Next we got on the train.|First we packed a bag.|Then we saw Grandma.|Last we hugged her.", why: "You pack before you get on the train.", win: "Four events in order." },
    { say: "Put this story in order by yourself.", alt: [{ seq: "First we got to the beach.|Next we built a sand castle.|Then a wave came.|Last we built it again.", trap: "Then a wave came.|First we got to the beach.|Next we built a sand castle.|Last we built it again." }, { seq: "First I found a seed.|Next I put it in dirt.|Then I gave it water.|Last a sprout came up.", trap: "Last a sprout came up.|First I found a seed.|Next I put it in dirt.|Then I gave it water." }] },
  ],
}));
