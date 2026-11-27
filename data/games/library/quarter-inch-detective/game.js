// Quarter Inch Detective. Skill 3.MD.B.4-1.
// Reading a ruler to the nearest half and quarter inch: the pointer is set to where the object ends. Reading a between-mark as the next whole inch is the known slip.
Sidekick.game(Sidekick.play({
  title: "Quarter Inch Detective",
  emoji: "🔩",
  premise: "The ruler has little marks between the inches for halves and quarters. Slide the pointer to where the thing ends.",
  outro: "The marks between the inches are halves and quarters of an inch.",
  scene: "desk",
  kind: "dial",
  cast: "",
  dials: [["Inches", 0, 5, 0.25, 0, null, 4]],
  hint: "Find the last whole inch, then count the quarter marks after it.",
  tag: "reads_mark_as_whole_inch",
  rounds: [
    { say: "Slide the pointer to the end of the bolt. How long is it?", view: { type: "units", len: 2.5, ruler: true, tick: 0.25, icon: "🔩", span: 5 }, ans: [2.5], trap: [3], why: "The bolt ends halfway between 2 and 3. That is 2 and a half.", win: "2 1/2 inches." },
    { say: "How long is the nail?", view: { type: "units", len: 3.25, ruler: true, tick: 0.25, icon: "📌", span: 5 }, ans: [3.25], trap: [4], why: "The nail ends one quarter mark past 3.", win: "3 1/4 inches." },
    { say: "Measure this one by yourself.", alt: [{ view: { type: "units", len: 1.75, ruler: true, tick: 0.25, icon: "🧷", span: 5 }, ans: [1.75], trap: [2] }, { view: { type: "units", len: 4.5, ruler: true, tick: 0.25, icon: "🖊️", span: 5 }, ans: [4.5], trap: [5] }] },
  ],
}));
