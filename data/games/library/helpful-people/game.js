// Helpful People. Skill L.3.5-2.
// Identifying real-life connections between words and their use (describing people who are friendly or helpful). Not being able to give examples is the known slip.
Sidekick.game(Sidekick.play({
  title: "Helpful People",
  emoji: "🧑‍🚒",
  premise: "A describing word fits real people when their actions show it. Link the word to what people do.",
  outro: "Connect a describing word to real people and actions that show it.",
  scene: "city",
  kind: "pick",
  fs: 5,
  hint: "Does what the person does show that word?",
  tag: "cannot_give_examples",
  rounds: [
    { say: "Tap the people who are being helpful.", yes: "a nurse caring for a patient|a neighbor carrying your bags|a firefighter rescuing a cat", no: "a kid hiding the remote|someone cutting in line", trap: "someone cutting in line", why: "Cutting in line helps no one but yourself.", win: "Helpful people do things for others." },
    { say: "Tap the people who are being friendly.", yes: "a girl who waves and says hello|a boy who invites you to play", no: "someone who turns away|a kid who slams the door|a person who will not answer", trap: "someone who turns away", why: "Turning away is not friendly.", win: "Friendly people reach out." },
    { say: "Tap the people who are being patient, by yourself.", yes: "a coach who explains it again calmly|a child who waits for a turn", no: "someone who yells to hurry up|a driver honking at once|a kid who grabs the toy", trap: "a kid who grabs the toy" },
  ],
}));
