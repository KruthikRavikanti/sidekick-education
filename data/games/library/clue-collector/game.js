// Clue Collector. Skill RL.6.1-2.
// Citing textual evidence to support inferences drawn from the text. Making inferences with no support is the known slip.
Sidekick.game(Sidekick.play({
  title: "Clue Collector",
  emoji: "🧩",
  premise: "An inference is a smart guess the author never states. It only counts if clues in the text back it up.",
  outro: "A strong inference rests on at least two clues from the text.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Does this detail point toward the inference, or is it just there?",
  tag: "inference_without_support",
  rounds: [
    { say: "Inference: Tomas is worried about his grades. Sort the details.", read: "Tomas shoved his report card to the bottom of his bag. At dinner he pushed peas around his plate and jumped when his mother said his name.", bins: "Supports it|Does not", items: ["hid the report card|jumped at his name", "peas were served|dinner was at home"], trap: ["peas were served", 0], why: "Peas tell us nothing about how he feels.", win: "Hiding the card and jumping are the clues." },
    { say: "Inference: Bea does not want to move away. Sort the details.", read: "Bea ran her hand along the doorframe where her height was marked each year. She packed her books last and very slowly.", bins: "Supports it|Does not", items: ["touched the height marks|packed very slowly", "she owns books|the house has a door"], trap: ["she owns books", 0], why: "Owning books is a fact, not a clue about her feelings.", win: "Lingering and slow packing show she wants to stay." },
    { say: "Inference: Kai is proud of his little sister. Sort the details by yourself.", read: "Kai clapped until his hands stung. He held up his phone to record every second of her dance, and he told the man beside him, “That is my sister.”", bins: "Supports it|Does not", items: ["clapped until it stung|told a stranger about her", "a man sat beside him|he owns a phone"], trap: ["he owns a phone", 0] },
  ],
}));
