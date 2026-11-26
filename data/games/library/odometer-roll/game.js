// Odometer Roll. Skill 2.NBT.A.2-1.
// Counting by ones across a hundred: 198, 199, 200, 201. A tile that falls back into the old hundred catches the known slip.
Sidekick.game(Sidekick.play({
  title: "Odometer Roll",
  emoji: "🚙",
  premise: "The car counter is about to roll over to a new hundred. Put the numbers in order as it rolls.",
  outro: "After 199 comes 200. The hundreds change and the counting starts fresh.",
  scene: "city",
  kind: "row",
  cast: "🚙 🛣️ 🌵 🛣️",
  hint: "After a number ending in 99, the hundreds digit goes up by one.",
  tag: "stuck_at_the_hundred",
  rounds: [
    { say: "Put the counter numbers in order.", seq: "198 199 200 201", extra: "190", trap: "198 199 190 200", why: "After 199 comes a new hundred: 200.", win: "198, 199, 200, 201." },
    { say: "Rolling over again.", seq: "398 399 400 401", extra: "390", trap: "398 399 390 400", why: "After 399 comes a new hundred: 400.", win: "398, 399, 400, 401." },
    { say: "Order these by yourself.", alt: [{ seq: "598 599 600 601", extra: "590", trap: "598 599 590 600" }, { seq: "797 798 799 800", extra: "790", trap: "797 798 790 799" }] },
  ],
}));
