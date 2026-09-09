# Backend — VJDS Project #16 (AI Fertility Platform)

Express + Postgres backend for the Guided Intake / Case Profile MVP.

Field names and allowed values mirror the React frontend's `intakeQuestions`
array in `frontend/src/App.jsx`. If a question changes there, update
`migrations/001_init.sql` and `src/config/labels.js` to match.

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Then fill in `.env`. Either set `DATABASE_URL` to a hosted Postgres
connection string (Supabase, Render, Railway), or leave it blank and fill
in the `PG*` variables for a local database.

Create the tables:

```bash
# hosted: paste migrations/001_init.sql into the provider's SQL editor
# local:
createdb vjds_fertility
psql -d vjds_fertility -f migrations/001_init.sql
```

Run it:

```bash
npm run dev
```

Server listens on `http://localhost:4000`.

## Endpoints

### `GET /health`
Returns `{ "status": "ok" }`.

### `POST /intake`
Body — all seven fields optional, so partial intakes still save:

```json
{
  "fertility": "ivf",
  "location": "us",
  "budget": "25-50",
  "timeline": "soon",
  "flexibility": "international",
  "documentation": "medical-history",
  "support": "all"
}
```

Creates a session, stores the answers, generates the case profile, and
returns `{ sessionId, intake }`. Keep the `sessionId` — it's the key for
fetching the profile back.

### `GET /profile/:sessionId`
Returns the raw answer codes, display-ready labels, the pathway category,
the generated summary paragraph, and the specialist review status.
Responds 404 if no intake exists for that session.

## Notes

- The summary paragraph in `src/controllers/intakeController.js` is a
  deterministic template, not a model call. Real recommendation logic still
  needs to be defined with the research side.
- Allowed values are enforced by `CHECK` constraints, so an invalid option
  is rejected at the database rather than silently stored.
