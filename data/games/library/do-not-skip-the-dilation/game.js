// Do Not Skip the Dilation. Skill 8.G.A.4-2.
// Describing a sequence of transformations that exhibits similarity. Leaving out the dilation is the known slip.
Sidekick.game(Sidekick.play({
  title: "Do Not Skip the Dilation",
  emoji: "📏",
  premise: "When two similar figures are different sizes, a dilation has to be part of the story. Then a rigid motion puts it in place.",
  outro: "To map one similar figure onto another: dilate by the scale factor, then slide, flip or turn.",
  scene: "paper",
  kind: "pick",
  fs: 5.2,
  hint: "Compare matching sides to find the scale factor.",
  tag: "leaves_out_dilation",
  rounds: [
    { say: "A is 2 by 3. B is 6 by 9 and sits to the right. Tap every step needed.", yes: "dilate by scale factor 3|translate to the right", no: "reflect over a line|dilate by scale factor 6|rotate 90°", trap: "-dilate by scale factor 3", why: "A slide alone keeps it 2 by 3. It has to grow to 6 by 9.", win: "Dilate by 3, then slide." },
    { say: "A has sides 3, 4, 5. B has sides 6, 8, 10 and is flipped. Tap every step needed.", yes: "dilate by scale factor 2|reflect", no: "dilate by scale factor 5|translate only|dilate by scale factor {1/2}", trap: "dilate by scale factor {1/2}", why: "B is bigger than A, so the scale factor is more than 1.", win: "Dilate by 2, then reflect." },
    { say: "Square A has side 4. Square B has side 2 and is turned. Tap every step by yourself.", yes: "dilate by scale factor {1/2}|rotate", no: "dilate by scale factor 2|reflect only|translate only|no change at all", trap: "-dilate by scale factor {1/2}" },
  ],
}));
