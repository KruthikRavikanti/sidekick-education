// Matching Parts. Skill G-CO.B.7-1.
// Showing that triangles are congruent if and only if corresponding sides and angles are congruent. Matching non-corresponding parts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Matching Parts",
  emoji: "🔗",
  premise: "The order of letters in a congruence statement tells which parts match. First with first, second with second, third with third.",
  outro: "If triangle ABC ≅ triangle DEF, then A↔D, B↔E, C↔F, so BC matches EF.",
  scene: "paper",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Line the names up: ABC over DEF. Read off the matching positions.",
  tag: "non_corresponding_parts",
  rounds: [
    { say: "Triangle ABC ≅ triangle DEF. Match the corresponding parts.", rows: [["side BC", "side EF"], ["angle A", "angle D"], ["side AC", "side DF"]], extra: "side DE|", trap: [0, "side DE"], why: "B and C are the 2nd and 3rd letters. So are E and F.", win: "Position in the name decides the match." },
    { say: "Triangle PQR ≅ triangle XYZ. Match the parts.", rows: [["side PQ", "side XY"], ["angle R", "angle Z"], ["side QR", "side YZ"]], extra: "side XZ|", trap: [2, "side XZ"], why: "Q and R are 2nd and 3rd. They match Y and Z.", win: "Same positions, same parts." },
    { say: "Triangle JKL ≅ triangle MNO. Match by yourself.", rows: [["side JL", "side MO"], ["angle K", "angle N"], ["side KL", "side NO"]], extra: "side MN|angle O", trap: [0, "side MN"] },
  ],
}));
