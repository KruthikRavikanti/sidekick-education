// Open and Unfold. Skill W.5.3-1.
// Orienting the reader by establishing a situation and introducing a narrator or characters; organizing an event sequence that unfolds naturally. A confusing start is the known slip.
Sidekick.game(Sidekick.play({
  title: "Open and Unfold",
  emoji: "🚪",
  premise: "A story opening orients the reader, then events unfold in an order that feels natural.",
  outro: "Establish the situation and characters first, then let events unfold naturally.",
  scene: "night",
  kind: "row",
  hint: "What must the reader know first for the rest to make sense?",
  tag: "confusing_start",
  rounds: [
    { say: "Put the opening of this story in order.", seq: "Nadia had never slept away from home.|Tonight she was at camp, in a creaky bunk.|A scratching sound came from under the floor.|She reached for her flashlight.", trap: "A scratching sound came from under the floor.|Nadia had never slept away from home.|Tonight she was at camp, in a creaky bunk.|She reached for her flashlight.", why: "We need to know who and where before the sound means anything.", win: "Who, where, trouble, response." },
    { say: "Put this opening in order.", seq: "Old Mr. Abe ran the last bookshop in town.|Business had been slow for months.|One morning a stranger left a locked box on the counter.|Mr. Abe turned it over, looking for a key.", trap: "One morning a stranger left a locked box on the counter.|Old Mr. Abe ran the last bookshop in town.|Business had been slow for months.|Mr. Abe turned it over, looking for a key.", why: "Set up the character and situation before the surprise arrives.", win: "A natural sequence." },
    { say: "Put this opening in order by yourself.", seq: "The twins shared everything, even a bike.|This summer, each wanted it for a race.|On race morning, the bike was gone.|They eyed each other with suspicion.", trap: "On race morning, the bike was gone.|The twins shared everything, even a bike.|This summer, each wanted it for a race.|They eyed each other with suspicion." },
  ],
}));
