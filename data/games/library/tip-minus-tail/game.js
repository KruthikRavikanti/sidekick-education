// Tip Minus Tail. Skill N-VM.A.2-1.
// Finding the components of a vector by subtracting the initial point from the terminal point. Subtracting in the reverse order is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tip Minus Tail",
  emoji: "➡️",
  premise: "A vector’s components say how far it moves across and up. Subtract where it starts from where it ends.",
  outro: "Components = terminal point − initial point.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -4, 4],
  quiet: true,
  hint: "Count from the tail to the tip: how far across, how far up?",
  tag: "subtracts_reverse_order",
  rounds: [
    { say: "The arrow runs from (−3, −2) to (0, 2). Tap the point that shows its components: across, then up.", arrows: [[-3, -2, 0, 2]], ans: [[3, 4]], trap: [[-3, -4]], why: "That is tail minus tip. The arrow moves right 3 and up 4.", win: "0 − (−3) = 3 and 2 − (−2) = 4." },
    { say: "The arrow runs from (2, 3) to (−1, 1). Tap its components.", arrows: [[2, 3, -1, 1]], ans: [[-3, -2]], trap: [[3, 2]], why: "This arrow points left and down, so both components are negative.", win: "−1 − 2 = −3 and 1 − 3 = −2." },
    { say: "Tap the components by yourself.", alt: [{ say: "By yourself: the arrow runs from (−1, −3) to (3, 0). Tap its components.", arrows: [[-1, -3, 3, 0]], ans: [[4, 3]], trap: [[-4, -3]] }, { say: "By yourself: the arrow runs from (3, 2) to (1, −2). Tap its components.", arrows: [[3, 2, 1, -2]], ans: [[-2, -4]], trap: [[2, 4]] }, { say: "By yourself: the arrow runs from (−4, 1) to (−1, 3). Tap its components.", arrows: [[-4, 1, -1, 3]], ans: [[3, 2]], trap: [[-3, -2]] }] },
  ],
}));
