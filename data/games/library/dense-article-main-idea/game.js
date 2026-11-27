// Dense Article Main Idea. Skill RI.4.10-1.
// Reading and comprehending informational texts in the grades 4-5 complexity band. Avoiding dense nonfiction is the known slip.
Sidekick.game(Sidekick.play({
  title: "Dense Article Main Idea",
  emoji: "🧠",
  premise: "Some articles pack a lot into each sentence. Slow down, then say the main idea in your own words.",
  outro: "In dense nonfiction, find the one idea all the facts support.",
  scene: "night",
  kind: "pick",
  hint: "What single point do all the facts add up to?",
  tag: "avoids_dense_text",
  rounds: [
    { say: "Read the article. Tap its main idea.", read: "Lightning is five times hotter than the surface of the sun. It heats the air so fast that the air explodes outward, and we hear that as thunder. Because light travels faster than sound, we see the flash first.", yes: "Lightning causes thunder, and we see it before we hear it.|", no: "Lightning is very hot.|The sun is hot.|Sound travels through air.", trap: "Lightning is very hot.", why: "That is the first fact only. What do all three sentences explain?", win: "Lightning, thunder, and why the flash comes first." },
    { say: "Read this article. Tap its main idea.", read: "Your heart beats about 100,000 times a day. Each beat pushes blood through 60,000 miles of vessels. That blood carries oxygen to every cell and carries waste away.", yes: "The heart pumps blood that supplies and cleans the whole body.|", no: "The heart beats 100,000 times a day.|Blood is red.|Cells are small.", trap: "The heart beats 100,000 times a day.", why: "That is one fact. What job do all the facts describe?", win: "The heart supplies the whole body." },
    { say: "Tap the main idea by yourself.", read: "Glaciers are rivers of ice that move a few inches a day. As they slide, they scrape valleys wider and carry boulders for miles. Much of the land we see was shaped by ice.", yes: "Slow-moving glaciers have shaped much of the land.|", no: "Glaciers move a few inches a day.|Ice is cold.|Boulders are heavy.|Valleys are wide.|Rivers flow.", trap: "Glaciers move a few inches a day." },
  ],
}));
