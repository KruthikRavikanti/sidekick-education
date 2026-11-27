// Because Why?. Skill RI.K.8-1.
// Identifying the reasons an author gives to support points in a text. Repeating the point instead of giving the reason is the known slip.
Sidekick.game(Sidekick.play({
  title: "Because Why?",
  emoji: "🦵",
  premise: "An author says something, then gives a reason for it. The reason tells you why it is true.",
  outro: "A reason tells why. It is different from saying the point again.",
  scene: "meadow",
  kind: "pick",
  hint: "Which sentence tells WHY?",
  tag: "repeats_the_point",
  rounds: [
    { say: "Read the page. Tap the reason frogs are good jumpers.", read: "Frogs are good jumpers. They have strong back legs.", yes: "They have strong back legs.|", no: "Frogs are good jumpers.|Frogs are green.|I like frogs.", trap: "Frogs are good jumpers.", why: "That is the point again. The reason tells why.", win: "Strong legs are the reason." },
    { say: "Read the page. Tap the reason ducks float.", read: "Ducks float on water. Their feathers have oil that keeps water out.", yes: "Their feathers keep water out.|", no: "Ducks float on water.|Ducks say quack.|Ducks are cute.", trap: "Ducks float on water.", why: "That is the point again. Look for why they float.", win: "Oily feathers are the reason." },
    { say: "Tap the reason by yourself.", read: "Polar bears stay warm in the snow. They have thick fur and fat.", yes: "They have thick fur and fat.|", no: "Polar bears stay warm.|Polar bears are white.|Snow is cold.|Bears are big.|I saw a bear.", trap: "Polar bears stay warm." },
  ],
}));
