// Living Document. Skill W.11-12.6-1.
// Using technology to produce, publish and update individual or shared writing products in response to ongoing feedback, including new arguments or information. Leaving the tools unused is the known slip.
Sidekick.game(Sidekick.play({
  title: "Living Document",
  emoji: "🔄",
  premise: "Published does not mean finished. Online writing can keep improving as feedback and new information arrive.",
  outro: "Use technology to produce, publish and update writing in response to ongoing feedback and new information.",
  scene: "desk",
  kind: "row",
  fs: 4.4,
  hint: "Updates come after feedback or new facts arrive.",
  tag: "tools_unused",
  rounds: [
    { say: "Put the steps in order.", seq: "Publish the article online.|A reader comments with a newer statistic.|Check the statistic against its source.|Update the article and note the change.", trap: "Update the article and note the change.|Publish the article online.|A reader comments with a newer statistic.|Check the statistic against its source.", why: "There is nothing to update until the feedback arrives and is checked.", win: "Publish, hear, check, update." },
    { say: "A responsible update, or a careless one?", kind: "sort", fs: 4.2, bins: "Responsible|Careless", items: ["verifying a reader’s correction before changing the text|adding a dated note that says what changed", "pasting in a comment without checking it|quietly deleting a claim that proved false"], trap: ["quietly deleting a claim that proved false", 0], why: "Readers who saw the old claim deserve to know it was corrected.", win: "Check it, then say what changed." },
    { say: "Put these steps in order by yourself.", seq: "Share the group report as a live link.|The teacher flags a missing counterargument.|The group drafts a new section.|The link now shows the stronger version.", trap: "The link now shows the stronger version.|Share the group report as a live link.|The teacher flags a missing counterargument.|The group drafts a new section." },
  ],
}));
