// Count Every Payment. Skill A-SSE.B.4-2.
// Using the geometric series formula to solve problems. Using one term too few or too many is the known slip.
Sidekick.game(Sidekick.play({
  title: "Count Every Payment",
  emoji: "🏦",
  premise: "Savings that grow by the same factor each time form a geometric series. The total depends on exactly how many terms there are.",
  outro: "Before using the formula, count the terms carefully: the first payment is term 1.",
  scene: "city",
  kind: "type",
  icon: "🏦",
  hint: "List the terms and count them. Day 1 is the first term.",
  tag: "miscounts_terms",
  rounds: [
    { say: "You save 1 dollar on day 1 and double it each day. Key in the total after 6 days.", q: "1 + 2 + 4 + 8 + 16 + 32 = 2^6 − 1", ans: 63, trap: 31, why: "31 is only 5 days. Six days means six terms.", win: "2^6 − 1 = 63 dollars." },
    { say: "You save 100 dollars in month 1 and 10% more each month. Key in the total after 3 months.", q: "100 + 110 + 121", ans: 331, trap: 210, why: "That is 2 months. Month 3 adds 121.", win: "100 + 110 + 121 = 331 dollars." },
    { say: "Find the total by yourself.", alt: [{ q: "Save 2 dollars in week 1 and triple it each week. Total after 4 weeks?", ans: 80, trap: 26 }, { q: "Save 5 dollars on day 1 and double it each day. Total after 5 days?", ans: 155, trap: 75 }, { q: "Save 1 dollar on day 1 and double it each day. Total after 8 days?", ans: 255, trap: 127 }] },
  ],
}));
