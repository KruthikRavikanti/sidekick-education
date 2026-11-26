// Sunrise to Moonrise. Skill GA-K-PAR.6.2-1.
// Ordering daily events with time words: the child sorts events into morning and night, then orders yesterday, today and tomorrow and the events of a day.
Sidekick.game(Sidekick.play({
  title: "Sunrise to Moonrise",
  emoji: "🌞",
  premise: "A day has an order, and so do the days. Sort what happens when, then line the days up.",
  outro: "Morning comes before night. Yesterday comes before today, and tomorrow comes after.",
  scene: "sky",
  kind: "sort",
  cast: "🌞 ☁️ 🌙 ⭐",
  hint: "Think about your own day, from waking up to going to sleep.",
  tag: "mixes_time_words",
  rounds: [
    { say: "Does it happen in the morning or at night?", bins: "Morning|Night", items: ["🥣 breakfast|🌅 sunrise|🚌 ride to school", "🌙 moon is out|🛏️ bedtime|🦉 owls wake"], trap: ["🛏️ bedtime", 0], why: "Bedtime comes when the day is done, at night.", win: "Morning things and night things." },
    { say: "Put the days in order, from the one that already happened to the one still to come.", kind: "row", seq: "yesterday today tomorrow", trap: "tomorrow today yesterday", why: "Yesterday already happened. Tomorrow comes after today.", win: "Yesterday, today, tomorrow." },
    { say: "Put this day in order by yourself.", kind: "row", alt: [{ seq: "🌅 wake up|🥪 eat lunch|🌆 eat dinner|🌙 go to sleep", trap: "🌅 wake up|🌆 eat dinner|🥪 eat lunch|🌙 go to sleep" }, { seq: "🥣 breakfast|🏫 school|🛁 bath time|🛏️ bedtime", trap: "🥣 breakfast|🛁 bath time|🏫 school|🛏️ bedtime" }] },
  ],
}));
