const pool = require("../config/db");
const { labelFor } = require("../config/labels");

// GET /profile/:id
// Returns the latest intake answers and case profile for a session,
// with codes already converted to the display labels the UI expects.
async function getProfile(req, res) {
  const { id } = req.params;

  try {
    const intakeResult = await pool.query(
      `SELECT * FROM intake_answers
       WHERE session_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [id]
    );

    if (intakeResult.rows.length === 0) {
      return res.status(404).json({ error: "No intake found for this session" });
    }

    const intake = intakeResult.rows[0];

    const profileResult = await pool.query(
      `SELECT * FROM case_profiles
       WHERE session_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [id]
    );
    const profile = profileResult.rows[0] || null;

    res.json({
      sessionId: id,
      // Raw codes, in case the frontend wants to drive logic off them
      answers: {
        fertility: intake.fertility,
        location: intake.location,
        budget: intake.budget,
        timeline: intake.timeline,
        flexibility: intake.flexibility,
        documentation: intake.documentation,
        support: intake.support,
      },
      // Display-ready strings for the profile cards
      labels: {
        fertility: labelFor("fertility", intake.fertility),
        location: labelFor("location", intake.location),
        budget: labelFor("budget", intake.budget),
        timeline: labelFor("timeline", intake.timeline),
        flexibility: labelFor("flexibility", intake.flexibility),
        documentation: labelFor("documentation", intake.documentation),
        support: labelFor("support", intake.support),
      },
      likelyPathwayCategory: profile?.likely_pathway_category || null,
      aiOverview: profile?.ai_overview || null,
      specialistReviewStatus: profile?.specialist_review_status || "pending",
      updatedAt: intake.updated_at,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}

module.exports = { getProfile };
