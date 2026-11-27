// One Tiny Degree. Skill 4.MD.C.5-3.
// One degree is 1/360 of a circle and an angle of n degrees is n one-degree turns. Thinking a degree is a length is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Tiny Degree",
  emoji: "🧿",
  premise: "Cut a full turn into 360 equal tiny turns. Each one is one degree. Degrees measure turning, not length.",
  outro: "One degree is 1/360 of a full turn. Degrees measure how far something turns.",
  scene: "night",
  kind: "sort",
  hint: "A degree is a tiny turn. It has nothing to do with how long the lines are.",
  tag: "degree_is_a_length",
  rounds: [
    { say: "Sort what is true about degrees.", bins: "True|Not true", items: ["A degree measures how far something turns|A full turn is 360 degrees", "A degree measures how long a line is|Longer rays mean more degrees"], trap: ["Longer rays mean more degrees", 0], why: "Stretching the rays does not change the turn between them.", win: "Degrees measure turning." },
    { say: "Key in the number of degrees.", kind: "type", icon: "🧿", q: "An angle turns through 45 one-degree turns. How many degrees is it?", ans: 45, trap: 360, why: "Each tiny turn is one degree. Count how many there are.", win: "45 one-degree turns make 45 degrees." },
    { say: "Sort these by yourself.", bins: "True|Not true", items: ["One degree is {1/360} of a full turn|Half a turn is 180 degrees", "A degree is a kind of length|A bigger drawing has more degrees"], trap: ["A bigger drawing has more degrees", 0] },
  ],
}));
