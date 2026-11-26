// Caboose Count. Skill K.CC.A.1-2.
// Counting across a decade: the child orders numbers like 28, 29, 30, 31, and a stray earlier ten is there to tempt a slip back.
Sidekick.game(Sidekick.play({
  title: "Caboose Count",
  emoji: "🚂",
  premise: "The train cars are numbered, but they got unhooked right where the tens change. Hook them up in counting order.",
  outro: "All aboard! You counted right past the new ten.",
  scene: "field",
  kind: "row",
  cast: "🚂 🚃 🚃 🚃",
  hint: "After a number ending in 9, the tens change to the next ten.",
  tag: "stuck_at_decade",
  rounds: [
    { say: "Hook the cars in counting order.", seq: "28 29 30 31", extra: "20", trap: "28 29 20 31", why: "After 29 comes a new ten: thirty.", win: "Twenty-nine, thirty, thirty-one!" },
    { say: "A new ten is coming. Hook these cars in order.", seq: "38 39 40 41", extra: "30", trap: "38 39 30 41", why: "After 39 comes a new ten: forty.", win: "Thirty-nine, forty, forty-one!" },
    { say: "Hook this train together by yourself.", alt: [{ seq: "48 49 50 51", extra: "40", trap: "48 49 40 51" }, { seq: "58 59 60 61", extra: "50", trap: "58 59 50 61" }, { seq: "68 69 70 71", extra: "60", trap: "68 69 60 71" }] },
  ],
}));
