// Morning or Night?. Skill 2.MD.C.7-2.
// Using a.m. and p.m.: daily events with times are sorted into the half of the day they happen in. Noon-hour events are the tricky case.
Sidekick.game(Sidekick.play({
  title: "Morning or Night?",
  emoji: "🌗",
  premise: "The same time comes twice a day. Sort each thing that happens into a.m. or p.m.",
  outro: "a.m. is from midnight to noon. p.m. is from noon to midnight.",
  scene: "sky",
  kind: "sort",
  cast: "🌞 ☁️ 🌙 ⭐",
  hint: "Morning times before noon are a.m. Afternoon and evening times are p.m.",
  tag: "mixes_am_and_pm",
  rounds: [
    { say: "Is it a.m. or p.m.?", bins: "a.m.|p.m.", items: ["🥣 breakfast at 7:30|🚌 bus to school at 8:00|🌅 sunrise at 6:15", "🌙 bedtime at 8:30|🍝 dinner at 6:00"], trap: ["🌙 bedtime at 8:30", 0], why: "Bedtime is at night, after noon. That is p.m.", win: "Morning is a.m. Evening is p.m." },
    { say: "Watch out for lunch time.", bins: "a.m.|p.m.", items: ["wake up at 7:00|morning recess at 10:15", "lunch at 12:30|soccer after school at 4:00|stars come out at 9:00"], trap: ["lunch at 12:30", 0], why: "Noon is 12:00 p.m. Half past noon is p.m. too.", win: "After noon, it is p.m." },
    { say: "Sort these by yourself.", bins: "a.m.|p.m.", items: ["🐓 rooster crows at 5:45|🥞 pancakes at 8:15|📚 reading class at 9:30", "🌃 night light on at 8:45|🍽️ supper at 5:30"], trap: ["🍽️ supper at 5:30", 0] },
  ],
}));
