// Snack Money. Skill 2.MD.C.8-3.
// Money word problems: the child builds the amount left or earned with coins. Adding when money is spent is the known slip.
Sidekick.game(Sidekick.play({
  title: "Snack Money",
  emoji: "🛒",
  premise: "You have some money and a story about spending or earning. Put in the purse what you have at the end.",
  outro: "Money problems are adding and taking away with cents.",
  scene: "city",
  kind: "build",
  cast: "",
  unit: "#¢",
  pile: [["25¢", 25, 3], ["10¢", 10, 4], ["5¢", 5, 2], ["1¢", 1, 5]],
  hint: "Spending makes the amount smaller. Earning makes it bigger.",
  tag: "adds_when_spending",
  rounds: [
    { say: "You have 75¢ and spend 40¢. Put what is left in the purse.", goal: 35, trap: 115, why: "You spent money, so you have less than 75¢.", win: "75¢ − 40¢ = 35¢." },
    { say: "You have 50¢ and earn 25¢ more. Put in how much you have now.", goal: 75, trap: 25, why: "You earned more, so you have more than 50¢.", win: "50¢ + 25¢ = 75¢." },
    { say: "Fill the purse by yourself.", alt: [{ say: "You have 80¢ and spend 35¢. Put what is left in the purse.", goal: 45, trap: 115 }, { say: "You have 65¢ and spend 30¢. Put what is left in the purse.", goal: 35, trap: 95 }] },
  ],
}));
