// Why This Order?. Skill RI.9-10.3-1.
// Analyzing how an author unfolds a series of ideas or events, including their order and the connections between them. Summarizing instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Why This Order?",
  emoji: "🧱",
  premise: "Writers arrange their points on purpose: a story to hook you, data to convince you, a solution to send you off.",
  outro: "Analyze the order of ideas: what each part does and how the parts connect.",
  scene: "city",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What job does this part do for the reader at this point?",
  tag: "summarizes_instead",
  rounds: [
    { say: "An article on farm water. Why is each part placed where it is?", rows: [["opens with one farmer’s dry well", "makes the problem personal"], ["then gives national figures", "shows the problem is widespread"], ["ends with drip irrigation", "leaves the reader with a way forward"]], extra: "the farmer is named Luis|", trap: [0, "the farmer is named Luis"], why: "That retells a detail. The question is what opening with one farmer does.", win: "Hook, proof, solution." },
    { say: "Which word shows how the second idea connects to the first?", kind: "fill", fs: 4.6, cast: "", rows: [["The dam stored water. ___, farms downstream expanded.", "As a result"], ["The dam stored water. ___, fish runs collapsed.", "However"], ["The dam stored water. ___, it made electricity.", "In addition"]], trap: [1, "As a result"], why: "Collapsing fish runs are a downside. The link should signal a turn.", win: "Cause, contrast, addition." },
    { say: "An essay on school lunch. Match each part by yourself.", rows: [["opens with a tray of wasted food", "grabs attention with an image"], ["then compares three schools", "gives evidence"], ["ends with a student-run menu", "proposes a solution"]], extra: "the tray is blue|", trap: [0, "the tray is blue"] },
  ],
}));
