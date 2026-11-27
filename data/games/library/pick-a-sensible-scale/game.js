// Pick a Sensible Scale. Skill N-Q.A.1-2.
// Choosing and interpreting the scale and origin in graphs and data displays. Using scales that hide the data is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pick a Sensible Scale",
  emoji: "📏",
  premise: "A graph’s scale should fit its data. Too fine and it runs off the page. Too coarse and the data is squashed flat.",
  outro: "Choose a scale that spreads the data across the axis in a reasonable number of steps.",
  scene: "paper",
  kind: "sort",
  fs: 5.2,
  hint: "About how many steps would that scale need to cover the data?",
  tag: "scale_hides_data",
  rounds: [
    { say: "The data run from 0 to 50,000. Which scales are sensible?", bins: "Sensible|Poor", items: ["count by 5,000s|count by 10,000s", "count by 1s|count by 1,000,000s"], trap: ["count by 1s", 0], why: "That would need 50,000 tick marks.", win: "Five to ten steps is about right." },
    { say: "Test scores run from 60 to 100. Sort the scales.", bins: "Sensible|Poor", items: ["count by 5s|count by 10s", "count by 0.01s|count by 500s"], trap: ["count by 500s", 0], why: "All the scores would sit inside the first step.", win: "Fit the scale to the spread." },
    { say: "Heights run from 140 to 190 cm. Sort by yourself.", bins: "Sensible|Poor", items: ["count by 10s|count by 5s", "count by 1,000s|count by 0.1s"], trap: ["count by 1,000s", 0] },
  ],
}));
