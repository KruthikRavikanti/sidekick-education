// First, Next, Last. Skill W.K.3-1.
// Narrating events in the order in which they occurred. Listing unconnected or out-of-order events is the known slip.
Sidekick.game(Sidekick.play({
  title: "First, Next, Last",
  emoji: "🌅",
  premise: "When you write about your day, tell things in the order they happened.",
  outro: "Tell events in order: first, next, last.",
  scene: "sky",
  kind: "row",
  hint: "What happened first in real life?",
  tag: "events_out_of_order",
  rounds: [
    { say: "Put the day in order.", seq: "🌅 First I woke up.|🥣 Next I ate.|🚌 Last I got on the bus.", trap: "🥣 Next I ate.|🌅 First I woke up.|🚌 Last I got on the bus.", why: "You wake up before you eat. Look for the word First.", win: "First, next, last." },
    { say: "Put this story in order.", seq: "🧦 First I put on socks.|👟 Next I put on shoes.|🏃 Last I ran outside.", trap: "👟 Next I put on shoes.|🧦 First I put on socks.|🏃 Last I ran outside.", why: "Socks go on before shoes.", win: "Socks, shoes, run." },
    { say: "Put this story in order by yourself.", alt: [{ seq: "🛁 First I took a bath.|📖 Next Dad read a book.|😴 Last I went to sleep.", trap: "😴 Last I went to sleep.|🛁 First I took a bath.|📖 Next Dad read a book." }, { seq: "🌱 First we dug a hole.|🌰 Next we put in a seed.|💧 Last we gave it water.", trap: "🌰 Next we put in a seed.|🌱 First we dug a hole.|💧 Last we gave it water." }] },
  ],
}));
