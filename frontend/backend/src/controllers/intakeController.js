const pool = require("../config/db");
const { labelFor, phraseFor } = require("../config/labels");

// Builds the summary paragraph shown on the profile page.
// This is a deterministic template, not a model call - the real
// recommendation logic still needs to be defined with the research side.
// Every clause is skipped when its answer is missing, so a partially
// completed intake still produces a readable paragraph.
function buildOverview(answers) {
  const sentences = [];

  const goal = phraseFor("fertility", answers.fertility);
  sentences.push(
    goal
      ? `Based on your answers, you are currently ${goal}.`
      : `Based on your answers, we have put together a starting picture of your situation.`
  );

  const location = answers.location
    ? labelFor("location", answers.location)
    : null;
  const budget = answers.budget ? labelFor("budget", answers.budget) : null;
  const timeline = phraseFor("timeline", answers.timeline);

  const contextParts = [];
  if (location) contextParts.push(`based in ${location}`);
  if (budget) contextParts.push(`working with a budget of ${budget}`);
  if (timeline) contextParts.push(timeline);

  if (contextParts.length > 0) {
    sentences.push(
      `You are ${contextParts.join(", ")}, which shapes the range of pathways realistically open to you.`
    );
  }

  const flexibility = phraseFor("flexibility", answers.flexibility);
  if (flexibility) {
    sentences.push(
      `Your preference for ${flexibility} affects which clinics and programmes are worth considering.`
    );
  }

  const support = phraseFor("support", answers.support);
  if (support) {
    sentences.push(`You have told us you are looking for ${support}.`);
  }

  sentences.push(
    `This summary organises the information you provided. It is not medical or legal advice, ` +
      `and a qualified specialist will review your profile before any personalised guidance is issued.`
  );

  return sentences.join(" ");
}

// POST /intake
// Accepts the seven intake answers, creates a session, stores the answers
// and generates the accompanying case profile in one transaction.
async function submitIntake(req, res) {
  const {
    sessionId,
    fertility,
    location,
    budget,
    timeline,
    flexibility,
    documentation,
    support,
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let session = sessionId;
    if (!session) {
      const sessionResult = await client.query(
        "INSERT INTO sessions DEFAULT VALUES RETURNING id"
      );
      session = sessionResult.rows[0].id;
    }

    const intakeResult = await client.query(
      `INSERT INTO intake_answers
        (session_id, fertility, location, budget, timeline, flexibility, documentation, support)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        session,
        fertility || null,
        location || null,
        budget || null,
        timeline || null,
        flexibility || null,
        documentation || null,
        support || null,
      ]
    );

    const answers = intakeResult.rows[0];

    await client.query(
      `INSERT INTO case_profiles
        (session_id, likely_pathway_category, ai_overview)
       VALUES ($1, $2, $3)`,
      [
        session,
        labelFor("fertility", answers.fertility),
        buildOverview(answers),
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      sessionId: session,
      intake: answers,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error saving intake:", err);
    res.status(500).json({ error: "Failed to save intake answers" });
  } finally {
    client.release();
  }
}

module.exports = { submitIntake };
