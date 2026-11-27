// Address Commas. Skill L.3.2-2.
// Using commas in addresses. Leaving out the commas is the known slip.
Sidekick.game(Sidekick.play({
  title: "Address Commas",
  emoji: "📬",
  premise: "In an address, a comma goes after the street and after the city.",
  outro: "Put a comma between the street and city, and between the city and state.",
  scene: "city",
  kind: "pick",
  fs: 5.4,
  hint: "A comma follows the street name and follows the city.",
  tag: "leaves_out_commas",
  rounds: [
    { say: "Tap the commas that belong in this address.", mark: ["12", ",", "Oak Street", "*,", "Atlanta", "*,", "GA"], trap: ",", why: "No comma goes between the house number and the street.", win: "12 Oak Street, Atlanta, GA." },
    { say: "Tap the commas that belong.", mark: ["She lives at", "40 Pine Road", "*,", "Denver", "*,", "Colorado", ",", "now."], trap: "-,", why: "A comma belongs after the street name too.", win: "Street, city, state." },
    { say: "Tap the commas that belong, by yourself.", alt: [{ mark: ["7", ",", "Elm Lane", "*,", "Boston", "*,", "MA"], trap: "," }, { mark: ["Send it to", "9 Lake Drive", "*,", "Austin", "*,", "Texas", ",", "today."], trap: "-," }] },
  ],
}));
