// Hundred Hurdles. Skill 2.NBT.A.2-2.
// Skip counting by 5s, 10s and 100s across a hundred: the step size stays the same. Jumping to the next hundred instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Hundred Hurdles",
  emoji: "🏃",
  premise: "The runner skip counts right over a hundred without breaking stride. Fill in the next two steps.",
  outro: "Skip counting keeps the same step, even when it crosses a hundred.",
  scene: "field",
  kind: "row",
  cast: "",
  hint: "How big is each step? Keep that same step past the hundred.",
  tag: "loses_step_at_hundred",
  rounds: [
    { say: "Keep counting by fives. Build the next two numbers.", q: "85, 90, 95, ▢, ▢", seq: "100 105", extra: "96 110", trap: "100 110", why: "The step is 5. After 100 comes 105.", win: "100, 105." },
    { say: "Keep counting by tens.", q: "170, 180, 190, ▢, ▢", seq: "200 210", extra: "191 300", trap: "200 300", why: "The step is 10. After 200 comes 210.", win: "200, 210." },
    { say: "Build the next two by yourself.", alt: [{ q: "290, 295, 300, ▢, ▢", seq: "305 310", extra: "301 400", trap: "305 400" }, { q: "380, 390, 400, ▢, ▢", seq: "410 420", extra: "401 500", trap: "410 500" }] },
  ],
}));
