// Fact Word Finder. Skill RI.K.4-1.
// Asking and answering questions about unknown words in an informational text. Skipping unknown words is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fact Word Finder",
  emoji: "🔦",
  premise: "Fact books use special words. When one is new, the book often tells you what it means.",
  outro: "When a word is new, look for the part of the book that explains it.",
  scene: "night",
  kind: "pick",
  hint: "Read the next sentence. It tells you about the word.",
  tag: "skips_unknown_words",
  rounds: [
    { say: "Read the page. What is a habitat?", read: "A habitat is where an animal lives. A pond is a habitat for frogs.", yes: "where an animal lives|", no: "what an animal eats|a kind of frog|a loud sound", trap: "a kind of frog", why: "The first sentence tells you: it is where an animal lives.", win: "A habitat is where an animal lives." },
    { say: "Read the page. What does hatch mean?", read: "Baby birds hatch. They break out of their eggs.", yes: "break out of an egg|", no: "fly away|eat a worm|build a nest", trap: "fly away", why: "The next sentence says they break out of their eggs.", win: "To hatch is to come out of an egg." },
    { say: "Read the page by yourself.", alt: [{ say: "What is a den?", read: "A fox sleeps in a den. A den is a safe hole in the ground.", yes: "a safe hole in the ground|", no: "a baby fox|a long nap|a kind of food|a tall tree|a fast run", trap: "a baby fox" }, { say: "What does soar mean?", read: "Eagles soar. They fly very high in the sky.", yes: "fly very high|", no: "swim fast|sing a song|sleep all day|dig a hole|eat a fish", trap: "swim fast" }] },
  ],
}));
