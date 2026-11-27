// Picture Graph Key. Skill 3.MD.B.3-2.
// Reading a scaled picture graph with half symbols: the key gives the value of each symbol. Counting the symbols and ignoring the key, or dropping the half, are the known slips.
Sidekick.game(Sidekick.play({
  title: "Picture Graph Key",
  emoji: "🎟️",
  premise: "In a picture graph, one picture can stand for many. The key tells you how many. A half picture is worth half as much.",
  outro: "Always read the key. Multiply the pictures by what each one stands for.",
  scene: "paper",
  kind: "type",
  icon: "🎟️",
  hint: "Read the key first. What is a whole picture worth? What is half of that?",
  tag: "ignores_the_key",
  tag2: "drops_the_half",
  rounds: [
    { say: "Use the key. Key in how many.", q: "Each 🎟️ stands for 2 tickets. Leo has 🎟️🎟️🎟️🎟️. How many tickets?", ans: 8, trap: 4, why: "There are 4 pictures, and each one stands for 2 tickets.", win: "4 twos is 8 tickets." },
    { say: "Watch for the half picture.", q: "Each 🎟️ stands for 10 tickets. Mia has 3 and a half 🎟️. How many tickets?", ans: 35, trap: 4, trap2: 30, why: "Each picture is 10 tickets, not 1.", why2: "The half picture counts too. Half of 10 is 5.", win: "30 and 5 more is 35 tickets." },
    { say: "Read the key by yourself.", alt: [{ q: "Each ⭐ stands for 4 books. Sam has 2 and a half ⭐. How many books?", ans: 10, trap: 3, trap2: 8 }, { q: "Each 🍎 stands for 6 apples. Zoe has 4 and a half 🍎. How many apples?", ans: 27, trap: 5, trap2: 24 }] },
  ],
}));
