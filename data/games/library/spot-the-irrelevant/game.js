// Spot the Irrelevant. Skill RI.8.8-1.
// Evaluating whether the reasoning is sound and the evidence relevant and sufficient; recognizing irrelevant evidence. Accepting all evidence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Spot the Irrelevant",
  emoji: "🚫",
  premise: "Some “evidence” has nothing to do with the claim. It may be true and still prove nothing.",
  outro: "Recognize when irrelevant evidence is introduced and judge whether the rest is sufficient.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "Does this sentence make the claim more likely to be true?",
  tag: "accepts_all_evidence",
  rounds: [
    { say: "Claim: the city should build a new library. Tap the two pieces of irrelevant evidence.", mark: "The current library turns away 200 people a week for lack of seats.|*The mayor once won a spelling bee.|Children’s programs have a six-month waiting list.|*Libraries have existed since ancient times.", trap: "-Libraries have existed since ancient times.", why: "How old libraries are does not show this city needs a new one.", win: "Two true facts that prove nothing." },
    { say: "Claim: schools should serve breakfast. Tap the two irrelevant pieces.", mark: "Students who eat breakfast score higher on morning tests.|*Breakfast cereal was invented in the 1800s.|Nurses report fewer stomachaches where breakfast is served.|*Many people like pancakes.", trap: "-Many people like pancakes.", why: "Liking pancakes is not a reason for a school program.", win: "Keep what supports the claim." },
    { say: "Claim: the park needs lights. Tap the two irrelevant pieces by yourself.", mark: "Evening accidents on the path doubled last year.|*The park was named after a poet.|Residents avoid the park after dark, a survey found.|*Light travels very fast.|Lit parks nearby report fewer injuries.", trap: "-Light travels very fast." },
  ],
}));
