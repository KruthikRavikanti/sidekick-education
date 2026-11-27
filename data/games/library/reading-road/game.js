// Reading Road. Skill RF.K.1-1.
// Following print left to right and top to bottom: the child rebuilds a sentence in reading order. Reading right to left, or starting on the lower line, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Reading Road",
  emoji: "🚗",
  premise: "Words are read like a road: start at the left, drive to the right, then go down to the next line.",
  outro: "We read from left to right, and from the upper line down to the next one.",
  scene: "city",
  kind: "row",
  fs: 5.4,
  hint: "Start with the first word on the left. Then go right.",
  tag: "reads_right_to_left",
  rounds: [
    { say: "Put the words in the order you read them.", read: "The cat sat.", seq: "The cat sat.", trap: "reverse", why: "Start at the left side. The first word is The.", win: "Left to right. You read it." },
    { say: "Two lines now. Read the upper line first, then the next one.", read: "I see a dog. / It is big.", seq: "I see a dog. It is big.", trap: "It is big. I see a dog.", why: "Start with the upper line. Then go down.", win: "Upper line first, then down." },
    { say: "Put these words in reading order by yourself.", alt: [{ read: "My hat is red. / Your cap is blue.", seq: "My hat is red. Your cap is blue.", trap: "Your cap is blue. My hat is red." }, { read: "A bug can hop. / The fish swims.", seq: "A bug can hop. The fish swims.", trap: "The fish swims. A bug can hop." }] },
  ],
}));
