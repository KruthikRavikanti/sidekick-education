// Stack the Evidence. Skill RI.7.1-1.
// Citing several pieces of textual evidence to support analysis of an informational text. Stopping at one piece is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stack the Evidence",
  emoji: "🧱",
  premise: "An author’s conclusion stands on several pieces of evidence. Find all of them, not just the first.",
  outro: "Cite several pieces of evidence from the text to support what it says.",
  scene: "ocean",
  kind: "pick",
  fs: 4.4,
  hint: "One fact is a start. Which other sentences back up the same point?",
  tag: "cites_one_piece",
  rounds: [
    { say: "Conclusion: plastic waste is a growing problem. Tap the three pieces of evidence.", mark: "*Plastic production has doubled in twenty years.|Plastic is made from oil.|*Tiny plastic bits now turn up in drinking water.|*Only a small share of plastic is ever recycled.|Bottles come in many shapes.", trap: "-Only a small share of plastic is ever recycled.", why: "Low recycling is part of why the problem grows.", win: "Three facts make the case." },
    { say: "Conclusion: city trees save money. Tap the three pieces of evidence.", mark: "*Shade lowers cooling bills in summer.|Oaks can live for centuries.|*Roots soak up storm water that would need drains.|*Homes on tree-lined streets sell for more.|Leaves fall in autumn.", trap: "-Homes on tree-lined streets sell for more.", why: "Higher home prices are money too.", win: "Cooling, drainage and home value." },
    { say: "Conclusion: teens need more sleep. Tap the three by yourself.", mark: "*Doctors recommend nine hours for teenagers.|Beds were once stuffed with straw.|*Tired students score lower on tests.|*Car crashes drop when schools start later.|Some people snore.", trap: "-Car crashes drop when schools start later." },
  ],
}));
