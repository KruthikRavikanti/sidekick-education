// Quote It Right. Skill L.4.2-2.
// Using commas and quotation marks to mark direct speech and quotations from a text. Misplacing the quotation marks is the known slip.
Sidekick.game(Sidekick.play({
  title: "Quote It Right",
  emoji: "🗨️",
  premise: "Quotation marks wrap the exact words a person said or a text states. A comma sets the quote apart.",
  outro: "Use a comma before the quotation, and put quotation marks around the exact words only.",
  scene: "candy",
  kind: "pick",
  hint: "Do the marks wrap only the exact words that were said?",
  tag: "misplaces_quotation_marks",
  rounds: [
    { say: "Tap the sentence that is punctuated correctly.", yes: "The coach said, \"Keep trying.\"|", no: "\"The coach said, keep trying.\"|The coach said \"keep trying\".|The coach \"said,\" Keep trying.", trap: "\"The coach said, keep trying.\"", why: "The coach said is not part of what was spoken. Leave it outside.", win: "Only the spoken words go inside." },
    { say: "Tap the sentence that is punctuated correctly.", yes: "\"I found it,\" said Maya, \"under the bed.\"|", no: "\"I found it, said Maya, under the bed.\"|\"I found it\" said Maya \"under the bed\".|I found it, \"said Maya,\" under the bed.", trap: "\"I found it, said Maya, under the bed.\"", why: "Said Maya is not her words. Close the marks before it.", win: "A quote split in two parts." },
    { say: "Tap the two sentences that are punctuated correctly.", yes: "The article states, \"Bees are in danger.\"|\"Hurry,\" said Dad, \"or we will be late.\"", no: "\"The article states, Bees are in danger.\"|\"Hurry, said Dad, or we will be late.\"|The article states \"bees are in danger\".", trap: "\"The article states, Bees are in danger.\"" },
  ],
}));
