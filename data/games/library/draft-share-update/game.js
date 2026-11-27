// Draft, Share, Update. Skill W.9-10.6-1.
// Using technology to produce, publish and update individual or shared writing products. Leaving the tools unused is the known slip.
Sidekick.game(Sidekick.play({
  title: "Draft, Share, Update",
  emoji: "💻",
  premise: "Shared documents let writing keep improving. Feedback comes in, the draft gets updated, and readers always see the latest version.",
  outro: "Use technology to produce, publish and update writing, and to respond to feedback.",
  scene: "desk",
  kind: "row",
  fs: 4.4,
  hint: "Feedback has to arrive before you can act on it.",
  tag: "tools_unused",
  rounds: [
    { say: "Put the steps in order.", seq: "Share the draft with a partner.|Read the comments.|Revise the document.|Publish the updated version.", trap: "Publish the updated version.|Share the draft with a partner.|Read the comments.|Revise the document.", why: "Publishing comes after the feedback has been used.", win: "Share, read, revise, publish." },
    { say: "Good use of a shared document, or a missed chance?", kind: "sort", fs: 4.4, bins: "Good use|Missed chance", items: ["replying to a comment with a fix|linking to the source of a fact", "ignoring every comment|emailing a copy that goes out of date"], trap: ["emailing a copy that goes out of date", 0], why: "A copy stops updating. A link to the live document stays current.", win: "Use the feedback and the links." },
    { say: "A group report needs a new chart. Put the steps in order by yourself.", seq: "Add the chart to the shared file.|Ask the group to review it.|Fix the label a teammate flagged.|Share the final link with the class.", trap: "Share the final link with the class.|Add the chart to the shared file.|Ask the group to review it.|Fix the label a teammate flagged." },
  ],
}));
