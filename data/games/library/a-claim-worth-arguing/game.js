// A Claim Worth Arguing. Skill W.11-12.1-1.
// Introducing precise, knowledgeable claims and establishing the significance of the claims. Writing vague claims is the known slip.
Sidekick.game(Sidekick.play({
  title: "A Claim Worth Arguing",
  emoji: "🎯",
  premise: "An advanced argument opens with a claim that is exact and informed, and shows at once why anyone should care.",
  outro: "Introduce a precise, knowledgeable claim and establish its significance.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "The claim says what should happen. The significance says what is at stake.",
  tag: "vague_claim",
  rounds: [
    { say: "Label each sentence of this introduction.", rows: [["claim", "The state should fund two years of community college."], ["significance", "Without it, a third of graduates cannot afford any training."]], extra: "College is a big topic these days.|", trap: [0, "College is a big topic these days."], why: "That gestures at a subject. It takes no position.", win: "A position, and why it matters." },
    { say: "Precise and informed, or vague?", kind: "sort", fs: 4.2, bins: "Precise|Vague", items: ["Cities should price downtown parking by demand to cut traffic.|A carbon fee returned as dividends would cut emissions fairly.", "Something must be done about cars.|Pollution is a problem in society."], trap: ["Pollution is a problem in society.", 0], why: "It names a problem but proposes nothing a reader could dispute.", win: "Specific enough to argue with." },
    { say: "Label these by yourself.", rows: [["claim", "Schools should teach personal finance before graduation."], ["significance", "Most students will sign a loan before they understand interest."]], extra: "Money matters to people.|Finance is a class.", trap: [1, "Money matters to people."] },
  ],
}));
