// Display labels for each stored answer code.
// These mirror the `label` strings in the frontend's intakeQuestions array
// (src/App.jsx). If a question's wording changes there, update it here too.

const LABELS = {
  fertility: {
    exploring: "Exploring fertility options",
    ivf: "Interested in IVF",
    donor: "Considering donor options",
    surrogacy: "Exploring surrogacy",
    compare: "Comparing countries & costs",
    unsure: "Not sure yet",
  },
  location: {
    us: "United States",
    uk: "United Kingdom",
    eu: "Europe",
    other: "Other",
  },
  budget: {
    under25: "Under $25,000",
    "25-50": "$25,000 - $50,000",
    "50-100": "$50,000 - $100,000",
    over100: "Over $100,000",
    flexible: "Flexible",
  },
  timeline: {
    urgent: "ASAP (within 3 months)",
    soon: "Soon (3-6 months)",
    flexible: "Flexible (6-12 months)",
    exploring: "Just exploring",
  },
  flexibility: {
    local: "Local only",
    domestic: "Domestic travel",
    international: "International travel",
    very: "Very flexible",
  },
  documentation: {
    "fertility-records": "Fertility records",
    "medical-history": "Medical history",
    none: "Still gathering",
  },
  support: {
    emotional: "Emotional support",
    medical: "Medical guidance",
    logistical: "Logistical planning",
    all: "All of the above",
  },
};

// Sentence-friendly wordings used when building the profile summary.
// The display labels above don't read well mid-sentence, so keep these
// separate rather than lowercasing the labels.
const PHRASES = {
  fertility: {
    exploring: "exploring your fertility options",
    ivf: "pursuing IVF treatment",
    donor: "considering donor options",
    surrogacy: "exploring surrogacy",
    compare: "comparing countries and costs",
    unsure: "still deciding where to start",
  },
  timeline: {
    urgent: "starting as soon as possible",
    soon: "starting within three to six months",
    flexible: "starting within six to twelve months",
    exploring: "with no fixed timeline yet",
  },
  flexibility: {
    local: "staying close to home",
    domestic: "travelling within your own country",
    international: "travelling internationally",
    very: "travelling wherever the right clinic is",
  },
  support: {
    emotional: "emotional support",
    medical: "medical guidance",
    logistical: "logistical planning",
    all: "emotional, medical and logistical support",
  },
};

function labelFor(field, value) {
  if (!value) return "Not answered";
  return LABELS[field]?.[value] || "Not answered";
}

function phraseFor(field, value) {
  return PHRASES[field]?.[value] || null;
}

module.exports = { LABELS, PHRASES, labelFor, phraseFor };
