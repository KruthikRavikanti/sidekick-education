// Domain and Range. Skill F-IF.A.1-2.
// Identifying the domain and range of a function. Swapping domain and range is the known slip.
Sidekick.game(Sidekick.play({
  title: "Domain and Range",
  emoji: "↔️",
  premise: "The domain is the set of inputs. The range is the set of outputs. List each value once.",
  outro: "Domain: all the x-values. Range: all the y-values, without repeats.",
  scene: "desk",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Domain comes from the first numbers. Range comes from the second.",
  tag: "swaps_domain_and_range",
  rounds: [
    { say: "For (1, 4), (2, 5), (3, 5), find the domain and the range.", rows: [["domain", "1, 2, 3"], ["range", "4, 5"]], extra: "4, 5, 5|", trap: [0, "4, 5"], why: "Those are the outputs. The domain is the set of inputs.", win: "Inputs 1, 2, 3. Outputs 4 and 5." },
    { say: "For (0, 7), (2, 9), (4, 7), find the domain and the range.", rows: [["domain", "0, 2, 4"], ["range", "7, 9"]], extra: "7, 9, 7|", trap: [1, "7, 9, 7"], why: "A set lists each value once. 7 appears only once in the range.", win: "No repeats in a set." },
    { say: "For (−1, 3), (0, 3), (5, 8), match by yourself.", rows: [["domain", "−1, 0, 5"], ["range", "3, 8"]], extra: "3, 3, 8|−1, 0", trap: [0, "3, 8"] },
  ],
}));
