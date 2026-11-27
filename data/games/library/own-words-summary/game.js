// Own Words Summary. Skill RI.4.2-2.
// Summarizing an informational text. Copying sentences instead of summarizing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Own Words Summary",
  emoji: "🗞️",
  premise: "A summary is short, covers the main points and is written in your own words. Copying a sentence is not summarizing.",
  outro: "Summarize an article briefly in your own words.",
  scene: "desk",
  kind: "pick",
  hint: "Is it short, complete and in new words?",
  tag: "copies_instead_of_summarizing",
  rounds: [
    { say: "Read the article. Tap the best summary.", read: "Coral reefs are home to a quarter of all sea life. Warmer oceans are turning many reefs white and weak. Scientists are growing new coral to replant them.", yes: "Reefs shelter much sea life but are harmed by warming, so scientists are regrowing them.|", no: "Coral reefs are home to a quarter of all sea life.|Coral is pretty.|Scientists work hard.", trap: "Coral reefs are home to a quarter of all sea life.", why: "That copies the first sentence and leaves out the rest.", win: "Short, complete and in your own words." },
    { say: "Read this article. Tap the best summary.", read: "The first bicycles had no pedals. Riders pushed along with their feet. Pedals, chains and rubber tires were added over fifty years.", yes: "Bicycles began as simple push machines and gained new parts over time.|", no: "The first bicycles had no pedals.|Bikes are fun.|Tires are rubber.", trap: "The first bicycles had no pedals.", why: "That is copied, and it covers only the beginning.", win: "The whole article in one sentence." },
    { say: "Tap the best summary by yourself.", read: "Honeybees visit flowers to gather nectar. Back at the hive they pass it mouth to mouth. Fanning wings dry it into thick honey.", yes: "Bees turn flower nectar into honey by passing and drying it.|", no: "Honeybees visit flowers to gather nectar.|Bees have wings.|Honey is thick.|Hives are busy.|Flowers have nectar.", trap: "Honeybees visit flowers to gather nectar." },
  ],
}));
