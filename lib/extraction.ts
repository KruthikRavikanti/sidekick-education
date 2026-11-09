export interface TextField {
  text: string | null;
  uncertain: boolean;
}

export interface SharedContext {
  id: string;
  type: "passage" | "table" | "diagram" | "other";
  title: TextField;
  content: TextField;
}

export interface Problem {
  id: string;
  label: TextField;
  question: TextField;
  answer_choices: { label: TextField; text: TextField }[];
  context_refs: string[];
  student_work: {
    steps: TextField[];
    final_answer: TextField;
    selected_choice: TextField;
    status: "answered" | "blank" | "unclear";
  };
}

export interface Extraction {
  worksheet: {
    title: TextField;
    subject: "math" | "ela" | "unknown";
    subject_uncertain: boolean;
    printed_grade: TextField;
    directions: TextField[];
    shared_context: SharedContext[];
  };
  problems: Problem[];
  source: "live" | "fixture";
}
