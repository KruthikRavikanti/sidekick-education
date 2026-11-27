// Quote and Explain. Skill RI.5.1-1.
// Quoting accurately from a text when explaining and inferring. Quoting without explaining is the known slip.
Sidekick.game(Sidekick.play({
  title: "Quote and Explain",
  emoji: "🏜️",
  premise: "A quote alone is not enough. After you quote the text, explain what it shows.",
  outro: "Quote accurately, then explain how the quote answers the question.",
  scene: "sand",
  kind: "fill",
  cast: "",
  hint: "First the exact words. Then say what they prove.",
  tag: "quotes_without_explaining",
  rounds: [
    { say: "What caused the drought? Pick the quote, then the explanation.", read: "Rain did not fall for three years. Farmers had also drained the wetlands that once held water through dry seasons.", rows: [["Quote", "\"Rain did not fall for three years.\""], ["Explanation", "This shows lack of rain was a cause."]], extra: "Droughts are bad.|", trap: [1, "Droughts are bad."], why: "That is an opinion. An explanation says what the quote shows.", win: "A quote, then what it proves." },
    { say: "Why did the city build a subway? Pick the quote, then the explanation.", read: "By 1900, streets were so jammed that a trip of two miles took an hour.", rows: [["Quote", "\"a trip of two miles took an hour\""], ["Explanation", "This shows traffic was the reason."]], extra: "Subways are underground.|", trap: [1, "Subways are underground."], why: "That is a fact about subways, not what the quote shows.", win: "Evidence, explained." },
    { say: "Why are coral reefs dying? Match by yourself.", read: "Warmer water causes coral to push out the tiny algae it needs to live.", rows: [["Quote", "\"Warmer water causes coral to push out the tiny algae\""], ["Explanation", "This shows heat is the cause."]], extra: "Coral is colorful.|Reefs are big.", trap: [1, "Coral is colorful."] },
  ],
}));
