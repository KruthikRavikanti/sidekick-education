# Sidekick

Sidekick is a local K–5 family prototype built with Next.js/TypeScript, FastAPI/Pydantic, and SQLite. Parents create profiles, unlock a PIN-protected dashboard, and review worksheet evidence. Children upload a photo or PDF and review the verbatim extraction. Skill-building activities are a future milestone; the standalone Practice section and diagnostic quizzes have been removed. The existing [Sidekick design kit](https://preview--sidekick-colorway-studio.lovable.app/?__lovable_receipt=mat_6nx4bc71428r69zqdx974t1cnk), colors, components, and locally hosted fonts are retained.

The gap engine extends the parent-account implementation. Its branch, `feature/gap-engine`, is stacked on `feature/parent-accounts-dashboard` ([PR #1](https://github.com/KruthikRavikanti/sidekick-education/pull/1)); review the gap changes against that parent branch while it remains unmerged.

## Local setup

Requires Node.js 20.9+ and Python 3.11+.

```sh
npm ci
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements.txt
cp -n .env.example .env.local
cp -n backend/.env.example backend/.env
npm run db:migrate
npm run catalog:seed
npm run dev:all
```

Open **http://localhost:3000** after the launcher prints that Sidekick is ready. Keep the terminal open; Ctrl+C stops both servers. The launcher checks ports 3000/8000 and dependencies without switching ports. `npm run dev` starts only Next.js. To start FastAPI separately:

```sh
backend/.venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port 8000 --no-access-log
```

Retain existing credentials when pulling updates. Add new settings from `backend/.env.example` instead of overwriting `backend/.env`. FastAPI reads that file; Next.js uses `.env.local` only for its server-side `BACKEND_URL` proxy. Restart servers after changing configuration. Never put credentials in `NEXT_PUBLIC_*` variables.

Set **`VISION_API_KEY`** and **`VISION_MODEL`** in `backend/.env` to enable live extraction, skill mapping, supported language grading, and error-pattern observations through the shared adapter. The provider must support image input and strict JSON Schema on an OpenAI-compatible `/chat/completions` endpoint. `VISION_BASE_URL` defaults to `https://api.openai.com/v1`; `VISION_TIMEOUT_SECONDS` defaults to 60 (1–180). HTTPS is required except on loopback. No provider/model is silently selected.

For an offline extraction walkthrough:

```sh
APP_ENV=development PASSWORD_POLICY=dev COOKIE_SECURE=false npm run db:seed
npm run dev:demo
```

The optional seed creates `parent@example.com` / `password`, Alex (grade 3), and Maya (grade 1). The PIN starts unset; repeated seeding preserves existing credentials and profiles. Sign in, choose Parent, verify the account password to set a 4–6 digit PIN, and unlock the dashboard. Switch profile to choose a child and open Homework.

Demo mode accepts only the two exact images under `public/samples/` and labels extraction `source: "fixture"`. It creates no fabricated learning evidence. Automated tests inject explicit model stubs when testing homework analysis.

## Migrations and catalog seeding

Run these after pulling migrations or catalog/compiler changes:

```sh
npm run db:migrate
npm run catalog:seed
# Optional: save the import report, or import a reviewed catalog revision.
npm run catalog:seed -- --report /tmp/sidekick-catalog-report.json
npm run catalog:seed -- --path /path/to/reviewed-catalog.json
```

Migrations `001`–`004` add accounts, the catalog, learning records, and private homework storage. Migration `005` retires the former check/practice workflow, archives its skill-state snapshot privately, and closes pending assignments, sessions, and chains without deleting historical attempts or evidence. Already-applied migrations are skipped. `DATABASE_URL` defaults to `sqlite:///backend/data/sidekick.db`; relative SQLite paths resolve from the repository root. Back up the database and private uploads together before moving this local prototype.

`data/sidekick_skill_map_v2.json` is the supplied, unchanged draft. Its SHA-256 is `7c7b3a98cdf51bb48b53bcef4c4d5e2c0015fc0845e40f6345a4962eeab1be23`. It contains **779 skills, 1,533 subskills, and 3,066 populated seed pairs**: 867 Math, 666 Reading/ELA, and 795 K–5 subskills. K–8 grades have explicit ordering; high-school math courses and ELA bands retain their separate string labels. Profiles remain K–5.

The importer validates before a transaction, upserts stable IDs, preserves every raw source field, and derives subskill order from the numeric suffix. Seed slots have stable logical IDs (`subskill:p1` / `subskill:p2`) and immutable content versions. Reseeding replaces current relationships and retires removed records; attempts and assignment references keep their exact historical item versions. Repeating an unchanged import does not duplicate items.

The checked-in [import report](data/catalog_import_report.json) records all counts and 37 graph warnings: 28 Low-confidence roots, five upward prerequisite directions, and four cycle edges across root/skill graphs. This includes the High-confidence `A-SSE.B.3-1` ↔ `A-REI.B.4-3` cycle and Algebra 1 → Algebra 2 links. Raw links remain stored and unsafe links are marked unusable. The current homework flow does not initiate prerequisite traversal or checks.

The retained catalog compiler records **101 ready, verified item specifications**, **1,941 adult-required specifications**, and **1,024 missing-context specifications**. All 3,066 seed pairs and their immutable versions remain available as curriculum data for future activity development. The current app does not serve these as quizzes or standalone practice. Missing passages, choices, plots, and dependencies are not invented.

## Homework observations and future activities

Upload a JPG, PNG, WebP, or bounded PDF from the active child's Homework area. Parents may also upload from the dashboard with a selected child. Preview, tap **Read worksheet**, and review problems in page order. Extraction preserves written mistakes, step order, fractions, shared context, and field-level uncertainty. Blank and unreadable responses remain distinct. Grading and mapping are separate stages; unsupported, blank, ambiguous, or unreadable work stays ungraded and cannot create incorrect skill evidence.

Candidate retrieval uses the same subject and grades up to one above the child's grade, with at most ten candidates. High-school labels stay outside the K–5 retrieval window. Mapping below 0.6 abstains. A confidently mapped incorrect answer can separately receive a visible-work error-pattern observation. Teacher marks are observations; conflicts with grading are flagged for review. Scores are initial routing estimates, not calibrated assessment probabilities.

Persistent uploads checkpoint extraction, grading, mapping, signatures, and evidence. Request keys, child-scoped file hashes, and problem fingerprints suppress recognized retries and duplicates. A stopped process can resume through **Retry** after its processing lease expires; this prototype uses in-process background tasks rather than a durable job worker. Authorization is rechecked after provider work and before returning profile-scoped results.

The parent Skills view summarizes eligible homework evidence:

| Status | Meaning |
| --- | --- |
| `unassessed` | There is not enough reliable homework evidence to summarize the skill. |
| `on_track` | At least one eligible correct response supports progress, without repeated incorrect observations. |
| `needs_support` | Two distinct eligible incorrect homework responses show where support may help. This is a homework observation, not a confirmed diagnostic result. |

`backend/gap/config.json` contains the application timezone, mapping confidence threshold, and number of distinct incorrect homework responses needed for a support observation.

A repeated upload of the same question does not create a second observation. Ungraded or unmapped outcomes remain available for review without affecting skill states. The dashboard includes the source homework and any observed error pattern, parent explanation, and home tip. It does not initiate diagnostic checks, prerequisite quizzes, practice sessions, or scheduled rechecks. Homework alone does not award mastery.

Activities are the intended future way to help children improve these skills. Activity creation, delivery, and activity-based progress rules are **not implemented in this revision**. There is no replacement quiz hidden behind an Activities label. Existing catalog content, item versions, and historical learning records are retained for that future work.

The parent Analytics view currently shows **Questions read**, **Correct answers**, and **Not graded yet** from stored homework problems. Questions are deduplicated by child-scoped problem fingerprint. Each distinct question uses its first usable correct/incorrect grade in chronological order; if it has no usable grade, it stays ungraded. Mapping eligibility determines skill observations separately, so an unmapped but confidently graded problem can still count as a correct answer. Session counts, time spent, and practice totals are not presented as activity progress. Server timestamps are retained, along with the configured application timezone, **`America/New_York`**, for future activity work. Conversation history remains empty until a future chat milestone.

The former Practice URL redirects to the child's home. Authenticated calls to retired check/practice/adult-review endpoints return `410 feature_removed` after the existing mode, ownership, and CSRF checks. Old pending work is retired by migration; historical records are retained privately and cannot continue generating evidence through those endpoints.

## Privacy, storage, and configuration

Account sessions, parent PINs, ownership checks, sibling isolation, profile switching, CSRF, and route protection remain in force. State-changing API requests require an exact trusted `Origin` and a session-bound `X-CSRF-Token` obtained from `GET /api/auth/csrf`. Parent mode expires after 30 idle minutes; five wrong PINs lock the account gate for five minutes. Passwords and PINs use Argon2id. Keep `PASSWORD_POLICY=strict`, HTTPS, and secure cookies before a pilot; local development explicitly uses `APP_ENV=development`, `PASSWORD_POLICY=dev`, `COOKIE_SECURE=false`, and `TRUSTED_ORIGINS=http://localhost:3000`.

Original uploads and rendered pages are retained privately under the database directory's `uploads/` by default (`backend/data/uploads/`). Opaque filenames, mode 0600 files, and a mode 0700 directory are used. This location is Git-ignored and outside public assets. Override `SIDEKICK_PRIVATE_UPLOAD_DIR` only with another private, ignored directory, preferably outside the repository. Files are retrieved through authorized routes, never public URLs.

Parent deletion removes an upload's original/pages, problems, and linked homework evidence, then recomputes affected states. Historical diagnostic/practice records are retained privately; the retired workflow cannot resume them. Deleting a child cascades its learning records and cleans its private files. There is no automatic retention deadline; parents delete retained uploads explicitly. Backups need the same privacy controls.

Before model image calls, EXIF metadata is stripped and the top 6% of each page is masked by default. Known names/account identifiers and obvious email addresses are redacted from text model payloads. **This is not complete image de-identification:** names elsewhere in an image can reach the configured provider, and masking can hide a title or question. Model prompts treat worksheet/catalog content as data. Private audits store internal references, task/model/prompt/catalog versions, outcome/confidence, and short redacted explanations. Ordinary errors/logs exclude worksheet content, provider bodies, credentials, and filenames.

| Backend setting | Default | Supported range / effect |
| --- | --- | --- |
| `SIDEKICK_PRIVATE_UPLOAD_DIR` | Database sibling `uploads/` | Private storage, outside `public/` |
| `SIDEKICK_MAX_UPLOAD_MB` | `10` | 1–30 MiB for the learning upload API |
| `SIDEKICK_MAX_PDF_PAGES` | `6` | 1–12 pages |
| `SIDEKICK_MAX_PAGE_PIXELS` | `24000000` | 4,096–24,000,000 rendered pixels/page |
| `SIDEKICK_MAX_TOTAL_PIXELS` | `72000000` | 4,096–144,000,000 rendered pixels/PDF |
| `SIDEKICK_PDF_TIMEOUT_SECONDS` | `20` | 2–60 seconds, isolated renderer CPU/wall deadline |
| `SIDEKICK_PDF_MEMORY_MB` | `1024` | 256–2,048 MiB process memory ceiling where supported |
| `SIDEKICK_HEADER_REDACTION_FRACTION` | `0.06` | 0–0.2 of page height; zero disables masking |

The PDF renderer rejects encrypted/invalid/oversized files and caps rendered output at 128 MiB. Photos also pass the reader's JPEG/PNG/WebP integrity, single-frame, minimum 64-pixel dimension, and 24-megapixel checks. Both upload APIs use the configured size bound. Limits apply before provider calls. The renderer is a bounded local process, not a hardened isolation service.

## API and extraction contract

`POST /api/extract` retains the authenticated multipart `file` extraction response: `worksheet`, `problems`, and `source`. [Pydantic models](backend/models.py), [JSON Schema](backend/schema.json), [TypeScript types](lib/extraction.ts), and [fixtures](fixtures/README.md) document the contract. Every transcribed field is `{ "text": "legible text or null", "uncertain": false }`; partial text is retained with `uncertain: true`. Completely unreadable final/selected answers normalize answered status to unclear. Extraction never replaces a student's incorrect work with a solution.

The learning API adds:

| Route under `/api/learning` | Purpose |
| --- | --- |
| `POST /kid/uploads` | Store/process active child's multipart `file`; optional `Idempotency-Key` |
| `GET /kid/uploads`, `GET /kid/uploads/{id}` | Resume list and processing/extraction results |
| `POST /kid/uploads/{id}/retry`, `GET /kid/uploads/{id}/file` | Resume processing or authorized original retrieval |
| `/parent/{kidId}/uploads` and `/{id}` variants | Equivalent explicitly selected-child parent operations; `DELETE .../{id}` deletes |
| `GET /parent/{kidId}/dashboard` | Homework-based skill observations and analytics |
| Former `/kid/next`, `/kid/submit`, `/kid/session/{id}/activity`, and parent adult/extra-practice routes | Retired; authorized requests return `410 feature_removed` |

Kid responses contain extraction; detailed mapping, grading, signatures, and learning states belong to authorized parent routes. API errors retain `{ "error": { "code": "...", "message": "..." } }`, use safe messages, and responses are `Cache-Control: no-store`.

## Verification and evaluation

```sh
npm run test:backend
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
npm run gap:evaluate
# Explicit provider calls using the same retrieval/grading/mapping/signature pipeline:
npm run gap:evaluate:live
# Include synthetic case IDs and expected/actual decisions, without worksheet text:
npm run gap:evaluate:live -- --details
```

Stop servers on ports 3000/8000 before Playwright; its configuration starts isolated servers. Unit/integration tests stub model calls and use temporary databases. Coverage includes authentication/PIN/CSRF, extraction preservation, invalid images/PDFs, provider failure and retry, child/account isolation and profile changes, catalog reseeding/history, distinct homework observations, retired-workflow enforcement, historical-data preservation, and real dashboard data. Browser journeys verify that the old Practice URL redirects, retired APIs cannot start questions, and private homework upload/retrieval/deletion still works.

`data/evaluation_homework.json` contains 27 synthetic Math/ELA examples with expected mapping or abstention, correctness, and signature labels, including mistakes/slips, equivalent fractions, blanks, unreadable responses, shared context, missing context, and ambiguous multi-skill work. The offline command validates cases and catalog IDs; it does **not** measure model accuracy. The live command creates a temporary database/catalog and reports mapping coverage, accuracy among accepted mappings, grading accuracy, eligible incorrect signature accuracy, and provider failures. Missing credentials exit with setup instructions. No real student data is used.

Verification for the removal revision passed **175 backend tests, 15 browser tests, TypeScript, and the production build**. Candidate retrieval finds the expected ID within ten candidates for all 22 labeled cases. The [live evaluation report](data/evaluation_report.json) records zero provider failures, 22/27 accepted mappings (all 22 correct), 27/27 grading matches, and 5/7 signature matches. The other five examples correctly abstained from mapping. The two signature disagreements concern an arithmetic slip and a reading-evidence pattern; these observations never override correctness.

This is an initial smoke evaluation: the 27 answer/status variants use only 12 unique question texts, with seven positive stems largely taken from the catalog. It measures decisions after transcription, not OCR accuracy or general classroom performance, and does not calibrate confidence scores. The historical [separate live smoke report](data/live_smoke_report.json) covers synthetic Math/ELA photos and the now-retired generation workflow: three addition items passed deterministic checking, independent solving, and alignment; three fraction items were aligned but correctly retained for adult adjudication. A follow-up Math photo retained the incorrect fraction after an initial exact-string comparison did not match; transcription can vary. Both subjects distinguished blank and unreadable responses. The generation results are retained as historical validation, not an active product feature. Broader transcription accuracy remains unmeasured. Missing contexts, unsupported interactions, unsafe source links, and lexical retrieval remain draft-data limitations.

Skill-building activities, games, tutoring chat, payments, email delivery/recovery, expanded grade profiles, and a visual redesign remain separate milestones.
