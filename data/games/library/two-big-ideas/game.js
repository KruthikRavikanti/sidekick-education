// Two Big Ideas. Skill RI.7.2-1.
// Determining two or more central ideas in a text. Finding only one is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Big Ideas",
  emoji: "✌️",
  premise: "A longer article often makes two main points, not one. Find both, and do not mistake a detail for either.",
  outro: "Identify two or more central ideas, each supported by its own details.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "Which two statements are big enough to have their own details?",
  tag: "finds_one_idea",
  rounds: [
    { say: "Read the article. Tap its two central ideas.", read: "Wolves were returned to Yellowstone in 1995. With wolves hunting them, elk stopped overgrazing the riverbanks, and willows grew back. The return was not welcomed by all: ranchers nearby lost livestock and pushed for limits.", yes: "Wolves helped the park’s plants recover.|The return caused conflict with ranchers.", no: "Willows are a kind of tree.|It happened in 1995.", trap: "-The return caused conflict with ranchers.", why: "The last part of the article is all about that conflict. It is a second main point.", win: "A benefit and a conflict." },
    { say: "Read the article. Tap its two central ideas.", read: "Electric buses cost more to buy than diesel ones. Over time they are cheaper to run because electricity and repairs cost less. They also cut the exhaust that city children breathe at bus stops.", yes: "Electric buses save money in the long run.|They make city air cleaner.", no: "Buses stop at bus stops.|Diesel is a fuel.", trap: "-They make city air cleaner.", why: "Cleaner air is a separate point from cost.", win: "Money and health." },
    { say: "Read the article. Tap its two central ideas by yourself.", read: "Sign languages are full languages with their own grammar, not codes for spoken words. They also differ from country to country: a signer from Japan and one from Brazil cannot simply understand each other.", yes: "Sign languages are complete languages.|Different countries have different sign languages.", no: "Japan is a country.|Signers use their hands.|Brazil is large.|Grammar is hard.", trap: "-Different countries have different sign languages." },
  ],
}));
