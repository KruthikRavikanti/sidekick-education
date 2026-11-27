// Shrink the World. Skill S-CP.B.6-1.
// Finding the conditional probability of A given B as the fraction of B’s outcomes that also belong to A. Dividing by the whole sample space is the known slip.
Sidekick.game(Sidekick.play({
  title: "Shrink the World",
  emoji: "🔍",
  premise: "Given B means: ignore everyone outside B. Count how many of B are also in A.",
  outro: "P(A given B) = the number in both A and B ÷ the number in B.",
  scene: "paper",
  kind: "type",
  icon: "🔍",
  hint: "The bottom of the fraction is the size of the given group.",
  tag: "whole_space_denominator",
  rounds: [
    { say: "Key in P(girl given band) as a fraction.", fig: { type: "table", rows: [["", "Band", "Not band", "Total"], ["Girls", 18, 42, 60], ["Boys", 12, 28, 40], ["Total", 30, 70, 100]], head: true, v: [] }, ans: "18/30", trap: "18/100", why: "Given band: only the 30 band members count.", win: "18 of the 30 band members are girls." },
    { say: "Key in P(band given boy) as a fraction.", fig: { type: "table", rows: [["", "Band", "Not band", "Total"], ["Girls", 18, 42, 60], ["Boys", 12, 28, 40], ["Total", 30, 70, 100]], head: true, v: [] }, ans: "12/40", trap: "12/100", why: "Given boy: only the 40 boys count.", win: "12 of the 40 boys are in band." },
    { say: "Use the club table by yourself. Key in the fraction.", fig: { type: "table", rows: [["", "Club", "No club", "Total"], ["Juniors", 20, 30, 50], ["Seniors", 10, 40, 50], ["Total", 30, 70, 100]], head: true, v: [] }, alt: [{ q: "P(junior given club)", ans: "20/30", trap: "20/100" }, { q: "P(club given senior)", ans: "10/50", trap: "10/100" }, { q: "P(senior given no club)", ans: "40/70", trap: "40/100" }] },
  ],
}));
