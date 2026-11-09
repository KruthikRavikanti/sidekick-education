# Sidekick

First working slice: a student takes or uploads one worksheet photo, previews it, taps **Read worksheet**, and sees the printed questions and their visible work in page order. This milestone ends at extraction. It does not grade, correct, or solve answers.

The interface uses Next.js and TypeScript; the API uses FastAPI and Pydantic. The empty starting workspace had no components to reuse, so the app reuses the original Sidekick kit’s logo vectors, palette, Fredoka headings, and Nunito body font. Fonts are served locally with their OFL licenses. Design reference: [Sidekick colorway studio](https://preview--sidekick-colorway-studio.lovable.app/?__lovable_receipt=mat_6nx4bc71428r69zqdx974t1cnk).

## Local setup

Requires Node.js 20.9+ and Python 3.11+.

```sh
npm ci
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements.txt
cp .env.example .env.local
cp backend/.env.example backend/.env
```

For an offline walkthrough, start both servers from the repository root with one command:

```sh
npm run dev:demo
```

Keep that terminal open while using Sidekick. Wait for **Sidekick is ready: http://localhost:3000**, then open that address. Ctrl+C stops both servers. The launcher checks dependencies and ports 3000/8000 and reports an actionable error if either server cannot start; it never silently switches ports. `npm run dev` remains available for starting only the Next.js interface when you already run FastAPI separately.

Open **http://localhost:3000**. Choose **Fractions** or **Reading**, inspect the photo, then tap **Read worksheet**. You can also upload the exact PNGs in `public/samples/`. Sample mode is visibly labeled, returns `source: "fixture"`, and accepts only those images by SHA-256. Arbitrary uploads never receive fabricated sample results. Camera controls use the phone’s file/camera picker; the browser decides which picker it presents. Camera access on a phone generally requires HTTPS or localhost.

## Live extraction configuration

Set these in `backend/.env`, then start both servers in live mode with `npm run dev:all`:

| Variable                 | Required  | Purpose                                                                                                                                          |
| ------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VISION_API_KEY`         | Live mode | Server-side provider credential.                                                                                                                 |
| `VISION_MODEL`           | Live mode | Vision-capable model ID supporting strict structured output. No model is silently selected.                                                      |
| `VISION_BASE_URL`        | Optional  | OpenAI-compatible API root; defaults to `https://api.openai.com/v1`. The adapter appends `/chat/completions`. HTTPS required except on loopback. |
| `VISION_TIMEOUT_SECONDS` | Optional  | Provider request timeout; defaults to `60` (range 1–180). The interface stops waiting after 90 seconds.                                          |
| `SIDEKICK_FIXTURE_MODE`  | Optional  | Defaults to `false`. Set `true` only for the explicitly labeled, deterministic sample walkthrough.                                               |
| `FRONTEND_ORIGIN`        | Optional  | Direct API CORS origin; defaults to `http://localhost:3000`. The normal interface uses a same-origin Next.js rewrite.                            |

When starting the interface separately, Next.js reads `BACKEND_URL` from `.env.local` (default `http://127.0.0.1:8000`) to forward `/api/*` to FastAPI. Restart Next.js after changing it. The combined launchers explicitly use the local API at `http://127.0.0.1:8000`. No provider credentials are sent to the browser.

```sh
npm run dev:all
```

The provider must accept `messages` with an `image_url` data URL and `response_format: {type: "json_schema", json_schema: {strict: true, ...}}`, following the official OpenAI documentation for [image inputs](https://developers.openai.com/api/docs/guides/images-vision) and [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=chat). The adapter validates the complete response with Pydantic and rejects refusals, truncated output, malformed JSON, invalid references, inconsistent statuses, and pages with no extractable problems. It does not fall back to unvalidated text or fixtures. A compatible provider and model are required; live compatibility has not been verified without credentials.

## API and extraction contract

`POST /api/extract` accepts one multipart field named `file`. JPG, PNG, and WebP only; maximum file size 10 MiB, minimum dimension 64 pixels, maximum 24 megapixels, single-frame images only. Both declared MIME and decoded content are checked. The complete request body is bounded before multipart parsing, including requests without a Content-Length header.

```sh
curl -sS http://127.0.0.1:8000/api/extract \
  -F 'file=@public/samples/math-worksheet.png;type=image/png'
```

The response includes `worksheet`, `problems`, and `source` (`live` or `fixture`). The authoritative models are in `backend/models.py`; the vision JSON Schema is checked in as `backend/schema.json`. Matching interface types are in `lib/extraction.ts`. Full examples are in `fixtures/math.json` and `fixtures/ela.json`.

- Every transcribed text field is `{ "text": "visible text or null", "uncertain": false }`. Actual missing values use JSON `null`, not the string `"null"`. Partial text is kept with `uncertain: true`; a fully unreadable field is `text: null, uncertain: true`. Absent optional printed fields are `text: null, uncertain: false`.
- `worksheet` contains title, inferred subject (`math`, `ela`, `unknown`), subject uncertainty, explicitly printed grade, directions, and shared context. Contexts have IDs and a type (`passage`, `table`, `diagram`, `other`); tables and diagram labels are transcribed into their text content.
- `problems` contains each printed problem or subpart in page order, its printed label, question, answer choices, context references, and `student_work`. Subparts such as `4(a)` get their own card.
- `student_work` contains steps in visible order, written final answer, selected choice, and status (`answered`, `blank`, `unclear`). Incorrect work is preserved verbatim. Blank work is distinct from obscured or unreadable work.

Errors use `{ "error": { "code": "...", "message": "..." } }` with appropriate 400/413/415/422/502/503/504 statuses. Failed reads retain the photo for retry, retake, or replacement. `GET /api/health` reports the active mode without exposing configuration or credentials.

Images are processed temporarily. Multipart temporary files are closed after the request; Sidekick has no upload database or retained worksheet storage. Live images are EXIF-oriented and re-encoded without metadata before sending to the configured provider. The app does not log filenames, worksheet content, provider payloads, or raw validation errors. API responses use `Cache-Control: no-store`. Run Uvicorn without access logs as shown above. The configured vision provider’s own data handling policies still apply.

## Verification

```sh
npm run typecheck
npm run build
npm run test:backend
npx playwright install chromium
npm run test:e2e
```

Playwright starts Next.js and FastAPI in explicit fixture mode. Stop servers using ports 3000 and 8000 before running it. The backend suite uses an in-process API client and mocked HTTP provider responses; it needs no credentials.

The synthetic fractions worksheet includes the incorrect answer **`2/5`**, all three written steps in order, a visibly blank response, unreadable writing with the legible fragment **`3/`**, a shared recipe table, and multiple-choice subpart **`4(a)`**. The ELA worksheet includes a shared reading passage, the incorrect response **`The story happens in winter.`**, a blank response, partially unreadable question and work, and a selected multiple-choice response. See `fixtures/README.md` for the exact assertions. Regenerate images and JSON with `backend/.venv/bin/python scripts/generate_fixtures.py`.

Browser checks cover both sample images through the real multipart endpoint, question order, blank versus unclear states, verbatim incorrect work, JSON download, invalid file/size handling, visible reading state, and failure followed by retry. Backend checks cover image integrity, MIME mismatch, request/file limits, provider failures, schema validation, and metadata removal.

**Live vision extraction remains unverified: no provider credentials were available during implementation.** Fixture tests verify the complete interface/API flow and contract, not model transcription accuracy. Real phone camera capture has not been physically tested.
