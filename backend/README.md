Stub Express + Postgres backend for the Guided Intake / Case Profile MVP,
for the 5 step intake flow built in Figma.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in real Postgres credentials
```

Create the database and run the schema:

```bash
createdb vjds_fertility
psql -d vjds_fertility -f migrations/001_init.sql
```

Run the server:

```bash
npm run dev
```

Server runs on `http://localhost:4000` by default.

## Endpoints

- `GET /health` — sanity check, returns `{ status: "ok" }`
- `POST /intake` — accepts intake answers, creates/updates a session
- `GET /profile/:id` — returns the case profile for a session id

### Example: POST /intake

```json
{
  "situation": "exploring",
  "location": "US",
  "budget": "15k_50k",
  "timeline": "6_12_months",
  "travelFlexibility": "open_international"
}
```

Response includes a `sessionId` — save that, it's what you pass to
`GET /profile/:sessionId` to fetch the profile back.

## Status

This is a template only atm. 
