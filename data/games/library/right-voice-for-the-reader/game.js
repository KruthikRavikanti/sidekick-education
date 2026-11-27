// Right Voice for the Reader. Skill W.11-12.4-1.
// Producing clear and coherent writing appropriate to task, purpose and audience. Ignoring the audience is the known slip.
Sidekick.game(Sidekick.play({
  title: "Right Voice for the Reader",
  emoji: "🎙️",
  premise: "A scholarship committee and a lab instructor want different things from you. Skilled writers switch voice to fit.",
  outro: "Produce writing in which development, organization and style suit the task, purpose and audience.",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Who is reading, and what are they looking for?",
  tag: "ignores_audience",
  rounds: [
    { say: "Which piece does each sentence belong in?", bins: "Scholarship essay|Lab report", items: ["Translating for my mother at the clinic taught me to listen.|I want to study nursing because of those afternoons.", "The sample was heated to 80 degrees for ten minutes.|Results are shown in Table 2."], trap: ["The sample was heated to 80 degrees for ten minutes.", 0], why: "That is a record of a procedure. A committee wants to know who you are.", win: "Personal purpose, or precise record." },
    { say: "Match each task to what its reader needs.", kind: "fill", fs: 4.4, cast: "", rows: [["résumé", "skills and results at a glance"], ["op-ed", "a clear stance and vivid reasons"], ["research paper", "evidence, sources and careful limits"]], trap: [0, "a clear stance and vivid reasons"], why: "An employer scans a résumé for skills and results, not opinions.", win: "Give each reader what they came for." },
    { say: "Sort these by yourself.", bins: "Email to a professor|Text to a friend", items: ["Dear Dr. Osei, I am writing to request an extension.|Thank you for considering this.", "cant make it, cover for me?|lol ok see u at 6"], trap: ["cant make it, cover for me?", 0] },
  ],
}));
