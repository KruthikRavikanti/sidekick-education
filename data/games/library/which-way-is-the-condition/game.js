// Which Way Is the Condition?. Skill S-CP.A.5-1.
// Recognizing and explaining conditional probability and independence in everyday situations. Reversing the condition is the known slip.
Sidekick.game(Sidekick.play({
  title: "Which Way Is the Condition?",
  emoji: "🔄",
  premise: "The chance of A given B and the chance of B given A are different questions. The group you start from changes everything.",
  outro: "P(A given B) and P(B given A) use different totals. Read which group comes after the word given.",
  scene: "paper",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "The group after \"given\" is the total you divide by.",
  tag: "reverses_condition",
  rounds: [
    { say: "Use the band table. These two are different questions.", fig: { type: "table", rows: [["", "Band", "Not band", "Total"], ["Girls", 18, 42, 60], ["Boys", 12, 28, 40], ["Total", 30, 70, 100]], head: true, v: [] }, rows: [["P(girl given band)", "{18/30}"], ["P(band given girl)", "{18/60}"]], extra: "{18/100}", trap: [0, "{18/60}"], why: "Given band means start from the 30 band members.", win: "18 of 30, and 18 of 60." },
    { say: "Which total does each question divide by?", rows: [["P(rain given clouds)", "all the cloudy days"], ["P(clouds given rain)", "all the rainy days"]], extra: "all the days|", trap: [0, "all the rainy days"], why: "Given clouds: look only at cloudy days.", win: "Most rainy days are cloudy. Fewer cloudy days are rainy." },
    { say: "Use the club table by yourself.", fig: { type: "table", rows: [["", "Club", "No club", "Total"], ["Juniors", 20, 30, 50], ["Seniors", 10, 40, 50], ["Total", 30, 70, 100]], head: true, v: [] }, rows: [["P(senior given club)", "{10/30}"], ["P(club given senior)", "{10/50}"]], extra: "{10/100} {20/30}", trap: [0, "{10/50}"] },
  ],
}));
