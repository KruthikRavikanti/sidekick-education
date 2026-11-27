// Table Test for Independence. Skill S-CP.A.4-1.
// Constructing and interpreting two-way frequency tables and using them to decide if events are independent. Comparing counts instead of relative frequencies is the known slip.
Sidekick.game(Sidekick.play({
  title: "Table Test for Independence",
  emoji: "🎺",
  premise: "A two-way table sorts people by two questions at once. Compare rates, not raw counts, to see if the answers are linked.",
  outro: "If P(A given B) equals P(A), the events are independent. Compare relative frequencies.",
  scene: "paper",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Divide each count by its own total before comparing.",
  tag: "counts_not_rates",
  rounds: [
    { say: "Use the table. Is being in band independent of being a girl?", fig: { type: "table", rows: [["", "Band", "Not band", "Total"], ["Girls", 18, 42, 60], ["Boys", 12, 28, 40], ["Total", 30, 70, 100]], head: true, v: [] }, rows: [["P(band)", "{30/100} = 0.3"], ["P(band given girl)", "{18/60} = 0.3"], ["so band and girl are", "independent"]], extra: "linked", trap: [2, "linked"], why: "18 and 12 are different counts, but both groups have the same rate, 0.3.", win: "Equal rates: independent." },
    { say: "Use the table. Is being in a club independent of being a junior?", fig: { type: "table", rows: [["", "Club", "No club", "Total"], ["Juniors", 20, 30, 50], ["Seniors", 10, 40, 50], ["Total", 30, 70, 100]], head: true, v: [] }, rows: [["P(club)", "{30/100} = 0.3"], ["P(club given junior)", "{20/50} = 0.4"], ["so club and junior are", "not independent"]], extra: "independent", trap: [2, "independent"], why: "0.4 is not 0.3. Juniors join at a higher rate.", win: "Different rates: linked." },
    { say: "Use the band table by yourself.", fig: { type: "table", rows: [["", "Band", "Not band", "Total"], ["Girls", 18, 42, 60], ["Boys", 12, 28, 40], ["Total", 30, 70, 100]], head: true, v: [] }, rows: [["P(band given boy)", "{12/40} = 0.3"], ["P(girl given band)", "{18/30} = 0.6"]], extra: "{12/100} = 0.12|{18/100} = 0.18", trap: [0, "{12/100} = 0.12"] },
  ],
}));
