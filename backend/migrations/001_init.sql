-- Initial schema for Guided Intake + Case Profile MVP
-- Matches the actual 5-step intake flow built in Figma Make
-- (situation, location, budget, timeline, travel_flexibility)

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS intake_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,

  -- Step 1: What best describes your situation?
  situation TEXT CHECK (
    situation IN ('exploring', 'ivf', 'donor', 'surrogacy', 'comparing_clinics', 'not_sure')
  ),

  -- Step 2: Where are you currently based?
  location TEXT CHECK (
    location IN ('US', 'UK', 'CA', 'ANZ', 'EU', 'OTHER')
  ),

  -- Step 3: What's your approximate budget?
  budget TEXT CHECK (
    budget IN ('under_5k', '5k_15k', '15k_50k', '50k_plus')
  ),

  -- Step 4: What's your treatment timeline?
  timeline TEXT CHECK (
    timeline IN ('asap', '6_12_months', '1_2_years', 'no_fixed')
  ),

  -- Step 5: How open are you to international treatment?
  travel_flexibility TEXT CHECK (
    travel_flexibility IN ('prefer_home', 'nearby', 'open_international', 'seeking_international')
  ),

  -- Optional extras shown on the Profile page - unclear yet whether these
  -- are collected during intake or filled in later. Nullable for now.
  documentation_status JSONB, -- e.g. {"medical_history": false, "photo_id": false, ...}
  support_needs TEXT[],       -- e.g. {"Emotional support resources", "Legal guidance"}

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS case_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,

  likely_pathway_category TEXT,
  ai_overview TEXT,
  specialist_review_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (specialist_review_status IN ('pending', 'in_review', 'reviewed')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_intake_answers_session ON intake_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_case_profiles_session ON case_profiles(session_id);
