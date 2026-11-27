// Two Ideas From a Dense Text. Skill RI.5.10-1.
// Reading and comprehending informational texts at the high end of the grades 4-5 band independently. Avoiding dense texts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Ideas From a Dense Text",
  emoji: "🧬",
  premise: "Dense texts reward slow reading. Read on your own, then name the two big ideas.",
  outro: "Reading complex nonfiction on your own means finding its main ideas without help.",
  scene: "desk",
  kind: "pick",
  hint: "Which two statements are the big points the details support?",
  tag: "avoids_dense_texts",
  rounds: [
    { say: "Read the article. Tap its two main ideas.", read: "DNA is a long molecule found in nearly every cell. It carries the instructions for building a living thing. Half of a child’s DNA comes from the mother and half from the father, which is why children resemble both.", yes: "DNA holds the instructions for life.|DNA is passed down through families.", no: "DNA is long.|Children can share a hair color.", trap: "DNA is long.", why: "That is a small detail.", win: "What DNA does, and how it is passed on." },
    { say: "Read this article. Tap its two main ideas.", read: "Glaciers store most of Earth’s fresh water as ice. As temperatures rise, they are melting faster than they form. The meltwater raises sea levels and threatens coastal cities.", yes: "Glaciers are melting as Earth warms.|The melting raises seas and endangers coasts.", no: "Ice is frozen water.|Cities are near water.", trap: "Ice is frozen water.", why: "That is background, not a main idea.", win: "A cause, and its effect." },
    { say: "Tap the two main ideas by yourself.", read: "Ancient Egyptians built pyramids as tombs for their kings. Moving the huge stones took thousands of workers and clever engineering. The pyramids show both their beliefs about death and their building skill.", yes: "Pyramids were tombs that reflect Egyptian beliefs.|Building them took great skill and labor.", no: "Stones are heavy.|Egypt has kings.|Workers were many.", trap: "Stones are heavy." },
  ],
}));
