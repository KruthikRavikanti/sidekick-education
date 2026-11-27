// Faithful or Changed?. Skill RL.8.7-1.
// Analyzing the extent to which a filmed or live production stays faithful to or departs from the text. Listing differences only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Faithful or Changed?",
  emoji: "🎬",
  premise: "A film version keeps some things and changes others. Each change is a choice the director made for a reason.",
  outro: "Evaluate where a production stays faithful to the text and where it departs, and consider why.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Does the film do what the text says, or something different?",
  tag: "lists_differences_only",
  rounds: [
    { say: "The text: “Rosa walked home alone through the rain, saying nothing.” Sort the film choices.", bins: "Faithful|Departs", items: ["Rosa walks alone in the rain|she stays silent the whole way", "a friend walks with her, chatting|the scene is set on a sunny day"], trap: ["a friend walks with her, chatting", 0], why: "The text says alone and saying nothing.", win: "Two choices keep the text. Two change it." },
    { say: "Why might a director make each change?", kind: "fill", fs: 4.4, cast: "", rows: [["adds a friend to the scene", "so thoughts can be spoken aloud"], ["cuts a long journey to one shot", "to save screen time"]], extra: "to make the book longer|", trap: [0, "to make the book longer"], why: "A film cannot show silent thoughts easily. A friend lets them be said.", win: "Changes solve film problems." },
    { say: "The text: “The old man told the story by firelight to three children.” Sort by yourself.", bins: "Faithful|Departs", items: ["three children listen by a fire|an old man narrates", "the story is shown as a cartoon on a phone|a teenager tells it at school"], trap: ["a teenager tells it at school", 0] },
  ],
}));
