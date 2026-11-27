// The Do-Nothing Matrices. Skill N-VM.C.10-1.
// Understanding that the zero and identity matrices play roles like 0 and 1. Thinking the identity matrix is all 1s is the known slip.
Sidekick.game(Sidekick.play({
  title: "The Do-Nothing Matrices",
  emoji: "🪞",
  premise: "The zero matrix acts like 0 in addition. The identity matrix acts like 1 in multiplication. It has 1s only on the diagonal.",
  outro: "A + 0 = A and AI = A. The identity has 1s down the main diagonal and 0s elsewhere.",
  scene: "desk",
  kind: "fill",
  figW: 20,
  cast: "",
  hint: "The identity keeps each entry in its own place: 1s on the diagonal only.",
  tag: "identity_all_ones",
  rounds: [
    { say: "Match each name to its matrix.", rows: [["identity matrix", "~mat:1,0;0,1"], ["zero matrix", "~mat:0,0;0,0"]], extra: "~mat:1,1;1,1", trap: [0, "~mat:1,1;1,1"], why: "A matrix of all 1s mixes the entries together. The identity has 0s off the diagonal.", win: "1s on the diagonal, 0s elsewhere." },
    { say: "Which operations leave a matrix A unchanged?", kind: "sort", fs: 5, bins: "Leaves A unchanged|Changes A", items: ["A times the identity|A plus the zero matrix", "A times the zero matrix|A times a matrix of all 1s"], trap: ["A times a matrix of all 1s", 0], why: "All 1s adds entries together. Only the identity gives A back.", win: "I for multiplying, 0 for adding." },
    { say: "Match these by yourself.", rows: [["2 by 2 identity", "~mat:1,0;0,1"], ["3 by 3 identity", "~mat:1,0,0;0,1,0;0,0,1"]], extra: "~mat:1,1;1,1 ~mat:0,1;1,0", trap: [0, "~mat:1,1;1,1"] },
  ],
}));
