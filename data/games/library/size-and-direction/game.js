// Size and Direction. Skill N-VM.A.1-1.
// Recognizing vector quantities as having both magnitude and direction. Treating vectors as plain numbers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Size and Direction",
  emoji: "🧭",
  premise: "A scalar is just a size. A vector has a size and a direction. Thirty miles per hour is a speed. Thirty miles per hour north is a velocity.",
  outro: "Vectors have magnitude and direction. Scalars have magnitude only.",
  scene: "field",
  kind: "sort",
  fs: 5,
  hint: "Does it say which way? If so, it is a vector.",
  tag: "vector_as_number",
  rounds: [
    { say: "Vector or scalar?", bins: "Vector|Scalar", items: ["velocity of 30 mph north|a push of 10 newtons downward", "speed of 30 mph|mass of 5 kg|temperature of 20°"], trap: ["velocity of 30 mph north", 1], why: "North is a direction. Size plus direction makes a vector.", win: "Direction makes it a vector." },
    { say: "Sort these.", bins: "Vector|Scalar", items: ["a 5 km walk to the east|wind blowing 12 mph from the west", "a 5 km distance|12 minutes|40 dollars"], trap: ["a 5 km distance", 0], why: "Distance alone has no direction.", win: "East and west are directions." },
    { say: "Sort these by yourself.", bins: "Vector|Scalar", items: ["a force of 8 newtons to the left|a current flowing 3 m/s south", "a volume of 2 liters|an area of 9 square meters|a speed of 3 m/s"], trap: ["a speed of 3 m/s", 0] },
  ],
}));
