// Revise for the Reader. Skill W.7.5-1.
// Strengthening writing by planning, revising and editing with a focus on purpose and audience. Only editing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Revise for the Reader",
  emoji: "🎯",
  premise: "Revising means asking who will read this and what they need. A good draft for one reader may miss for another.",
  outro: "Revise with purpose and audience in mind, then edit the mechanics.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "What does THIS reader not know yet, or not need?",
  tag: "only_edits",
  rounds: [
    { say: "How should the draft change for each reader?", rows: [["a first grader will read it", "use simpler words"], ["the school board will read it", "add facts and a formal tone"]], extra: "fix one comma|", trap: [0, "fix one comma"], why: "A comma fix is editing. A young reader needs simpler words.", win: "Revise for who is reading." },
    { say: "Is each change revising for the audience, or editing?", kind: "sort", fs: 4.4, bins: "Revising|Editing", items: ["explain a term the reader will not know|cut details this reader already knows", "capitalize a name|fix a run-on sentence"], trap: ["cut details this reader already knows", 1], why: "Deciding what the reader needs is revising.", win: "Audience choices are revision." },
    { say: "Match these by yourself.", rows: [["experts will read it", "use technical terms"], ["newcomers will read it", "define the key words"]], extra: "change the font|add a period", trap: [1, "add a period"] },
  ],
}));
