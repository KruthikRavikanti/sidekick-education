// And Then, And Then. Skill W.2.3-1.
// Recounting a well-elaborated event. Writing and-then events without details is the known slip.
Sidekick.game(Sidekick.play({
  title: "And Then, And Then",
  emoji: "🎁",
  premise: "A story that only says and then, and then is flat. Details let the reader see what happened.",
  outro: "Tell an event with details, not just a list of and then.",
  scene: "candy",
  kind: "pick",
  hint: "Which sentence helps you see, hear or feel it?",
  tag: "and_then_without_details",
  rounds: [
    { say: "Tap the sentences that tell it with details.", yes: "The box was wrapped in shiny gold paper.|Inside was a tiny gray kitten with a pink nose.", no: "I got a box.|And then I opened it.", trap: "I got a box.", why: "That tells what happened, but nothing about how it looked or felt.", win: "Details bring the surprise to life." },
    { say: "Tap the sentences that tell it with details.", yes: "Thunder shook the windows of our little cabin.|Rain drummed on the tin roof all night.", no: "It rained.|And then we slept.|There was a storm.", trap: "It rained.", why: "That is plain. Which ones let you hear the storm?", win: "You can hear the storm now." },
    { say: "Tap the detailed sentences by yourself.", yes: "The roller coaster creaked up the steep hill.|My stomach flipped as we dropped.", no: "We went on a ride.|And then it went down.|It was a ride.", trap: "We went on a ride." },
  ],
}));
