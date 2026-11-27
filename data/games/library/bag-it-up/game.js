// Bag It Up. Skill 3.OA.A.2-2.
// Division as how many groups: the group size is fixed and the child finds the number of groups that uses up the total. Giving the group size as the answer is the known slip.
Sidekick.game(Sidekick.play({
  title: "Bag It Up",
  emoji: "🥡",
  premise: "This time you know how many go in each bag. Add bags until all the fruit is packed.",
  outro: "Dividing can also ask: how many groups of this size are in the total?",
  scene: "city",
  kind: "dial",
  cast: "",
  dials: [["Bags", 1, 8]],
  hint: "Skip count by the number in each bag until you reach the total.",
  tag: "gives_group_size",
  rounds: [
    { say: "20 apples go 5 in each bag. Add bags until 20 are packed.", view: { type: "groups", each: 5, icon: "🍎" }, ans: [4], trap: [5], why: "5 is how many in each bag. Count the bags it takes to reach 20.", win: "20 ÷ 5 = 4 bags." },
    { say: "18 plums go 3 in each bag. Add bags until 18 are packed.", view: { type: "groups", each: 3, icon: "🫐" }, ans: [6], trap: [3], why: "3 is how many in each bag. Count 3, 6, 9... up to 18.", win: "18 ÷ 3 = 6 bags." },
    { say: "Pack the fruit by yourself.", alt: [{ say: "24 pears go 6 in each bag. How many bags?", view: { type: "groups", each: 6, icon: "🍐" }, ans: [4], trap: [6] }, { say: "21 limes go 3 in each bag. How many bags?", view: { type: "groups", each: 3, icon: "🍋" }, ans: [7], trap: [3] }] },
  ],
}));
