// Cricket Jumps. Skill GA-1-PAR.3.2-2.
// Extending skip-counting patterns forward and backward: the child supplies the next two numbers. Losing the step size partway is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cricket Jumps",
  emoji: "🦗",
  premise: "The cricket always jumps the same distance, forward or backward. Fill in where it lands next.",
  outro: "In skip counting, every jump is the same size.",
  scene: "meadow",
  kind: "row",
  cast: "",
  hint: "How big is each jump? Keep every jump that same size.",
  tag: "loses_the_step_size",
  rounds: [
    { say: "Keep the jumps the same size. Build the next two numbers.", q: "5, 10, 15, ▢, ▢", seq: "20 25", extra: "16 30", trap: "20 30", why: "Each jump is 5. After 20 comes 25.", win: "20, 25." },
    { say: "This cricket jumps backward. Build the next two numbers.", q: "20, 18, 16, ▢, ▢", seq: "14 12", extra: "15 10", trap: "15 14", why: "Each jump back is 2. After 16 comes 14.", win: "14, 12." },
    { say: "Build the next two numbers by yourself.", alt: [{ q: "10, 20, 30, ▢, ▢", seq: "40 50", extra: "31 60", trap: "40 60" }, { q: "30, 25, 20, ▢, ▢", seq: "15 10", extra: "19 5", trap: "15 5" }, { q: "2, 4, 6, ▢, ▢", seq: "8 10", extra: "7 12", trap: "8 12" }] },
  ],
}));
