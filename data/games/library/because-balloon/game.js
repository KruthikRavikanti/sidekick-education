// Because Balloon. Skill W.K.1-2.
// Supplying a reason for an opinion in writing. Giving no reason, or repeating the opinion, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Because Balloon",
  emoji: "🎈",
  premise: "When you say what you like, tell why. A reason makes other people understand.",
  outro: "An opinion needs a reason: I like it because...",
  scene: "sky",
  kind: "fill",
  cast: "",
  hint: "A reason tells why. It comes after the word because.",
  tag: "gives_no_reason",
  rounds: [
    { say: "Finish each sentence with a real reason.", rows: [["I like dogs because", "they play with me"], ["I like apples because", "they taste sweet"]], extra: "I like them|dogs", trap: [0, "I like them"], why: "That says the same thing again. Tell why you like dogs.", win: "Now each one has a reason." },
    { say: "Finish these with a reason.", rows: [["The park is fun because", "it has a slide"], ["I like my bed because", "it is soft"]], extra: "it is fun|bed", trap: [0, "it is fun"], why: "That says fun again. What makes the park fun?", win: "A slide and a soft bed are good reasons." },
    { say: "Finish these by yourself.", rows: [["I like rain because", "I can splash"], ["My cat is the best because", "she purrs"], ["I like soup because", "it warms me up"]], extra: "I like it|", trap: [0, "I like it"] },
  ],
}));
