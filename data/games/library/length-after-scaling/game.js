// Length After Scaling. Skill N-VM.B.5-2.
// Computing the magnitude of a scalar multiple. Forgetting the absolute value of the scalar is the known slip.
Sidekick.game(Sidekick.play({
  title: "Length After Scaling",
  emoji: "📐",
  premise: "Scaling a vector by c multiplies its length by the size of c. A length is never negative, even when c is.",
  outro: "The magnitude of cv is |c| times the magnitude of v.",
  scene: "paper",
  kind: "type",
  icon: "📐",
  hint: "Ignore the sign of the multiplier. Lengths cannot be negative.",
  tag: "negative_length",
  rounds: [
    { say: "v has magnitude 5. Key in the magnitude of −2v.", ans: 10, trap: -10, why: "The arrow turns around and doubles, but its length is still positive.", win: "2 × 5 = 10." },
    { say: "v has magnitude 3. Key in the magnitude of 4v.", ans: 12, trap: 7, why: "Scaling multiplies the length: 4 × 3.", win: "4 × 3 = 12." },
    { say: "Find the magnitude by yourself.", alt: [{ q: "v has magnitude 6. Find the magnitude of −3v.", ans: 18, trap: -18 }, { q: "v has magnitude 7. Find the magnitude of 2v.", ans: 14, trap: 9 }, { q: "v has magnitude 4. Find the magnitude of −5v.", ans: 20, trap: -20 }] },
  ],
}));
