// Steady Amount Each Step. Skill F-LE.A.1-2.
// Recognizing situations in which one quantity changes at a constant rate per unit interval. Mistaking percent change for constant change is the known slip.
Sidekick.game(Sidekick.play({
  title: "Steady Amount Each Step",
  emoji: "🕯️",
  premise: "When a quantity changes by the same amount in each equal time step, a linear model fits it.",
  outro: "A constant rate of change per unit interval means linear.",
  scene: "night",
  kind: "pick",
  fs: 4.8,
  hint: "Is the same AMOUNT added each time, or the same percent?",
  tag: "percent_as_constant",
  rounds: [
    { say: "Tap every situation that changes by a constant amount.", yes: "A candle burns 2 cm an hour.|You save $15 a week.|A pool fills 40 liters a minute.", no: "A debt grows 10% a month.|A colony triples each day.", trap: "A debt grows 10% a month.", why: "10% of a growing debt is a bigger amount each month. That is not constant.", win: "Three steady amounts." },
    { say: "Linear or not?", kind: "sort", fs: 4.8, bins: "Linear|Not linear", items: ["A plant grows 2 cm every week.|A taxi adds $3 for each mile.", "A rumor doubles its listeners each hour.|A bank adds 5% of the balance each year."], trap: ["A bank adds 5% of the balance each year.", 0], why: "5% of a larger balance is more dollars each year.", win: "Constant amount means linear." },
    { say: "Tap every constant-amount situation by yourself.", yes: "A train covers 80 km each hour.|A tank loses 5 liters a day.", no: "A value drops 20% a year.|Views double weekly.|A crowd grows by half each hour.|Prices rise 3% a year.", trap: "A value drops 20% a year." },
  ],
}));
