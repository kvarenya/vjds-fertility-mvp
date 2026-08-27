const pool = require("../config/db");

// Lookup tables to turn stored codes into the display text shown on the
// "My Profile" page in the actual build. Keep these here for now - if
// research/Alexia finalizes different wording, this is the only place
// that needs to change.
const SITUATION_LABELS = {
  exploring: "Exploring Fertility Options",
  ivf: "Pursuing IVF Treatment",
  donor: "Considering Donor Options",
  surrogacy: "Exploring Surrogacy",
  comparing_clinics: "Comparing Clinics & Costs",
  not_sure: "Not Sure — Needs Guidance",
};

const LOCATION_LABELS = {
  US: "United States",
  UK: "United Kingdom",
  CA: "Canada",
  ANZ: "Australia & New Zealand",
  EU: "European Union",
  OTHER: "Other / International",
};

const BUDGET_LABELS = {
  under_5k: "Under $5,000",
  "5k_15k": "$5,000 – $15,000",
  "15k_50k": "$15,000 – $50,000",
  "50k_plus": "$50,000 or more",
};

const TIMELINE_LABELS = {
  asap: "As soon as possible",
  "6_12_months": "Within 6–12 months",
  "1_2_years": "In 1–2 years",
  no_fixed: "No fixed timeline",
};

const TRAVEL_LABELS = {
  prefer_home: "Prefer home country",
  nearby: "Open to nearby travel",
  open_international: "Open to international travel",
  seeking_international: "Seeking international options",
};

// GET /profile/:id
// Returns the most recent intake answers + case profile for a session,
// shaped to match the "My Profile" page fields.
async function getProfile(req, res) {
  const { id } = req.params;

  try {
    const intakeResult = await pool.query(
      `SELECT * FROM intake_answers WHERE session_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [id]
    );

    if (intakeResult.rows.length === 0) {
      return res.status(404).json({ error: "No intake found for this session" });
    }

    const intake = intakeResult.rows[0];

    const profileResult = await pool.query(
      `SELECT * FROM case_profiles WHERE session_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [id]
    );
    const profile = profileResult.rows[0] || null;

    res.json({
      sessionId: id,
      primaryPathway: SITUATION_LABELS[intake.situation] || null,
      location: LOCATION_LABELS[intake.location] || null,
      budgetRange: BUDGET_LABELS[intake.budget] || null,
      timeline: TIMELINE_LABELS[intake.timeline] || null,
      travelFlexibility: TRAVEL_LABELS[intake.travel_flexibility] || null,
      likelyPathwayCategory:
        profile?.likely_pathway_category || SITUATION_LABELS[intake.situation] || null,
      // Stub AI overview until the real recommendation/scoring logic is defined.
      aiOverview: profile?.ai_overview || "AI overview not yet generated.",
      documentationStatus: intake.documentation_status || {},
      supportNeeds: intake.support_needs || [],
      specialistReviewStatus: profile?.specialist_review_status || "pending",
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}

module.exports = { getProfile };
