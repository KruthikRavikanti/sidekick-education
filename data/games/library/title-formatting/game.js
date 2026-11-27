// Title Formatting. Skill L.5.2-4.
// Using underlining, quotation marks or italics to indicate titles of works. Formatting titles incorrectly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Title Formatting",
  emoji: "📕",
  premise: "Long works like books and movies are underlined or put in italics. Short works like poems and songs go in quotation marks.",
  outro: "Underline or italicize titles of long works. Use quotation marks for short works.",
  scene: "paper",
  kind: "sort",
  hint: "Is it a whole long work, or a short piece inside something bigger?",
  tag: "formats_titles_incorrectly",
  rounds: [
    { say: "How should each title be shown?", bins: "Underline or italics|Quotation marks", items: ["a book|a movie", "a poem|a song"], trap: ["a poem", 0], why: "A poem is a short work. It takes quotation marks.", win: "Long works and short works." },
    { say: "Sort these titles.", bins: "Underline or italics|Quotation marks", items: ["a newspaper|a magazine", "a short story|an article in a magazine"], trap: ["an article in a magazine", 0], why: "An article is a short piece inside the magazine.", win: "The whole, and the part." },
    { say: "Sort these by yourself.", bins: "Underline or italics|Quotation marks", items: ["a novel|a play|a TV series", "a chapter title|one episode"], trap: ["one episode", 0] },
  ],
}));
