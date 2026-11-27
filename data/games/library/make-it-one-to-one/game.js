// Make It One-to-One. Skill F-BF.B.4-4.
// Producing an invertible function from a non-invertible one by restricting the domain. Not restricting is the known slip.
Sidekick.game(Sidekick.play({
  title: "Make It One-to-One",
  emoji: "✂️",
  premise: "A function has an inverse only if no output is used twice. If one is, trim the domain until each output appears once.",
  outro: "Restrict the domain so the function is one-to-one. For x^2, use x ≥ 0 and the inverse is √x.",
  scene: "paper",
  kind: "sort",
  figW: 14,
  hint: "Slide a flat line up the graph. Does it ever hit the curve twice?",
  tag: "does_not_restrict",
  rounds: [
    { say: "Which graphs already have an inverse function?", bins: "Has an inverse|Needs trimming", items: ["~plot:line:1:0 ~plot:cubic:0.3:0:0", "~plot:quad:0.4:0:-2 ~plot:abs:1:0:-2"], trap: ["~plot:quad:0.4:0:-2", 0], why: "A flat line crosses the parabola twice. Two inputs share one output.", win: "One output, one input." },
    { say: "Fix f(x) = x^2 so it has an inverse.", kind: "fill", fs: 5.4, cast: "", rows: [["keep only the domain", "x ≥ 0"], ["then the inverse is", "√x"]], extra: "all real numbers|{1/x^2}", trap: [0, "all real numbers"], why: "With all real numbers, 3 and −3 both give 9. The inverse could not choose.", win: "Half of the parabola is one-to-one." },
    { say: "Sort these by yourself.", bins: "Has an inverse|Needs trimming", items: ["~plot:sqrt:1.5:-4:-3 ~plot:exp:1:2:0 ~plot:line:-1:1", "~plot:sin:2:1 ~plot:quad:-0.4:0:3"], trap: ["~plot:sin:2:1", 0] },
  ],
}));
