// Narrow It, Then Dig. Skill W.11-12.7-1.
// Conducting sustained research projects to answer a question or solve a problem, narrowing or broadening the inquiry when appropriate. Using one source is the known slip.
Sidekick.game(Sidekick.play({
  title: "Narrow It, Then Dig",
  emoji: "⛏️",
  premise: "Sustained research starts with a question you can actually answer. Too broad and you drown. Too narrow and there is nothing to find.",
  outro: "Conduct sustained research: narrow or broaden the inquiry as needed and synthesize multiple sources.",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Could you answer it with evidence in a few weeks?",
  tag: "uses_one_source",
  rounds: [
    { say: "Researchable question, or too broad?", bins: "Researchable|Too broad", items: ["How did later start times affect attendance in our district?|Did the 2019 bike lanes reduce crashes on Main Street?", "What is education?|How does transportation work?"], trap: ["What is education?", 0], why: "Whole libraries address that. Narrow it to one place, time and effect.", win: "One place, one time, one effect." },
    { say: "A student researches a town’s water quality. Match each step.", kind: "fill", fs: 4.4, cast: "", rows: [["narrow", "focus on lead levels since 2015"], ["gather", "state tests, a news series, an engineer’s interview"], ["synthesize", "show where the three sources agree"]], trap: [2, "focus on lead levels since 2015"], why: "That is narrowing the question. Synthesis combines what the sources show.", win: "Narrow, gather, combine." },
    { say: "Sort these questions by yourself.", bins: "Researchable|Too broad", items: ["Has the new bus route cut commute times for east-side workers?|Which local stores closed after the mall opened in 2010?", "Why do people do things?|What is the economy?"], trap: ["What is the economy?", 0] },
  ],
}));
