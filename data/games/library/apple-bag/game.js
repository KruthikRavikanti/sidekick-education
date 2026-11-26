// Apple Bag. Skill K.OA.A.2-2.
// Put-together problems with the total unknown: two groups are shown and the child keys in the total. Answering with one of the two given numbers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Apple Bag",
  emoji: "🛍️",
  premise: "Red apples and green apples go into one bag. Key in how many apples are in the bag in all.",
  outro: "To find how many in all, put both groups together.",
  scene: "kitchen",
  kind: "type",
  icon: "🧺",
  hint: "Count every apple, red and green together.",
  tag: "answers_with_a_given_number",
  rounds: [
    { say: "How many apples are in the bag in all?", pic: "🍎🍎 🍏🍏🍏", q: "2 red and 3 green", ans: 5, trap: 3, why: "That is only the green ones. Count every apple.", win: "2 and 3 make 5 apples." },
    { say: "How many apples in all this time?", pic: "🍎🍎🍎🍎 🍏🍏", q: "4 red and 2 green", ans: 6, trap: 4, why: "That is only the red ones. Count the green ones too.", win: "4 and 2 make 6 apples." },
    { say: "Key in how many apples in all.", alt: [{ pic: "🍎🍎 🍏🍏🍏🍏🍏", q: "2 red and 5 green", ans: 7, trap: 5, trap2: 2 }, { pic: "🍎🍎🍎 🍏🍏🍏🍏🍏", q: "3 red and 5 green", ans: 8, trap: 5, trap2: 3 }, { pic: "🍎🍎🍎🍎 🍏🍏🍏🍏🍏", q: "4 red and 5 green", ans: 9, trap: 5, trap2: 4 }] },
  ],
}));
