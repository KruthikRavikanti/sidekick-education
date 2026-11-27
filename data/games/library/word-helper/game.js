// Word Helper. Skill RI.1.4-1.
// Asking and answering questions to determine or clarify the meaning of words and phrases in a text. Ignoring unknown words is the known slip.
Sidekick.game(Sidekick.play({
  title: "Word Helper",
  emoji: "🛟",
  premise: "Fact books explain their hard words. The meaning is often right after the word.",
  outro: "When a word is new, look for the words nearby that explain it.",
  scene: "ocean",
  kind: "pick",
  hint: "Read what comes right after the new word.",
  tag: "ignores_unknown_words",
  rounds: [
    { say: "Read the page. What is a colony?", read: "Ants live in a colony, a big group that works together.", yes: "a big group|", no: "a kind of food|a small hill|one ant", trap: "one ant", why: "Read after the comma: a big group that works together.", win: "A colony is a big group." },
    { say: "Read the page. What does nocturnal mean?", read: "Owls are nocturnal. That means they are awake at night.", yes: "awake at night|", no: "able to fly|very wise|covered in feathers", trap: "able to fly", why: "The next sentence says what it means.", win: "Nocturnal means awake at night." },
    { say: "Read the page by yourself.", alt: [{ say: "What is a herd?", read: "Elephants live in a herd. A herd is a family group that travels together.", yes: "a family group|", no: "a long nose|a kind of grass|a loud sound|a big ear|a water hole", trap: "a long nose" }, { say: "What is prey?", read: "A hawk hunts for prey. Prey is an animal that is caught for food.", yes: "an animal caught for food|", no: "a kind of bird|a sharp claw|a high nest|a fast dive|a prayer", trap: "a kind of bird" }] },
  ],
}));
