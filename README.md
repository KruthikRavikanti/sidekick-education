# Sidekick

Sidekick is a local K–5 family prototype. A parent owns an email/password account, creates up to six child profiles, and enters a PIN-protected parent dashboard. Children choose their profile to open homework help or the practice placeholder. Homework help retains the photo → preview → **Read worksheet** → extraction results flow; it does not grade, correct, or solve answers.

The interface uses Next.js and TypeScript; the API uses FastAPI and Pydantic. The empty starting workspace had no components to reuse, so the app reuses the original Sidekick kit’s logo vectors, palette, Fredoka headings, and Nunito body font. Fonts are served locally with their OFL licenses. Design reference: [Sidekick colorway studio](https://preview--sidekick-colorway-studio.lovable.app/?__lovable_receipt=mat_6nx4bc71428r69zqdx974t1cnk).

## Local setup

Requires Node.js 20.9+ and Python 3.11+.

```sh
npm ci
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements.txt
cp -n .env.example .env.local
cp -n backend/.env.example backend/.env
```

For existing checkouts, retain your vision credentials and add the account settings from `backend/.env.example` to `backend/.env`. The explicit localhost configuration is `APP_ENV=development`, `PASSWORD_POLICY=dev`, `COOKIE_SECURE=false`, and `TRUSTED_ORIGINS=http://localhost:3000`.

### One-time database migration

```sh
npm run db:migrate
```

This applies the versioned SQL migrations in `backend/migrations/` to `DATABASE_URL` (default `sqlite:///backend/data/sidekick.db`). Relative SQLite paths resolve from the repository root. Run the command again after pulling new migrations; already-applied migrations are skipped. Account sessions, PIN lockouts, and profile records persist across backend restarts. SQLite databases and credentials are Git-ignored. No migration touches worksheet images or retains extraction results.

Optional, explicit development-only seed:

```sh
APP_ENV=development PASSWORD_POLICY=dev COOKIE_SECURE=false npm run db:seed
```

The demo parent is **`parent@example.com`**, password **`password`**, with **Alex** (grade 3) and **Maya** (grade 1). The PIN starts unset. Running the seed again preserves the existing account, password, PIN, and profiles. It is rejected outside development/test or without the development password policy.

For an offline walkthrough, start both servers from the repository root with one command:

```sh
npm run dev:demo
```

Keep that terminal open while using Sidekick. Wait for **Sidekick is ready: http://localhost:3000**, then open that address. Ctrl+C stops both servers. The launcher checks dependencies and ports 3000/8000 and reports an actionable error if either server cannot start; it never silently switches ports. `npm run dev` remains available for starting only the Next.js interface when you already run FastAPI separately.

Open **http://localhost:3000** and sign up or log in with the demo parent. On **Who’s learning today?**, choose **Parent**, verify the account password to set a 4–6 digit PIN twice, then enter that PIN to unlock parent mode. Add or edit children from the dashboard. **Switch profile** returns to the picker and locks parent mode. Choose a child → **Get help with my homework** → **Fractions** or **Reading**, inspect the photo, then tap **Read worksheet**.

You can also upload the exact PNGs in `public/samples/`. Sample mode is visibly labeled, returns `source: "fixture"`, and accepts only those images by SHA-256. Arbitrary uploads never receive fabricated sample results. Camera controls use the phone’s file/camera picker; the browser decides which picker it presents. Camera access on a phone generally requires HTTPS or localhost.

### Accounts, PINs, and access

| Backend variable  | Local example                        | Behavior                                                                                                           |
| ----------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`    | `sqlite:///backend/data/sidekick.db` | SQLite prototype database; migrate before first use.                                                               |
| `APP_ENV`         | `development`                        | Defaults to `production`. Only `development`/`test` permit relaxed passwords and HTTP cookies.                     |
| `PASSWORD_POLICY` | `dev`                                | `strict` by default; explicitly select `dev` for local passwords such as `password`.                               |
| `COOKIE_SECURE`   | `false`                              | Local HTTP only. Defaults to `true` outside development/test; use HTTPS and secure cookies for other environments. |
| `TRUSTED_ORIGINS` | `http://localhost:3000`              | Exact comma-separated allowed origins. HTTPS required outside development/test.                                    |

**TODO: Turn on strict password rules before pilot.** Use `PASSWORD_POLICY=strict`, secure HTTPS cookies, and your exact HTTPS origin before any pilot; the development seed is not a production bootstrap.

Passwords and parent PINs use salted Argon2id through `argon2-cffi`, following [OWASP password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html). Emails are normalized before a unique database constraint. Account sessions use opaque tokens whose digests are stored server-side, with a 30-day expiry. Cookies are HttpOnly, have explicit SameSite, and use `__Host-` names in secure mode. No password, PIN, hash, or session token is returned in screen data or logged.

Parent unlock belongs to one account session. Parent data is checked by FastAPI on every request; kid endpoints also require the currently selected, owned child. Five wrong PIN attempts lock the account’s PIN gate for five minutes, including across browser sessions and backend restarts. Parent mode expires after 30 idle minutes using server time. Dashboard reads and background checks do not extend it; genuine parent interactions call the activity endpoint. Reloading or going back conservatively locks parent mode before protected UI is shown. Profile switching aborts requests, clears previous-profile UI, and synchronizes tabs sharing the session.

Changing/resetting the PIN clears existing parent unlocks and requires the new PIN. Password changes require the current password, revoke all old account sessions, and issue a fresh picker session. Logout revokes its server session and expires its cookie. Forgot password is an informational placeholder for future email recovery; Forgot PIN uses the account password and a confirmed replacement PIN.

The dashboard’s skill heat map, analytics, and conversation transcripts are explicitly **sample learning data**. Typed data-access functions accept account and child IDs and check ownership. They are independent of worksheet extraction. Common Core labels reference [Math standards](https://www.thecorestandards.org/Math/) and [ELA standards](https://www.thecorestandards.org/ELA-Literacy/); sample statuses are not an assessment of a child.

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

The provider must accept `messages` with an `image_url` data URL and `response_format: {type: "json_schema", json_schema: {strict: true, ...}}`, following the official OpenAI documentation for [image inputs](https://developers.openai.com/api/docs/guides/images-vision) and [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=chat). The adapter validates the complete response with Pydantic and rejects refusals, truncated output, malformed JSON, invalid references, inconsistent statuses, and pages with no extractable problems. It does not fall back to unvalidated text or fixtures. Live extraction has been verified with the configured provider on the two synthetic worksheets; other providers and models still require compatibility checks.

## API and extraction contract

`POST /api/extract` requires an authenticated account in kid mode with an active child owned by that account. It accepts the same single multipart field named `file`; its extraction response schema is unchanged. JPG, PNG, and WebP only; maximum file size 10 MiB, minimum dimension 64 pixels, maximum 24 megapixels, single-frame images only. Both declared MIME and decoded content are checked. The complete request body is bounded before multipart parsing, including requests without a Content-Length header. The active child/session revision is checked again before returning results, so a profile switch or deletion cannot expose an in-flight result to the next profile.

All state-changing API calls, including signup/login, PIN operations, profile selection, logout, and multipart extraction, require a valid `X-CSRF-Token` and an exact trusted `Origin`. Obtain a token through `GET /api/auth/csrf` using the same cookie jar, then send it in the request header. The server validates a session-bound, server-stored token, following [OWASP CSRF guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html). Refresh the token after authentication/session changes. The interface handles this automatically.

Authenticated upload example (run with a fresh development seed and both servers running; substitute your credentials and PIN if you changed them):

```sh
backend/.venv/bin/python - <<'PY'
import httpx

with httpx.Client(base_url="http://localhost:3000", headers={"Origin": "http://localhost:3000"}, timeout=90) as client:
    def headers():
        response = client.get("/api/auth/csrf")
        response.raise_for_status()
        return {"X-CSRF-Token": response.json()["csrfToken"]}
    def post(path, data):
        response = client.post(path, json=data, headers=headers())
        response.raise_for_status()
        return response.json()
    post("/api/auth/login", {"email": "parent@example.com", "password": "password"})
    if client.get("/api/parent/gate").json()["pinSetupRequired"]:
        post("/api/parent/pin/setup", {"password": "password", "pin": "0123", "confirmPin": "0123"})
    post("/api/parent/pin/verify", {"pin": "0123"})
    profiles = client.get("/api/parent/profiles").json()["profiles"]
    post("/api/session/kid", {"profileId": profiles[0]["id"]})
    with open("public/samples/math-worksheet.png", "rb") as image:
        response = client.post("/api/extract", files={"file": ("sample.png", image, "image/png")}, headers=headers())
    response.raise_for_status()
    print(response.json()["source"])
PY
```

The response includes `worksheet`, `problems`, and `source` (`live` or `fixture`). The authoritative models are in `backend/models.py`; the vision JSON Schema is checked in as `backend/schema.json`. Matching interface types are in `lib/extraction.ts`. Full examples are in `fixtures/math.json` and `fixtures/ela.json`.

- Every transcribed text field is `{ "text": "visible text or null", "uncertain": false }`. Actual missing values use JSON `null`, not the string `"null"`. Partial text is kept with `uncertain: true`; a fully unreadable field is `text: null, uncertain: true`. Absent optional printed fields are `text: null, uncertain: false`.
- `worksheet` contains title, inferred subject (`math`, `ela`, `unknown`), subject uncertainty, explicitly printed grade, directions, and shared context. Contexts have IDs and a type (`passage`, `table`, `diagram`, `other`); tables and diagram labels are transcribed into their text content.
- `problems` contains each printed problem or subpart in page order, its printed label, question, answer choices, context references, and `student_work`. Subparts such as `4(a)` get their own card.
- `student_work` contains steps in visible order, written final answer, selected choice, and status (`answered`, `blank`, `unclear`). Incorrect work is preserved verbatim. Blank work is distinct from obscured or unreadable work. If a final answer or selected choice is wholly unreadable (`text: null, uncertain: true`), the API normalizes an `answered` status to `unclear` without changing any transcribed fields. An uncertain earlier step can still accompany an `answered` status when the final answer is legible.

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

The automated suites include **93 backend tests and 12 browser tests**. They cover the complete parent/child journey, account and session persistence, password policy and rate limits, PIN setup/reset/lockout, a controllable clock for idle expiry and lock recovery, ownership and sibling isolation, CSRF and origin checks, concurrent profile limits, profile deletion cleanup, credential changes, and the authenticated extraction flow. Extraction regressions preserve incorrect work, blanks, unreadable fields, and a legible final answer with an uncertain earlier step.

An additional browser smoke check exercised the real configured vision provider through signup, parent PIN setup, child creation/selection, and authenticated multipart upload: HTTP 200, `source: "live"`, and four rendered problems. Mobile and desktop screens were visually checked with no horizontal page overflow or uncaught browser errors. The development seed’s PIN remains unset for first-time setup.

**Live vision extraction was verified through the browser with both synthetic worksheets.** Both returned `source: "live"` and rendered four problem cards. The ELA response preserved the incorrect winter answer and detected the blank response. A follow-up Math check confirmed the incorrect `2/5` answer, the blank response, and the `unclear` status for unreadable writing after the status fix. Credentials stay in the local, Git-ignored `backend/.env` file.

Fixture tests verify the complete interface/API flow and contract; the live checks are a small synthetic smoke test, not a broad evaluation of transcription accuracy. Real phone camera capture has not been physically tested.

## Remaining integration TODOs

- AI homework chat and persisted real conversations (the chat placeholder does not send messages).
- Generated practice (practice cards are explicit placeholders).
- Real skill mapping, longitudinal records, and analytics (dashboard data is labeled sample).
- Payments/subscriptions.
- Email delivery, email verification, and account-password recovery.
- Turn on strict password rules before pilot; this repository remains a local prototype.
