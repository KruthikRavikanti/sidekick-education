import {
  AlertCircle,
  ArrowDownToLine,
  Check,
  ChevronDown,
  FileText,
  RotateCcw,
} from "lucide-react";
import type {
  Extraction,
  Problem,
  SharedContext,
  TextField,
} from "@/lib/extraction";

function Transcription({
  value,
  fallback = "Unreadable text",
}: {
  value: TextField;
  fallback?: string;
}) {
  return (
    <span className="transcription">
      {value.text ?? <span className="unreadable">{fallback}</span>}
      {value.uncertain && (
        <span className="uncertainty">
          <AlertCircle size={12} aria-hidden="true" /> Partly unreadable
        </span>
      )}
    </span>
  );
}

function ContextCard({ context }: { context: SharedContext }) {
  return (
    <details className="context-card" id={`context-${context.id}`} open>
      <summary>
        <span>
          <FileText size={17} aria-hidden="true" />
          {context.title.text !== null || context.title.uncertain ? (
            <Transcription
              value={context.title}
              fallback={`Shared ${context.type}`}
            />
          ) : (
            `Shared ${context.type}`
          )}
        </span>
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      <div className="context-content">
        <Transcription value={context.content} />
      </div>
    </details>
  );
}

function ProblemCard({
  problem,
  index,
  contexts,
}: {
  problem: Problem;
  index: number;
  contexts: SharedContext[];
}) {
  const work = problem.student_work;
  const statusLabel = {
    answered: "Answered",
    blank: "Blank response",
    unclear: "Unclear response",
  }[work.status];
  return (
    <article
      className="problem-card"
      aria-label={`Problem ${problem.label.text ?? index + 1}`}
    >
      <div className="problem-heading">
        <h3>
          <span className="problem-number">{index + 1}</span>Problem{" "}
          <Transcription
            value={problem.label}
            fallback={`${index + 1} · label unreadable`}
          />
        </h3>
        <span className={`status status-${work.status}`}>
          {work.status === "answered" && <Check size={13} aria-hidden="true" />}
          {statusLabel}
        </span>
      </div>
      <div className="problem-question">
        <Transcription value={problem.question} />
      </div>
      {problem.context_refs.length > 0 && (
        <div className="context-refs">
          {problem.context_refs.map((ref) => {
            const context = contexts.find((item) => item.id === ref);
            return (
              <a key={ref} href={`#context-${ref}`}>
                See {context?.title.text || "shared context"} ↗
              </a>
            );
          })}
        </div>
      )}
      {problem.answer_choices.length > 0 && (
        <ul className="answer-choices" aria-label="Answer choices">
          {problem.answer_choices.map((choice, i) => (
            <li key={i}>
              <strong>
                <Transcription value={choice.label} fallback="?" />
              </strong>
              <Transcription value={choice.text} />
            </li>
          ))}
        </ul>
      )}
      <div className="student-work">
        <p className="eyebrow">YOUR WORK</p>
        {work.steps.length > 0 && (
          <ol className="work-steps" aria-label="Written steps in order">
            {work.steps.map((step, i) => (
              <li key={i}>
                <Transcription value={step} />
              </li>
            ))}
          </ol>
        )}
        {work.status === "blank" ? (
          <p className="blank-note">No written response visible.</p>
        ) : (
          <>
            {(work.final_answer.text !== null ||
              work.final_answer.uncertain) && (
              <p className="answer-line">
                <span>Written answer</span>
                <strong>
                  <Transcription value={work.final_answer} />
                </strong>
              </p>
            )}
            {(work.selected_choice.text !== null ||
              work.selected_choice.uncertain) && (
              <p className="answer-line">
                <span>Selected choice</span>
                <strong>
                  <Transcription value={work.selected_choice} />
                </strong>
              </p>
            )}
            {work.status === "unclear" && (
              <p className="unclear-note">
                <AlertCircle size={16} aria-hidden="true" />
                Some writing couldn’t be read. Legible text is kept above.
              </p>
            )}
            {work.status === "answered" &&
              work.steps.length === 0 &&
              work.final_answer.text === null &&
              work.selected_choice.text === null && (
                <p className="blank-note">
                  A response is visible, but its text couldn’t be read.
                </p>
              )}
          </>
        )}
      </div>
    </article>
  );
}

function downloadJSON(result: Extraction) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(result, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "sidekick-worksheet.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ExtractionResults({
  result,
  onReset,
}: {
  result: Extraction;
  onReset: () => void;
}) {
  const worksheet = result.worksheet;
  const subject = { math: "Math", ela: "ELA", unknown: "Subject unknown" }[
    worksheet.subject
  ];
  const unclear = result.problems.filter(
    (p) => p.student_work.status === "unclear",
  ).length;
  return (
    <div className="results">
      <div className="results-intro">
        <div className="success-icon">
          <Check size={24} aria-hidden="true" />
        </div>
        <p className="eyebrow">ONE PAGE, A LITTLE CLEARER</p>
        <h1 tabIndex={-1} id="results-title">
          Here’s your worksheet.
        </h1>
        <p>Questions and your work, just as they appear on the page.</p>
      </div>
      {result.source === "fixture" && (
        <p className="demo-notice">
          Sample results · This is a pre-written extraction of the sample
          worksheet.
        </p>
      )}
      <section className="worksheet-summary" aria-label="Worksheet details">
        <div className="worksheet-tags">
          <span className="subject-tag">
            {subject}
            {worksheet.subject_uncertain
              ? " · uncertain"
              : worksheet.subject !== "unknown"
                ? " · detected"
                : ""}
          </span>
          {(worksheet.printed_grade.text !== null ||
            worksheet.printed_grade.uncertain) && (
            <span className="grade-tag">
              <Transcription
                value={worksheet.printed_grade}
                fallback="Grade unreadable"
              />
            </span>
          )}
        </div>
        <h2>
          <Transcription
            value={worksheet.title}
            fallback="Untitled worksheet"
          />
        </h2>
        <p className="problem-count">
          {result.problems.length} problems
          {unclear > 0 && ` · ${unclear} with unclear writing`}
        </p>
        {worksheet.directions.length > 0 && (
          <div className="directions">
            <p className="eyebrow">DIRECTIONS</p>
            {worksheet.directions.map((d, i) => (
              <p key={i}>
                <Transcription value={d} />
              </p>
            ))}
          </div>
        )}
      </section>
      {worksheet.shared_context.map((context) => (
        <ContextCard key={context.id} context={context} />
      ))}
      <div className="problem-list">
        {result.problems.map((problem, i) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            index={i}
            contexts={worksheet.shared_context}
          />
        ))}
      </div>
      <p className="results-footnote">
        Sidekick transcribes your work. Answers haven’t been checked or
        corrected.
      </p>
      <div className="results-actions">
        <button className="button primary" onClick={onReset}>
          <RotateCcw size={18} aria-hidden="true" />
          Read another worksheet
        </button>
        <button className="text-button" onClick={() => downloadJSON(result)}>
          <ArrowDownToLine size={17} aria-hidden="true" />
          Download JSON
        </button>
      </div>
    </div>
  );
}
