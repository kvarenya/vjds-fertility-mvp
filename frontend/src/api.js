// Talks to the Express backend.
// Set VITE_API_URL in a .env file to point at a deployed backend;
// falls back to the local dev server.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function submitIntake(answers) {
  const res = await fetch(`${API_URL}/intake`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });

  if (!res.ok) {
    throw new Error(`Failed to submit intake (${res.status})`);
  }

  return res.json();
}

export async function fetchProfile(sessionId) {
  const res = await fetch(`${API_URL}/profile/${sessionId}`);

  if (!res.ok) {
    throw new Error(`Failed to load profile (${res.status})`);
  }

  return res.json();
}
