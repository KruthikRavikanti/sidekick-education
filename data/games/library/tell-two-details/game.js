// Tell Two Details. Skill RI.1.2-2.
// Retelling key details of an informational text. Retelling details in a random way or from outside the text is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tell Two Details",
  emoji: "🦉",
  premise: "After you name the topic, tell the key details. They are the facts the page gives about the topic.",
  outro: "Key details are facts from the text that tell more about the topic.",
  scene: "night",
  kind: "pick",
  hint: "Is that fact on the page?",
  tag: "retells_outside_the_text",
  rounds: [
    { say: "Read the page. Tap the details it gives about owls.", read: "Owls hunt at night. They can turn their heads far around. Their feathers help them fly without a sound.", yes: "They hunt at night.|They fly without a sound.", no: "They eat cookies.|They sleep at night.", trap: "They sleep at night.", why: "The page says they hunt at night.", win: "Two key details about owls." },
    { say: "Read the page. Tap the details it gives about deserts.", read: "Deserts get very little rain. Many desert animals come out at night when it is cool.", yes: "Deserts get little rain.|Animals come out at night.", no: "Deserts have many lakes.|It snows every day.|Fish live there.", trap: "Deserts have many lakes.", why: "The page says there is very little rain.", win: "Two key details about deserts." },
    { say: "Tap the details from the page, by yourself.", read: "Bees visit flowers to get nectar. They carry it back to the hive and turn it into honey.", yes: "Bees get nectar from flowers.|Nectar becomes honey.", no: "Bees sleep in flowers.|Honey comes from trees.|Bees eat leaves.", trap: "Honey comes from trees." },
  ],
}));
