// Chart Plus Article. Skill RI.6.7-1.
// Integrating information presented in different media or formats. Using only one format is the known slip.
Sidekick.game(Sidekick.play({
  title: "Chart Plus Article",
  emoji: "📊",
  premise: "Some answers are in the words. Some are in the chart. The full picture needs both.",
  outro: "Combine what the text explains with what the chart shows.",
  scene: "city",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Which source tells you how many? Which tells you why?",
  tag: "uses_one_format",
  rounds: [
    { say: "Use the article and the chart together.", read: "Bike riding to school has grown since the town added bike lanes in 2022.", fig: { type: "bars", given: [["2021", 20], ["2022", 35], ["2023", 60]], cap: 60, tick: 20, values: true, h: 36, v: [] }, rows: [["riders in 2023", "60"], ["why riding grew", "new bike lanes"]], extra: "cheaper bikes|", trap: [1, "cheaper bikes"], why: "The article gives the reason: the town added bike lanes.", win: "The chart gives the number. The text gives the reason." },
    { say: "Which source answers each question?", kind: "sort", bins: "The chart|The article|Both together", items: ["How many rode in 2021?|", "What did the town build?|", "Did riding rise after the lanes opened?|"], trap: ["Did riding rise after the lanes opened?", 0], why: "You need the date from the article and the numbers from the chart.", win: "Some questions need both." },
    { say: "Use both sources by yourself.", read: "The school garden began composting lunch scraps in March.", fig: { type: "bars", given: [["Feb", 50], ["Mar", 30], ["Apr", 20]], cap: 60, tick: 20, values: true, h: 36, v: [] }, rows: [["bags of trash in April", "20"], ["why trash dropped", "composting began"]], extra: "50|fewer students", trap: [1, "fewer students"] },
  ],
}));
