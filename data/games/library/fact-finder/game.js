// Fact Finder. Skill W.1.2-1.
// Writing informative texts that name a topic and supply facts. Writing opinions instead of facts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fact Finder",
  emoji: "🐸",
  premise: "Writing that teaches needs facts. A fact is true for everyone. An opinion is what one person thinks.",
  outro: "Informative writing names a topic and gives facts, not opinions.",
  scene: "meadow",
  kind: "sort",
  hint: "Could you check it and show it is true?",
  tag: "writes_opinions_as_facts",
  rounds: [
    { say: "You are writing to teach about frogs. Sort the sentences.", bins: "Fact|Opinion", items: ["Frogs can jump.|Frogs lay eggs.", "Frogs are gross.|Frogs are the best."], trap: ["Frogs are the best.", 0], why: "Best is what one person thinks. Not everyone agrees.", win: "Facts teach. Opinions tell what you think." },
    { say: "You are writing to teach about the sun. Sort the sentences.", bins: "Fact|Opinion", items: ["The sun is a star.|The sun gives us light.", "Sunny days are the nicest.|The sun is too bright."], trap: ["Sunny days are the nicest.", 0], why: "Nicest is an opinion. Some people like rain better.", win: "Two facts for your writing." },
    { say: "Sort these by yourself.", bins: "Fact|Opinion", items: ["Cats have fur.|Cats can climb.|Kittens drink milk.", "Cats are cuter than dogs.|Cats are boring."], trap: ["Cats are cuter than dogs.", 0] },
  ],
}));
