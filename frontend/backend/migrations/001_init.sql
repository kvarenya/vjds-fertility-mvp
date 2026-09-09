-- Schema for Guided Intake + Case Profile MVP
-- Field names and allowed values match the actual React frontend
-- (src/App.jsx intakeQuestions array) so the two stay in sync.

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS intake_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,

  -- Q1: What brings you here today?
  fertility TEXT CHECK (
    fertility IN ('exploring', 'ivf', 'donor', 'surrogacy', 'compare', 'unsure')
  ),

  -- Q2: Where are you located?
  location TEXT CHECK (
    location IN ('us', 'uk', 'eu', 'other')
  ),

  -- Q3: What is your budget range?
  budget TEXT CHECK (
    budget IN ('under25', '25-50', '50-100', 'over100', 'flexible')
  ),

  -- Q4: What is your timeline?
  timeline TEXT CHECK (
    timeline IN ('urgent', 'soon', 'flexible', 'exploring')
  ),

  -- Q5: How flexible are you with travel?
  flexibility TEXT CHECK (
    flexibility IN ('local', 'domestic', 'international', 'very')
  ),

  -- Q6: What documentation do you have?
  documentation TEXT CHECK (
    documentation IN ('fertility-records', 'medical-history', 'none')
  ),

  -- Q7: What kind of support do you need?
  support TEXT CHECK (
    support IN ('emotional', 'medical', 'logistical', 'all')
  ),

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
