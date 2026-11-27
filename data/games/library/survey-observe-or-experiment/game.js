// Survey, Observe or Experiment. Skill S-IC.B.3-1.
// Recognizing the purposes of and differences among sample surveys, experiments and observational studies. Calling a survey an experiment is the known slip.
Sidekick.game(Sidekick.play({
  title: "Survey, Observe or Experiment",
  emoji: "🔬",
  premise: "A survey asks. An observational study watches. An experiment assigns a treatment and compares.",
  outro: "Survey: ask questions. Observational study: record what happens. Experiment: impose a treatment.",
  scene: "paper",
  kind: "sort",
  fs: 4.6,
  hint: "Did the researchers make anyone do something different? Only then is it an experiment.",
  tag: "survey_as_experiment",
  rounds: [
    { say: "Which kind of study is each one?", bins: "Survey|Observational|Experiment", items: ["400 voters answer a phone poll|", "Researchers record how many cars stop at a sign|", "50 people get a new drug and 50 get a placebo, chosen by coin flip|"], trap: ["400 voters answer a phone poll", 2], why: "Nobody was given a treatment. People were only asked.", win: "Ask, watch, or assign." },
    { say: "Sort these studies.", bins: "Survey|Observational|Experiment", items: ["Students fill in a form about sleep|", "A scientist tracks which birds visit a feeder|", "Half the plants, picked at random, get fertilizer|"], trap: ["Students fill in a form about sleep", 2], why: "A form asks questions. No one was assigned anything.", win: "Only the plants got a treatment." },
    { say: "Sort these by yourself.", bins: "Survey|Observational|Experiment", items: ["Shoppers rate a store from 1 to 5|", "Doctors compare records of smokers and non-smokers|", "Classes are randomly given one of two math apps|"], trap: ["Doctors compare records of smokers and non-smokers", 2] },
  ],
}));
