// Formal or Informal Moment?. Skill L.4.3-3.
// Differentiating between contexts that call for formal English and situations where informal discourse is appropriate. Using informal language in reports is the known slip.
Sidekick.game(Sidekick.play({
  title: "Formal or Informal Moment?",
  emoji: "🎤",
  premise: "Some moments call for formal English, like a presentation. Others, like chatting in a small group, can be casual.",
  outro: "Use formal English to present ideas. Informal English fits casual talk.",
  scene: "city",
  kind: "sort",
  hint: "Who is the audience, and what is the occasion?",
  tag: "informal_in_reports",
  rounds: [
    { say: "Which kind of English fits each situation?", bins: "Formal|Informal", items: ["giving a class presentation|writing a report", "texting a friend|joking at lunch"], trap: ["writing a report", 1], why: "A report is read by a teacher and others. It calls for formal English.", win: "The occasion decides." },
    { say: "Which sentence fits where?", bins: "A science report|A chat with a friend", items: ["The results show that plants need light.|Our experiment lasted two weeks.", "The plant thing totally worked!|It was kinda cool, I guess."], trap: ["The plant thing totally worked!", 0], why: "Totally and thing are chat words.", win: "Formal for the report, casual for the chat." },
    { say: "Sort these by yourself.", bins: "Formal|Informal", items: ["a letter to the mayor|a speech at an assembly", "a note to your cousin|a group chat about a game"], trap: ["a speech at an assembly", 1] },
  ],
}));
