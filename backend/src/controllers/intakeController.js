const pool = require("../config/db");

// POST /intake
// Receives the 5 guided-intake answers, creates a session if none was
// passed in, and stores the answers against it.
async function submitIntake(req, res) {
  const {
    sessionId, // optional: pass an existing session id to update it
    situation,
    location,
    budget,
    timeline,
    travelFlexibility,
    documentationStatus,
    supportNeeds,
  } = req.body;

  try {
    let session = sessionId;

    if (!session) {
      const sessionResult = await pool.query(
        "INSERT INTO sessions DEFAULT VALUES RETURNING id"
      );
      session = sessionResult.rows[0].id;
    }

    const result = await pool.query(
      `INSERT INTO intake_answers
        (session_id, situation, location, budget, timeline, travel_flexibility, documentation_status, support_needs)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        session,
        situation || null,
        location || null,
        budget || null,
        timeline || null,
        travelFlexibility || null,
        documentationStatus ? JSON.stringify(documentationStatus) : null,
        supportNeeds || null,
      ]
    );

    res.status(201).json({
      sessionId: session,
      intake: result.rows[0],
    });
  } catch (err) {
    console.error("Error saving intake:", err);
    res.status(500).json({ error: "Failed to save intake answers" });
  }
}

module.exports = { submitIntake };
